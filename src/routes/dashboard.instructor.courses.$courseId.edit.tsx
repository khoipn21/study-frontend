import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { CourseCreationWizard } from '@/components/course/CourseCreationWizard'
import { instructorDashboardService } from '@/lib/instructor-dashboard'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { CourseCreationData } from '@/lib/course-management-types'

export const Route = createFileRoute(
  '/dashboard/instructor/courses/$courseId/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  const { token } = useAuth()

  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['instructor', 'course', courseId],
    queryFn: () =>
      instructorDashboardService.getCourseById(courseId, token ?? undefined),
    enabled: !!token && !!courseId,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
                <h3 className="text-lg font-semibold">Error Loading Course</h3>
                <p className="text-muted-foreground mb-4">
                  Failed to load course data. Please try again.
                </p>
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
                <h3 className="text-lg font-semibold">Course Not Found</h3>
                <p className="text-muted-foreground">
                  The course you're trying to edit doesn't exist or you don't
                  have permission to edit it.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Transform InstructorCourse to CourseCreationData
  const editingCourse: Partial<CourseCreationData> & { id?: string } = {
    id: course.id, // Include the course ID for edit mode detection
    title: course.title,
    description: course.description,
    category: course.category,
    difficulty_level: course.level,
    price: typeof course.price === 'number' ? course.price : 0,
    currency: course.currency as 'VND' | 'USD',
    thumbnail_url: course.thumbnail,
    learning_outcomes: course.learningObjectives,
    requirements: course.prerequisites,
    language: course.language,
    tags: course.tags,
    estimated_duration_hours:
      typeof course.estimatedDuration === 'number'
        ? Math.floor(course.estimatedDuration / 60)
        : 0, // Convert minutes to hours
    status: course.status === 'archived' ? 'draft' : course.status,
    auto_approve_enrollment: true, // Default values for missing fields
    allow_previews: course.isPublic,
    has_certificate: course.certificateEnabled,
    mobile_access: true,
    lectures:
      course.lectures?.map((lecture) => ({
        id: lecture.id,
        title: lecture.title,
        description: lecture.description,
        type: 'video' as const,
        order_number: lecture.order,
        duration_minutes:
          typeof lecture.duration === 'number'
            ? Math.floor(lecture.duration / 60)
            : 0,
        is_free: lecture.isFree,
        video_id: lecture.videoUrl,
      })) || [],
    resources: [],
    videos: [],
  }

  return <CourseCreationWizard editingCourse={editingCourse} />
}
