import { ApiError } from '@/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

let accessToken: string | null = null
let refreshToken: string | null = null
let isRefreshing = false
let refreshPromise: Promise<void> | null = null

const requestCache = new Map<string, { promise: Promise<any>; timestamp: number }>()
const CACHE_DURATION = 5000

export function clearRequestCache() {
  requestCache.clear()
}

export function setTokens(access: string, refresh: string) {
  accessToken = access
  refreshToken = refresh
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('refreshToken', refresh)
  }
  if (typeof document !== 'undefined') {
    document.cookie = `refreshToken=${refresh}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  }
}

const getFetch = () => (typeof global !== 'undefined' && global.fetch) || fetch

export function clearTokens() {
  accessToken = null
  refreshToken = null
  isRefreshing = false
  refreshPromise = null
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('refreshToken')
  }
  if (typeof document !== 'undefined') {
    document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax'
  }
}

export function getAccessToken(): string | null {
  return accessToken
}

export function getRefreshToken(): string | null {
  if (refreshToken) return refreshToken
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('refreshToken')
    if (token) {
      refreshToken = token
    }
    return token
  }
  return null
}

if (typeof window !== 'undefined') {
  refreshToken = localStorage.getItem('refreshToken')
}

async function refreshAccessToken(): Promise<void> {
  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token available')
  }

  if (isRefreshing && refreshPromise) {
    await refreshPromise
    return
  }

  isRefreshing = true
  refreshPromise = (async () => {
    const response = await getFetch()(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      clearTokens()
      throw new ApiError(401, 'Token refresh failed')
    }

    const data = await response.json()
    accessToken = data.accessToken
    refreshToken = data.refreshToken
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('refreshToken', data.refreshToken)
    }
    if (typeof document !== 'undefined') {
      document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
  })()

  await refreshPromise
  isRefreshing = false
  refreshPromise = null
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  
  const cacheKey = `${options.method || 'GET'}:${url}`
  if (options.method === 'GET' || !options.method) {
    const cached = requestCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.promise
    }
  }

  const fetchPromise = (async (): Promise<T> => {
    let response = await getFetch()(url, { ...options, headers })

    if (response.status === 401) {
      try {
        await refreshAccessToken()
        headers['Authorization'] = `Bearer ${accessToken}`
        response = await getFetch()(url, { ...options, headers })
      } catch {
        clearTokens()
        const isTest = typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined
        const PUBLIC_PATHS = ['/', '/login', '/register', '/pricing']
        const isPublicPath = typeof window !== 'undefined' && window.location && PUBLIC_PATHS.some(path => window.location.pathname.startsWith(path))
        if (typeof window !== 'undefined' && window.location && !isPublicPath && !isTest) {
          window.location.href = '/login'
        }
        throw new ApiError(401, 'Authentication failed')
      }
    }

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 1000

        await new Promise(resolve => setTimeout(resolve, delay))

        headers['Authorization'] = `Bearer ${accessToken}`
        response = await getFetch()(url, { ...options, headers })
        
        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Request failed' }))
          throw new ApiError(response.status, error.message || 'Request failed after retry')
        }
      } else {
        const error = await response.json().catch(() => ({ message: 'Request failed' }))
        throw new ApiError(response.status, error.message || 'Request failed')
      }
    }

    return response.json()
  })()

  if (options.method === 'GET' || !options.method) {
    requestCache.set(cacheKey, { promise: fetchPromise, timestamp: Date.now() })
  }
  
  return fetchPromise
}
