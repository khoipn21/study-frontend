import { useMutation } from '@tanstack/react-query'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
  AlertCircle,
  Chrome,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react'
import React, { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'

import type { Role } from '@/lib/types'

// Helper function to determine redirect URL based on user role
function getRedirectUrlByRole(role: Role): string {
  switch (role) {
    case 'instructor':
    case 'admin':
      return '/dashboard/instructor/analytics'
    case 'student':
    default:
      return '/me/dashboard'
  }
}

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)

  // Prevent hydration mismatch by waiting for client-side hydration
  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.login(credentials)
      return response.data
    },
    onSuccess: (data) => {
      if (data?.token && data?.user) {
        login(data.user, data.token)

        // Redirect based on user role
        const redirectTo = getRedirectUrlByRole(data.user.role)
        router.history.push(redirectTo)
      } else {
        setError(
          'Đăng nhập thành công nhưng không nhận được dữ liệu người dùng',
        )
      }
    },
    onError: (error: unknown) => {
      console.error('Login error:', error)
      const errorObj = error as {
        response?: { data?: { message?: string } }
        message?: string
      }
      setError(
        errorObj?.response?.data?.message ||
          errorObj?.message ||
          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.',
      )
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    if (!email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ')
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    loginMutation.mutate({ email, password })
  }

  const handleSocialLogin = (provider: string) => {
    // Implementation for OAuth login
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/auth/${provider}`
  }

  // Show loading placeholder during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="w-full max-w-md">
          <div className="border-0 shadow-2xl shadow-primary/5 bg-background rounded-lg p-8">
            <div className="text-center space-y-2 pb-6">
              <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Đăng nhập</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl shadow-primary/5">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-muted-foreground leading-relaxed">
              Chào mừng bạn trở lại với nền tảng học tập hàng đầu Việt Nam
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert
                variant="destructive"
                className="border-destructive/20 bg-destructive/5"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Social Login */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-11 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loginMutation.isPending}
              >
                <Chrome className="h-4 w-4 mr-2" />
                Đăng nhập với Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={loginMutation.isPending}
              >
                <Github className="h-4 w-4 mr-2" />
                Đăng nhập với GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground font-medium">
                  Hoặc tiếp tục với email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Địa chỉ email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-border/50 focus:border-primary/50 transition-colors"
                    disabled={loginMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Mật khẩu
                  </Label>
                  <a
                    href="#"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Tính năng quên mật khẩu đang được phát triển')
                    }}
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-border/50 focus:border-primary/50 transition-colors"
                    disabled={loginMutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loginMutation.isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  disabled={loginMutation.isPending}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center text-sm border-t border-border/50 pt-6">
              <span className="text-muted-foreground">
                Chưa có tài khoản học tập?{' '}
              </span>
              <Link
                to="/auth/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Đăng ký ngay miễn phí
              </Link>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground">
              Bằng cách đăng nhập, bạn đồng ý với{' '}
              <a
                href="#"
                className="text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Điều khoản dịch vụ đang được cập nhật')
                }}
              >
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a
                href="#"
                className="text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Chính sách bảo mật đang được cập nhật')
                }}
              >
                Chính sách bảo mật
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
