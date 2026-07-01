import { IsEnum } from 'class-validator';
import { Plan } from '@prisma/client';

export class UpgradeDto {
  @IsEnum(Plan)
  plan: Plan;
}
