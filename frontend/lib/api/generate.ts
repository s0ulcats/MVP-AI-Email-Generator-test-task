import { apiFetch } from './client'
import type { GenerateRequest, Generation } from '@/types/api'

export async function generateEmail(data: GenerateRequest): Promise<Generation> {
  return apiFetch<Generation>('/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getHistory(limit: number = 10): Promise<Generation[]> {
  return apiFetch<Generation[]>(`/generate/history?limit=${limit}`)
}
