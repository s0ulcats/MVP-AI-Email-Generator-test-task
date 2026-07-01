import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailGenerationController } from './email-generation.controller';
import { EmailGenerationService } from './email-generation.service';
import { MockAIProvider } from './providers/mock-ai.provider';
import { AI_PROVIDER_TOKEN } from './constants/ai-provider.token';
import { AIProvider } from './interfaces/ai-provider.interface';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

const aiProviderFactory = {
  provide: AI_PROVIDER_TOKEN,
  useFactory: (configService: ConfigService): AIProvider => {
    const provider = configService.get<string>('AI_PROVIDER', 'mock');
    
    switch (provider) {
      case 'mock':
      default:
        return new MockAIProvider();
    }
  },
  inject: [ConfigService],
};

@Module({
  imports: [PrismaModule, ConfigModule, AuthModule],
  controllers: [EmailGenerationController],
  providers: [EmailGenerationService, aiProviderFactory],
  exports: [EmailGenerationService],
})
export class EmailGenerationModule {}
