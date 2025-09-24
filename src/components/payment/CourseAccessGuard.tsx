import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  Eye,
  Loader2,
  Lock,
  Star,
  Unlock,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthenticatedApi } from '@/lib/auth-context'
import { stripeApiClient } from '@/lib/stripe-api'
import { CoursePaymentButton } from './CoursePaymentButton'
import type {
  CourseAccessGuardProps,
  CourseEnrollment,
} from '@/lib/stripe-types'

interface AccessCheckResult {
  has_access: boolean
  access_level: 'none' | 'preview' | 'full'
  enrollment: CourseEnrollment | null
}

export function CourseAccessGuard({
  courseId,
  children,
  fallback,
  showPaymentPrompt = true,
}: CourseAccessGuardProps) {
  const { user, isAuthenticated } = useAuthenticatedApi()
  const [courseData, setCourseData] = useState<{
    title: string
    price: number
    currency: string
    originalPrice?: number
    discountPercentage?: number
  } | null>(null)

  // Query to check course access
  const {
    data: accessData,
    isLoading,
    error,
    refetch,
  } = useQuery<AccessCheckResult>({
    queryKey: ['courseAccess', courseId, user?.id],
    queryFn: () => stripeApiClient.checkCourseAccess(courseId),
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  // Mock course data fetch (in real app, this would be a separate query)
  useEffect(() => {
    // Mock course data - in real implementation, fetch from API
    setCourseData({
      title: 'Advanced React Development Course',
      price: 9999, // $99.99 in cents
      currency: 'USD',
      originalPrice: 14999, // $149.99 in cents
      discountPercentage: 33,
    })
  }, [courseId])

  const handlePaymentSuccess = () => {
    // Refetch access data after successful payment
    refetch()
  }

  // Loading state
  if (isLoading || !courseData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (!showPaymentPrompt) {
      return (
        fallback || (
          <div className="text-center py-8">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Please log in to access this content
            </p>
          </div>
        )
      )
    }

    return (
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Authentication Required</h3>
              <p className="text-muted-foreground">
                Please log in to purchase and access this course
              </p>
            </div>
            <Button asChild>
              <a href="/login">Log In</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      fallback || (
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-red-600 dark:text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                  Access Check Failed
                </h3>
                <p className="text-red-700 dark:text-red-400">
                  Unable to verify your course access. Please try again.
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    )
  }

  const { has_access, access_level, enrollment } = accessData!

  // Full access - show content
  if (has_access && access_level === 'full') {
    return (
      <div>
        {/* Access indicator */}
        <div className="flex items-center gap-2 mb-4">
          <Badge
            variant="outline"
            className="border-green-300 text-green-800 dark:border-green-600 dark:text-green-300"
          >
            <Unlock className="h-3 w-3 mr-1" />
            Full Access
          </Badge>
          {enrollment && (
            <span className="text-sm text-muted-foreground">
              Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
            </span>
          )}
        </div>
        {children}
      </div>
    )
  }

  // Preview access - show content with upgrade prompt
  if (access_level === 'preview') {
    return (
      <div>
        {/* Preview indicator */}
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant="outline"
            className="border-blue-300 text-blue-800 dark:border-blue-600 dark:text-blue-300"
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview Access
          </Badge>
          <CoursePaymentButton
            courseId={courseId}
            courseTitle={courseData.title}
            price={courseData.price}
            currency={courseData.currency}
            originalPrice={courseData.originalPrice}
            discountPercentage={courseData.discountPercentage}
            size="sm"
            onSuccess={handlePaymentSuccess}
          />
        </div>
        {children}
        {/* Upgrade prompt overlay */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Crown className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 dark:text-blue-300">
                Unlock Full Course Access
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Get lifetime access to all lectures, assignments, and premium
                content
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No access - show payment prompt or fallback
  if (!showPaymentPrompt) {
    return (
      fallback || (
        <div className="text-center py-8">
          <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            This content requires course purchase
          </p>
        </div>
      )
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">Premium Content</CardTitle>
        <CardDescription>
          Purchase this course to unlock all content and features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Course Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm">Lifetime access</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm">All video lectures</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm">Downloadable resources</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm">Certificate of completion</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm">Mobile access</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm">30-day money-back guarantee</span>
          </div>
        </div>

        {/* Pricing and Purchase Button */}
        <div className="space-y-4">
          <div className="text-center">
            {courseData.originalPrice && courseData.discountPercentage && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg text-muted-foreground line-through">
                  ${(courseData.originalPrice / 100).toFixed(2)}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {courseData.discountPercentage}% OFF
                </Badge>
              </div>
            )}
            <div className="text-3xl font-bold text-primary">
              ${(courseData.price / 100).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">One-time payment</p>
          </div>

          <CoursePaymentButton
            courseId={courseId}
            courseTitle={courseData.title}
            price={courseData.price}
            currency={courseData.currency}
            originalPrice={courseData.originalPrice}
            discountPercentage={courseData.discountPercentage}
            className="w-full"
            size="lg"
            onSuccess={handlePaymentSuccess}
          />

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.9 rating</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>12 hours content</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>2,543 students</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for inline content protection
export function InlineAccessGuard({
  courseId,
  children,
  message = 'This content is only available to enrolled students',
  showUpgradeButton = true,
}: {
  courseId: string
  children: React.ReactNode
  message?: string
  showUpgradeButton?: boolean
}) {
  const { user, isAuthenticated } = useAuthenticatedApi()

  const { data: accessData, isLoading } = useQuery<AccessCheckResult>({
    queryKey: ['courseAccess', courseId, user?.id],
    queryFn: () => stripeApiClient.checkCourseAccess(courseId),
    enabled: isAuthenticated && !!user,
  })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-4 border border-border rounded-lg bg-muted/50">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Checking access...
        </span>
      </div>
    )
  }

  if (
    !isAuthenticated ||
    !accessData?.has_access ||
    accessData.access_level === 'none'
  ) {
    return (
      <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{message}</span>
        </div>
        {showUpgradeButton && (
          <Button size="sm" variant="outline">
            <CreditCard className="h-4 w-4 mr-1" />
            Upgrade
          </Button>
        )}
      </div>
    )
  }

  return <>{children}</>
}
