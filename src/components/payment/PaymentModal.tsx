import React, { useState } from 'react'
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Crown,
  Gift,
  Loader2,
  Lock,
  X,
  Zap,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/lib/auth-context'
import { lemonSqueezyService } from '@/lib/lemon-squeezy'
import { cn } from '@/lib/utils'
import type {
  CourseCheckoutData,
  SubscriptionCheckoutData,
} from '@/lib/lemon-squeezy'

export interface PaymentModalProps {
  children: React.ReactNode
  type: 'course' | 'subscription'
  courseData?: {
    id: string
    title: string
    price: number
    currency: string
    originalPrice?: number
  }
  subscriptionData?: {
    planName: string
    variantId: string
    price: number
    currency: string
    features: Array<string>
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function PaymentModal({
  children,
  type,
  courseData,
  subscriptionData,
  onSuccess,
  onCancel: _onCancel,
}: PaymentModalProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discount: number
  } | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const isCourse = type === 'course'
  const isSubscription = type === 'subscription'

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price)
  }

  const calculateFinalPrice = () => {
    const basePrice = isCourse
      ? courseData?.price || 0
      : subscriptionData?.price || 0
    if (appliedCoupon) {
      return basePrice * (1 - appliedCoupon.discount / 100)
    }
    return basePrice
  }

  const applyCoupon = () => {
    if (!couponCode.trim()) return

    // Simulate coupon validation
    // In real implementation, validate with your backend
    if (couponCode.toLowerCase() === 'student10') {
      setAppliedCoupon({ code: couponCode, discount: 10 })
      setError('')
    } else if (couponCode.toLowerCase() === 'welcome20') {
      setAppliedCoupon({ code: couponCode, discount: 20 })
      setError('')
    } else {
      setError('Invalid coupon code')
      setAppliedCoupon(null)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setError('')
  }

  const handlePayment = async () => {
    if (!user) {
      setError('Please log in to continue')
      return
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      let checkoutUrl = ''

      if (isCourse && courseData) {
        const checkoutData: CourseCheckoutData = {
          courseId: courseData.id,
          courseTitle: courseData.title,
          price: calculateFinalPrice(),
          currency: courseData.currency,
          userId: user.id,
          userEmail: user.email,
          userName: user.username,
        }

        checkoutUrl =
          await lemonSqueezyService.createCourseCheckout(checkoutData)
      } else if (isSubscription && subscriptionData) {
        const checkoutData: SubscriptionCheckoutData = {
          planName: subscriptionData.planName,
          variantId: subscriptionData.variantId,
          userId: user.id,
          userEmail: user.email,
          userName: user.username,
        }

        checkoutUrl =
          await lemonSqueezyService.createSubscriptionCheckout(checkoutData)
      }

      if (checkoutUrl) {
        // Open Lemon Squeezy checkout in new window/tab
        window.open(
          checkoutUrl,
          '_blank',
          'width=800,height=800,scrollbars=yes,resizable=yes',
        )

        // Close modal and call success callback
        setIsOpen(false)
        onSuccess?.()
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Payment failed. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Complete Your {isCourse ? 'Purchase' : 'Subscription'}
          </DialogTitle>
          <DialogDescription>
            {isCourse
              ? 'Get lifetime access to this course and all its content'
              : 'Subscribe for unlimited access to all premium courses'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course/Subscription Info */}
          <div className="academic-card p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  {isCourse
                    ? courseData?.title
                    : `${subscriptionData?.planName} Plan`}
                </h4>
                {isSubscription && subscriptionData && (
                  <div className="mt-2 space-y-1">
                    {subscriptionData.features
                      .slice(0, 3)
                      .map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="h-3 w-3 text-success" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    {subscriptionData.features.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        +{subscriptionData.features.length - 3} more features
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                {isCourse &&
                  courseData?.originalPrice &&
                  courseData.originalPrice > courseData.price && (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatPrice(
                        courseData.originalPrice,
                        courseData.currency,
                      )}
                    </div>
                  )}
                <div className="text-lg font-bold text-primary">
                  {isCourse
                    ? formatPrice(courseData?.price || 0, courseData?.currency)
                    : `${formatPrice(subscriptionData?.price || 0, subscriptionData?.currency)}/month`}
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Coupon Code (Optional)
            </Label>
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={applyCoupon}
                  disabled={!couponCode.trim()}
                >
                  Apply
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">
                    {appliedCoupon.code} ({appliedCoupon.discount}% off)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeCoupon}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Price Summary */}
          {appliedCoupon && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>
                  {isCourse
                    ? formatPrice(courseData?.price || 0, courseData?.currency)
                    : formatPrice(
                        subscriptionData?.price || 0,
                        subscriptionData?.currency,
                      )}
                </span>
              </div>
              <div className="flex justify-between text-sm text-success">
                <span>Discount ({appliedCoupon.discount}%):</span>
                <span>
                  -
                  {formatPrice(
                    (isCourse
                      ? courseData?.price || 0
                      : subscriptionData?.price || 0) *
                      (appliedCoupon.discount / 100),
                    isCourse
                      ? courseData?.currency
                      : subscriptionData?.currency,
                  )}
                </span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">
                  {formatPrice(
                    calculateFinalPrice(),
                    isCourse
                      ? courseData?.currency
                      : subscriptionData?.currency,
                  )}
                  {isSubscription && '/month'}
                </span>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Switch
              id="terms"
              checked={acceptTerms}
              onCheckedChange={setAcceptTerms}
              className="mt-0.5"
            />
            <Label
              htmlFor="terms"
              className="text-sm text-muted-foreground leading-relaxed"
            >
              I accept the{' '}
              <a
                href="/terms"
                className="text-primary hover:underline"
                target="_blank"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="text-primary hover:underline"
                target="_blank"
              >
                Privacy Policy
              </a>
              {isSubscription &&
                '. You can cancel your subscription at any time.'}
            </Label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-3">
          <Button
            className="w-full h-11"
            onClick={handlePayment}
            disabled={isLoading || !acceptTerms || !user}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CreditCard className="h-4 w-4 mr-2" />
            )}
            {isLoading
              ? 'Processing...'
              : `Complete ${isCourse ? 'Purchase' : 'Subscription'} - ${formatPrice(calculateFinalPrice(), isCourse ? courseData?.currency : subscriptionData?.currency)}${isSubscription ? '/month' : ''}`}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Secured by Lemon Squeezy • SSL Encrypted</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Subscription Plan Card Component
export function SubscriptionPlanCard({
  planName,
  price,
  currency = 'USD',
  features,
  isPopular = false,
  variantId,
  className,
}: {
  planName: string
  price: number
  currency?: string
  features: Array<string>
  isPopular?: boolean
  variantId: string
  className?: string
}) {
  const formatPrice = (priceValue: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(priceValue)
  }

  return (
    <div
      className={cn(
        'academic-card p-6 relative',
        isPopular && 'border-primary shadow-lg',
        className,
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
          {planName === 'Pro' && <Crown className="h-5 w-5 text-warning" />}
          {planName === 'Premium' && <Zap className="h-5 w-5 text-primary" />}
          {planName}
        </h3>
        <div className="text-3xl font-bold text-primary mb-1">
          {formatPrice(price, currency)}
          <span className="text-lg font-normal text-muted-foreground">
            /month
          </span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <PaymentModal
        type="subscription"
        subscriptionData={{
          planName,
          variantId,
          price,
          currency,
          features,
        }}
      >
        <Button className="w-full" variant={isPopular ? 'default' : 'outline'}>
          Get Started
        </Button>
      </PaymentModal>
    </div>
  )
}
