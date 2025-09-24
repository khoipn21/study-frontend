import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  HelpCircle,
  Home,
  Mail,
  Phone,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { PaymentError } from '@/lib/stripe-types'

interface PaymentErrorPageProps {
  error?: PaymentError | string
  courseId?: string
  courseTitle?: string
  className?: string
}

// Common Stripe error codes and user-friendly messages
const ERROR_MESSAGES: Record<
  string,
  { title: string; message: string; actionable: boolean }
> = {
  // Card errors
  card_declined: {
    title: 'Card Declined',
    message:
      'Your card was declined. Please try a different payment method or contact your bank.',
    actionable: true,
  },
  expired_card: {
    title: 'Card Expired',
    message:
      'Your card has expired. Please update your card details and try again.',
    actionable: true,
  },
  insufficient_funds: {
    title: 'Insufficient Funds',
    message:
      'Your card has insufficient funds. Please use a different card or add funds to your account.',
    actionable: true,
  },
  incorrect_cvc: {
    title: 'Incorrect Security Code',
    message:
      'The security code (CVC) you entered is incorrect. Please check and try again.',
    actionable: true,
  },
  processing_error: {
    title: 'Processing Error',
    message:
      'We encountered an error processing your payment. Please try again in a few minutes.',
    actionable: true,
  },

  // Authentication errors
  authentication_required: {
    title: 'Authentication Required',
    message:
      'Your bank requires additional authentication. Please complete the verification process.',
    actionable: true,
  },

  // Network/API errors
  api_connection_error: {
    title: 'Connection Error',
    message:
      'We could not connect to our payment processor. Please check your internet connection and try again.',
    actionable: true,
  },
  api_error: {
    title: 'Service Error',
    message:
      'Our payment service is temporarily unavailable. Please try again later.',
    actionable: false,
  },

  // Generic errors
  generic_decline: {
    title: 'Payment Declined',
    message:
      'Your payment was declined. Please try a different payment method.',
    actionable: true,
  },
}

export function PaymentErrorPage({
  error,
  courseId,
  courseTitle,
  className,
}: PaymentErrorPageProps) {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })

  const [retryCount, setRetryCount] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  // Get error details from props or URL
  const errorCode =
    typeof error === 'string' ? error : error?.code || search.error || 'unknown'
  const targetCourseId = courseId || search.course_id
  const targetCourseTitle = courseTitle || search.course_title || 'the course'

  const errorInfo =
    ERROR_MESSAGES[errorCode] || ERROR_MESSAGES['generic_decline']
  const canRetry = errorInfo.actionable && retryCount < 3

  const handleRetryPayment = () => {
    if (!canRetry) return

    setRetryCount((prev) => prev + 1)

    // Navigate back to course with retry flag
    if (targetCourseId) {
      navigate({
        to: `/courses/${targetCourseId}`,
      })
    } else {
      // Go back to previous page
      window.history.back()
    }
  }

  const handleGoToCourse = () => {
    if (targetCourseId) {
      navigate({ to: `/courses/${targetCourseId}` })
    } else {
      navigate({ to: '/courses' })
    }
  }

  const handleGoHome = () => {
    navigate({ to: '/' })
  }

  const handleContactSupport = () => {
    // In a real app, this might open a support chat or email
    window.open(
      'mailto:support@studyplatform.com?subject=Payment Error&body=Payment Error Code: ' +
        errorCode,
      '_blank',
    )
  }

  return (
    <div
      className={cn('container max-w-2xl mx-auto py-8 space-y-6', className)}
    >
      {/* Error Header */}
      <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">
                {errorInfo.title}
              </h1>
              <p className="text-red-700 dark:text-red-400">
                We couldn't process your payment for {targetCourseTitle}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-red-600" />
            What went wrong?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{errorInfo.message}</p>

          {canRetry && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">
                    You can try again
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Most payment issues are temporary. You have {3 - retryCount}{' '}
                    attempt(s) remaining.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Technical Details (collapsible) */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showDetails ? 'Hide' : 'Show'} technical details
              <HelpCircle className="h-4 w-4 ml-2" />
            </Button>

            {showDetails && (
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <div>
                  <span className="font-medium">Error Code:</span>{' '}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    {errorCode}
                  </code>
                </div>
                {search.payment_intent && (
                  <div>
                    <span className="font-medium">Payment Intent:</span>{' '}
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                      {search.payment_intent}
                    </code>
                  </div>
                )}
                <div>
                  <span className="font-medium">Time:</span>{' '}
                  {new Date().toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>What would you like to do?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {canRetry && (
              <Button onClick={handleRetryPayment} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Payment Again
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleGoToCourse}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>

            <Button variant="outline" onClick={handleGoHome} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>

            <Button
              variant="outline"
              onClick={handleContactSupport}
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Common Solutions */}
      <Card>
        <CardHeader>
          <CardTitle>Common Solutions</CardTitle>
          <CardDescription>
            Try these steps to resolve payment issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-medium">Check your card details</h4>
                <p className="text-sm text-muted-foreground">
                  Make sure your card number, expiry date, and security code are
                  correct
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-medium">Try a different card</h4>
                <p className="text-sm text-muted-foreground">
                  Use another payment method if available
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-medium">Contact your bank</h4>
                <p className="text-sm text-muted-foreground">
                  Your bank may be blocking the transaction for security reasons
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                4
              </div>
              <div>
                <h4 className="font-medium">Check your internet connection</h4>
                <p className="text-sm text-muted-foreground">
                  A stable connection is required for secure payments
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Options */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Our support team is here to help you complete your purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium">Email Support</h4>
                <p className="text-sm text-muted-foreground">
                  support@studyplatform.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium">Phone Support</h4>
                <p className="text-sm text-muted-foreground">1-800-STUDY-NOW</p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Reference this error when contacting support:
            </p>
            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
              ERROR_{errorCode.toUpperCase()}_{Date.now().toString().slice(-6)}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Inline error component for forms
export function PaymentErrorInline({
  error,
  onRetry,
  onDismiss,
  className,
}: {
  error: string | PaymentError
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg',
        className,
      )}
    >
      <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-medium text-destructive">Payment Failed</h4>
        <p className="text-sm text-destructive/80 mt-1">{errorMessage}</p>
        {(onRetry || onDismiss) && (
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
