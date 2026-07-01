import { apiFetch, setTokens, clearTokens, getRefreshToken, clearRequestCache } from './client'
import type { RegisterRequest, LoginRequest, AuthResponse } from '@/types/api'

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  setTokens(response.accessToken, response.refreshToken)
  return response
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  setTokens(response.accessToken, response.refreshToken)
  return response
}

export async function logout(): Promise<void> {
  try {
    const token = getRefreshToken()
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token }),
      }).catch(() => {})
    }
  } finally {
    clearTokens()
    clearRequestCache()
  }
}

export async function refresh(): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/refresh', { method: 'POST' })
}
