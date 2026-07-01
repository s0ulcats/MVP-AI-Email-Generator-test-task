import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpgradeDto } from './dto/upgrade.dto';
import { Plan } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        plan: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async upgradePlan(userId: string, dto: UpgradeDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { plan: dto.plan },
      select: {
        id: true,
        plan: true,
      },
    });

    return user;
  }
}
