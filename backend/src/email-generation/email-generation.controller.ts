import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EmailGenerationService } from './email-generation.service';
import { GenerateDto } from './dto/generate.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PlanLimitGuard } from '../common/guards/plan-limit.guard';
import { PlanLimit } from '../common/decorators/plan-limit.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('email-generation')
@Controller('generate')
@UseGuards(JwtAuthGuard)
export class EmailGenerationController {
  constructor(private emailGenerationService: EmailGenerationService) {}

  @Post()
  @PlanLimit()
  @UseGuards(PlanLimitGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Generate an email' })
  @ApiResponse({ status: 201, description: 'Email generated successfully' })
  @ApiResponse({ status: 403, description: 'Monthly limit reached' })
  async generate(@CurrentUser() user: any, @Body() dto: GenerateDto) {
    return this.emailGenerationService.generate(user.sub, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get generation history' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHistory(
    @CurrentUser() user: any,
    @Query('limit') limit?: string,
  ) {
    return this.emailGenerationService.getHistory(user.sub, limit ? parseInt(limit) : 10);
  }
}
