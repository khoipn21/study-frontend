import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  PlayCircle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/lib/auth-context'
import { stripeApiClient } from '@/lib/stripe-api'
import { cn } from '@/lib/utils'

import type {
  CourseEnrollment,
  EnrollmentStatusProps,
} from '@/lib/stripe-types'

interface EnrollmentData {
  enrollments: Array<CourseEnrollment>
  total: number
  page: number
  limit: number
}

interface EnrollmentStatusDisplayProps {
  enrollment: CourseEnrollment
  courseTitle?: string
  showProgress?: boolean
  showActions?: boolean
  compact?: boolean
  className?: string
}

// Status badge component
function EnrollmentStatusBadge({
  status,
  paymentStatus,
}: {
  status: string
  paymentStatus: string
}) {
  const getStatusConfig = () => {
    if (paymentStatus === 'pending') {
      return {
        label: 'Payment Pending',
        variant: 'outline' as const,
        icon: Clock,
        className:
          'border-yellow-300 text-yellow-800 dark:border-yellow-600 dark:text-yellow-300',
      }
    }

    if (paymentStatus === 'failed') {
      return {
        label: 'Payment Failed',
        variant: 'destructive' as const,
        icon: AlertCircle,
        className: '',
      }
    }

    if (paymentStatus === 'refunded') {
      return {
        label: 'Refunded',
        variant: 'outline' as const,
        icon: RefreshCw,
        className:
          'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400',
      }
    }

    switch (status) {
      case 'active':
        return {
          label: 'Enrolled',
          variant: 'outline' as const,
          icon: CheckCircle,
          className:
            'border-green-300 text-green-800 dark:border-green-600 dark:text-green-300',
        }
      case 'expired':
        return {
          label: 'Expired',
          variant: 'outline' as const,
          icon: Clock,
          className:
            'border-red-300 text-red-800 dark:border-red-600 dark:text-red-300',
        }
      default:
        return {
          label: 'Unknown',
          variant: 'secondary' as const,
          icon: AlertCircle,
          className: '',
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

// Individual enrollment status display
function EnrollmentStatusDisplay({
  enrollment,
  courseTitle,
  showProgress = true,
  showActions = true,
  compact = false,
  className,
}: EnrollmentStatusDisplayProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isActive = enrollment.payment_status === 'completed'
  const hasExpiry =
    enrollment.expires_at !== undefined && enrollment.expires_at !== null
  const isExpired = hasExpiry && new Date(enrollment.expires_at!) < new Date()

  // Mock progress data (in real app, fetch from progress API)
  const mockProgress = {
    completion_percentage: 65,
    completed_lectures: 12,
    total_lectures: 18,
    last_watched: '2 days ago',
  }

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-3 border rounded-lg',
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              isActive ? 'bg-green-500' : 'bg-yellow-500',
            )}
          />
          <div>
            <p className="font-medium text-sm">
              {courseTitle || `Course ${enrollment.course_id}`}
            </p>
            <p className="text-xs text-muted-foreground">
              Enrolled {formatDate(enrollment.enrolled_at)}
            </p>
          </div>
        </div>
        <EnrollmentStatusBadge
          status={isExpired ? 'expired' : 'active'}
          paymentStatus={enrollment.payment_status}
        />
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {courseTitle || `Course ${enrollment.course_id}`}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span>Enrolled {formatDate(enrollment.enrolled_at)}</span>
              {hasExpiry && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Expires {formatDate(enrollment.expires_at!)}
                </span>
              )}
            </CardDescription>
          </div>
          <EnrollmentStatusBadge
            status={isExpired ? 'expired' : 'active'}
            paymentStatus={enrollment.payment_status}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress section */}
        {showProgress && isActive && !isExpired && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {mockProgress.completed_lectures}/{mockProgress.total_lectures}{' '}
                lectures
              </span>
            </div>
            <Progress
              value={mockProgress.completion_percentage}
              className="h-2"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{mockProgress.completion_percentage}% complete</span>
              <span>Last watched {mockProgress.last_watched}</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {isActive && !isExpired ? (
              <>
                <Button size="sm" className="flex-1">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Resources
                </Button>
              </>
            ) : enrollment.payment_status === 'failed' ? (
              <Button size="sm" variant="outline" className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Retry Payment
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="flex-1" disabled>
                <AlertCircle className="h-4 w-4 mr-2" />
                Access Restricted
              </Button>
            )}
          </div>
        )}

        {/* Additional info for different statuses */}
        {enrollment.payment_status === 'pending' && (
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Your payment is being processed. You'll receive email confirmation
              once completed.
            </p>
          </div>
        )}

        {enrollment.payment_status === 'failed' && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-300">
              Payment failed. Please update your payment method to continue
              accessing the course.
            </p>
          </div>
        )}

        {isExpired && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-300">
              Your access has expired. Renew your enrollment to continue
              learning.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main enrollment status component
export function EnrollmentStatus({
  courseId,
  userId,
  className,
}: EnrollmentStatusProps) {
  const { user } = useAuth()
  const targetUserId = userId || user?.id

  const {
    data: enrollmentData,
    isLoading,
    error,
    refetch,
  } = useQuery<EnrollmentData>({
    queryKey: ['userEnrollments', targetUserId, courseId],
    queryFn: () => stripeApiClient.getUserEnrollments({ limit: 1 }),
    enabled: !!targetUserId,
    select: (data) => ({
      ...data,
      enrollments: courseId
        ? data.enrollments.filter((e) => e.course_id === courseId)
        : data.enrollments,
    }),
  })

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Card
        className={cn(
          'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50',
          className,
        )}
      >
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto text-red-600 dark:text-red-400" />
            <h3 className="font-medium text-red-800 dark:text-red-300">
              Failed to Load Enrollment Status
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              {error instanceof Error
                ? error.message
                : 'Unknown error occurred'}
            </p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const enrollments = enrollmentData?.enrollments || []

  if (enrollments.length === 0) {
    return courseId ? null : (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <Award className="h-8 w-8 mx-auto text-muted-foreground" />
            <h3 className="font-medium">No Enrollments</h3>
            <p className="text-sm text-muted-foreground">
              You haven't enrolled in any courses yet
            </p>
            <Button size="sm" asChild>
              <a href="/courses">
                <ExternalLink className="h-4 w-4 mr-2" />
                Browse Courses
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Single course view
  if (courseId && enrollments.length === 1) {
    return (
      <EnrollmentStatusDisplay
        enrollment={enrollments[0]}
        showProgress={true}
        showActions={true}
        className={className}
      />
    )
  }

  // Multiple enrollments view
  return (
    <div className={cn('space-y-4', className)}>
      {!courseId && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">My Enrollments</h3>
          <Badge variant="outline">
            {enrollments.length} course{enrollments.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      {enrollments.map((enrollment) => (
        <EnrollmentStatusDisplay
          key={enrollment.id}
          enrollment={enrollment}
          showProgress={true}
          showActions={true}
        />
      ))}
    </div>
  )
}

// Compact enrollment list for dashboard/sidebar
export function CompactEnrollmentList({
  userId,
  maxItems = 5,
  className,
}: {
  userId?: string
  maxItems?: number
  className?: string
}) {
  const { user } = useAuth()
  const targetUserId = userId || user?.id

  const { data: enrollmentData, isLoading } = useQuery<EnrollmentData>({
    queryKey: ['userEnrollments', targetUserId],
    queryFn: () => stripeApiClient.getUserEnrollments({ limit: maxItems }),
    enabled: !!targetUserId,
  })

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  const enrollments = enrollmentData?.enrollments || []

  if (enrollments.length === 0) {
    return (
      <div
        className={cn(
          'text-center py-4 text-sm text-muted-foreground',
          className,
        )}
      >
        No active enrollments
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {enrollments.slice(0, maxItems).map((enrollment) => (
        <EnrollmentStatusDisplay
          key={enrollment.id}
          enrollment={enrollment}
          compact={true}
          showProgress={false}
          showActions={false}
        />
      ))}
      {enrollments.length > maxItems && (
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <a href="/dashboard/enrollments">View All ({enrollments.length})</a>
        </Button>
      )}
    </div>
  )
}

// Enrollment statistics component
export function EnrollmentStats({
  userId,
  className,
}: {
  userId?: string
  className?: string
}) {
  const { user } = useAuth()
  const targetUserId = userId || user?.id

  const { data: enrollmentData, isLoading } = useQuery<EnrollmentData>({
    queryKey: ['userEnrollments', targetUserId],
    queryFn: () => stripeApiClient.getUserEnrollments(),
    enabled: !!targetUserId,
  })

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  const enrollments = enrollmentData?.enrollments || []
  const activeEnrollments = enrollments.filter(
    (e) =>
      e.payment_status === 'completed' &&
      (!e.expires_at || new Date(e.expires_at) > new Date()),
  )
  const completedCount = 0 // Mock - would come from progress API

  const stats = [
    {
      label: 'Active Courses',
      value: activeEnrollments.length,
      icon: PlayCircle,
      color: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: Award,
      color: 'text-green-600',
    },
    {
      label: 'Total Enrolled',
      value: enrollments.length,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ]

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)}>
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg bg-muted', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
