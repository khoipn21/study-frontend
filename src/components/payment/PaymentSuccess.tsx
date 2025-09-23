import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Award,
  BookOpen,
  CheckCircle,
  Download,
  MessageCircle,
  Play,
  Share2,
  Star,
  Users,
} from 'lucide-react'
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
import type { Course, CoursePurchase } from '@/lib/types'

interface PaymentSuccessProps {
  course: Course
  purchase: CoursePurchase
  onStartLearning?: () => void
  onDownloadReceipt?: () => void
  onRateCourse?: () => void
  className?: string
}

export function PaymentSuccess({
  course,
  purchase,
  onStartLearning,
  onDownloadReceipt,
  onRateCourse,
  className,
}: PaymentSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={cn('max-w-4xl mx-auto p-6 space-y-6', className)}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 via-transparent to-transparent animate-pulse" />
        </div>
      )}

      {/* Success Header */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700 dark:text-green-300">
            Payment Successful! 🎉
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            Welcome to your new course! You now have lifetime access to all
            course materials.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Your Course
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {course.title}
                  </h3>
                  {course.instructor_name && (
                    <p className="text-sm text-muted-foreground mt-1">
                      by {course.instructor_name}
                    </p>
                  )}
                  {course.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">
                        {course.rating.toFixed(1)}
                      </span>
                      {course.rating_count && (
                        <span className="text-sm text-muted-foreground">
                          ({course.rating_count.toLocaleString()} reviews)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {course.total_lectures && (
                  <div className="text-center">
                    <div className="font-semibold">{course.total_lectures}</div>
                    <div className="text-muted-foreground">Lectures</div>
                  </div>
                )}
                {course.duration_minutes && (
                  <div className="text-center">
                    <div className="font-semibold">
                      {Math.floor(course.duration_minutes / 60)}h{' '}
                      {course.duration_minutes % 60}m
                    </div>
                    <div className="text-muted-foreground">Duration</div>
                  </div>
                )}
                {course.total_assignments && (
                  <div className="text-center">
                    <div className="font-semibold">
                      {course.total_assignments}
                    </div>
                    <div className="text-muted-foreground">Assignments</div>
                  </div>
                )}
                {course.certificate_available && (
                  <div className="text-center">
                    <Award className="h-5 w-5 mx-auto text-yellow-500" />
                    <div className="text-muted-foreground">Certificate</div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={onStartLearning}
                  asChild={!onStartLearning}
                >
                  {onStartLearning ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Learning
                    </>
                  ) : (
                    <Link
                      to="/courses/$courseId"
                      params={{ courseId: course.id }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Learning
                    </Link>
                  )}
                </Button>
                <Button variant="outline" onClick={onRateCourse}>
                  <Star className="h-4 w-4 mr-2" />
                  Rate Course
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>
                Here are some things you can do to get the most out of your
                course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Play className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Start with the first lesson</h4>
                    <p className="text-sm text-muted-foreground">
                      Begin your learning journey with the course introduction
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Download className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Download the mobile app</h4>
                    <p className="text-sm text-muted-foreground">
                      Learn on the go with offline video downloads
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Join the community</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with other students and ask questions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Leave a review</h4>
                    <p className="text-sm text-muted-foreground">
                      Help other students by sharing your experience
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Purchase Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Course Price</span>
                  <span className="text-sm font-medium">
                    {formatPrice(purchase.amount, purchase.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Payment Method</span>
                  <Badge variant="outline" className="text-xs">
                    {purchase.payment_provider === 'lemon_squeezy'
                      ? 'Card'
                      : purchase.payment_provider}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Purchase Date</span>
                  <span className="text-sm">
                    {formatDate(purchase.purchased_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Transaction ID</span>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {purchase.payment_id.slice(-8)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Access Details</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Mobile & TV access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Offline downloads</span>
                  </div>
                  {course.certificate_available && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Certificate of completion</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={onDownloadReceipt}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </CardContent>
          </Card>

          {/* Customer Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If you have any issues with your purchase or need assistance,
                we're here to help.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
