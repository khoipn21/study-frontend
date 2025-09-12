import { Link } from '@tanstack/react-router'
import { 
  Clock, 
  Star, 
  Users, 
  BookOpen, 
  Award,
  Play,
  Heart,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Course } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: Course
  variant?: 'default' | 'compact' | 'featured'
  showInstructor?: boolean
  showProgress?: boolean
  progress?: number
}

export function CourseCard({ 
  course, 
  variant = 'default',
  showInstructor = true,
  showProgress = false,
  progress = 0
}: CourseCardProps) {
  const getLevelBadgeStyle = (level: string) => {
    switch (level?.toLowerCase()) {
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

  const formatPrice = (price: number, currency: string = 'USD') => {
    if (price === 0) return 'Free'
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency 
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const isCompact = variant === 'compact'
  const isFeatured = variant === 'featured'

  return (
    <div className={cn(
      "academic-card group overflow-hidden transition-all duration-300",
      isFeatured && "border-primary/30 shadow-lg",
      "hover:shadow-xl hover:-translate-y-1"
    )}>
      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnail_url ? (
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
          <Button size="sm" variant="secondary" className="bg-background/90 backdrop-blur-sm">
            <Play className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.level && (
            <div className={cn(
              "px-2 py-1 text-xs font-medium rounded-full border",
              getLevelBadgeStyle(course.level)
            )}>
              {course.level}
            </div>
          )}
          {isFeatured && (
            <div className="px-2 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground">
              Featured
            </div>
          )}
        </div>

        {/* Bookmark/Favorite */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
            <Heart className="h-4 w-4" />
          </Button>
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
      <div className={cn("p-4", isCompact && "p-3")}>
        {/* Course Title */}
        <Link 
          to="/courses/$courseId"
          params={{ courseId: course.id }}
          className="block"
        >
          <h3 className={cn(
            "font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors",
            isCompact ? "text-base" : "text-lg",
            isFeatured && "text-xl"
          )}>
            {course.title}
          </h3>
        </Link>

        {/* Instructor */}
        {showInstructor && course.instructor_name && !isCompact && (
          <p className="text-sm text-muted-foreground mt-1">
            by {course.instructor_name}
          </p>
        )}

        {/* Description */}
        {course.description && !isCompact && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Course Metadata */}
        <div className={cn(
          "flex items-center gap-4 text-xs text-muted-foreground",
          isCompact ? "mt-2" : "mt-3"
        )}>
          {course.duration_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(course.duration_minutes)}</span>
            </div>
          )}
          {course.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-warning" />
              <span>{course.rating}</span>
              {course.rating_count && (
                <span className="text-muted-foreground">({course.rating_count})</span>
              )}
            </div>
          )}
          {course.enrollment_count && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{course.enrollment_count.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && !isCompact && (
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
        <div className={cn(
          "flex items-center justify-between",
          isCompact ? "mt-3" : "mt-4"
        )}>
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-bold text-primary",
              isFeatured ? "text-xl" : "text-lg"
            )}>
              {formatPrice(course.price || 0, course.currency)}
            </span>
            {course.price && course.price > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                ${(course.price * 1.5).toFixed(0)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isCompact && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.preventDefault()}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            <Button size={isCompact ? "sm" : "default"} asChild>
              <Link
                to="/courses/$courseId"
                params={{ courseId: course.id }}
              >
                {showProgress && progress > 0 ? 'Continue' : 'Enroll Now'}
              </Link>
            </Button>
          </div>
        </div>

        {/* Additional Progress Info */}
        {showProgress && progress > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progress}% Complete</span>
              <span>
                {progress === 100 ? (
                  <div className="flex items-center gap-1 text-success">
                    <Award className="h-3 w-3" />
                    Completed
                  </div>
                ) : (
                  'In Progress'
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
