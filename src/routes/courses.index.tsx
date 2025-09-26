import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Filter, Grid, List, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CourseCard } from '@/components/CourseCard'
import { CourseFilters } from '@/components/CourseFilters'
import {
  CourseMarketplaceProvider,
  useCourseMarketplace,
} from '@/lib/course-marketplace-context'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import type { Course, CourseAccess } from '@/lib/types'

export const Route = createFileRoute('/courses/')({
  component: CoursesPage,
})

// Inner component that uses the context
function CoursesPageContent() {
  const { token } = useAuth()
  const { dispatch } = useCourseMarketplace()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch courses from API
  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses', searchQuery],
    queryFn: () => api.listCourses({ q: searchQuery || undefined }),
  })

  // Fetch user's enrolled courses to determine access status
  const { data: enrolledCoursesData } = useQuery({
    queryKey: ['my-enrolled-courses'],
    queryFn: async () => {
      if (!token) {
        return { success: true, message: 'No token', data: { courses: [] } }
      }
      return api.getMyEnrolledCourses(token)
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update course access status in context when enrollment data changes
  useEffect(() => {
    if (enrolledCoursesData?.data?.courses) {
      const courseAccess: Array<CourseAccess> =
        enrolledCoursesData.data.courses.map((course: any) => ({
          user_id: course.enrollment?.user_id || '',
          course_id: course.id,
          access_level: 'full' as const,
          purchase_id: course.enrollment?.id || '',
          granted_at:
            course.enrollment?.enrolled_at || new Date().toISOString(),
        }))

      dispatch({
        type: 'SET_USER_ACCESS',
        payload: courseAccess,
      })
    }
  }, [enrolledCoursesData, dispatch])

  // Transform API data to match frontend expectations
  const apiCourses = coursesData?.data?.courses ?? []
  const courses = apiCourses.map(
    (course: {
      id: string
      title: string
      description?: string
      instructor_name?: string
      level?: string
      price?: number
      currency?: string
      thumbnail_url?: string
      tags?: Array<string>
      rating?: number
      rating_count?: number
      enrollment_count?: number
      duration_minutes?: number
    }) => ({
      ...course,
      difficulty_level:
        (course.level as 'beginner' | 'intermediate' | 'advanced' | 'expert') ??
        'beginner',
      is_free: course.price === 0,
      access_type: course.price === 0 ? ('free' as const) : ('paid' as const),
      // Ensure we have required fields
      instructor_name: course.instructor_name ?? 'Unknown Instructor',
      currency: 'VND',
      price:
        course.currency === 'USD' &&
        course.price !== undefined &&
        course.price !== null
          ? course.price * 24000
          : (course.price ?? 0), // Convert USD to VND
      thumbnail_url: course.thumbnail_url ?? '/api/placeholder/400/225',
      tags: course.tags ?? [],
      rating: course.rating ?? 0,
      rating_count: course.rating_count ?? 0,
      enrollment_count: course.enrollment_count ?? 0,
      duration_minutes: course.duration_minutes ?? 0,
      total_lectures: Math.floor((course.duration_minutes ?? 0) / 15), // Estimate lectures
      certificate_available: true,
      mobile_access: true,
      lifetime_access: (course.price ?? 0) > 0,
      language: 'Tiếng Việt',
    }),
  )

  // Legacy mock data for fallback
  const mockCourses: Array<Course> = [
    {
      id: '1',
      title: 'Lập trình React từ cơ bản đến nâng cao',
      description:
        'Học React một cách toàn diện từ những khái niệm cơ bản đến các kỹ thuật nâng cao',
      instructor_name: 'Nguyễn Văn A',
      duration_minutes: 1200,
      rating: 4.8,
      rating_count: 256,
      enrollment_count: 1540,
      price: 899000,
      currency: 'VND',
      is_free: false,
      difficulty_level: 'intermediate',
      category: 'Programming',
      language: 'Tiếng Việt',
      total_lectures: 45,
      certificate_available: true,
      mobile_access: true,
      lifetime_access: true,
      tags: ['React', 'JavaScript', 'Frontend'],
      is_featured: true,
      access_type: 'paid' as const,
      thumbnail_url: '/api/placeholder/400/225',
      preview_video_url: '/api/placeholder/video',
    },
    {
      id: '2',
      title: 'Node.js và Express.js cho Backend',
      description: 'Xây dựng API và ứng dụng backend với Node.js và Express.js',
      instructor_name: 'Trần Thị B',
      duration_minutes: 900,
      rating: 4.6,
      rating_count: 189,
      enrollment_count: 987,
      price: 799000,
      currency: 'VND',
      is_free: false,
      difficulty_level: 'intermediate',
      category: 'Programming',
      language: 'Tiếng Việt',
      total_lectures: 38,
      certificate_available: true,
      mobile_access: true,
      lifetime_access: true,
      tags: ['Node.js', 'Express', 'Backend'],
      is_featured: false,
      access_type: 'paid' as const,
      thumbnail_url: '/api/placeholder/400/225',
    },
    {
      id: '3',
      title: 'TypeScript cho JavaScript Developer',
      description: 'Nâng cao kỹ năng JavaScript với TypeScript',
      instructor_name: 'Lê Văn C',
      duration_minutes: 600,
      rating: 4.9,
      rating_count: 324,
      enrollment_count: 2156,
      price: 0,
      currency: 'VND',
      is_free: true,
      difficulty_level: 'beginner',
      category: 'Programming',
      language: 'Tiếng Việt',
      total_lectures: 25,
      certificate_available: true,
      mobile_access: true,
      lifetime_access: true,
      tags: ['TypeScript', 'JavaScript'],
      is_featured: false,
      access_type: 'free' as const,
      thumbnail_url: '/api/placeholder/400/225',
    },
  ]

  // Use API data if available, otherwise fall back to mock data
  const allCourses = courses.length > 0 ? courses : mockCourses

  const filteredCourses = allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Khóa học</h1>
            <p className="text-muted-foreground">
              Khám phá {allCourses.length} khóa học chất lượng cao
              {isLoading && ' (Đang tải...)'}
              {error && ' (Lỗi kết nối API)'}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border rounded-lg p-4">
            <CourseFilters
              filters={{
                search: '',
                category: '',
                level: '',
                minPrice: 0,
                maxPrice: 10000000,
                minRating: 0,
                duration: '',
                status: '',
                instructor: '',
                isFree: false,
                hasVideos: false,
                hasCertificate: false,
                sortBy: 'newest',
                sortOrder: 'desc',
                language: '',
                accessType: '',
                isPopular: false,
                isFeatured: false,
                hasSubtitles: false,
                instructorVerified: false,
                completionRate: 0,
                currency: 'VND',
              }}
              onFiltersChange={() => {}}
              onReset={() => {}}
            />
          </div>
        )}
      </div>

      {/* Course Grid */}
      <div
        className={`
        ${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
        }
      `}
      >
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            variant={viewMode === 'list' ? 'compact' : 'default'}
            showInstructor={true}
            showProgress={false}
            showAccessStatus={true}
            showPricing={true}
            onPreview={(course) => console.log('Preview:', course.title)}
            onPurchase={(course) => console.log('Purchase:', course.title)}
            onAddToWishlist={(course) =>
              console.log('Add to wishlist:', course.title)
            }
            isInWishlist={false}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            Không tìm thấy khóa học nào phù hợp với tìm kiếm của bạn
          </div>
          <Button variant="outline" onClick={() => setSearchQuery('')}>
            Xóa bộ lọc
          </Button>
        </div>
      )}

      {/* Load More */}
      {filteredCourses.length > 0 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem thêm khóa học
          </Button>
        </div>
      )}
    </div>
  )
}

// Main component with provider wrapper
function CoursesPage() {
  return (
    <CourseMarketplaceProvider>
      <CoursesPageContent />
    </CourseMarketplaceProvider>
  )
}
