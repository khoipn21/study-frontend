import { redirect } from '@tanstack/react-router'

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

export function checkAuthentication() {
  if (typeof window === 'undefined') return true // Skip auth check during SSR

  try {
    const auth = localStorage.getItem('study.auth')
    if (!auth) return false

    const parsed = JSON.parse(auth) as { token: string | null; user: any }
    const hasValidToken = isTokenValid(parsed.token)

    if (!hasValidToken && parsed.token) {
      // Token is invalid, clear storage
      localStorage.removeItem('study.auth')
      return false
    }

    return !!(parsed.token && parsed.user && hasValidToken)
  } catch {
    return false
  }
}

export function requireAuthentication(location: { href: string }) {
  const isAuthenticated = checkAuthentication()
  if (!isAuthenticated) {
    throw redirect({
      to: '/auth/login',
      search: {
        // Redirect back to this page after login
        redirect: location.href,
      },
    })
  }
}

export function requireInstructorRole(location: { href: string }) {
  const isAuthenticated = checkAuthentication()
  if (!isAuthenticated) {
    throw redirect({
      to: '/auth/login',
      search: {
        redirect: location.href,
      },
    })
  }

  try {
    const auth = localStorage.getItem('study.auth')
    if (!auth) throw new Error('No auth data')

    const parsed = JSON.parse(auth) as { token: string | null; user: any }
    const user = parsed.user as { roles?: Array<string>; role?: string }
    const hasValidToken = isTokenValid(parsed.token)

    if (!hasValidToken) {
      localStorage.removeItem('study.auth')
      throw new Error('Invalid token')
    }

    // Check if user has instructor role
    const hasInstructorRole =
      user?.roles?.includes('instructor') ||
      user?.role === 'instructor' ||
      user?.roles?.includes('admin') ||
      user?.role === 'admin'

    if (!hasInstructorRole) {
      throw redirect({
        to: '/',
      })
    }
  } catch (error) {
    throw redirect({
      to: '/auth/login',
      search: {
        redirect: location.href,
      },
    })
  }
}
