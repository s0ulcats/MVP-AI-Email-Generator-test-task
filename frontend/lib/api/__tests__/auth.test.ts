import { login, register, logout } from '../auth'
import { apiFetch, getRefreshToken } from '../client'
import type { AuthResponse } from '@/types/api'

jest.mock('../client')

describe('auth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('login() calls POST /auth/login with correct body and returns token data', async () => {
    const mockResponse: AuthResponse = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }
    ;(apiFetch as jest.MockedFunction<typeof apiFetch>).mockResolvedValueOnce(mockResponse)

    const result = await login({ email: 'test@example.com', password: 'password123' })

    expect(apiFetch).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    })
    expect(result).toEqual(mockResponse)
  })

  it('register() calls POST /auth/register with correct body', async () => {
    const mockResponse: AuthResponse = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }
    ;(apiFetch as jest.MockedFunction<typeof apiFetch>).mockResolvedValueOnce(mockResponse)

    const result = await register({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    })

    expect(apiFetch).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }),
    })
    expect(result).toEqual(mockResponse)
  })

  it('logout() calls POST /auth/logout with refresh token', async () => {
    ;(getRefreshToken as jest.MockedFunction<typeof getRefreshToken>).mockReturnValueOnce('test-refresh-token')
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true } as Response)

    await logout()

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/auth/logout',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: 'test-refresh-token' }),
      }
    )
  })
})
