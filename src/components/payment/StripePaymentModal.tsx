import { Elements } from '@stripe/react-stripe-js'
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Loader2,
  Lock,
  Shield,
  Star,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { stripeApiClient } from '@/lib/stripe-api'
import { stripeConfig, useStripe } from '@/lib/stripe-context'
import { cn } from '@/lib/utils'

import { PaymentForm } from './PaymentForm'

import type {
  CreatePaymentIntentRequest,
  StripePaymentIntent,
  StripePaymentModalProps,
} from '@/lib/stripe-types'

interface PaymentModalState {
  paymentIntent: StripePaymentIntent | null
  isCreatingIntent: boolean
  error: string | null
  step: 'loading' | 'payment' | 'processing' | 'success' | 'error'
}

export function StripePaymentModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  price,
  currency = 'USD',
  originalPrice,
  onSuccess,
  onError,
  className,
}: StripePaymentModalProps) {
  const { user } = useAuth()
  const { stripe, isLoading: stripeLoading } = useStripe()
  const [state, setState] = useState<PaymentModalState>({
    paymentIntent: null,
    isCreatingIntent: false,
    error: null,
    step: 'loading',
  })

  const formatPrice = (priceValue: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(priceValue / 100)
  }

  const hasDiscount = originalPrice && originalPrice > price
  const discountAmount = hasDiscount ? originalPrice - price : 0
  const discountPercentage = hasDiscount
    ? Math.round((discountAmount / originalPrice) * 100)
    : 0

  // Create payment intent when modal opens
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!isOpen || !user || stripeLoading) return

      setState((prev) => ({
        ...prev,
        isCreatingIntent: true,
        error: null,
        step: 'loading',
      }))

      try {
        const payload: CreatePaymentIntentRequest = {
          amount: price,
          currency: currency.toLowerCase(),
          courseId,
          userId: user.id,
          userEmail: user.email,
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            course_id: courseId,
            course_title: courseTitle,
            user_id: user.id,
            user_email: user.email,
          },
        }

        console.log('Creating payment intent with payload:', {
          ...payload,
          amount: payload.amount,
          currency: payload.currency,
          courseId: payload.courseId,
        })

        const response = await stripeApiClient.createPaymentIntent(payload)
        console.log('Payment intent created successfully:', {
          paymentIntentId: response.payment_intent_id,
          clientSecret: response.client_secret ? '[REDACTED]' : 'null',
          status: response.status,
        })

        // Transform the response to match our StripePaymentIntent type
        const paymentIntent: StripePaymentIntent = {
          id: response.payment_intent_id,
          client_secret: response.client_secret,
          amount: response.amount,
          currency: response.currency,
          status: response.status,
          metadata: response.metadata || {
            course_id: courseId,
            course_title: courseTitle,
            user_id: user.id,
            user_email: user.email,
          },
          created: Math.floor(Date.now() / 1000),
        }

        setState((prev) => ({
          ...prev,
          paymentIntent,
          isCreatingIntent: false,
          step: 'payment',
        }))
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to initialize payment'
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isCreatingIntent: false,
          step: 'error',
        }))
        onError?.(errorMessage)
      }
    }

    createPaymentIntent()
  }, [isOpen, user, stripeLoading, courseId, price, currency, courseTitle])

  const handlePaymentSuccess = (paymentIntent: StripePaymentIntent) => {
    setState((prev) => ({
      ...prev,
      step: 'success',
    }))

    // Delay calling onSuccess to show success state
    setTimeout(() => {
      onSuccess?.(paymentIntent)
      onClose()
    }, 2000)
  }

  const handlePaymentError = (error: string) => {
    setState((prev) => ({
      ...prev,
      error,
      step: 'error',
    }))
    onError?.(error)
  }

  const handlePaymentProcessing = () => {
    setState((prev) => ({
      ...prev,
      step: 'processing',
      error: null,
    }))
  }

  const handleRetry = () => {
    setState((prev) => ({
      ...prev,
      error: null,
      step: 'loading',
      paymentIntent: null,
    }))
  }

  const handleModalClose = () => {
    // Prevent closing during critical payment steps
    if (state.step === 'processing' || state.step === 'loading') {
      console.log('Preventing modal close during', state.step)
      return
    }

    // Reset state when closing
    if (state.step !== 'success') {
      setState((prev) => ({
        ...prev,
        paymentIntent: null,
        error: null,
        step: 'loading',
      }))
    }

    onClose()
  }

  // Render loading state
  if (state.step === 'loading' || stripeLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className={cn('sm:max-w-lg', className)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Complete Your Purchase
            </DialogTitle>
            <DialogDescription>
              Preparing secure payment for {courseTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">
                Initializing secure payment...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Render error state
  if (state.step === 'error') {
    return (
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className={cn('sm:max-w-lg', className)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Payment Error
            </DialogTitle>
            <DialogDescription>
              We encountered an issue processing your payment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{state.error}</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button onClick={handleRetry}>Try Again</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Render success state
  if (state.step === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className={cn('sm:max-w-lg', className)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Payment Successful!
            </DialogTitle>
            <DialogDescription>
              You now have full access to {courseTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Welcome to the course!
            </h3>
            <p className="text-sm text-muted-foreground">
              You will be redirected to your course shortly...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Main payment form
  if (!state.paymentIntent || !stripe) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent
        className={cn('sm:max-w-2xl max-h-[90vh] overflow-y-auto', className)}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Complete Your Purchase
              </DialogTitle>
              <DialogDescription>
                Secure payment processed by Stripe
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleModalClose}
              disabled={state.step === 'processing'}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {courseTitle}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>4.8 rating</span>
                  <span>•</span>
                  <span>Lifetime access</span>
                </div>
              </div>
              <div className="text-right">
                {hasDiscount && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(originalPrice, currency)}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 text-xs"
                    >
                      -{discountPercentage}% OFF
                    </Badge>
                  </div>
                )}
                <div className="text-xl font-bold text-primary">
                  {formatPrice(price, currency)}
                </div>
              </div>
            </div>

            {/* Course Benefits */}
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Lifetime access</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Mobile & desktop</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Certificate included</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>30-day guarantee</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Payment Information</h3>
            </div>

            <Elements
              stripe={stripe}
              options={{
                clientSecret: state.paymentIntent.client_secret,
                appearance: stripeConfig.appearance,
                loader: 'auto',
              }}
            >
              <PaymentForm
                paymentIntent={state.paymentIntent}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onProcessing={handlePaymentProcessing}
                className="space-y-4"
              />
            </Elements>
          </div>

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <Shield className="h-3 w-3" />
            <span>Your payment is secured with 256-bit SSL encryption</span>
            <span>•</span>
            <span>Powered by Stripe</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Simplified version for quick purchases
export function QuickPurchaseModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  price,
  currency = 'USD',
  onSuccess,
  onError,
}: Omit<StripePaymentModalProps, 'originalPrice'>) {
  return (
    <StripePaymentModal
      isOpen={isOpen}
      onClose={onClose}
      courseId={courseId}
      courseTitle={courseTitle}
      price={price}
      currency={currency}
      onSuccess={onSuccess}
      onError={onError}
      className="sm:max-w-lg"
    />
  )
}
