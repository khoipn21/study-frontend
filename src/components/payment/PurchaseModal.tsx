import { useEffect, useState } from 'react'
import {
  Award,
  BookOpen,
  Check,
  Clock,
  CreditCard,
  Crown,
  Globe,
  Heart,
  Lock,
  RefreshCw,
  ShoppingCart,
  Smartphone,
  Star,
  Users,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  useCourseAccess,
  usePaymentFlow,
} from '@/lib/course-marketplace-context'
import { lemonSqueezyService } from '@/lib/lemon-squeezy'
import { useAuthContext } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import type { Course } from '@/lib/types'

interface PurchaseModalProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: (course: Course) => void
}

export function PurchaseModal({
  course,
  isOpen,
  onClose,
  onSuccess,
}: PurchaseModalProps) {
  const { user } = useAuthContext()
  const { paymentFlow, startPayment, setCheckoutUrl, resetPayment } =
    usePaymentFlow()
  const { getAccessStatus } = useCourseAccess()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accessStatus = course ? getAccessStatus(course) : 'locked'

  useEffect(() => {
    if (!isOpen) {
      resetPayment()
      setError(null)
      setIsProcessing(false)
    }
  }, [isOpen, resetPayment])

  // Redirect to checkout if URL is available
  useEffect(() => {
    if (paymentFlow.checkoutUrl && paymentFlow.status === 'processing') {
      window.open(paymentFlow.checkoutUrl, '_blank')
    }
  }, [paymentFlow.checkoutUrl, paymentFlow.status])

  const handlePurchase = async () => {
    if (!course || !user) {
      setError('Please log in to purchase this course')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      startPayment(course.id)

      const checkoutUrl = await lemonSqueezyService.createCourseCheckout({
        courseId: course.id,
        courseTitle: course.title,
        price: getDiscountedPrice(),
        currency: course.currency || 'USD',
        userId: user.id,
        userEmail: user.email,
        userName: user.username,
      })

      if (checkoutUrl) {
        setCheckoutUrl(course.id, checkoutUrl)
        // The useEffect above will handle the redirect
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (err) {
      console.error('Purchase error:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to start purchase process',
      )
      setIsProcessing(false)
    }
  }

  const getDiscountedPrice = () => {
    if (!course?.price || course.is_free) return 0
    if (!course.discount_percentage) return course.price
    return course.price * (1 - course.discount_percentage / 100)
  }

  const formatPrice = (price: number, currency: string = 'USD') => {
    if (price === 0) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  if (!course) return null

  const discountedPrice = getDiscountedPrice()
  const savings =
    course.price && course.discount_percentage
      ? course.price - discountedPrice
      : 0

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase Course
          </DialogTitle>
          <DialogDescription>
            Get lifetime access to this course and all its materials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Info */}
          <div className="flex gap-4">
            <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              {course.is_featured && (
                <Badge className="absolute top-1 left-1 text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg line-clamp-2">
                {course.title}
              </h3>
              {course.instructor_name && (
                <p className="text-sm text-muted-foreground">
                  by {course.instructor_name}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {course.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating.toFixed(1)}</span>
                    {course.rating_count && (
                      <span>({course.rating_count.toLocaleString()})</span>
                    )}
                  </div>
                )}
                {course.duration_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(course.duration_minutes)}</span>
                  </div>
                )}
                {course.enrollment_count && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrollment_count.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* What's Included */}
          <div className="space-y-4">
            <h4 className="font-medium">What's included:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {course.total_lectures && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{course.total_lectures} video lectures</span>
                </div>
              )}
              {course.lifetime_access && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Lifetime access</span>
                </div>
              )}
              {course.mobile_access && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Mobile and TV access</span>
                </div>
              )}
              {course.certificate_available && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
              )}
              {course.total_assignments && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{course.total_assignments} assignments</span>
                </div>
              )}
              {course.total_quizzes && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{course.total_quizzes} quizzes</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Full HD video quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Download for offline viewing</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Total</span>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(discountedPrice, course.currency)}
                  </span>
                  {course.discount_percentage && course.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(course.price, course.currency)}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <span>
                      You save {formatPrice(savings, course.currency)}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      -{course.discount_percentage}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {course.access_type === 'subscription' && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 This course is also included in our subscription plan for
                  unlimited access to all courses.
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Security and Guarantee */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Secure payment processed by Lemon Squeezy</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <X className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handlePurchase}
              disabled={isProcessing || accessStatus === 'purchased'}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : accessStatus === 'purchased' ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Already Purchased
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Purchase
                </>
              )}
            </Button>
          </div>

          {/* Payment Flow Status */}
          {paymentFlow.isActive && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>
                  {paymentFlow.status === 'initiating' &&
                    'Preparing checkout...'}
                  {paymentFlow.status === 'processing' &&
                    'Redirecting to payment...'}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PurchaseModal
