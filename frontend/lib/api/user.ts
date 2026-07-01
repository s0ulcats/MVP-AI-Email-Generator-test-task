import { apiFetch } from './client'
import type { User, UpdateUserRequest } from '@/types/api'

export async function getMe(): Promise<User> {
  return apiFetch<User>('/users/me')
}

export async function updateMe(data: UpdateUserRequest): Promise<User> {
  return apiFetch<User>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
