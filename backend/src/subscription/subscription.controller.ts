import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { UpgradeDto } from './dto/upgrade.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('subscription')
@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  @ApiOperation({ summary: 'Get current subscription' })
  @ApiResponse({ status: 200, description: 'Subscription retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getSubscription(@CurrentUser() user: any) {
    return this.subscriptionService.getSubscription(user.sub);
  }

  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade subscription plan' })
  @ApiResponse({ status: 200, description: 'Plan upgraded successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async upgrade(@CurrentUser() user: any, @Body() dto: UpgradeDto) {
    return this.subscriptionService.upgradePlan(user.sub, dto);
  }
}
