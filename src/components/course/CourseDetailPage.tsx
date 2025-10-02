import { useQuery } from '@tanstack/react-query'
import {
  Award,
  BarChart3,
  Book,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Flag,
  Globe,
  Heart,
  Infinity as InfinityIcon,
  Lock,
  MessageCircle,
  Play,
  PlayCircle,
  Share2,
  Shield,
  ShoppingCart,
  Smartphone,
  Star,
  Subtitles,
  Target,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api-client'
import { useCourseAccess } from '@/lib/course-marketplace-context'
import {
  formatCoursePrice,
  formatPriceWithDiscount,
  formatVietnameseDuration,
} from '@/lib/currency'
import { cn } from '@/lib/utils'
import {
  formatVietnameseCount,
  formatVietnameseDate,
  vietnameseTranslations,
} from '@/lib/vietnamese-locale'

import type { Course } from '@/lib/types'

interface CourseDetailPageProps {
  courseId: string
  onEnroll?: (course: Course) => void
  onPreview?: (course: Course) => void
  onPurchase?: (course: Course) => void
  onAddToWishlist?: (course: Course) => void
}

interface CourseReview {
  id: string
  user_name: string
  user_avatar?: string
  rating: number
  comment: string
  created_at: string
  helpful_count: number
}

interface InstructorProfile {
  id: string
  name: string
  title: string
  bio: string
  avatar_url?: string
  rating: number
  total_students: number
  total_courses: number
  years_experience: number
  verified: boolean
  specializations: Array<string>
  social_links?: {
    website?: string
    linkedin?: string
    twitter?: string
  }
}

export function CourseDetailPage({
  courseId,
  onEnroll,
  onPreview,
  onPurchase,
  onAddToWishlist,
}: CourseDetailPageProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Fetch course details
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => api.getCourse(courseId),
  })

  // Fetch course lectures
  const { data: lecturesData, isLoading: lecturesLoading } = useQuery({
    queryKey: ['course', courseId, 'lectures'],
    queryFn: () => api.listLectures(courseId),
    enabled: !!courseId,
  })

  // Mock data for demonstration (would come from API)
  const instructorData: InstructorProfile = {
    id: 'instructor-1',
    name: courseData?.data?.instructor_name || 'Instructor Name',
    title: 'Senior Software Engineer',
    bio: 'Experienced developer with 10+ years in the industry. Passionate about teaching and sharing knowledge.',
    avatar_url: 'https://via.placeholder.com/120',
    rating: 4.8,
    total_students: 25000,
    total_courses: 12,
    years_experience: 10,
    verified: true,
    specializations: ['React', 'Node.js', 'TypeScript', 'System Design'],
    social_links: {
      website: 'https://instructor.dev',
      linkedin: 'https://linkedin.com/in/instructor',
    },
  }

  const reviewsData: Array<CourseReview> = [
    {
      id: '1',
      user_name: 'Nguyễn Văn A',
      user_avatar: 'https://via.placeholder.com/40',
      rating: 5,
      comment:
        'Khóa học rất hữu ích và dễ hiểu. Giảng viên giải thích rất rõ ràng.',
      created_at: '2024-01-15',
      helpful_count: 12,
    },
    {
      id: '2',
      user_name: 'Trần Thị B',
      rating: 4,
      comment: 'Nội dung phong phú, tuy nhiên một số phần hơi nhanh.',
      created_at: '2024-01-10',
      helpful_count: 8,
    },
  ]

  const { getAccessStatus, canAccessCourse } = useCourseAccess()

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Đang tải thông tin khóa học...
          </p>
        </div>
      </div>
    )
  }

  if (!courseData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy khóa học</h2>
          <p className="text-muted-foreground">
            Khóa học bạn đang tìm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    )
  }

  const course = courseData.data
  const lectures = lecturesData?.data?.lectures || []
  const accessStatus = getAccessStatus(course)
  const hasAccess = canAccessCourse(course)

  const priceInfo = formatCoursePrice(course.price, 'VND', course.is_free)
  const discountInfo =
    course.discount_percentage && course.price
      ? formatPriceWithDiscount(course.price, course.discount_percentage, 'VND')
      : null

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.(course)
  }

  const totalDuration = lectures.reduce(
    (sum, lecture) => sum + (lecture.duration_minutes || 0),
    0,
  )
  const freeLectures = lectures.filter((lecture) => lecture.is_free)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>{vietnameseTranslations.courses.courses}</span>
                <span>/</span>
                <span>{course.category}</span>
                <span>/</span>
                <span className="text-foreground">{course.title}</span>
              </div>

              {/* Title and Badges */}
              <div className="flex flex-wrap items-start gap-3 mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex-1 min-w-0">
                  {course.title}
                </h1>
                <div className="flex gap-2">
                  {course.is_featured && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Nổi bật
                    </Badge>
                  )}
                  {course.enrollment_count &&
                    course.enrollment_count > 1000 && (
                      <Badge className="bg-orange-500 text-white">
                        🔥 Bán chạy
                      </Badge>
                    )}
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm mb-6">
                {course.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-warning" />
                      <span className="font-semibold">
                        {course.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      (
                      {formatVietnameseCount(
                        course.rating_count || 0,
                        'đánh giá',
                      )}
                      )
                    </span>
                  </div>
                )}
                {course.enrollment_count && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>
                      {formatVietnameseCount(
                        course.enrollment_count,
                        'học viên',
                      )}
                    </span>
                  </div>
                )}
                {totalDuration > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{formatVietnameseDuration(totalDuration)}</span>
                  </div>
                )}
                {lectures.length > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>
                      {formatVietnameseCount(lectures.length, 'bài giảng')}
                    </span>
                  </div>
                )}
                {course.language && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span>{course.language}</span>
                  </div>
                )}
                {course.difficulty_level && (
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span>
                      {course.difficulty_level === 'beginner'
                        ? vietnameseTranslations.courses.beginner
                        : course.difficulty_level === 'intermediate'
                          ? vietnameseTranslations.courses.intermediate
                          : course.difficulty_level === 'advanced'
                            ? vietnameseTranslations.courses.advanced
                            : course.difficulty_level === 'expert'
                              ? vietnameseTranslations.courses.expert
                              : course.difficulty_level}
                    </span>
                  </div>
                )}
              </div>

              {/* Learning Outcomes Preview */}
              {course.learning_outcomes &&
                course.learning_outcomes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Bạn sẽ học được gì
                    </h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {course.learning_outcomes
                        .slice(0, 6)
                        .map((outcome, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-sm">{outcome}</span>
                          </div>
                        ))}
                      {course.learning_outcomes.length > 6 && (
                        <div className="text-sm text-muted-foreground">
                          +{course.learning_outcomes.length - 6} mục tiêu khác
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Created/Updated Date */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {course.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Tạo {formatVietnameseDate(course.created_at, 'relative')}
                    </span>
                  </div>
                )}
                {course.updated_at &&
                  course.updated_at !== course.created_at && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>
                        Cập nhật{' '}
                        {formatVietnameseDate(course.updated_at, 'relative')}
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="academic-card sticky top-8">
                {/* Preview Video */}
                <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                  {course.preview_video_url ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      poster={course.thumbnail_url}
                      controls
                    >
                      <source src={course.preview_video_url} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  ) : course.thumbnail_url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Button
                          size="lg"
                          variant="secondary"
                          className="bg-white/90 backdrop-blur-sm"
                        >
                          <PlayCircle className="h-6 w-6 mr-2" />
                          Xem giới thiệu
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/60" />
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      {priceInfo.display}
                    </span>
                    {discountInfo && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          {discountInfo.originalPrice}
                        </span>
                        <Badge variant="destructive">
                          -{discountInfo.discountPercentage}%
                        </Badge>
                      </>
                    )}
                  </div>

                  {course.access_type === 'subscription' && !course.is_free && (
                    <p className="text-sm text-muted-foreground">
                      hoặc có trong gói đăng ký hàng tháng
                    </p>
                  )}

                  {discountInfo && (
                    <p className="text-sm text-green-600">
                      Tiết kiệm {discountInfo.discountAmount}!
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  {accessStatus === 'free' && (
                    <Button
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => onEnroll?.(course)}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      {vietnameseTranslations.courses.startLearning}
                    </Button>
                  )}

                  {accessStatus === 'purchased' && (
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {vietnameseTranslations.courses.continueLearning}
                    </Button>
                  )}

                  {accessStatus === 'locked' && (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => onPurchase?.(course)}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {vietnameseTranslations.courses.enrollNow}
                    </Button>
                  )}

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={handleWishlist}
                      className={cn(
                        'transition-colors',
                        isWishlisted && 'border-red-500 text-red-500',
                      )}
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4 mr-1',
                          isWishlisted && 'fill-current',
                        )}
                      />
                      Yêu thích
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-1" />
                      Chia sẻ
                    </Button>
                  </div>

                  {/* Preview Button */}
                  {course.preview_video_url &&
                    accessStatus !== 'purchased' &&
                    freeLectures.length > 0 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onPreview?.(course)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem trước ({freeLectures.length} bài)
                      </Button>
                    )}
                </div>

                {/* Course Features */}
                <div className="space-y-3 text-sm">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Khóa học bao gồm:
                  </h4>

                  <div className="space-y-2">
                    {totalDuration > 0 && (
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatVietnameseDuration(totalDuration)} video
                        </span>
                      </div>
                    )}

                    {course.total_assignments &&
                      course.total_assignments > 0 && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{course.total_assignments} bài tập</span>
                        </div>
                      )}

                    {course.total_quizzes && course.total_quizzes > 0 && (
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-muted-foreground" />
                        <span>{course.total_quizzes} bài kiểm tra</span>
                      </div>
                    )}

                    {course.mobile_access && (
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span>Truy cập trên di động</span>
                      </div>
                    )}

                    {course.certificate_available && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>Chứng chỉ hoàn thành</span>
                      </div>
                    )}

                    {course.lifetime_access && (
                      <div className="flex items-center gap-2">
                        <InfinityIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Truy cập trọn đời</span>
                      </div>
                    )}

                    {course.subtitles && course.subtitles.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Subtitles className="h-4 w-4 text-muted-foreground" />
                        <span>Phụ đề: {course.subtitles.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Money-back Guarantee */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-900">
                      Đảm bảo hoàn tiền 30 ngày
                    </span>
                  </div>
                  <p className="text-xs text-green-700">
                    Không hài lòng? Hoàn tiền 100% trong 30 ngày đầu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="curriculum">Chương trình</TabsTrigger>
            <TabsTrigger value="instructor">Giảng viên</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Learning Outcomes */}
                {course.learning_outcomes &&
                  course.learning_outcomes.length > 0 && (
                    <section>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Mục tiêu học tập
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {course.learning_outcomes.map((outcome, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                            <span className="text-sm">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      Yêu cầu
                    </h3>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-muted-foreground">•</span>
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Course Description */}
                <section>
                  <h3 className="text-xl font-semibold mb-4">Mô tả khóa học</h3>
                  <div className="max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </section>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Chủ đề</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="academic-card p-6">
                  <h4 className="font-semibold mb-4">Thông tin khóa học</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cấp độ:</span>
                      <span className="font-medium">
                        {course.difficulty_level === 'beginner'
                          ? vietnameseTranslations.courses.beginner
                          : course.difficulty_level === 'intermediate'
                            ? vietnameseTranslations.courses.intermediate
                            : course.difficulty_level === 'advanced'
                              ? vietnameseTranslations.courses.advanced
                              : course.difficulty_level === 'expert'
                                ? vietnameseTranslations.courses.expert
                                : course.difficulty_level}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Danh mục:</span>
                      <span className="font-medium">{course.category}</span>
                    </div>

                    {course.language && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngôn ngữ:</span>
                        <span className="font-medium">{course.language}</span>
                      </div>
                    )}

                    {totalDuration > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Thời lượng:
                        </span>
                        <span className="font-medium">
                          {formatVietnameseDuration(totalDuration)}
                        </span>
                      </div>
                    )}

                    {lectures.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Bài giảng:
                        </span>
                        <span className="font-medium">{lectures.length}</span>
                      </div>
                    )}

                    {course.completion_rate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Tỷ lệ hoàn thành:
                        </span>
                        <span className="font-medium">
                          {course.completion_rate}%
                        </span>
                      </div>
                    )}

                    {course.created_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày tạo:</span>
                        <span className="font-medium">
                          {formatVietnameseDate(course.created_at, 'short')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="mt-6">
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Chương trình học</h3>
                <div className="text-sm text-muted-foreground">
                  {lectures.length} bài giảng •{' '}
                  {formatVietnameseDuration(totalDuration)}
                </div>
              </div>

              {lecturesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                    Đang tải chương trình học...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {lectures.map((lecture, index) => (
                    <div
                      key={lecture.id}
                      className="academic-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="shrink-0">
                            {lecture.is_free || hasAccess ? (
                              <PlayCircle className="h-5 w-5 text-primary" />
                            ) : (
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">
                              {index + 1}. {lecture.title}
                            </h4>
                            {lecture.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {lecture.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {lecture.is_free && (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              Miễn phí
                            </Badge>
                          )}

                          {lecture.duration_minutes && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatVietnameseDuration(
                                  lecture.duration_minutes,
                                )}
                              </span>
                            </div>
                          )}

                          {(lecture.is_free || hasAccess) && (
                            <Button size="sm" variant="ghost">
                              <Play className="h-3 w-3 mr-1" />
                              Phát
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {lectures.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Chương trình học đang được cập nhật</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Instructor Tab */}
          <TabsContent value="instructor" className="mt-6">
            <div className="max-w-4xl">
              <div className="academic-card p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={instructorData.avatar_url}
                      alt={instructorData.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {instructorData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">
                        {instructorData.name}
                      </h3>
                      {instructorData.verified && (
                        <Badge className="bg-blue-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Đã xác minh
                        </Badge>
                      )}
                    </div>

                    <p className="text-lg text-muted-foreground mb-4">
                      {instructorData.title}
                    </p>

                    {/* Instructor Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="h-4 w-4 fill-current text-warning" />
                          <span className="font-semibold">
                            {instructorData.rating}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Đánh giá
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="font-semibold mb-1">
                          {formatVietnameseCount(
                            instructorData.total_students,
                            '',
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Học viên
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="font-semibold mb-1">
                          {instructorData.total_courses}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Khóa học
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="font-semibold mb-1">
                          {instructorData.years_experience}+
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Năm kinh nghiệm
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {instructorData.bio}
                    </p>

                    {/* Specializations */}
                    {instructorData.specializations &&
                      instructorData.specializations.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Chuyên môn:</h4>
                          <div className="flex flex-wrap gap-2">
                            {instructorData.specializations.map(
                              (spec, index) => (
                                <Badge key={index} variant="secondary">
                                  {spec}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {/* Social Links */}
                    {instructorData.social_links && (
                      <div className="flex gap-2">
                        {instructorData.social_links.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={instructorData.social_links.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Globe className="h-4 w-4 mr-1" />
                              Website
                            </a>
                          </Button>
                        )}
                        {instructorData.social_links.linkedin && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={instructorData.social_links.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              LinkedIn
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6">
            <div className="max-w-4xl">
              {/* Review Summary */}
              {course.rating && (
                <div className="academic-card p-6 mb-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {course.rating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-5 w-5',
                              i < Math.floor(course.rating!)
                                ? 'fill-current text-warning'
                                : 'text-muted-foreground',
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatVietnameseCount(
                          course.rating_count || 0,
                          'đánh giá',
                        )}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm w-3">{star}</span>
                          <Star className="h-4 w-4 fill-current text-warning" />
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-warning h-2 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {Math.floor(Math.random() * 50)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviewsData.map((review) => (
                  <div key={review.id} className="academic-card p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage
                          src={review.user_avatar}
                          alt={review.user_name}
                        />
                        <AvatarFallback>
                          {review.user_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{review.user_name}</h4>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-4 w-4',
                                  i < review.rating
                                    ? 'fill-current text-warning'
                                    : 'text-muted-foreground',
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatVietnameseDate(
                              review.created_at,
                              'relative',
                            )}
                          </span>
                        </div>

                        <p className="text-muted-foreground mb-3 leading-relaxed">
                          {review.comment}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <Button variant="ghost" size="sm">
                            <span>👍 Hữu ích ({review.helpful_count})</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Trả lời
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Flag className="h-4 w-4 mr-1" />
                            Báo cáo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {reviewsData.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có đánh giá nào cho khóa học này</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
