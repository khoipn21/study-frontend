import { BookOpen, CheckCircle, CreditCard } from 'lucide-react'

import { PaymentModal } from '@/components/payment/PaymentModal'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

interface EnrollmentButtonProps {
  courseId: string
  courseTitle: string
  price: number
  currency?: string
  isEnrolled?: boolean
  onEnrollmentSuccess?: () => void
  className?: string
}

export function EnrollmentButton({
  courseId,
  courseTitle,
  price,
  currency = 'USD',
  isEnrolled = false,
  onEnrollmentSuccess,
  className,
}: EnrollmentButtonProps) {
  const { user } = useAuth()

  const formatPrice = (priceValue: number, currencyCode: string) => {
    if (priceValue === 0) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(priceValue)
  }

  const handleFreeEnrollment = () => {
    if (!user) {
      alert('Please login first')
      return
    }

    try {
      // Call your API to enroll in free course
      // await api.enroll(token, courseId)
      onEnrollmentSuccess?.()
      alert('Successfully enrolled!')
    } catch (error) {
      console.error('Free enrollment failed:', error)
      alert('Enrollment failed. Please try again.')
    }
  }

  const handlePaymentSuccess = () => {
    onEnrollmentSuccess?.()
    // Show success message or redirect
    alert('Payment successful! You are now enrolled in the course.')
  }

  if (isEnrolled) {
    return (
      <Button className={className} disabled>
        <CheckCircle className="h-4 w-4 mr-2" />
        Enrolled
      </Button>
    )
  }

  if (price === 0) {
    // Free course
    return (
      <Button
        className={className}
        onClick={handleFreeEnrollment}
        disabled={!user}
      >
        <BookOpen className="h-4 w-4 mr-2" />
        {user ? 'Enroll for Free' : 'Login to Enroll'}
      </Button>
    )
  }

  // Paid course - requires payment
  return (
    <PaymentModal
      type="course"
      courseData={{
        id: courseId,
        title: courseTitle,
        price,
        currency,
      }}
      onSuccess={handlePaymentSuccess}
      onCancel={() => console.log('Payment cancelled')}
    >
      <Button className={className} disabled={!user}>
        <CreditCard className="h-4 w-4 mr-2" />
        {user
          ? `Purchase for ${formatPrice(price, currency)}`
          : 'Login to Purchase'}
      </Button>
    </PaymentModal>
  )
}
