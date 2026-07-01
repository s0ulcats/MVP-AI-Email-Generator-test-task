import { renderHook, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../auth-provider'
import { getMe } from '@/lib/api/user'
import { logout } from '@/lib/api/auth'
import type { User } from '@/types/api'

jest.mock('@/lib/api/user')
jest.mock('@/lib/api/auth')

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls getMe() on mount to restore session', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      plan: 'FREE',
      createdAt: '2024-01-01T00:00:00Z',
    }
    ;(getMe as jest.MockedFunction<typeof getMe>).mockResolvedValueOnce(mockUser)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(getMe).toHaveBeenCalledTimes(1)
    })
  })

  it('sets user state when getMe() resolves successfully', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      plan: 'FREE',
      createdAt: '2024-01-01T00:00:00Z',
    }
    ;(getMe as jest.MockedFunction<typeof getMe>).mockResolvedValueOnce(mockUser)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
    })
  })

  it('treats user as logged out when getMe() throws', async () => {
    ;(getMe as jest.MockedFunction<typeof getMe>).mockRejectedValueOnce(new Error('Unauthorized'))

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.user).toBeNull()
    })
  })

  it('logout() clears user state', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      plan: 'FREE',
      createdAt: '2024-01-01T00:00:00Z',
    }
    ;(getMe as jest.MockedFunction<typeof getMe>).mockResolvedValueOnce(mockUser)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
    })

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
  })

  it('provides user and logout via useAuth() hook', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      plan: 'FREE',
      createdAt: '2024-01-01T00:00:00Z',
    }
    ;(getMe as jest.MockedFunction<typeof getMe>).mockResolvedValueOnce(mockUser)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
    })

    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.refreshUser).toBe('function')
    expect(typeof result.current.loading).toBe('boolean')
  })
})
