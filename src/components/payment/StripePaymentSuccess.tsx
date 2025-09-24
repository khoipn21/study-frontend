import React, { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Download,
  Loader2,
  Mail,
  Play,
  Star,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { PaymentSuccessResponse } from '@/lib/stripe-types'

interface PaymentSuccessState {
  isLoading: boolean
  error: string | null
  paymentData: PaymentSuccessResponse | null
  countdown: number
}

interface PaymentSuccessPageProps {
  paymentIntentId?: string
  courseId?: string
  className?: string
}

export function PaymentSuccessPage({
  paymentIntentId,
  courseId,
  className,
}: PaymentSuccessPageProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const search = useSearch({ strict: false })

  const [state, setState] = useState<PaymentSuccessState>({
    isLoading: true,
    error: null,
    paymentData: null,
    countdown: 10,
  })

  // Get payment intent ID from props or URL
  const intentId = paymentIntentId || search.payment_intent
  const targetCourseId = courseId || search.course_id

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!intentId || !user) {
        setState((prev) => ({
          ...prev,
          error: 'Payment information not found',
          isLoading: false,
        }))
        return
      }

      try {
        // In a real implementation, you'd fetch the payment details
        // For now, we'll create mock data based on the payment intent
        const mockPaymentData: PaymentSuccessResponse = {
          payment_intent: {
            id: intentId,
            client_secret: '',
            amount: 9999, // $99.99 in cents
            currency: 'usd',
            status: 'succeeded',
            metadata: {
              course_id: targetCourseId || 'course_123',
              course_title: 'Advanced React Development',
            },
            created: Date.now() / 1000,
          },
          enrollment: {
            id: 'enrollment_123',
            user_id: user.id,
            course_id: targetCourseId || 'course_123',
            status: 'active',
            enrolled_at: new Date().toISOString(),
          },
          transaction: {
            id: 'transaction_123',
            amount: 9999,
            currency: 'USD',
            status: 'completed',
            stripe_payment_intent_id: intentId,
            created_at: new Date().toISOString(),
          },
        }

        setState((prev) => ({
          ...prev,
          paymentData: mockPaymentData,
          isLoading: false,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to load payment details',
          isLoading: false,
        }))
      }
    }

    fetchPaymentDetails()
  }, [intentId, user, targetCourseId])

  // Countdown for auto-redirect
  useEffect(() => {
    if (state.paymentData && state.countdown > 0) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, countdown: prev.countdown - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (state.paymentData && state.countdown === 0) {
      // Auto-redirect to course
      handleGoToCourse()
    }
  }, [state.countdown, state.paymentData])

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const handleGoToCourse = () => {
    if (state.paymentData) {
      navigate({
        to: `/courses/${state.paymentData.enrollment.course_id}`,
      })
    }
  }

  const handleGoToDashboard = () => {
    navigate({ to: '/me/dashboard' })
  }

  const handleDownloadReceipt = () => {
    // In a real implementation, this would download the receipt
    window.open(`/api/receipts/${state.paymentData?.transaction.id}`, '_blank')
  }

  if (state.isLoading) {
    return (
      <div className={cn('container max-w-2xl mx-auto py-8', className)}>
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <h2 className="text-xl font-semibold">
                Processing your payment...
              </h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your purchase
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className={cn('container max-w-2xl mx-auto py-8', className)}>
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <h2 className="text-xl font-semibold text-destructive">
                Payment Error
              </h2>
              <p className="text-muted-foreground">{state.error}</p>
              <Button onClick={handleGoToDashboard}>Go to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!state.paymentData) {
    return null
  }

  const { payment_intent, transaction } = state.paymentData
  const courseTitle = payment_intent.metadata.course_title || 'Your Course'

  return (
    <div
      className={cn('container max-w-3xl mx-auto py-8 space-y-6', className)}
    >
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-2">
                Payment Successful!
              </h1>
              <p className="text-green-700 dark:text-green-400 text-lg">
                Welcome to {courseTitle}
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-green-300 text-green-800 dark:border-green-600 dark:text-green-300"
            >
              <Mail className="h-3 w-3 mr-1" />
              Confirmation email sent
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Purchase Details
          </CardTitle>
          <CardDescription>
            Your payment has been processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Course
              </Label>
              <p className="text-lg font-semibold">{courseTitle}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Amount Paid
              </Label>
              <p className="text-lg font-semibold">
                {formatPrice(transaction.amount, transaction.currency)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Transaction ID
              </Label>
              <p className="text-sm font-mono">{transaction.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Purchase Date
              </Label>
              <p className="text-sm">
                {new Date(transaction.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={handleDownloadReceipt} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button onClick={handleGoToDashboard} variant="outline" size="sm">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Access Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Your Course Access
          </CardTitle>
          <CardDescription>
            You now have full access to all course content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Instant Access</h4>
                <p className="text-sm text-muted-foreground">
                  Start learning immediately
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Lifetime Access</h4>
                <p className="text-sm text-muted-foreground">
                  Learn at your own pace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium">Certificate</h4>
                <p className="text-sm text-muted-foreground">Upon completion</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium">Premium Support</h4>
                <p className="text-sm text-muted-foreground">
                  Get help when needed
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleGoToCourse} size="lg" className="flex-1">
              <Play className="h-5 w-5 mr-2" />
              Start Learning Now
              {state.countdown > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {state.countdown}s
                </Badge>
              )}
            </Button>
            <Button variant="outline" onClick={handleGoToDashboard} size="lg">
              <ArrowRight className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>

          {state.countdown > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              You'll be redirected to the course automatically in{' '}
              {state.countdown} seconds
            </p>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-medium">Check your email</h4>
                <p className="text-sm text-muted-foreground">
                  We've sent you a confirmation email with your receipt and
                  course access details
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-medium">Set up your learning schedule</h4>
                <p className="text-sm text-muted-foreground">
                  Plan your learning journey and set goals in your dashboard
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-medium">Join the community</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with other students and get support from instructors
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}
