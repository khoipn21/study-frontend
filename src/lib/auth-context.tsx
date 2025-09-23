import React from 'react'
import type { User } from './types'

type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
}

type AuthContextValue = AuthState & {
  login: (user: User, token: string) => void
  logout: () => void
  checkAuth: () => boolean
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'study.auth'

function readStorage(): Omit<AuthState, 'isLoading'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, token: null }
    const parsed = JSON.parse(raw) as {
      user: User | null
      token: string | null
    }
    return parsed
  } catch {
    return { user: null, token: null }
  }
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false

  try {
    // Basic JWT token structure check
    const parts = token.split('.')
    if (parts.length !== 3) return false

    // Decode the payload to check expiry
    const payload = JSON.parse(atob(parts[1])) as { exp?: number }
    const now = Math.floor(Date.now() / 1000)

    // Check if token is expired (with 1 minute buffer for early refresh)
    if (payload.exp && payload.exp <= now + 60) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(() => {
    const stored = readStorage()
    return { ...stored, isLoading: true }
  })

  // Check auth on mount and validate token
  React.useEffect(() => {
    const stored = readStorage()
    const validToken = isTokenValid(stored.token)

    if (!validToken && stored.token) {
      // Token is invalid, clear storage
      localStorage.removeItem(STORAGE_KEY)
      setState({ user: null, token: null, isLoading: false })
    } else {
      setState({ ...stored, isLoading: false })
    }

    // Listen for global logout events (from API 401 errors)
    const handleGlobalLogout = () => {
      localStorage.removeItem(STORAGE_KEY)
      setState({ user: null, token: null, isLoading: false })
    }

    // Listen for storage changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        if (event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue) as {
              user: User | null
              token: string | null
            }
            if (isTokenValid(parsed.token)) {
              setState({ ...parsed, isLoading: false })
            } else {
              setState({ user: null, token: null, isLoading: false })
            }
          } catch {
            setState({ user: null, token: null, isLoading: false })
          }
        } else {
          setState({ user: null, token: null, isLoading: false })
        }
      }
    }

    window.addEventListener('auth:logout', handleGlobalLogout)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('auth:logout', handleGlobalLogout)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = React.useCallback((user: User, token: string) => {
    const next = { user, token, isLoading: false }
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
  }, [])

  const logout = React.useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({ user: null, token: null, isLoading: false })
    // Trigger logout event for other components
    window.dispatchEvent(new CustomEvent('auth:logout'))
  }, [])

  const checkAuth = React.useCallback(() => {
    const validToken = isTokenValid(state.token)
    if (!validToken && state.token) {
      logout()
      return false
    }
    return !!(state.token && state.user)
  }, [state.token, state.user, logout])

  const value = React.useMemo<AuthContextValue>(
    () => ({ ...state, login, logout, checkAuth }),
    [state, login, logout, checkAuth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// Enhanced hook for authenticated API calls in dashboard components
export function useAuthenticatedApi() {
  const { token, user, isLoading, checkAuth } = useAuth()

  const isAuthenticated = React.useMemo(() => {
    if (isLoading) return false
    return checkAuth()
  }, [isLoading, checkAuth])

  // Helper to make authenticated API calls
  const callWithAuth = React.useCallback(
    function <T>(apiCall: (token: string) => Promise<T>): Promise<T> {
      if (!checkAuth() || !token) {
        throw new Error('User is not authenticated')
      }
      return apiCall(token)
    },
    [token, checkAuth],
  )

  return {
    token,
    user,
    isLoading,
    isAuthenticated,
    callWithAuth,
  }
}
