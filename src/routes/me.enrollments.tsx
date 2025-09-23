import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Award, BookOpen, Clock, Grid, List, Play, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CourseCard } from '@/components/CourseCard'
import type { Course } from '@/lib/types'

export const Route = createFileRoute('/me/enrollments')({
  component: MyEnrollments,
})

function MyEnrollments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock enrolled courses with progress data
  const enrolledCourses: Array<
    Course & {
      progress: number
      enrollmentDate: string
      lastAccessed: string
    }
  > = [
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
      progress: 75,
      enrollmentDate: '2024-01-15',
      lastAccessed: '2024-01-20',
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
      progress: 45,
      enrollmentDate: '2024-01-10',
      lastAccessed: '2024-01-18',
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
      progress: 100,
      enrollmentDate: '2023-12-20',
      lastAccessed: '2024-01-15',
    },
    {
      id: '4',
      title: 'Python cho Data Science',
      description: 'Học Python để phân tích dữ liệu và machine learning',
      instructor_name: 'Phạm Văn D',
      duration_minutes: 1500,
      rating: 4.7,
      rating_count: 412,
      enrollment_count: 2890,
      price: 1200000,
      currency: 'VND',
      is_free: false,
      difficulty_level: 'beginner',
      category: 'Data Science',
      language: 'Tiếng Việt',
      total_lectures: 60,
      certificate_available: true,
      mobile_access: true,
      lifetime_access: true,
      tags: ['Python', 'Data Science', 'Machine Learning'],
      is_featured: false,
      access_type: 'paid' as const,
      thumbnail_url: '/api/placeholder/400/225',
      progress: 20,
      enrollmentDate: '2024-01-05',
      lastAccessed: '2024-01-12',
    },
  ]

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
        return (
          matchesSearch &&
          course.progress !== null &&
          course.progress !== undefined &&
          course.progress > 0 &&
          course.progress < 100
        )
      if (filterStatus === 'completed')
        return (
          matchesSearch &&
          course.progress !== null &&
          course.progress !== undefined &&
          course.progress === 100
        )
      if (filterStatus === 'not-started')
        return (
          matchesSearch &&
          course.progress !== null &&
          course.progress !== undefined &&
          course.progress === 0
        )

      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'recent')
        return (
          new Date(b.lastAccessed).getTime() -
          new Date(a.lastAccessed).getTime()
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

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
        <p className="text-muted-foreground">
          Quản lý và theo dõi tiến độ học tập của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số khóa học
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang học</CardTitle>
            <Play className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa bắt đầu</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.notStarted}
            </div>
          </CardContent>
        </Card>
      </div>

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
                          <span>
                            Đăng ký:{' '}
                            {new Date(course.enrollmentDate).toLocaleDateString(
                              'vi-VN',
                            )}
                          </span>
                          <span>
                            Học lần cuối:{' '}
                            {new Date(course.lastAccessed).toLocaleDateString(
                              'vi-VN',
                            )}
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
                        <Button asChild size="sm">
                          <Link
                            to="/courses/$courseId"
                            params={{ courseId: course.id }}
                          >
                            {course.progress === 100
                              ? 'Xem lại'
                              : course.progress > 0
                                ? 'Tiếp tục'
                                : 'Bắt đầu'}
                          </Link>
                        </Button>
                        {course.progress !== null &&
                          course.progress !== undefined &&
                          course.progress === 100 &&
                          course.certificate_available !== null &&
                          course.certificate_available !== undefined &&
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
