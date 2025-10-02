import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  Grid,
  List,
  Play,
  Search,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { CourseCard } from '@/components/CourseCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import {
  CourseMarketplaceProvider,
  useCourseMarketplace,
} from '@/lib/course-marketplace-context'

import type { CourseAccess } from '@/lib/types'

export const Route = createFileRoute('/me/enrollments')({
  component: MyEnrollmentsPage,
})

function MyEnrollmentsContent() {
  const { token } = useAuth()
  const { dispatch } = useCourseMarketplace()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch enrolled courses from API
  const {
    data: enrolledCoursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-enrolled-courses'],
    queryFn: () =>
      token ? api.getMyEnrolledCourses(token) : Promise.reject('No token'),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  // Get enrolled courses from API or fallback to empty array
  const enrolledCourses = enrolledCoursesData?.data?.courses ?? []

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

  // Filter and sort courses
  const filteredCourses = enrolledCourses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())

      if (filterStatus === 'all') return matchesSearch
      if (filterStatus === 'in-progress')
        return matchesSearch && course.progress > 0 && course.progress < 100
      if (filterStatus === 'completed')
        return matchesSearch && course.progress === 100
      if (filterStatus === 'not-started')
        return matchesSearch && course.progress === 0

      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'recent')
        return (
          new Date(b.last_accessed ?? 0).getTime() -
          new Date(a.last_accessed ?? 0).getTime()
        )
      if (sortBy === 'progress') return b.progress - a.progress
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return 0
    })

  const getStatusBadge = (progress: number) => {
    if (progress === 0) return <Badge variant="outline">Chưa bắt đầu</Badge>
    if (progress === 100)
      return (
        <Badge variant="default" className="bg-green-600">
          Hoàn thành
        </Badge>
      )
    return <Badge variant="secondary">Đang học</Badge>
  }

  const stats = {
    total: enrolledCourses.length,
    completed: enrolledCourses.filter((c) => c.progress === 100).length,
    inProgress: enrolledCourses.filter(
      (c) => c.progress > 0 && c.progress < 100,
    ).length,
    notStarted: enrolledCourses.filter((c) => c.progress === 0).length,
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-64 animate-pulse" />
            <div className="h-4 bg-muted rounded w-96 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-destructive">
              Không thể tải khóa học
            </h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error
                ? error.message
                : 'Đã xảy ra lỗi không xác định'}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Academic Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Bảng điều khiển học tập
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Theo dõi tiến độ và quản lý hành trình học tập của bạn
        </p>
      </div>

      {/* Enhanced Academic Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số khóa học
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Khóa học đã đăng ký
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang học
            </CardTitle>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Play className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 tracking-tight">
              {stats.inProgress}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tiến độ đang diễn ra
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hoàn thành
            </CardTitle>
            <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <Award className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 tracking-tight">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Chứng chỉ có thể nhận
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chưa bắt đầu
            </CardTitle>
            <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 tracking-tight">
              {stats.notStarted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Chờ bạn khám phá
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Study Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Tổng quan tiến độ học tập</span>
          </CardTitle>
          <CardDescription>
            Theo dõi sự tiến bộ của bạn qua thời gian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall completion rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Tỷ lệ hoàn thành tổng thể
                </span>
                <span className="text-sm text-muted-foreground">
                  {stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
                }
                className="h-2"
              />
            </div>

            {/* Quick access to continue learning */}
            {stats.inProgress > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Tiếp tục học</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCourses
                    .filter(
                      (course) => course.progress > 0 && course.progress < 100,
                    )
                    .slice(0, 2)
                    .map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="w-12 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {course.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress
                              value={course.progress}
                              className="h-1 flex-1"
                            />
                            <span className="text-xs text-muted-foreground">
                              {course.progress}%
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            const lectureId = course.next_lecture_id ?? 'first'
                            window.location.href = `/learn/${course.id}/${lectureId}`
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Controls */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Khóa học đã đăng ký</CardTitle>
              <CardDescription>
                {filteredCourses.length} khóa học
              </CardDescription>
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

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="not-started">Chưa bắt đầu</SelectItem>
                <SelectItem value="in-progress">Đang học</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mới nhất</SelectItem>
                <SelectItem value="progress">Tiến độ</SelectItem>
                <SelectItem value="title">Tên khóa học</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Course List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              variant="default"
              showInstructor={true}
              showProgress={true}
              progress={course.progress}
              showAccessStatus={false}
              showPricing={false}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-16 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Giảng viên:{' '}
                          {course.instructor_name ?? 'Chưa có thông tin'}
                        </p>

                        {/* Progress */}
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">
                                Tiến độ
                              </span>
                              <span className="text-sm font-medium">
                                {course.progress}%
                              </span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          {getStatusBadge(course.progress)}
                        </div>

                        {/* Meta */}
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Đăng ký:{' '}
                              {new Date(
                                course.enrollment?.enrolled_at ?? 0,
                              ).toLocaleDateString('vi-VN')}
                            </span>
                          </span>
                          <span>
                            Học lần cuối:{' '}
                            {new Date(
                              course.last_accessed ?? 0,
                            ).toLocaleDateString('vi-VN')}
                          </span>
                          <span>{course.total_lectures} bài học</span>
                          <span>
                            {Math.floor((course.duration_minutes ?? 0) / 60)}h{' '}
                            {(course.duration_minutes ?? 0) % 60}m
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="min-w-[100px]"
                          onClick={() => {
                            const url = course.next_lecture_id
                              ? `/learn/${course.id}/${course.next_lecture_id}`
                              : `/courses/${course.id}`
                            window.location.href = url
                          }}
                        >
                          {course.progress === 100
                            ? 'Xem lại'
                            : course.progress > 0
                              ? 'Tiếp tục'
                              : 'Bắt đầu'}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                        {course.progress === 100 &&
                          course.certificate_available && (
                            <Button variant="outline" size="sm">
                              <Award className="h-4 w-4 mr-1" />
                              Chứng chỉ
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Không tìm thấy khóa học
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== 'all'
                ? 'Thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc'
                : 'Bạn chưa đăng ký khóa học nào'}
            </p>
            <div className="flex justify-center gap-4">
              {(searchQuery || filterStatus !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterStatus('all')
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}
              <Button asChild>
                <Link to="/courses">Khám phá khóa học</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Wrapper component that provides the Course Marketplace context
function MyEnrollmentsPage() {
  return (
    <CourseMarketplaceProvider>
      <MyEnrollmentsContent />
    </CourseMarketplaceProvider>
  )
}
