import { apiFetch, setTokens, clearTokens, clearRequestCache } from '../client'

describe('apiFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearTokens()
    clearRequestCache()
    ;(global.fetch as jest.Mock).mockReset()
  })

  it('attaches Authorization header when access token exists in auth store', async () => {
    setTokens('test-access-token', 'test-refresh-token')
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    } as Response)

    await apiFetch('/test')

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-access-token',
        }),
      })
    )
  })

  it('works correctly when no token is present (unauthenticated requests)', async () => {
    clearTokens()
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'public' }),
    } as Response)

    const result = await apiFetch('/public')

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ data: 'public' })
  })
})