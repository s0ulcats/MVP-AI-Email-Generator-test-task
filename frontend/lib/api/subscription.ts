import { apiFetch } from './client'
import type { User, UpgradeRequest } from '@/types/api'

export async function getSubscription(): Promise<{ id: string; plan: string }> {
  return apiFetch<{ id: string; plan: string }>('/subscription')
}

export async function upgradePlan(data: UpgradeRequest): Promise<{ id: string; plan: string }> {
  return apiFetch<{ id: string; plan: string }>('/subscription/upgrade', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
