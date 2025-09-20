import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Bookmark,
  Brain,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Coffee,
  Crown,
  Download,
  Eye,
  FileText,
  Filter,
  Fire,
  Globe,
  Grid3X3,
  HelpCircle,
  Lightbulb,
  List,
  Medal,
  MessageSquare,
  MoreHorizontal,
  Mountain,
  Pause,
  Play,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Star,
  Target,
  ThumbsUp,
  Timer,
  TrendingUp,
  Users,
  Video,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import {
  formatVietnameseCount,
  formatVietnameseDate,
  formatVietnameseDuration,
  vietnameseTranslations,
} from '@/lib/vietnamese-locale'
import { formatVND } from '@/lib/currency'
import { cn } from '@/lib/utils'
import type { Course, Enrollment, User } from '@/lib/types'

interface DashboardProps {
  user: User
}

interface LearningStats {
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  totalWatchTime: number
  averageRating: number
  certificatesEarned: number
  currentStreak: number
  longestStreak: number
  weeklyGoal: number
  weeklyProgress: number
  monthlyMinutes: number
  yearlyGoals: {
    courses: number
    certificates: number
    skillsCompleted: number
  }
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  type: 'course' | 'time' | 'streak' | 'skill' | 'social'
  unlockedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface RecentActivity {
  id: string
  type:
    | 'course_started'
    | 'lesson_completed'
    | 'course_completed'
    | 'certificate_earned'
    | 'goal_achieved'
  title: string
  description: string
  courseId?: string
  timestamp: string
  metadata?: any
}

interface LearningPath {
  id: string
  title: string
  description: string
  courses: Array<Course>
  progress: number
  estimatedDuration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

const MOCK_LEARNING_STATS: LearningStats = {
  totalCourses: 12,
  completedCourses: 8,
  inProgressCourses: 4,
  totalWatchTime: 15420, // minutes
  averageRating: 4.6,
  certificatesEarned: 6,
  currentStreak: 7,
  longestStreak: 21,
  weeklyGoal: 300, // minutes
  weeklyProgress: 185,
  monthlyMinutes: 890,
  yearlyGoals: {
    courses: 25,
    certificates: 15,
    skillsCompleted: 50,
  },
}

const MOCK_ACHIEVEMENTS: Array<Achievement> = [
  {
    id: '1',
    title: 'Người học tích cực',
    description: 'Hoàn thành 5 khóa học đầu tiên',
    icon: '🎓',
    type: 'course',
    unlockedAt: '2024-01-15',
    rarity: 'rare',
  },
  {
    id: '2',
    title: 'Kỷ lục học tập',
    description: 'Học liên tục 7 ngày',
    icon: '🔥',
    type: 'streak',
    unlockedAt: '2024-01-20',
    rarity: 'epic',
  },
  {
    id: '3',
    title: 'Thạc sĩ JavaScript',
    description: 'Hoàn thành tất cả khóa học JavaScript',
    icon: '⚡',
    type: 'skill',
    unlockedAt: '2024-01-25',
    rarity: 'legendary',
  },
]

const MOCK_RECENT_ACTIVITY: Array<RecentActivity> = [
  {
    id: '1',
    type: 'lesson_completed',
    title: 'Hoàn thành bài học',
    description: 'React Hooks Advanced Patterns',
    courseId: 'react-advanced',
    timestamp: '2024-01-26T10:30:00Z',
  },
  {
    id: '2',
    type: 'course_completed',
    title: 'Hoàn thành khóa học',
    description: 'Complete Node.js Developer',
    courseId: 'nodejs-complete',
    timestamp: '2024-01-25T15:45:00Z',
  },
]

export function EnhancedUserDashboard({ user }: DashboardProps) {
  const { token } = useAuth()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Fetch user enrollments
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments', user.id],
    queryFn: () => api.listEnrollments(token || ''),
    enabled: !!token,
  })

  // Fetch user analytics
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics', user.id],
    queryFn: () => api.getUserAnalytics(token || ''),
    enabled: !!token,
  })

  const enrollments = enrollmentsData?.data?.enrollments || []
  const stats = MOCK_LEARNING_STATS // In production, this would come from API

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      !searchQuery ||
      enrollment.course?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'completed' &&
        enrollment.progress_percentage === 100) ||
      (filterStatus === 'in_progress' &&
        enrollment.progress_percentage > 0 &&
        enrollment.progress_percentage < 100) ||
      (filterStatus === 'not_started' && enrollment.progress_percentage === 0)

    return matchesSearch && matchesFilter
  })

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Xin chào, {user.username}! 👋
            </h2>
            <p className="text-muted-foreground">
              Hôm nay là một ngày tuyệt vời để tiếp tục hành trình học tập của
              bạn.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.currentStreak}
            </div>
            <p className="text-sm text-muted-foreground">Ngày liên tiếp</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-sm text-muted-foreground">Khóa học</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.completedCourses}</div>
            <p className="text-sm text-muted-foreground">Hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {Math.round(stats.totalWatchTime / 60)}h
            </div>
            <p className="text-sm text-muted-foreground">Đã học</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
            <p className="text-sm text-muted-foreground">Chứng chỉ</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Goal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Mục tiêu tuần này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    Thời gian học: {stats.weeklyProgress} / {stats.weeklyGoal}{' '}
                    phút
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round(
                      (stats.weeklyProgress / stats.weeklyGoal) * 100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={(stats.weeklyProgress / stats.weeklyGoal) * 100}
                />
                <p className="text-xs text-muted-foreground">
                  Còn {stats.weeklyGoal - stats.weeklyProgress} phút nữa để đạt
                  mục tiêu tuần này!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Tiếp tục học tập
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments
                  .filter(
                    (e) =>
                      e.progress_percentage > 0 && e.progress_percentage < 100,
                  )
                  .slice(0, 3)
                  .map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-16 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {enrollment.course?.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress
                            value={enrollment.progress_percentage || 0}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">
                            {Math.round(enrollment.progress_percentage || 0)}%
                          </span>
                        </div>
                      </div>
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Tiếp tục
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Thành tích gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOCK_ACHIEVEMENTS.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="text-center p-4 border rounded-lg"
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className="font-medium text-sm mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        'mt-2 text-xs',
                        achievement.rarity === 'legendary' &&
                          'border-yellow-500 text-yellow-600',
                        achievement.rarity === 'epic' &&
                          'border-purple-500 text-purple-600',
                        achievement.rarity === 'rare' &&
                          'border-blue-500 text-blue-600',
                      )}
                    >
                      {achievement.rarity === 'legendary'
                        ? 'Huyền thoại'
                        : achievement.rarity === 'epic'
                          ? 'Sử thi'
                          : achievement.rarity === 'rare'
                            ? 'Hiếm'
                            : 'Thông thường'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Fire className="h-5 w-5" />
                Chuỗi học tập
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {stats.currentStreak}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Ngày liên tiếp
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Kỷ lục cá nhân:</span>
                  <span className="font-medium">
                    {stats.longestStreak} ngày
                  </span>
                </div>
                <Progress
                  value={(stats.currentStreak / stats.longestStreak) * 100}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Tìm khóa học mới
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Tải chứng chỉ
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt học tập
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                Trợ giúp
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      {activity.type === 'course_completed' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {activity.type === 'lesson_completed' && (
                        <Play className="h-4 w-4 text-blue-500" />
                      )}
                      {activity.type === 'certificate_earned' && (
                        <Award className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatVietnameseDate(activity.timestamp, 'relative')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderCoursesTab = () => (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Khóa học của tôi</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tiến độ học tập của bạn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="in_progress">Đang học</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="not_started">Chưa bắt đầu</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Course Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.inProgressCourses}
                </div>
                <p className="text-sm text-muted-foreground">Đang học</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.completedCourses}
                </div>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.certificatesEarned}
                </div>
                <p className="text-sm text-muted-foreground">Chứng chỉ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid/List */}
      {enrollmentsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Đang tải khóa học...</p>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-6',
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1',
          )}
        >
          {filteredEnrollments.map((enrollment) => (
            <Card
              key={enrollment.id}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                {/* Course Image */}
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  {enrollment.course?.thumbnail_url ? (
                    <img
                      src={enrollment.course.thumbnail_url}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-primary/60" />
                    </div>
                  )}

                  {/* Progress Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {Math.round(enrollment.progress_percentage || 0)}% hoàn
                        thành
                      </span>
                      {enrollment.progress_percentage === 100 && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Hoàn thành
                        </Badge>
                      )}
                    </div>
                    <Progress
                      value={enrollment.progress_percentage || 0}
                      className="mt-1 h-1"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Chia sẻ
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Tải chứng chỉ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {enrollment.course?.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    {enrollment.course?.instructor_name && (
                      <span>
                        Giảng viên: {enrollment.course.instructor_name}
                      </span>
                    )}
                    {enrollment.course?.duration_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatVietnameseDuration(
                            enrollment.course.duration_minutes,
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Bắt đầu:{' '}
                        {formatVietnameseDate(
                          enrollment.enrolled_at || '',
                          'short',
                        )}
                      </span>
                    </div>
                    {enrollment.last_accessed && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          Lần cuối:{' '}
                          {formatVietnameseDate(
                            enrollment.last_accessed,
                            'relative',
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    variant={
                      enrollment.progress_percentage === 100
                        ? 'outline'
                        : 'default'
                    }
                  >
                    {enrollment.progress_percentage === 100 ? (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Xem lại
                      </>
                    ) : enrollment.progress_percentage > 0 ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Tiếp tục học
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Bắt đầu học
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredEnrollments.length === 0 && !enrollmentsLoading && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery || filterStatus !== 'all'
              ? 'Không tìm thấy khóa học phù hợp'
              : 'Chưa có khóa học nào'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterStatus !== 'all'
              ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
              : 'Hãy bắt đầu hành trình học tập của bạn bằng cách đăng ký khóa học đầu tiên'}
          </p>
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Khám phá khóa học
          </Button>
        </div>
      )}
    </div>
  )

  const renderStatsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Thống kê học tập</h2>
          <p className="text-muted-foreground">
            Theo dõi tiến độ và thành tích học tập của bạn
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Cập nhật
        </Button>
      </div>

      {/* Yearly Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mục tiêu năm 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Khóa học hoàn thành</span>
                <span className="text-sm text-muted-foreground">
                  {stats.completedCourses}/{stats.yearlyGoals.courses}
                </span>
              </div>
              <Progress
                value={
                  (stats.completedCourses / stats.yearlyGoals.courses) * 100
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Còn {stats.yearlyGoals.courses - stats.completedCourses} khóa
                học
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Chứng chỉ đạt được</span>
                <span className="text-sm text-muted-foreground">
                  {stats.certificatesEarned}/{stats.yearlyGoals.certificates}
                </span>
              </div>
              <Progress
                value={
                  (stats.certificatesEarned / stats.yearlyGoals.certificates) *
                  100
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Còn {stats.yearlyGoals.certificates - stats.certificatesEarned}{' '}
                chứng chỉ
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Kỹ năng hoàn thành</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(stats.completedCourses * 4.2)}/
                  {stats.yearlyGoals.skillsCompleted}
                </span>
              </div>
              <Progress
                value={
                  (Math.round(stats.completedCourses * 4.2) /
                    stats.yearlyGoals.skillsCompleted) *
                  100
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Còn{' '}
                {stats.yearlyGoals.skillsCompleted -
                  Math.round(stats.completedCourses * 4.2)}{' '}
                kỹ năng
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Learning Time Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Thống kê thời gian học
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(stats.totalWatchTime / 60)}h
                </div>
                <p className="text-sm text-blue-700">Tổng thời gian</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(stats.monthlyMinutes / 60)}h
                </div>
                <p className="text-sm text-green-700">Tháng này</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Thời gian học trung bình/ngày:</span>
                <span className="font-medium">
                  {Math.round(stats.monthlyMinutes / 30)} phút
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Thời gian học/khóa học:</span>
                <span className="font-medium">
                  {Math.round(stats.totalWatchTime / stats.totalCourses)} phút
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Hiệu suất học tập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.averageRating.toFixed(1)}
                </div>
                <p className="text-sm text-yellow-700">Điểm trung bình</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    (stats.completedCourses / stats.totalCourses) * 100,
                  )}
                  %
                </div>
                <p className="text-sm text-purple-700">Tỷ lệ hoàn thành</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Chuỗi học tập hiện tại:</span>
                <div className="flex items-center gap-1">
                  <Fire className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">
                    {stats.currentStreak} ngày
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Kỷ lục cá nhân:</span>
                <div className="flex items-center gap-1">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">
                    {stats.longestStreak} ngày
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Tiến độ kỹ năng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { skill: 'JavaScript', level: 85, courses: 3 },
              { skill: 'React', level: 72, courses: 2 },
              { skill: 'Node.js', level: 68, courses: 2 },
              { skill: 'Python', level: 45, courses: 1 },
              { skill: 'Data Science', level: 30, courses: 1 },
              { skill: 'UI/UX Design', level: 20, courses: 1 },
            ].map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-sm text-muted-foreground">
                    {skill.level}% • {skill.courses} khóa
                  </span>
                </div>
                <Progress value={skill.level} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAchievementsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Thành tích</h2>
        <p className="text-muted-foreground">
          Khám phá tất cả các thành tích bạn đã đạt được trong hành trình học
          tập
        </p>
      </div>

      {/* Achievement Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="course">Khóa học</TabsTrigger>
          <TabsTrigger value="time">Thời gian</TabsTrigger>
          <TabsTrigger value="streak">Chuỗi học</TabsTrigger>
          <TabsTrigger value="skill">Kỹ năng</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_ACHIEVEMENTS.map((achievement) => (
              <Card
                key={achievement.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{achievement.icon}</div>
                  <h3 className="font-bold text-lg mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge
                      className={cn(
                        'text-xs',
                        achievement.rarity === 'legendary' &&
                          'bg-gradient-to-r from-yellow-400 to-orange-500',
                        achievement.rarity === 'epic' &&
                          'bg-gradient-to-r from-purple-400 to-pink-500',
                        achievement.rarity === 'rare' &&
                          'bg-gradient-to-r from-blue-400 to-cyan-500',
                      )}
                    >
                      {achievement.rarity === 'legendary'
                        ? 'Huyền thoại'
                        : achievement.rarity === 'epic'
                          ? 'Sử thi'
                          : achievement.rarity === 'rare'
                            ? 'Hiếm'
                            : 'Thông thường'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatVietnameseDate(achievement.unlockedAt, 'short')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Achievement Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ thành tích</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Tổng thành tích đã mở khóa:</span>
              <span className="font-bold">{MOCK_ACHIEVEMENTS.length}/50</span>
            </div>
            <Progress value={(MOCK_ACHIEVEMENTS.length / 50) * 100} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <p className="text-sm text-muted-foreground">Khóa học</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">2</div>
                <p className="text-sm text-muted-foreground">Thời gian</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">1</div>
                <p className="text-sm text-muted-foreground">Chuỗi học</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2</div>
                <p className="text-sm text-muted-foreground">Kỹ năng</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              />
              <AvatarFallback className="text-xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Trang cá nhân</h1>
              <p className="text-muted-foreground">
                Chào mừng trở lại, {user.username}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Thông báo
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Khóa học
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Thống kê
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              Thành tích
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="overview">{renderOverviewTab()}</TabsContent>
            <TabsContent value="courses">{renderCoursesTab()}</TabsContent>
            <TabsContent value="stats">{renderStatsTab()}</TabsContent>
            <TabsContent value="achievements">
              {renderAchievementsTab()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
