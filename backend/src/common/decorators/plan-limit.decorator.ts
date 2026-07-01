import { SetMetadata } from '@nestjs/common';

export const PLAN_LIMIT_KEY = 'planLimit';
export const PlanLimit = () => SetMetadata(PLAN_LIMIT_KEY, true);
