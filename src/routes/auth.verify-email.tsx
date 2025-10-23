import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Mail, CheckCircle, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import { AnimatedOTPInput } from '@/components/ui/animated-otp-input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { api } from '@/lib/api-client'

export const Route = createFileRoute('/auth/verify-email')({
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const navigate = useNavigate()
  const [otp, setOTP] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)

  const userId = localStorage.getItem('pendingVerificationUserId')
  const email = localStorage.getItem('pendingVerificationEmail')

  useEffect(() => {
    if (!userId || !email) {
      navigate({ to: '/auth/login' })
    }
  }, [userId, email, navigate])

  const verifyMutation = useMutation({
    mutationFn: async (otpCode: string) => {
      return await api.verifyEmail({
        user_id: userId!,
        otp: otpCode,
      })
    },
    onSuccess: () => {
      setIsVerified(true)
      setError('')
      
      // Clear storage and redirect after 2 seconds
      setTimeout(() => {
        localStorage.removeItem('pendingVerificationUserId')
        localStorage.removeItem('pendingVerificationEmail')
        navigate({ to: '/auth/login' })
      }, 2000)
    },
    onError: (err: any) => {
      console.error('Verification error:', err)
      const errorMessage = err?.response?.data?.error || err?.message || 'Invalid verification code'
      setError(errorMessage)
      setOTP('')
    },
  })

  const resendMutation = useMutation({
    mutationFn: async () => {
      return await api.resendVerification({
        email: email!,
      })
    },
    onSuccess: () => {
      setCountdown(60)
      setError('')
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.error || 'Failed to resend code'
      setError(errorMessage)
    },
  })

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOTPComplete = (value: string) => {
    verifyMutation.mutate(value)
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-academic-background p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-academic-border rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-academic font-semibold text-academic-foreground mb-2">
              Email Verified!
            </h1>
            <p className="text-academic-foreground/70">
              Redirecting you to login...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-academic-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-academic-border rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[oklch(0.25_0.06_230)] to-[oklch(0.35_0.08_230)] p-8 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-academic font-semibold text-white">
              Verify Your Email
            </h1>
            <p className="text-white/80 mt-2 text-sm">
              Academic Excellence Portal
            </p>
          </div>

          <div className="p-8">
            <p className="text-academic-foreground/80 mb-2 text-center font-academic">
              We've sent a verification code to:
            </p>
            <p className="text-[oklch(0.25_0.06_230)] font-semibold text-center mb-6">
              {email}
            </p>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mb-6">
              <label className="block text-sm text-academic-foreground/70 mb-3 text-center font-academic">
                Enter 6-digit code
              </label>
              <AnimatedOTPInput
                value={otp}
                onChange={setOTP}
                onComplete={handleOTPComplete}
                disabled={verifyMutation.isPending}
              />
            </div>

            {verifyMutation.isPending && (
              <div className="text-center mb-6">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[oklch(0.25_0.06_230)]" />
                <p className="text-sm text-academic-foreground/60 mt-2">Verifying...</p>
              </div>
            )}

            <div className="text-center mb-6">
              {countdown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend code in {countdown}s
                </p>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resendMutation.mutate()}
                  disabled={resendMutation.isPending}
                  className="text-[oklch(0.25_0.06_230)] hover:text-[oklch(0.45_0.15_25)]"
                >
                  {resendMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                    </>
                  ) : (
                    'Resend verification code'
                  )}
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full border-academic-border hover:bg-academic-muted"
              asChild
            >
              <Link to="/auth/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-6 bg-[oklch(0.94_0.01_85)] border border-academic-border rounded-lg p-4">
          <p className="text-xs text-academic-foreground/70 text-center">
            <strong>Note:</strong> The verification code expires in 15 minutes. If you didn't receive the email, check your spam folder.
          </p>
        </div>
      </div>
    </div>
  )
}
