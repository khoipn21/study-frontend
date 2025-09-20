import {
  Link,
  createFileRoute,
  useRouter,
  useSearch,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type SearchParams = {
  token?: string
  user?: string
}

export const Route = createFileRoute('/me/dashboard')({
  validateSearch: (search): SearchParams => ({
    token: typeof search.token === 'string' ? search.token : undefined,
    user: typeof search.user === 'string' ? search.user : undefined,
  }),
  component: UserDashboard,
})

function UserDashboard() {
  const router = useRouter()
  const search = useSearch({ from: '/me/dashboard' })
  const { login } = useAuth()

  // Handle OAuth authentication if parameters are present
  useEffect(() => {
    if (search.token != null && search.user != null) {
      // For OAuth login, we need to get the full user object
      // Since we only have the user ID, we'd typically make an API call
      // For now, create a minimal user object
      const user = {
        id: search.user,
        username: '',
        email: '',
        role: 'student' as const,
      }

      login(user, search.token)

      // Clear the OAuth parameters from URL
      void router.navigate({
        to: '/me/dashboard',
        replace: true,
      })
    }
  }, [search.token, search.user, login, router])

  // Mock user data - replace with actual data from context/API
  const user = {
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    joinDate: '2024-01-15',
    totalCourses: 5,
    completedCourses: 2,
    totalWatchTime: 24.5, // hours
  }

  const recentCourses = [
    {
      id: '1',
      title: 'Lập trình React từ cơ bản đến nâng cao',
      progress: 75,
      lastWatched: '2024-01-20',
      instructor: 'Nguyễn Văn B',
    },
    {
      id: '2',
      title: 'Node.js và Express.js cho Backend',
      progress: 45,
      lastWatched: '2024-01-18',
      instructor: 'Trần Thị C',
    },
    {
      id: '3',
      title: 'TypeScript cho JavaScript Developer',
      progress: 100,
      lastWatched: '2024-01-15',
      instructor: 'Lê Văn D',
    },
  ]

  const achievements = [
    {
      title: 'Người học tích cực',
      description: 'Hoàn thành 3 khóa học',
      icon: Award,
    },
    { title: 'Học giả', description: 'Học 50 giờ trong tháng', icon: BookOpen },
    {
      title: 'Streak Master',
      description: 'Học liên tục 7 ngày',
      icon: Calendar,
    },
  ]

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Xin chào, {user.name}!</h1>
        <p className="text-muted-foreground">
          Chào mừng bạn quay trở lại với hành trình học tập
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Khóa học đã đăng ký
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {user.completedCourses} đã hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian học</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalWatchTime}h</div>
            <p className="text-xs text-muted-foreground">+2.5h tuần này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiến độ trung bình
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chứng chỉ</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.completedCourses}</div>
            <p className="text-xs text-muted-foreground">Đã nhận được</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Khóa học gần đây</CardTitle>
              <CardDescription>
                Tiếp tục hành trình học tập của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Giảng viên: {course.instructor}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Progress value={course.progress} className="flex-1" />
                      <span className="text-sm font-medium">
                        {course.progress}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Học lần cuối:{' '}
                      {new Date(course.lastWatched).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <Button asChild>
                    <Link
                      to="/courses/$courseId"
                      params={{ courseId: course.id }}
                    >
                      {course.progress === 100 ? 'Xem lại' : 'Tiếp tục'}
                    </Link>
                  </Button>
                </div>
              ))}

              <div className="text-center pt-4">
                <Button variant="outline" asChild>
                  <Link to="/me/enrollments">Xem tất cả khóa học</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements & Quick Actions */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Thành tích</CardTitle>
              <CardDescription>Những cột mốc bạn đã đạt được</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <achievement.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link to="/courses">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Khám phá khóa học mới
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/forum">
                  <Users className="h-4 w-4 mr-2" />
                  Tham gia diễn đàn
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/me/enrollments">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Xem tiến độ học tập
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Learning Streak */}
          <Card>
            <CardHeader>
              <CardTitle>Chuỗi học tập</CardTitle>
              <CardDescription>
                Duy trì thói quen học tập hàng ngày
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">7</div>
                <p className="text-sm text-muted-foreground">ngày liên tiếp</p>
                <div className="mt-4">
                  <Button size="sm" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Học hôm nay
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
