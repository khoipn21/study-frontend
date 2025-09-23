import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Area,
  AreaChart,
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
  BarChart3,
  BookOpen,
  DollarSign,
  Download,
  Eye,
  PieChart as PieChartIcon,
  RefreshCw,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Progress } from '@/components/ui/progress'
import { instructorDashboardService } from '@/lib/instructor-dashboard'
import type {
  InstructorCourse,
  StudentEngagement,
} from '@/lib/instructor-dashboard'

// Chart color themes
const CHART_COLORS = {
  primary: '#2563eb',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#eab308',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  cyan: '#06b6d4',
}

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.danger,
  CHART_COLORS.purple,
  CHART_COLORS.cyan,
]

// Data adapters to transform API data to component interface
function adaptStudentEngagementData(data: Array<StudentEngagement>) {
  return data.map((engagement) => ({
    courseTitle: engagement.courseTitle,
    engagementScore: engagement.engagementScore,
    averageWatchTime: engagement.averageWatchTime,
    completionRate:
      (engagement.completedStudents / engagement.totalStudents) * 100 || 0,
  }))
}

function adaptInstructorCoursesForPerformance(
  courses: Array<InstructorCourse>,
) {
  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    revenue: course.revenue || 0,
    enrollments: course.enrollmentCount || 0,
    rating: course.averageRating || 0,
    engagementRate: Math.random() * 100, // Mock engagement rate - replace with real data
  }))
}

function adaptInstructorCoursesForTopPerformers(
  courses: Array<InstructorCourse>,
) {
  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    thumbnail: course.thumbnail,
    revenue: course.revenue || 0,
    enrollments: course.enrollmentCount || 0,
    rating: course.averageRating || 0,
    completionRate: course.completionRate || 0,
    engagementRate: Math.random() * 100, // Mock engagement rate - replace with real data
  }))
}

interface DateRangeState {
  from: Date
  to: Date
}

interface RevenueAnalyticsProps {
  data: Array<any>
  forecast?: Array<any>
  period: string
}

function RevenueAnalytics({ data, forecast, period }: RevenueAnalyticsProps) {
  const formatCurrency = (value: number) => `$${(value || 0).toLocaleString()}`
  const formatPeriod = (period: string) => {
    switch (period) {
      case 'day':
        return 'Daily'
      case 'week':
        return 'Weekly'
      case 'month':
        return 'Monthly'
      default:
        return 'Daily'
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Revenue Analytics
        </CardTitle>
        <CardDescription>
          {formatPeriod(period)} revenue trends with forecasting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === 'amount' ? 'Revenue' : 'Enrollments',
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="amount"
              stroke={CHART_COLORS.primary}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              name="Revenue"
            />
            <Bar
              dataKey="enrollments"
              fill={CHART_COLORS.secondary}
              name="Enrollments"
            />
            {forecast && forecast.length > 0 && (
              <Line
                type="monotone"
                dataKey="predicted"
                stroke={CHART_COLORS.warning}
                strokeDasharray="5 5"
                name="Forecast"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface CoursePerformanceProps {
  courses: Array<{
    id: string
    title: string
    revenue: number
    enrollments: number
    rating: number
    engagementRate: number
  }>
}

function CoursePerformance({ courses }: CoursePerformanceProps) {
  const revenueData = courses
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((course) => ({
      name:
        course.title.length > 20
          ? course.title.substring(0, 20) + '...'
          : course.title,
      revenue: course.revenue,
      enrollments: course.enrollments,
      rating: course.rating,
    }))

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Course Performance
        </CardTitle>
        <CardDescription>Revenue by course (top 8 performers)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={revenueData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis type="category" dataKey="name" width={120} />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === 'revenue'
                  ? `$${(value || 0).toLocaleString()}`
                  : value,
                name === 'revenue' ? 'Revenue' : name,
              ]}
            />
            <Bar dataKey="revenue" fill={CHART_COLORS.primary} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface EngagementMetricsProps {
  data: Array<{
    courseTitle: string
    engagementScore: number
    averageWatchTime: number
    completionRate: number
  }>
}

function EngagementMetrics({ data }: EngagementMetricsProps) {
  const pieData = data.slice(0, 6).map((course, index) => ({
    name:
      course.courseTitle.length > 15
        ? course.courseTitle.substring(0, 15) + '...'
        : course.courseTitle,
    value: course.engagementScore,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }))

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Engagement Distribution
        </CardTitle>
        <CardDescription>Engagement scores by course</CardDescription>
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
              label={({ percent }) =>
                `${((percent as number) * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {pieData.map((entry) => (
            <div
              key={entry.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}</span>
              </div>
              <span className="font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface StudentAnalyticsProps {
  data: Array<{
    date: string
    newStudents: number
    activeStudents: number
    completions: number
  }>
}

function StudentAnalytics({ data }: StudentAnalyticsProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Student Analytics
        </CardTitle>
        <CardDescription>
          Student acquisition, activity, and completion trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="newStudents"
              stroke={CHART_COLORS.secondary}
              strokeWidth={2}
              name="New Students"
            />
            <Line
              type="monotone"
              dataKey="activeStudents"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              name="Active Students"
            />
            <Line
              type="monotone"
              dataKey="completions"
              stroke={CHART_COLORS.success}
              strokeWidth={2}
              name="Completions"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface TopPerformersProps {
  courses: Array<{
    id: string
    title: string
    thumbnail?: string
    revenue: number
    enrollments: number
    rating: number
    completionRate: number
    engagementRate: number
  }>
}

function TopPerformers({ courses }: TopPerformersProps) {
  const topCourses = courses.slice(0, 5)

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Top Performing Courses</CardTitle>
        <CardDescription>
          Detailed performance metrics for your best courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCourses.map((course, index) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Badge
                  variant="secondary"
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                >
                  {index + 1}
                </Badge>
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
                <div>
                  <h4 className="font-medium">{course.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />$
                      {(course.revenue || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.enrollments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {(course.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Completion
                  </div>
                  <div className="font-medium">
                    {(course.completionRate || 0).toFixed(1)}%
                  </div>
                  <Progress
                    value={course.completionRate || 0}
                    className="w-16 h-2 mt-1"
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Engagement
                  </div>
                  <div className="font-medium">
                    {(course.engagementRate || 0).toFixed(1)}%
                  </div>
                  <Progress
                    value={course.engagementRate || 0}
                    className="w-16 h-2 mt-1"
                  />
                </div>
                <div className="flex items-center">
                  {course.revenue > 10000 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRangeState>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')

  // Fetch analytics data
  const { data: revenueAnalytics, isLoading: revenueLoading } = useQuery({
    queryKey: [
      'instructor',
      'analytics',
      'revenue',
      {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        courseId: selectedCourse !== 'all' ? selectedCourse : undefined,
        granularity: period,
      },
    ],
    queryFn: () =>
      instructorDashboardService.getRevenueAnalytics({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        courseId: selectedCourse !== 'all' ? selectedCourse : undefined,
        granularity: period,
      }),
  })

  const { data: engagementData, isLoading: engagementLoading } = useQuery({
    queryKey: ['instructor', 'analytics', 'engagement'],
    queryFn: () => instructorDashboardService.getStudentEngagement(),
  })

  const { data: coursesData } = useQuery({
    queryKey: ['instructor', 'courses', 'list'],
    queryFn: () => instructorDashboardService.getCourses({ limit: 100 }),
  })

  // Mock data for student analytics (replace with real data)
  const studentAnalyticsData = [
    {
      date: '2024-01-01',
      newStudents: 45,
      activeStudents: 320,
      completions: 12,
    },
    {
      date: '2024-01-02',
      newStudents: 52,
      activeStudents: 335,
      completions: 18,
    },
    {
      date: '2024-01-03',
      newStudents: 38,
      activeStudents: 342,
      completions: 15,
    },
    {
      date: '2024-01-04',
      newStudents: 61,
      activeStudents: 358,
      completions: 22,
    },
    {
      date: '2024-01-05',
      newStudents: 49,
      activeStudents: 371,
      completions: 19,
    },
    {
      date: '2024-01-06',
      newStudents: 44,
      activeStudents: 385,
      completions: 16,
    },
    {
      date: '2024-01-07',
      newStudents: 56,
      activeStudents: 398,
      completions: 25,
    },
  ]

  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    // Implement export functionality
    console.log(`Exporting analytics data as ${format}`)
  }

  const isLoading = revenueLoading || engagementLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-[400px] bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analytics Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          <Select
            value={period}
            onValueChange={(value: any) => setPeriod(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {coursesData?.courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(revenueAnalytics?.summary?.total || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {revenueAnalytics?.summary?.growth &&
              revenueAnalytics.summary.growth > 0
                ? '+'
                : ''}
              {(revenueAnalytics?.summary?.growth || 0).toFixed(1)}% from last
              period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Revenue/Student
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenueAnalytics?.summary?.avgPerStudent?.toFixed(2) || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per enrolled student
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Course Revenue
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {(
                revenueAnalytics?.summary?.topCourse?.revenue || 0
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {revenueAnalytics?.summary?.topCourse?.title || 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Engagement
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementData &&
              Array.isArray(engagementData) &&
              engagementData.length > 0
                ? (
                    engagementData.reduce(
                      (acc, course) => acc + course.engagementScore,
                      0,
                    ) / engagementData.length
                  ).toFixed(1)
                : '0'}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4">
            {revenueAnalytics && (
              <RevenueAnalytics
                data={revenueAnalytics.revenue}
                forecast={revenueAnalytics.forecast}
                period={period}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {engagementData && Array.isArray(engagementData) && (
              <EngagementMetrics
                data={adaptStudentEngagementData(engagementData)}
              />
            )}
            {coursesData && (
              <CoursePerformance
                courses={adaptInstructorCoursesForPerformance(
                  coursesData.courses,
                )}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <StudentAnalytics data={studentAnalyticsData} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {coursesData && (
            <TopPerformers
              courses={adaptInstructorCoursesForTopPerformers(
                coursesData.courses,
              )}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
