import type { Plan, Tone, Length } from '@/types/api'

export const TONES: { value: Tone; label: string }[] = [
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'CASUAL', label: 'Casual' },
  { value: 'FRIENDLY', label: 'Friendly' },
  { value: 'FORMAL', label: 'Formal' },
  { value: 'PERSUASIVE', label: 'Persuasive' },
]

export const LENGTHS: { value: Length; label: string }[] = [
  { value: 'SHORT', label: 'Short' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LONG', label: 'Long' },
]

export const PLANS: { value: Plan; label: string }[] = [
  { value: 'FREE', label: 'Free' },
  { value: 'PRO', label: 'Pro' },
  { value: 'PREMIUM', label: 'Premium' },
]

export const PLAN_LIMITS: Record<Plan, number> = {
  FREE: 5,
  PRO: Infinity,
  PREMIUM: Infinity,
}
