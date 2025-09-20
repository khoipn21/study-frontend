import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  MessageSquare,
  PlayCircle,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'

import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { instructorDashboardService } from '@/lib/instructor-dashboard'
import { useAuthenticatedApi } from '@/lib/auth-context'
import type {
  InstructorDashboardStats,
  RevenueMetrics,
  StudentEngagement,
} from '@/lib/instructor-dashboard'

// Chart color themes
const CHART_COLORS = {
  primary: '#2563eb',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  muted: '#6b7280',
}

const PIE_COLORS = [
  '#2563eb',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
]

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: React.ElementType
  description?: string
  trend?: Array<{ value: number }>
}

function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
  trend,
}: MetricCardProps) {
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  const getChangeColor = (type?: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getChangeIcon = (type?: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return <ArrowUpRight className="h-4 w-4" />
      case 'decrease':
        return <ArrowDownRight className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div
            className={`flex items-center text-xs ${getChangeColor(changeType)}`}
          >
            {getChangeIcon(changeType)}
            <span className="ml-1">{formatChange(change)} from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={40}>
              <LineChart data={trend}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface RevenueChartProps {
  data: Array<RevenueMetrics>
}

function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue and enrollment trends</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === 'revenue' ? `$${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Enrollments',
              ]}
            />
            <Legend />
            <Bar dataKey="revenue" fill={CHART_COLORS.primary} name="Revenue" />
            <Bar
              dataKey="enrollments"
              fill={CHART_COLORS.secondary}
              name="Enrollments"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface EngagementChartProps {
  data: Array<StudentEngagement>
}

function EngagementChart({ data }: EngagementChartProps) {
  const pieData = data.slice(0, 5).map((course, index) => ({
    name: course.courseTitle,
    value: course.engagementScore,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }))

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Course Engagement</CardTitle>
        <CardDescription>
          Top performing courses by engagement score
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface TopCoursesProps {
  courses: Array<{
    id: string
    title: string
    students: number
    revenue: number
    rating: number
    thumbnail?: string
  }>
}

function TopCourses({ courses }: TopCoursesProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Top Performing Courses</CardTitle>
        <CardDescription>
          Your highest revenue and highest rated courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div key={course.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {course.title}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {course.students.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />$
                    {course.revenue.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {course.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <Badge variant="secondary">{index + 1}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface RecentActivityProps {
  activities: Array<{
    id: string
    type: string
    description: string
    time: string
    user?: string
    courseTitle?: string
  }>
}

function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <Users className="h-4 w-4 text-green-600" />
      case 'completion':
        return <Award className="h-4 w-4 text-blue-600" />
      case 'review':
        return <Star className="h-4 w-4 text-yellow-600" />
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from your courses and students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm">{activity.description}</p>
                {activity.courseTitle && (
                  <p className="text-xs text-muted-foreground">
                    Course: {activity.courseTitle}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickActionsProps {
  onCreateCourse: () => void
  onUploadVideo: () => void
  onViewAnalytics: () => void
  onCheckMessages: () => void
}

function QuickActions({
  onCreateCourse,
  onUploadVideo,
  onViewAnalytics,
  onCheckMessages,
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button onClick={onCreateCourse} className="h-20 flex-col">
          <BookOpen className="h-6 w-6 mb-2" />
          <span className="text-xs">Create Course</span>
        </Button>
        <Button
          onClick={onUploadVideo}
          variant="outline"
          className="h-20 flex-col"
        >
          <PlayCircle className="h-6 w-6 mb-2" />
          <span className="text-xs">Upload Video</span>
        </Button>
        <Button
          onClick={onViewAnalytics}
          variant="outline"
          className="h-20 flex-col"
        >
          <BarChart className="h-6 w-6 mb-2" />
          <span className="text-xs">View Analytics</span>
        </Button>
        <Button
          onClick={onCheckMessages}
          variant="outline"
          className="h-20 flex-col"
        >
          <MessageSquare className="h-6 w-6 mb-2" />
          <span className="text-xs">Check Messages</span>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function DashboardOverview() {
  const {
    token,
    isAuthenticated,
    isLoading: authLoading,
    callWithAuth,
  } = useAuthenticatedApi()

  // Fetch dashboard data with proper authentication
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['instructor', 'dashboard', 'stats'],
    queryFn: () =>
      callWithAuth((token) =>
        instructorDashboardService.getDashboardStats(token),
      ),
    refetchInterval: 300000, // Refetch every 5 minutes
    enabled: isAuthenticated && !authLoading,
    retry: (failureCount, error) => {
      // Don't retry if it's an authentication error
      if (error instanceof Error && error.message.includes('Authentication')) {
        return false
      }
      return failureCount < 2
    },
  })

  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError,
  } = useQuery({
    queryKey: ['instructor', 'revenue', 'metrics'],
    queryFn: () =>
      callWithAuth((token) =>
        instructorDashboardService.getRevenueMetrics('month', token),
      ),
    enabled: isAuthenticated && !authLoading,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('Authentication')) {
        return false
      }
      return failureCount < 2
    },
  })

  const {
    data: engagementData,
    isLoading: engagementLoading,
    error: engagementError,
  } = useQuery({
    queryKey: ['instructor', 'engagement'],
    queryFn: () =>
      callWithAuth((token) =>
        instructorDashboardService.getStudentEngagement(token),
      ),
    enabled: isAuthenticated && !authLoading,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('Authentication')) {
        return false
      }
      return failureCount < 2
    },
  })

  // Mock data for demonstration (replace with real data from APIs)
  const topCourses = [
    {
      id: '1',
      title: 'React Mastery: Complete Guide',
      students: 1247,
      revenue: 18940,
      rating: 4.8,
      thumbnail: '/course-thumbnails/react.jpg',
    },
    {
      id: '2',
      title: 'TypeScript for Professionals',
      students: 892,
      revenue: 13380,
      rating: 4.7,
      thumbnail: '/course-thumbnails/typescript.jpg',
    },
    {
      id: '3',
      title: 'Modern JavaScript Patterns',
      students: 1156,
      revenue: 17340,
      rating: 4.9,
      thumbnail: '/course-thumbnails/javascript.jpg',
    },
  ]

  const recentActivities = [
    {
      id: '1',
      type: 'enrollment',
      description: 'John Smith enrolled in React Mastery',
      time: '2 minutes ago',
      courseTitle: 'React Mastery: Complete Guide',
    },
    {
      id: '2',
      type: 'completion',
      description: 'Sarah Johnson completed TypeScript course',
      time: '15 minutes ago',
      courseTitle: 'TypeScript for Professionals',
    },
    {
      id: '3',
      type: 'review',
      description: 'New 5-star review from Michael Brown',
      time: '1 hour ago',
      courseTitle: 'Modern JavaScript Patterns',
    },
    {
      id: '4',
      type: 'message',
      description: 'Emma Davis sent you a message',
      time: '2 hours ago',
    },
  ]

  // Handle authentication loading first
  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Handle authentication errors
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              Authentication Required
            </CardTitle>
            <CardDescription>
              Please log in to access your instructor dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="mt-4"
              onClick={() => {
                window.location.href = '/auth/login'
              }}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Handle other errors
  if (statsError || revenueError || engagementError) {
    const hasAuthError = [statsError, revenueError, engagementError].some(
      (error) => error && error.message?.includes('Authentication'),
    )

    if (hasAuthError) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
                Authentication Error
              </CardTitle>
              <CardDescription>
                Your session has expired. Please log in again to access your
                dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="mt-4"
                onClick={() => {
                  // Clear auth state and redirect to login
                  localStorage.removeItem('study.auth')
                  window.location.href = '/auth/login'
                }}
              >
                Log In Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              Error Loading Dashboard
            </CardTitle>
            <CardDescription>
              We encountered an issue while loading your dashboard data. Please
              try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              {statsError && <p>• Failed to load dashboard statistics</p>}
              {revenueError && <p>• Failed to load revenue metrics</p>}
              {engagementError && <p>• Failed to load engagement data</p>}
            </div>
            <Button
              className="mt-4"
              onClick={() => {
                window.location.reload()
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (statsLoading || revenueLoading || engagementLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-[350px] bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-[350px] bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
          change={stats?.revenueGrowth || 0}
          changeType={
            stats?.revenueGrowth && stats.revenueGrowth > 0
              ? 'increase'
              : 'decrease'
          }
          icon={DollarSign}
          description="Monthly recurring revenue"
        />
        <MetricCard
          title="Active Students"
          value={stats?.activeStudents?.toLocaleString() || '0'}
          change={stats?.studentGrowth || 0}
          changeType={
            stats?.studentGrowth && stats.studentGrowth > 0
              ? 'increase'
              : 'decrease'
          }
          icon={Users}
          description="Currently enrolled students"
        />
        <MetricCard
          title="Published Courses"
          value={stats?.publishedCourses?.toLocaleString() || '0'}
          icon={BookOpen}
          description={`${stats?.draftCourses || 0} in draft`}
        />
        <MetricCard
          title="Average Rating"
          value={`${stats?.averageRating?.toFixed(1) || '0.0'} ⭐`}
          icon={Star}
          description={`${stats?.totalReviews || 0} total reviews`}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {revenueData && <RevenueChart data={revenueData} />}
        {engagementData && <EngagementChart data={engagementData} />}
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Completion Rate"
          value={`${stats?.completionRate?.toFixed(1) || '0'}%`}
          icon={Award}
          description="Average course completion"
        />
        <MetricCard
          title="Watch Time"
          value={`${Math.round((stats?.watchTime || 0) / 60)} hrs`}
          icon={Clock}
          description="Total student watch time"
        />
        <MetricCard
          title="Engagement Rate"
          value={`${stats?.engagementRate?.toFixed(1) || '0'}%`}
          icon={TrendingUp}
          description="Student interaction rate"
        />
        <MetricCard
          title="Refund Rate"
          value={`${stats?.refundRate?.toFixed(1) || '0'}%`}
          icon={AlertCircle}
          description="Course refund percentage"
        />
      </div>

      {/* Detailed Views */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <TopCourses courses={topCourses} />
        <RecentActivity activities={recentActivities} />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickActions
          onCreateCourse={() =>
            (window.location.href = '/dashboard/instructor/courses/new')
          }
          onUploadVideo={() =>
            (window.location.href = '/dashboard/instructor/upload')
          }
          onViewAnalytics={() =>
            (window.location.href = '/dashboard/instructor/analytics')
          }
          onCheckMessages={() =>
            (window.location.href = '/dashboard/instructor/messages')
          }
        />
      </div>
    </div>
  )
}
