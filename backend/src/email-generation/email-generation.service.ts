import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIProvider } from './interfaces/ai-provider.interface';
import { AI_PROVIDER_TOKEN } from './constants/ai-provider.token';
import { GenerateDto } from './dto/generate.dto';
import { Tone, Length } from '@prisma/client';

@Injectable()
export class EmailGenerationService {
  constructor(
    private prisma: PrismaService,
    @Inject(AI_PROVIDER_TOKEN) private aiProvider: AIProvider,
  ) {}

  async generate(userId: string, dto: GenerateDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (user?.plan === 'FREE') {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const monthlyCount = await this.prisma.generation.count({
        where: {
          userId,
          createdAt: { gte: currentMonth },
        },
      });

      if (monthlyCount >= 10) {
        throw new Error('Monthly limit exceeded');
      }
    }

    const content = await this.aiProvider.generate(dto.topic, dto.tone, dto.length);

    const generation = await this.prisma.generation.create({
      data: {
        userId,
        topic: dto.topic,
        tone: dto.tone,
        length: dto.length,
        content,
      },
    });

    return generation;
  }

  async getHistory(userId: string, limit: number = 10) {
    return this.prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
