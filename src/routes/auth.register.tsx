import { useMutation } from '@tanstack/react-query'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Chrome,
  Eye,
  EyeOff,
  Github,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Shield,
  User,
} from 'lucide-react'
import { useState } from 'react'

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
import { Progress } from '@/components/ui/progress'
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

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptMarketing, setAcceptMarketing] = useState(false)
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: async (payload: {
      username: string
      email: string
      password: string
    }) => {
      const response = await api.register(payload)
      return response.data
    },
    onSuccess: (data) => {
      if (data?.token && data?.user) {
        login(data.user, data.token)

        // Redirect based on user role
        const redirectTo = getRedirectUrlByRole(data.user.role)
        router.history.push(redirectTo)
      } else {
        setError('Đăng ký thành công nhưng không nhận được dữ liệu người dùng')
      }
    },
    onError: (error: unknown) => {
      console.error('Registration error:', error)
      const errorObj = error as {
        response?: { data?: { message?: string } }
        message?: string
      }
      setError(
        errorObj?.response?.data?.message ||
          errorObj?.message ||
          'Đăng ký thất bại. Vui lòng thử lại sau.',
      )
    },
  })

  const passwordStrength = calculatePasswordStrength(formData.password)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ và tên')
      return
    }

    if (!formData.email?.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ')
      return
    }

    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    if (!acceptTerms) {
      setError('Vui lòng đồng ý với Điều khoản dịch vụ')
      return
    }

    mutation.mutate({
      username: formData.fullName,
      email: formData.email,
      password: formData.password,
    })
  }

  const handleSocialLogin = (provider: string) => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/auth/${provider}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl shadow-primary/5">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Tạo tài khoản
            </CardTitle>
            <CardDescription className="text-muted-foreground leading-relaxed">
              Tham gia cộng đồng học tập hàng triệu học viên Việt Nam
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

            {/* Social Registration */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-11 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={mutation.isPending}
              >
                <Chrome className="h-4 w-4 mr-2" />
                Đăng ký với Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={mutation.isPending}
              >
                <Github className="h-4 w-4 mr-2" />
                Đăng ký với GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground font-medium">
                  Hoặc tạo tài khoản mới
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-foreground"
                >
                  Họ và tên
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange('fullName', e.target.value)
                    }
                    className="pl-10 h-11 border-border/50 focus:border-primary/50 transition-colors"
                    disabled={mutation.isPending}
                  />
                </div>
              </div>

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
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 h-11 border-border/50 focus:border-primary/50 transition-colors"
                    disabled={mutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 8 ký tự"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    className="pl-10 pr-10 h-11 border-border/50 focus:border-primary/50 transition-colors"
                    disabled={mutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={mutation.isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Độ mạnh mật khẩu
                      </span>
                      <span
                        className={getPasswordStrengthColor(passwordStrength)}
                      >
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <Progress
                      value={passwordStrength * 25}
                      className={`h-1 ${getPasswordStrengthColor(passwordStrength)}`}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    className="pl-10 pr-10 h-11 border-border/50 focus:border-primary/50 transition-colors"
                    disabled={mutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={mutation.isPending}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Mật khẩu xác nhận không khớp
                    </p>
                  )}
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Mật khẩu khớp
                    </p>
                  )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setAcceptTerms(checked as boolean)
                    }
                    disabled={mutation.isPending}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                  >
                    Tôi đồng ý với{' '}
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
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={acceptMarketing}
                    onCheckedChange={(checked) =>
                      setAcceptMarketing(checked as boolean)
                    }
                    disabled={mutation.isPending}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="marketing"
                    className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                  >
                    Tôi muốn nhận thông tin khóa học và ưu đãi đặc biệt qua
                    email
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
                disabled={mutation.isPending || !acceptTerms}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Tạo tài khoản học tập
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center text-sm border-t border-border/50 pt-6">
              <span className="text-muted-foreground">Đã có tài khoản? </span>
              <Link
                to="/auth/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </div>

            {/* Benefits */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm text-foreground">
                Lợi ích khi tham gia:
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Truy cập hàng nghìn khóa học chất lượng cao
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Học tập mọi lúc, mọi nơi trên mọi thiết bị
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Nhận chứng chỉ hoàn thành có giá trị
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Tham gia cộng đồng học tập sôi động
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function calculatePasswordStrength(password: string): number {
  let strength = 0
  if (password.length >= 8) strength += 1
  if (/[a-z]/.test(password)) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^A-Za-z0-9]/.test(password)) strength += 1
  return Math.min(strength, 4)
}

function getPasswordStrengthText(strength: number): string {
  switch (strength) {
    case 0:
    case 1:
      return 'Yếu'
    case 2:
      return 'Trung bình'
    case 3:
      return 'Mạnh'
    case 4:
      return 'Rất mạnh'
    default:
      return 'Yếu'
  }
}

function getPasswordStrengthColor(strength: number): string {
  switch (strength) {
    case 0:
    case 1:
      return 'text-red-500'
    case 2:
      return 'text-yellow-500'
    case 3:
      return 'text-blue-500'
    case 4:
      return 'text-green-500'
    default:
      return 'text-red-500'
  }
}
