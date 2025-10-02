import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Lock,
  ShoppingCart,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthenticatedApi } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

import { StripePaymentModal } from './StripePaymentModal'

import type {
  CoursePaymentButtonProps,
  StripePaymentIntent,
} from '@/lib/stripe-types'

interface CoursePaymentButtonState {
  isModalOpen: boolean
  isLoading: boolean
  error: string | null
  success: boolean
}

export function CoursePaymentButton({
  courseId,
  courseTitle,
  price,
  currency = 'USD',
  originalPrice,
  discountPercentage,
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  onSuccess,
  onError,
}: CoursePaymentButtonProps) {
  const { isAuthenticated } = useAuthenticatedApi()
  const [state, setState] = useState<CoursePaymentButtonState>({
    isModalOpen: false,
    isLoading: false,
    error: null,
    success: false,
  })

  const formatPrice = (priceValue: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(priceValue / 100) // Convert from cents to dollars
  }

  const calculateDiscountedPrice = () => {
    if (!originalPrice || !discountPercentage) return price
    return originalPrice - (originalPrice * discountPercentage) / 100
  }

  const currentPrice = calculateDiscountedPrice()
  const hasDiscount =
    originalPrice && discountPercentage && originalPrice > currentPrice

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      setState((prev) => ({
        ...prev,
        error: 'Please log in to purchase this course',
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      isModalOpen: true,
      error: null,
    }))
  }

  const handleModalClose = () => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      error: null,
    }))
  }

  const handlePaymentSuccess = (paymentIntent: StripePaymentIntent) => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      success: true,
      error: null,
    }))

    onSuccess?.(paymentIntent)

    // Auto-hide success state after 3 seconds
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        success: false,
      }))
    }, 3000)
  }

  const handlePaymentError = (error: string) => {
    setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }))

    onError?.(error)
  }

  // Success state button
  if (state.success) {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn(
          'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
          'dark:border-green-800 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900',
          className,
        )}
        disabled
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Purchase Successful!
      </Button>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {/* Main Purchase Button */}
        <Button
          variant={variant}
          size={size}
          className={cn(
            'relative group transition-all duration-200',
            variant === 'default' &&
              'bg-primary hover:bg-primary/90 text-primary-foreground',
            variant === 'outline' && 'border-2 hover:bg-accent/10',
            'focus:ring-2 focus:ring-primary/20 focus:outline-none',
            className,
          )}
          onClick={handleButtonClick}
          disabled={disabled || state.isLoading}
        >
          {state.isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="flex items-center gap-2">
                Purchase Course
                {hasDiscount ? (
                  <span className="flex items-center gap-1">
                    <span className="line-through text-sm opacity-70">
                      {formatPrice(originalPrice, currency)}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(currentPrice, currency)}
                    </span>
                  </span>
                ) : (
                  <span className="font-semibold">
                    {formatPrice(currentPrice, currency)}
                  </span>
                )}
              </span>
            </>
          )}
        </Button>

        {/* Price Details and Badges */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {hasDiscount && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            >
              <Zap className="h-3 w-3 mr-1" />
              {discountPercentage}% OFF
            </Badge>
          )}

          <div className="flex items-center gap-1 text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span className="text-xs">Secure Payment</span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <CreditCard className="h-3 w-3" />
            <span className="text-xs">Stripe Protected</span>
          </div>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="flex items-center gap-2 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:text-red-400 dark:bg-red-950 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Benefits List */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Lifetime access to course content</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Certificate of completion</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Mobile and desktop access</span>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <StripePaymentModal
        isOpen={state.isModalOpen}
        onClose={handleModalClose}
        courseId={courseId}
        courseTitle={courseTitle}
        price={currentPrice}
        currency={currency}
        originalPrice={hasDiscount ? originalPrice : undefined}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </>
  )
}

// Compact version for course cards
export function CompactCoursePaymentButton({
  courseId,
  courseTitle,
  price,
  currency = 'USD',
  originalPrice,
  discountPercentage,
  className,
  onSuccess,
  onError,
}: CoursePaymentButtonProps) {
  const { isAuthenticated } = useAuthenticatedApi()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formatPrice = (priceValue: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(priceValue / 100)
  }

  const calculateDiscountedPrice = () => {
    if (!originalPrice || !discountPercentage) return price
    return originalPrice - (originalPrice * discountPercentage) / 100
  }

  const currentPrice = calculateDiscountedPrice()
  const hasDiscount =
    originalPrice && discountPercentage && originalPrice > currentPrice

  const handleClick = () => {
    if (!isAuthenticated) {
      // Handle authentication required
      return
    }
    setIsModalOpen(true)
  }

  const handleSuccess = (paymentIntent: StripePaymentIntent) => {
    setIsModalOpen(false)
    onSuccess?.(paymentIntent)
  }

  const handleError = (error: string) => {
    onError?.(error)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(currentPrice, currency)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice, currency)}
              </span>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 text-xs"
              >
                -{discountPercentage}%
              </Badge>
            </div>
          ) : (
            <span className="text-lg font-bold text-primary">
              {formatPrice(currentPrice, currency)}
            </span>
          )}
        </div>

        <Button
          size="sm"
          className={cn('group', className)}
          onClick={handleClick}
        >
          <CreditCard className="h-4 w-4 mr-1" />
          Buy Now
        </Button>
      </div>

      <StripePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
        price={currentPrice}
        currency={currency}
        originalPrice={hasDiscount ? originalPrice : undefined}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  )
}

// Price display component
export function CoursePriceDisplay({
  price,
  currency = 'USD',
  originalPrice,
  discountPercentage,
  size = 'default',
  className,
}: {
  price: number
  currency?: string
  originalPrice?: number
  discountPercentage?: number
  size?: 'sm' | 'default' | 'lg'
  className?: string
}) {
  const formatPrice = (priceValue: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(priceValue / 100)
  }

  const calculateDiscountedPrice = () => {
    if (!originalPrice || !discountPercentage) return price
    return originalPrice - (originalPrice * discountPercentage) / 100
  }

  const currentPrice = calculateDiscountedPrice()
  const hasDiscount =
    originalPrice && discountPercentage && originalPrice > currentPrice

  const sizeClasses = {
    sm: 'text-sm',
    default: 'text-lg',
    lg: 'text-xl',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-bold text-primary', sizeClasses[size])}>
        {formatPrice(currentPrice, currency)}
      </span>

      {hasDiscount && (
        <>
          <span
            className={cn(
              'text-muted-foreground line-through',
              size === 'sm'
                ? 'text-xs'
                : size === 'lg'
                  ? 'text-base'
                  : 'text-sm',
            )}
          >
            {formatPrice(originalPrice, currency)}
          </span>
          <Badge
            variant="secondary"
            className={cn(
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
              size === 'sm' ? 'text-xs px-1 py-0' : 'text-xs',
            )}
          >
            -{discountPercentage}%
          </Badge>
        </>
      )}
    </div>
  )
}
