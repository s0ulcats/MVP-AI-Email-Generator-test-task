import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Plan } from '@prisma/client';

const PLAN_LIMITS: Record<Plan, number> = {
  [Plan.FREE]: 5,
  [Plan.PRO]: Infinity,
  [Plan.PREMIUM]: Infinity,
};

@Injectable()
export class PlanLimitGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { plan: true },
    });

    if (!dbUser) {
      throw new ForbiddenException('User not found');
    }

    const limit = PLAN_LIMITS[dbUser.plan];

    if (limit === Infinity) {
      return true;
    }

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const generationCount = await this.prisma.generation.count({
      where: {
        userId: user.sub,
        createdAt: { gte: currentMonth },
      },
    });

    if (generationCount >= limit) {
      throw new ForbiddenException(
        `Monthly limit reached. Your ${dbUser.plan} plan allows ${limit} generations per month.`,
      );
    }

    return true;
  }
}
