import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import {
  AlertCircle,
  CreditCard,
  Loader2,
  Lock,
  Mail,
  Shield,
  User,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { stripeApiClient } from '@/lib/stripe-api'
import { useStripeErrorHandler } from '@/lib/stripe-context'
import { cn } from '@/lib/utils'

import type { PaymentFormProps, StripePaymentIntent } from '@/lib/stripe-types'

interface PaymentFormState {
  isProcessing: boolean
  error: string | null
  customerInfo: {
    email: string
    name: string
  }
  agreeToTerms: boolean
  savePaymentMethod: boolean
}

export function PaymentForm({
  paymentIntent,
  onSuccess,
  onError,
  onProcessing,
  isLoading = false,
  className,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const { formatStripeError } = useStripeErrorHandler()

  const [state, setState] = useState<PaymentFormState>({
    isProcessing: false,
    error: null,
    customerInfo: {
      email: user?.email || '',
      name: user?.username || '',
    },
    agreeToTerms: false,
    savePaymentMethod: false,
  })

  // Update customer info when user changes
  useEffect(() => {
    if (user) {
      setState((prev) => ({
        ...prev,
        customerInfo: {
          email: user.email || prev.customerInfo.email,
          name: user.username || prev.customerInfo.name,
        },
      }))
    }
  }, [user])

  const handleInputChange =
    (field: keyof PaymentFormState['customerInfo']) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [field]: e.target.value,
        },
      }))
    }

  const validateForm = (): boolean => {
    const { email, name } = state.customerInfo

    if (!email.trim()) {
      setState((prev) => ({ ...prev, error: 'Email is required' }))
      return false
    }

    if (!name.trim()) {
      setState((prev) => ({ ...prev, error: 'Full name is required' }))
      return false
    }

    if (!state.agreeToTerms) {
      setState((prev) => ({
        ...prev,
        error: 'You must agree to the terms and conditions',
      }))
      return false
    }

    if (!stripe || !elements) {
      setState((prev) => ({
        ...prev,
        error: 'Payment system not ready. Please try again.',
      }))
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setState((prev) => ({
      ...prev,
      isProcessing: true,
      error: null,
    }))

    // Notify parent component that processing has started
    onProcessing?.()

    try {
      const { error: submitError } = await elements!.submit()

      if (submitError) {
        throw submitError
      }

      // Confirm the payment with Stripe
      const { error: confirmError, paymentIntent: confirmedPaymentIntent } =
        await stripe!.confirmPayment({
          elements: elements!,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`,
            receipt_email: state.customerInfo.email,
            payment_method_data: {
              billing_details: {
                email: state.customerInfo.email,
                name: state.customerInfo.name,
              },
            },
          },
          redirect: 'if_required',
        })

      if (confirmError) {
        throw confirmError
      }

      if (
        confirmedPaymentIntent &&
        confirmedPaymentIntent.status === 'succeeded'
      ) {
        // Payment succeeded, notify the backend
        try {
          const courseId =
            paymentIntent.metadata.course_id || paymentIntent.metadata.courseId
          if (!courseId) {
            throw new Error('Course ID not found in payment metadata')
          }

          console.log('Purchasing course with payment intent:', {
            courseId,
            paymentIntentId: confirmedPaymentIntent.id,
            amount: confirmedPaymentIntent.amount,
          })

          await stripeApiClient.purchaseCourse(courseId, {
            payment_intent_id: confirmedPaymentIntent.id,
          })

          onSuccess({
            ...confirmedPaymentIntent,
            metadata: paymentIntent.metadata,
          } as StripePaymentIntent)
        } catch (backendError) {
          // Payment succeeded with Stripe but backend failed
          // This is a critical error that needs manual resolution
          console.error(
            'Backend enrollment failed after successful payment:',
            backendError,
          )
          const errorMessage =
            backendError instanceof Error
              ? `Payment successful but enrollment failed: ${backendError.message}. Please contact support.`
              : 'Payment successful but enrollment failed. Please contact support.'

          setState((prev) => ({
            ...prev,
            error: errorMessage,
            isProcessing: false,
          }))
        }
      } else if (
        confirmedPaymentIntent &&
        confirmedPaymentIntent.status === 'requires_action'
      ) {
        // Handle additional authentication (3D Secure, etc.)
        setState((prev) => ({
          ...prev,
          error:
            'Payment requires additional authentication. Please complete the authentication.',
          isProcessing: false,
        }))
      } else {
        throw new Error('Payment failed with unknown status')
      }
    } catch (error) {
      const errorMessage = formatStripeError(error)
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isProcessing: false,
      }))
      onError(errorMessage)
    }
  }

  const isFormDisabled = isLoading || state.isProcessing || !stripe || !elements

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Customer Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Customer Information</Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={state.customerInfo.email}
                onChange={handleInputChange('email')}
                className="pl-10"
                required
                disabled={isFormDisabled}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={state.customerInfo.name}
                onChange={handleInputChange('name')}
                className="pl-10"
                required
                disabled={isFormDisabled}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Payment Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Payment Information</Label>
        </div>

        <div className="p-4 border border-border rounded-lg bg-card">
          <PaymentElement
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
              fields: {
                billingDetails: {
                  email: 'never',
                  name: 'never',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Billing Address */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Billing Address</Label>
        <div className="p-4 border border-border rounded-lg bg-card">
          <AddressElement
            options={{
              mode: 'billing',
              allowedCountries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
              fields: {
                phone: 'auto',
              },
            }}
          />
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="save-payment"
            checked={state.savePaymentMethod}
            onCheckedChange={(checked) =>
              setState((prev) => ({
                ...prev,
                savePaymentMethod: checked as boolean,
              }))
            }
            disabled={isFormDisabled}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="save-payment"
              className="text-sm font-normal cursor-pointer"
            >
              Save payment method for future purchases
            </Label>
            <p className="text-xs text-muted-foreground">
              Securely save your payment method for faster checkout
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={state.agreeToTerms}
            onCheckedChange={(checked) =>
              setState((prev) => ({
                ...prev,
                agreeToTerms: checked as boolean,
              }))
            }
            disabled={isFormDisabled}
            className="mt-0.5"
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-normal cursor-pointer"
            >
              I agree to the{' '}
              <a
                href="/terms"
                className="text-primary underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="text-primary underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              *
            </Label>
            <p className="text-xs text-muted-foreground">
              30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-destructive font-medium">
              Payment Error
            </p>
            <p className="text-sm text-destructive/80 mt-1">{state.error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={isFormDisabled || !state.agreeToTerms}
          size="lg"
        >
          {state.isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Processing Payment...
            </>
          ) : (
            <>
              <Lock className="h-5 w-5 mr-2" />
              Complete Purchase
            </>
          )}
        </Button>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        {/* Payment Provider Info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Powered by Stripe • PCI DSS Compliant</p>
          <p className="mt-1">
            We never store your payment information on our servers
          </p>
        </div>
      </div>
    </form>
  )
}

// Minimal payment form for quick purchases
export function QuickPaymentForm({
  onSuccess,
  onError,
  className,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const { formatStripeError } = useStripeErrorHandler()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) throw submitError

      const { error: confirmError, paymentIntent: confirmedPaymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`,
            receipt_email: user?.email,
            payment_method_data: {
              billing_details: {
                email: user?.email || '',
                name: user?.username || '',
              },
            },
          },
          redirect: 'if_required',
        })

      if (confirmError) throw confirmError

      if (
        confirmedPaymentIntent &&
        confirmedPaymentIntent.status === 'succeeded'
      ) {
        onSuccess({
          ...confirmedPaymentIntent,
          metadata: {},
        } as StripePaymentIntent)
      }
    } catch (error) {
      const errorMessage = formatStripeError(error)
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <PaymentElement />

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          'Complete Payment'
        )}
      </Button>
    </form>
  )
}
