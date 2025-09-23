import { Link } from '@tanstack/react-router'
import {
  Award,
  BookOpen,
  Check,
  Clock,
  Crown,
  Eye,
  Globe,
  Heart,
  Lock,
  Medal,
  Play,
  Share2,
  ShoppingCart,
  Star,
  Subtitles,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useCourseAccess } from '@/lib/course-marketplace-context'
import { formatCoursePrice, formatVietnameseDuration } from '@/lib/currency'
import { vietnameseTranslations } from '@/lib/vietnamese-locale'
import type { Course } from '@/lib/types'

interface CourseCardProps {
  course: Course
  variant?: 'default' | 'compact' | 'featured'
  showInstructor?: boolean
  showProgress?: boolean
  progress?: number
  showAccessStatus?: boolean
  showPricing?: boolean
  onPreview?: (course: Course) => void
  onPurchase?: (course: Course) => void
  onAddToWishlist?: (course: Course) => void
  isInWishlist?: boolean
}

export function CourseCard({
  course,
  variant = 'default',
  showInstructor = true,
  showProgress = false,
  progress = 0,
  showAccessStatus = true,
  showPricing = true,
  onPreview,
  onPurchase,
  onAddToWishlist,
  isInWishlist = false,
}: CourseCardProps) {
  const { getAccessStatus } = useCourseAccess()
  const accessStatus = getAccessStatus(course)
  const getLevelBadgeStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'course-level-beginner'
      case 'intermediate':
        return 'course-level-intermediate'
      case 'advanced':
        return 'course-level-advanced'
      case 'expert':
        return 'course-level-expert'
      default:
        return 'course-level-beginner'
    }
  }

  const formatPrice = (
    price: number,
    currency: 'VND' | 'USD' | 'EUR' = 'VND',
  ) => {
    if (price === 0 || course.is_free === true)
      return vietnameseTranslations.payment.free
    const priceData = formatCoursePrice(price, currency, course.is_free)
    return priceData.display
  }

  const getDiscountedPrice = () => {
    if ((course.price ?? 0) === 0 || course.is_free === true) return 0
    if ((course.discount_percentage ?? 0) === 0) return course.price ?? 0
    return (course.price ?? 0) * (1 - (course.discount_percentage ?? 0) / 100)
  }

  const getAccessIcon = () => {
    switch (accessStatus) {
      case 'free':
        return <Check className="h-4 w-4 text-green-500" />
      case 'purchased':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'preview':
        return <Eye className="h-4 w-4 text-blue-500" />
      case 'locked':
        return <Lock className="h-4 w-4 text-muted-foreground" />
      default:
        return <Lock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getButtonText = () => {
    if (showProgress && progress > 0)
      return vietnameseTranslations.courses.continueLearning
    if (accessStatus === 'free')
      return vietnameseTranslations.courses.startLearning
    if (accessStatus === 'purchased')
      return vietnameseTranslations.courses.continueLearning
    if (accessStatus === 'preview')
      return vietnameseTranslations.courses.preview
    return vietnameseTranslations.courses.enrollNow
  }

  const getButtonAction = () => {
    if (accessStatus === 'free' || accessStatus === 'purchased') {
      return () => {} // Navigate to course
    }
    if (accessStatus === 'preview' && onPreview) {
      return () => onPreview(course)
    }
    if (accessStatus === 'locked' && onPurchase) {
      return () => onPurchase(course)
    }
    return () => {}
  }

  const formatDuration = (minutes: number) => {
    return formatVietnameseDuration(minutes)
  }

  const isCompact = variant === 'compact'
  const isFeatured = variant === 'featured'

  return (
    <div
      className={cn(
        'academic-card group overflow-hidden transition-all duration-300',
        isFeatured && 'border-primary/30 shadow-lg',
        'hover:shadow-xl hover:-translate-y-1',
      )}
    >
      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnail_url != null && course.thumbnail_url !== '' ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/60" />
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            className="bg-background/90 backdrop-blur-sm"
          >
            <Play className="h-4 w-4 mr-2" />
            {vietnameseTranslations.courses.preview}
          </Button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[70%]">
          {/* Access Status Badge */}
          {showAccessStatus && (
            <Badge
              variant={
                accessStatus === 'free'
                  ? 'default'
                  : accessStatus === 'purchased'
                    ? 'secondary'
                    : 'outline'
              }
              className={cn(
                'flex items-center gap-1 text-xs',
                accessStatus === 'free' && 'bg-green-500/90 text-white',
                accessStatus === 'purchased' && 'bg-yellow-500/90 text-white',
                accessStatus === 'preview' && 'bg-blue-500/90 text-white',
                accessStatus === 'locked' && 'bg-gray-500/90 text-white',
              )}
            >
              {getAccessIcon()}
              {accessStatus === 'free'
                ? vietnameseTranslations.payment.free
                : accessStatus === 'purchased'
                  ? 'Đã sở hữu'
                  : accessStatus === 'preview'
                    ? 'Xem trước'
                    : 'Trả phí'}
            </Badge>
          )}

          {/* Level Badge */}
          {course.difficulty_level && (
            <Badge
              variant="outline"
              className={cn(
                'text-xs bg-white/90 backdrop-blur-sm',
                getLevelBadgeStyle(course.difficulty_level),
              )}
            >
              {course.difficulty_level === 'beginner'
                ? vietnameseTranslations.courses.beginner
                : course.difficulty_level === 'intermediate'
                  ? vietnameseTranslations.courses.intermediate
                  : course.difficulty_level === 'advanced'
                    ? vietnameseTranslations.courses.advanced
                    : vietnameseTranslations.courses.expert}
            </Badge>
          )}

          {/* Featured Badge */}
          {(course.is_featured === true || isFeatured) && (
            <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Nổi bật
            </Badge>
          )}

          {/* Bestseller/Hot Badge */}
          {(course.enrollment_count ?? 0) > 1000 && (
            <Badge className="text-xs bg-orange-500 text-white">
              🔥 Bán chạy
            </Badge>
          )}
        </div>

        {/* Bookmark/Favorite */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={(e) => {
              e.preventDefault()
              onAddToWishlist?.(course)
            }}
          >
            <Heart
              className={cn(
                'h-4 w-4',
                isInWishlist && 'fill-red-500 text-red-500',
              )}
            />
          </Button>

          {/* Quick Action Buttons */}
          {!isCompact && (
            <>
              {course.preview_video_url != null &&
                course.preview_video_url !== '' &&
                accessStatus !== 'purchased' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={(e) => {
                      e.preventDefault()
                      onPreview?.(course)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}

              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={(e) => e.preventDefault()}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Progress Bar (if showing progress) */}
        {showProgress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div
              className="h-full bg-success transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className={cn('p-4', isCompact && 'p-3')}>
        {/* Course Title */}
        <Link
          to="/courses/$courseId"
          params={{ courseId: course.id }}
          className="block"
        >
          <h3
            className={cn(
              'font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors',
              isCompact ? 'text-base' : 'text-lg',
              isFeatured && 'text-xl',
            )}
          >
            {course.title}
          </h3>
        </Link>

        {/* Instructor */}
        {showInstructor &&
          course.instructor_name != null &&
          course.instructor_name !== '' &&
          !isCompact && (
            <p className="text-sm text-muted-foreground mt-1">
              {vietnameseTranslations.courses.instructor}:{' '}
              {course.instructor_name}
            </p>
          )}

        {/* Description */}
        {course.description != null &&
          course.description !== '' &&
          !isCompact && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
              {course.description}
            </p>
          )}

        {/* Course Metadata */}
        <div
          className={cn(
            'flex items-center gap-4 text-xs text-muted-foreground',
            isCompact ? 'mt-2' : 'mt-3',
          )}
        >
          {(course.duration_minutes ?? 0) > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(course.duration_minutes ?? 0)}</span>
            </div>
          )}
          {(course.rating ?? 0) > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-warning" />
              <span>{(course.rating ?? 0).toFixed(1)}</span>
              {(course.rating_count ?? 0) > 0 && (
                <span className="text-muted-foreground">
                  ({(course.rating_count ?? 0).toLocaleString()})
                </span>
              )}
            </div>
          )}
          {(course.enrollment_count ?? 0) > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{(course.enrollment_count ?? 0).toLocaleString()}</span>
            </div>
          )}
          {(course.total_lectures ?? 0) > 0 && !isCompact && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>
                {course.total_lectures}{' '}
                {vietnameseTranslations.courses.lectures}
              </span>
            </div>
          )}
        </div>

        {/* Additional Metadata Row */}
        {!isCompact && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            {course.language != null && course.language !== '' && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>{course.language}</span>
              </div>
            )}
            {course.subtitles != null && course.subtitles.length > 0 && (
              <div className="flex items-center gap-1">
                <Subtitles className="h-3 w-3" />
                <span>CC</span>
              </div>
            )}
            {course.certificate_available === true && (
              <div className="flex items-center gap-1">
                <Medal className="h-3 w-3" />
                <span>{vietnameseTranslations.courses.certificate}</span>
              </div>
            )}
            {course.mobile_access === true && (
              <div className="flex items-center gap-1 text-green-600">
                <span>📱 Di động</span>
              </div>
            )}
            {course.lifetime_access === true && accessStatus !== 'free' && (
              <div className="flex items-center gap-1 text-blue-600">
                <span>♾️ Trọn đời</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {course.tags != null && course.tags.length > 0 && !isCompact && (
          <div className="flex flex-wrap gap-1 mt-3">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">
                +{course.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div
          className={cn(
            'flex items-center justify-between',
            isCompact ? 'mt-3' : 'mt-4',
          )}
        >
          {/* Pricing Section */}
          {showPricing && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'font-bold',
                    isFeatured ? 'text-xl' : 'text-lg',
                    course.is_free === true ? 'text-green-600' : 'text-primary',
                  )}
                >
                  {course.is_free === true
                    ? vietnameseTranslations.payment.free
                    : formatPrice(
                        getDiscountedPrice(),
                        (course.currency ?? 'VND') as 'VND' | 'USD' | 'EUR',
                      )}
                </span>
                {(course.discount_percentage ?? 0) > 0 &&
                  (course.price ?? 0) > 0 &&
                  course.is_free !== true && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(
                        course.price ?? 0,
                        (course.currency ?? 'VND') as 'VND' | 'USD' | 'EUR',
                      )}
                    </span>
                  )}
                {(course.discount_percentage ?? 0) > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    -{course.discount_percentage ?? 0}%
                  </Badge>
                )}
              </div>
              {course.access_type === 'subscription' &&
                course.is_free !== true && (
                  <span className="text-xs text-muted-foreground">
                    hoặc có trong gói đăng ký
                  </span>
                )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Secondary Action (Share/Preview) */}
            {!isCompact &&
              accessStatus === 'locked' &&
              course.preview_video_url != null &&
              course.preview_video_url !== '' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    onPreview?.(course)
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {vietnameseTranslations.courses.preview}
                </Button>
              )}

            {/* Primary Action Button */}
            <Button
              size={isCompact ? 'sm' : 'default'}
              variant={accessStatus === 'locked' ? 'default' : 'secondary'}
              className={cn(
                accessStatus === 'locked' && 'bg-primary hover:bg-primary/90',
                accessStatus === 'free' &&
                  'bg-green-600 hover:bg-green-700 text-white',
                accessStatus === 'purchased' &&
                  'bg-blue-600 hover:bg-blue-700 text-white',
              )}
              onClick={(e) => {
                e.preventDefault()
                const action = getButtonAction()
                if (accessStatus === 'free' || accessStatus === 'purchased') {
                  // Navigate to course
                  window.location.href = `/courses/${course.id}`
                } else {
                  action()
                }
              }}
            >
              {accessStatus === 'locked' && (
                <ShoppingCart className="h-4 w-4 mr-1" />
              )}
              {accessStatus === 'free' && <Play className="h-4 w-4 mr-1" />}
              {accessStatus === 'purchased' && (
                <Check className="h-4 w-4 mr-1" />
              )}
              {accessStatus === 'preview' && <Eye className="h-4 w-4 mr-1" />}
              {getButtonText()}
            </Button>
          </div>
        </div>

        {/* Additional Progress Info */}
        {showProgress && progress > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progress}% hoàn thành</span>
              <span>
                {progress === 100 ? (
                  <div className="flex items-center gap-1 text-success">
                    <Award className="h-3 w-3" />
                    {vietnameseTranslations.learning.completed}
                  </div>
                ) : (
                  vietnameseTranslations.learning.inProgress
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
