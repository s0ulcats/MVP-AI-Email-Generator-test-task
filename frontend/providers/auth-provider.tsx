'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '@/lib/api/user'
import { clearTokens } from '@/lib/api/client'
import type { User } from '@/types/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const userData = await getMe()
      setUser(userData)
    } catch {
      setUser(null)
    }
  }

  const logout = async () => {
    setUser(null)
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
