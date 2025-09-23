import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  Clock,
  Play,
  TrendingUp,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { LearningProgress as LearningProgressType } from '@/lib/dashboard'

interface LearningProgressProps {
  courses: Array<LearningProgressType>
  className?: string
}

export function LearningProgress({
  courses,
  className,
}: LearningProgressProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100'
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100'
      case 'advanced':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const formatLastWatched = (timestamp?: string) => {
    if (!timestamp) return 'Not started'
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (courses.length === 0) {
    return (
      <div className={cn('academic-card p-8 text-center', className)}>
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No courses in progress</h3>
        <p className="text-muted-foreground mb-4">
          Start learning something new today!
        </p>
        <Button asChild>
          <Link to="/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {courses.map((course) => (
        <div key={course.courseId} className="academic-card p-6">
          <div className="flex gap-4">
            {/* Course Thumbnail */}
            <div className="shrink-0">
              {course.courseThumbnail ? (
                <img
                  src={course.courseThumbnail}
                  alt={course.courseTitle}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <Link
                    to="/courses/$courseId"
                    params={{ courseId: course.courseId }}
                    className="block group"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {course.courseTitle}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{course.category}</span>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        getDifficultyColor(course.difficulty),
                      )}
                    >
                      {course.difficulty}
                    </span>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-primary">
                    {course.progress}%
                  </div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <Progress value={course.progress} className="h-2" />
              </div>

              {/* Course Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatTime(course.estimatedTimeToComplete)} remaining
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>
                      Last watched {formatLastWatched(course.lastWatched)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {course.nextLecture && (
                    <Button size="sm" variant="outline" asChild>
                      <Link
                        to="/learn/$courseId/$lectureId"
                        params={{
                          courseId: course.courseId,
                          lectureId: course.nextLecture.id,
                        }}
                        className="gap-2"
                      >
                        <Play className="h-3 w-3" />
                        Continue
                      </Link>
                    </Button>
                  )}

                  <Button size="sm" variant="ghost" asChild>
                    <Link
                      to="/courses/$courseId"
                      params={{ courseId: course.courseId }}
                      className="gap-1"
                    >
                      View Course
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Next Lecture Info */}
              {course.nextLecture && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        Next: {course.nextLecture.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {course.nextLecture.duration} minutes
                      </div>
                    </div>

                    <Button size="sm" asChild>
                      <Link
                        to="/learn/$courseId/$lectureId"
                        params={{
                          courseId: course.courseId,
                          lectureId: course.nextLecture.id,
                        }}
                        className="gap-2"
                      >
                        <Play className="h-3 w-3" />
                        Watch Now
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
