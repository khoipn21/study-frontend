import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/auth/oauth/callback')({
  component: OAuthCallbackPage,
})

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        const userId = params.get('user')
        const errorParam = params.get('error')

        if (errorParam) {
          setError(decodeURIComponent(errorParam))
          setTimeout(() => {
            navigate({ to: '/auth/login' })
          }, 3000)
          return
        }

        if (!token || !userId) {
          setError('Missing authentication data')
          setTimeout(() => {
            navigate({ to: '/auth/login' })
          }, 3000)
          return
        }

        // Fetch user data from the API
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
        const response = await fetch(`${apiBaseUrl}/auth/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          throw new Error('Failed to validate user')
        }

        const data = await response.json()
        
        if (data.data?.user) {
          // Login with user data and token
          login(data.data.user, token)

          // Redirect based on user role
          const redirectPath = 
            data.data.user.role === 'instructor' || data.data.user.role === 'admin'
              ? '/dashboard/instructor/analytics'
              : '/me/dashboard'

          navigate({ to: redirectPath })
        } else {
          throw new Error('Invalid user data received')
        }
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError(err instanceof Error ? err.message : 'Authentication failed')
        setTimeout(() => {
          navigate({ to: '/auth/login' })
        }, 3000)
      }
    }

    handleCallback()
  }, [navigate, login])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Đăng nhập thất bại
            </h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground">
              Đang chuyển hướng về trang đăng nhập...
            </p>
          </>
        ) : (
          <>
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Đang xác thực...
            </h2>
            <p className="text-muted-foreground">
              Vui lòng đợi trong giây lát
            </p>
          </>
        )}
      </div>
    </div>
  )
}
