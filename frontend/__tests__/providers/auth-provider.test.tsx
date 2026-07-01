import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/providers/auth-provider'
import { getMe } from '@/lib/api/user'

jest.mock('@/lib/api/user')

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should provide auth context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current).toBeDefined()
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('should load user on mount', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', plan: 'FREE', createdAt: '2024-01-01' }
    ;(getMe as jest.Mock).mockResolvedValue(mockUser)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )
    const { result } = await act(async () => {
      return renderHook(() => useAuth(), { wrapper })
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.loading).toBe(false)
  })

  it('should handle refreshUser', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', plan: 'FREE', createdAt: '2024-01-01' }
    ;(getMe as jest.Mock).mockResolvedValue(mockUser)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )
    const { result } = await act(async () => {
      return renderHook(() => useAuth(), { wrapper })
    })

    await act(async () => {
      await result.current.refreshUser()
    })

    expect(getMe).toHaveBeenCalled()
    expect(result.current.user).toEqual(mockUser)
  })

  it('should handle logout', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )
    const { result } = await act(async () => {
      return renderHook(() => useAuth(), { wrapper })
    })

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
  })
})
