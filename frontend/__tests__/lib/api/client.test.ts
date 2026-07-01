import { apiFetch, setTokens, clearTokens, getAccessToken, clearRequestCache } from '@/lib/api/client'

describe('apiFetch', () => {
  let mockFetch: jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
    clearTokens()
    clearRequestCache()
    mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockReset()
  })

  it('should make a successful request', async () => {
    const mockResponse = { data: 'test' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await apiFetch('/test')
    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('should include authorization header when token is set', async () => {
    setTokens('test-token', 'refresh-token')
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response)

    await apiFetch('/test')
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    )
  })

  it('should throw error on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad request' }),
    } as Response)

    await expect(apiFetch('/test')).rejects.toThrow('Bad request')
  })

  it('should clear tokens and redirect on 401', async () => {
    setTokens('test-token', 'refresh-token')
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    } as Response)
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Refresh failed' }),
    } as Response)

    await expect(apiFetch('/test')).rejects.toThrow()
    expect(getAccessToken()).toBeNull()
  })
})

describe('token management', () => {
  it('should set and get access token', () => {
    setTokens('access-123', 'refresh-123')
    expect(getAccessToken()).toBe('access-123')
  })

  it('should clear tokens', () => {
    setTokens('access-123', 'refresh-123')
    clearTokens()
    expect(getAccessToken()).toBeNull()
  })
})
