import React from 'react'
import type { User } from './types'

type AuthState = {
  user: User | null
  token: string | null
}

type AuthContextValue = AuthState & {
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'study.auth'

function readStorage(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, token: null }
    const parsed = JSON.parse(raw) as AuthState
    return parsed
  } catch {
    return { user: null, token: null }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(() => readStorage())

  const login = React.useCallback((user: User, token: string) => {
    const next = { user, token }
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const logout = React.useCallback(() => {
    setState({ user: null, token: null })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({ ...state, login, logout }),
    [state, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
