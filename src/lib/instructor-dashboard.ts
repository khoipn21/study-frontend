// Instructor Dashboard Types and API Client
import { apiClient } from './api-client'

// Core Instructor Dashboard Types
export interface InstructorDashboardStats {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  totalStudents: number
  activeStudents: number
  studentGrowth: number
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalEnrollments: number
  completionRate: number
  averageRating: number
  totalReviews: number
  watchTime: number // total minutes watched
  engagementRate: number
  refundRate: number
}

export interface RevenueMetrics {
  period: string
  revenue: number
  enrollments: number
  refunds: number
  netRevenue: number
}

export interface StudentEngagement {
  courseId: string
  courseTitle: string
  totalStudents: number
  activeStudents: number
  completedStudents: number
  averageProgress: number
  averageWatchTime: number
  lastActivity: string
  dropoffRate: number
  engagementScore: number
}

export interface CourseAnalytics {
  courseId: string
  title: string
  thumbnail?: string
  publishedAt: string
  totalEnrollments: number
  activeEnrollments: number
  completions: number
  revenue: number
  averageRating: number
  totalReviews: number
  watchTime: number
  engagementRate: number
  dropoffPoints: Array<{
    lectureId: string
    lectureTitle: string
    dropoffRate: number
    timestamp: number
  }>
  studentFeedback: Array<{
    rating: number
    comment: string
    studentName: string
    date: string
    lectureId?: string
  }>
}

export interface InstructorCourse {
  id: string
  title: string
  description: string
  thumbnail?: string
  coverImage?: string
  status: 'draft' | 'published' | 'archived' | 'under_review'
  category: string
  subcategory?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  language: string
  price: number
  currency: string
  discountPrice?: number
  promotionalVideo?: string
  estimatedDuration: number // in minutes
  learningObjectives: Array<string>
  prerequisites: Array<string>
  targetAudience: Array<string>
  createdAt: string
  updatedAt: string
  publishedAt?: string
  enrollmentCount: number
  averageRating: number
  totalReviews: number
  revenue: number
  completionRate: number
  lectures: Array<InstructorLecture>
  tags: Array<string>
  isPublic: boolean
  allowDiscussions: boolean
  certificateEnabled: boolean
  hasDrm: boolean
}

export interface InstructorLecture {
  id: string
  courseId: string
  title: string
  description?: string
  videoUrl?: string
  videoProcessingStatus: 'pending' | 'processing' | 'completed' | 'failed'
  duration: number // in seconds
  order: number
  isFree: boolean
  resources: Array<{
    id: string
    title: string
    type: 'pdf' | 'zip' | 'link' | 'code'
    url: string
    size?: number
  }>
  quiz?: {
    id: string
    questions: number
    passingScore: number
  }
  isPublished: boolean
  createdAt: string
  updatedAt: string
  watchTime: number
  completionRate: number
  dropoffRate: number
}

export interface InstructorStudent {
  id: string
  name: string
  email: string
  avatar?: string
  enrolledAt: string
  lastActivity: string
  totalWatchTime: number
  coursesEnrolled: number
  coursesCompleted: number
  averageProgress: number
  engagementLevel: 'high' | 'medium' | 'low'
  isAtRisk: boolean
  totalSpent: number
  preferredLanguage: string
  timezone: string
  courses: Array<{
    courseId: string
    courseTitle: string
    progress: number
    lastWatched: string
    completedAt?: string
    currentLecture?: string
    watchTime: number
    rating?: number
    review?: string
  }>
  communications: Array<{
    id: string
    type: 'message' | 'announcement' | 'reminder'
    subject: string
    sentAt: string
    isRead: boolean
  }>
}

export interface VideoProcessingStatus {
  lectureId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  quality: Array<{
    resolution: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    size?: number
    duration?: number
  }>
  error?: string
  estimatedCompletion?: string
}

export interface BulkOperation {
  id: string
  type:
    | 'delete_courses'
    | 'publish_courses'
    | 'archive_courses'
    | 'update_pricing'
    | 'send_messages'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  totalItems: number
  processedItems: number
  failedItems: number
  startedAt: string
  completedAt?: string
  error?: string
  results?: Array<{
    itemId: string
    status: 'success' | 'failed'
    error?: string
  }>
}

export interface InstructorNotification {
  id: string
  type:
    | 'course_review'
    | 'student_message'
    | 'payment_received'
    | 'course_milestone'
    | 'system_update'
  title: string
  message: string
  createdAt: string
  isRead: boolean
  actionUrl?: string
  metadata?: {
    courseId?: string
    studentId?: string
    amount?: number
    rating?: number
  }
}

export interface MessageThread {
  id: string
  subject: string
  participants: Array<{
    id: string
    name: string
    email: string
    avatar?: string
    role: 'instructor' | 'student'
  }>
  lastMessage: {
    content: string
    sentAt: string
    senderName: string
  }
  unreadCount: number
  courseId?: string
  courseTitle?: string
  status: 'open' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

export interface InstructorMessage {
  id: string
  threadId: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  sentAt: string
  attachments?: Array<{
    id: string
    filename: string
    url: string
    size: number
    type: string
  }>
  isRead: boolean
}

// API Client Interface
export class InstructorDashboardService {
  private static instance: InstructorDashboardService

  public static getInstance(): InstructorDashboardService {
    InstructorDashboardService.instance ??= new InstructorDashboardService()
    return InstructorDashboardService.instance
  }

  private constructor() {}

  // Dashboard Overview
  async getDashboardStats(token?: string): Promise<InstructorDashboardStats> {
    const response = await apiClient.get('/instructor/dashboard/overview', {
      token,
    })
    return (response as { data: InstructorDashboardStats }).data
  }

  async getRevenueMetrics(
    period: 'week' | 'month' | 'quarter' | 'year' = 'month',
    token?: string,
  ): Promise<Array<RevenueMetrics>> {
    const response = await apiClient.get(
      `/instructor/analytics/revenue?period=${period}`,
      { token },
    )
    return (response as { data: Array<RevenueMetrics> }).data
  }

  async getStudentEngagement(
    token?: string,
  ): Promise<Array<StudentEngagement>> {
    const response = await apiClient.get('/instructor/analytics/engagement', {
      token,
    })
    return (response as { data: Array<StudentEngagement> }).data
  }

  async getStudentAnalytics(
    params?: {
      startDate?: string
      endDate?: string
      courseId?: string
      granularity?: 'day' | 'week' | 'month'
    },
    token?: string,
  ): Promise<
    Array<{
      date: string
      newStudents: number
      activeStudents: number
      completions: number
    }>
  > {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await apiClient.get(
      `/instructor/analytics/students?${searchParams}`,
      { token },
    )
    return (
      response as {
        data: Array<{
          date: string
          newStudents: number
          activeStudents: number
          completions: number
        }>
      }
    ).data
  }

  // Course Management
  async getCourses(
    params?: {
      page?: number
      limit?: number
      status?: string
      search?: string
      category?: string
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    },
    token?: string,
  ): Promise<{
    courses: Array<InstructorCourse>
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await apiClient.get(`/courses?${searchParams}`, { token })
    return (
      response as {
        data: {
          courses: Array<InstructorCourse>
          total: number
          page: number
          limit: number
          totalPages: number
        }
      }
    ).data
  }

  async getCourseById(
    courseId: string,
    token?: string,
  ): Promise<InstructorCourse> {
    const response = await apiClient.get(`/instructor/courses/${courseId}`, {
      token,
    })
    return (response as { data: InstructorCourse }).data
  }

  async createCourse(
    courseData: Partial<InstructorCourse>,
    token?: string,
  ): Promise<InstructorCourse> {
    const response = await apiClient.post('/instructor/courses', courseData, {
      token,
    })
    return (response as { data: InstructorCourse }).data
  }

  async updateCourse(
    courseId: string,
    courseData: Partial<InstructorCourse>,
    token?: string,
  ): Promise<InstructorCourse> {
    const response = await apiClient.put(
      `/instructor/courses/${courseId}`,
      courseData,
      { token },
    )
    return (response as { data: InstructorCourse }).data
  }

  async deleteCourse(courseId: string, token?: string): Promise<void> {
    await apiClient.delete(`/instructor/courses/${courseId}`, { token })
  }

  async bulkOperations(
    operation: {
      type: BulkOperation['type']
      courseIds: Array<string>
      data?: unknown
    },
    token?: string,
  ): Promise<BulkOperation> {
    const response = await apiClient.post(
      '/instructor/courses/bulk',
      operation,
      { token },
    )
    return (response as { data: BulkOperation }).data
  }

  async getBulkOperationStatus(
    operationId: string,
    token?: string,
  ): Promise<BulkOperation> {
    const response = await apiClient.get(
      `/instructor/bulk-operations/${operationId}`,
      { token },
    )
    return (response as { data: BulkOperation }).data
  }

  // Analytics
  async getCourseAnalytics(
    courseId: string,
    period?: string,
    token?: string,
  ): Promise<CourseAnalytics> {
    const params =
      period !== undefined && period !== null && period !== ''
        ? `?period=${period}`
        : ''
    const response = await apiClient.get(
      `/instructor/analytics/courses/${courseId}${params}`,
      { token },
    )
    return (response as { data: CourseAnalytics }).data
  }

  async getRevenueAnalytics(
    params?: {
      startDate?: string
      endDate?: string
      courseId?: string
      granularity?: 'day' | 'week' | 'month'
    },
    token?: string,
  ): Promise<{
    revenue: Array<{ date: string; amount: number; enrollments: number }>
    forecast: Array<{ date: string; predicted: number; confidence: number }>
    summary: {
      total: number
      growth: number
      avgPerStudent: number
      topCourse: { id: string; title: string; revenue: number }
    }
  }> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await apiClient.get(
      `/instructor/analytics/revenue?${searchParams}`,
      { token },
    )
    return (
      response as {
        data: {
          revenue: Array<{ date: string; amount: number; enrollments: number }>
          forecast: Array<{
            date: string
            predicted: number
            confidence: number
          }>
          summary: {
            total: number
            growth: number
            avgPerStudent: number
            topCourse: { id: string; title: string; revenue: number }
          }
        }
      }
    ).data
  }

  // Student Management
  async getStudents(
    params?: {
      page?: number
      limit?: number
      courseId?: string
      engagementLevel?: string
      search?: string
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    },
    token?: string,
  ): Promise<{
    students: Array<InstructorStudent>
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await apiClient.get(
      `/instructor/students?${searchParams}`,
      { token },
    )
    return (
      response as {
        data: {
          students: Array<InstructorStudent>
          total: number
          page: number
          limit: number
          totalPages: number
        }
      }
    ).data
  }

  async getStudentById(
    studentId: string,
    token?: string,
  ): Promise<InstructorStudent> {
    const response = await apiClient.get(`/instructor/students/${studentId}`, {
      token,
    })
    return (response as { data: InstructorStudent }).data
  }

  async getAtRiskStudents(token?: string): Promise<Array<InstructorStudent>> {
    const response = await apiClient.get('/instructor/students/at-risk', {
      token,
    })
    return (response as { data: Array<InstructorStudent> }).data
  }

  // Video Management
  async uploadVideo(
    lectureId: string,
    file: File,
    token?: string,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('lectureId', lectureId)

    await apiClient.post('/instructor/videos/upload', formData, {
      token,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: unknown) => {
        const event = progressEvent as { loaded: number; total?: number }
        if (
          event.total !== undefined &&
          event.total !== null &&
          onProgress !== undefined
        ) {
          const progress = Math.round((event.loaded * 100) / event.total)
          onProgress(progress)
        }
      },
    })
  }

  async getVideoProcessingStatus(
    lectureId: string,
    token?: string,
  ): Promise<VideoProcessingStatus> {
    const response = await apiClient.get(
      `/instructor/videos/status/${lectureId}`,
      { token },
    )
    return (response as { data: VideoProcessingStatus }).data
  }

  // Communications
  async getNotifications(
    params?: {
      page?: number
      limit?: number
      type?: string
      isRead?: boolean
    },
    token?: string,
  ): Promise<{
    notifications: Array<InstructorNotification>
    total: number
    unreadCount: number
  }> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await apiClient.get(
      `/instructor/notifications?${searchParams}`,
      { token },
    )
    return (
      response as {
        data: {
          notifications: Array<InstructorNotification>
          total: number
          unreadCount: number
        }
      }
    ).data
  }

  async markNotificationAsRead(
    notificationId: string,
    token?: string,
  ): Promise<void> {
    await apiClient.patch(
      `/instructor/notifications/${notificationId}/read`,
      undefined,
      { token },
    )
  }

  async markAllNotificationsAsRead(token?: string): Promise<void> {
    await apiClient.patch('/instructor/notifications/read-all', undefined, {
      token,
    })
  }

  async getMessageThreads(
    params?: {
      page?: number
      limit?: number
      status?: string
      courseId?: string
    },
    token?: string,
  ): Promise<{
    threads: Array<MessageThread>
    total: number
    unreadCount: number
  }> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await apiClient.get(
      `/instructor/messages/threads?${searchParams}`,
      { token },
    )
    return (
      response as {
        data: {
          threads: Array<MessageThread>
          total: number
          unreadCount: number
        }
      }
    ).data
  }

  async getMessages(
    threadId: string,
    params?: {
      page?: number
      limit?: number
    },
    token?: string,
  ): Promise<{
    messages: Array<InstructorMessage>
    total: number
  }> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await apiClient.get(
      `/instructor/messages/${threadId}?${searchParams}`,
      { token },
    )
    return (
      response as {
        data: {
          messages: Array<InstructorMessage>
          total: number
        }
      }
    ).data
  }

  async sendMessage(
    threadId: string,
    content: string,
    attachments?: Array<File>,
    token?: string,
  ): Promise<InstructorMessage> {
    const formData = new FormData()
    formData.append('content', content)

    if (attachments) {
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
    }

    const response = await apiClient.post(
      `/instructor/messages/${threadId}`,
      formData,
      {
        token,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return (response as { data: InstructorMessage }).data
  }

  async sendBulkMessage(
    data: {
      subject: string
      content: string
      recipients: Array<{
        type: 'course' | 'student'
        id: string
      }>
      courseId?: string
    },
    token?: string,
  ): Promise<void> {
    await apiClient.post('/instructor/messages/bulk', data, { token })
  }

  // WebSocket connection for real-time updates
  connectToRealTimeUpdates(callbacks: {
    onVideoProcessingUpdate?: (status: VideoProcessingStatus) => void
    onNewNotification?: (notification: InstructorNotification) => void
    onNewMessage?: (message: InstructorMessage) => void
    onBulkOperationUpdate?: (operation: BulkOperation) => void
    onStudentActivity?: (activity: unknown) => void
  }): WebSocket | null {
    if (typeof window === 'undefined') return null

    try {
      const ws = new WebSocket(
        `${process.env.VITE_WS_URL ?? 'ws://localhost:8080'}/instructor/ws`,
      )

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as {
            type: string
            payload: unknown
          }

          switch (data.type) {
            case 'video_processing_update':
              callbacks.onVideoProcessingUpdate?.(
                data.payload as VideoProcessingStatus,
              )
              break
            case 'new_notification':
              callbacks.onNewNotification?.(
                data.payload as InstructorNotification,
              )
              break
            case 'new_message':
              callbacks.onNewMessage?.(data.payload as InstructorMessage)
              break
            case 'bulk_operation_update':
              callbacks.onBulkOperationUpdate?.(data.payload as BulkOperation)
              break
            case 'student_activity':
              callbacks.onStudentActivity?.(data.payload)
              break
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onopen = () => {
        console.log('Instructor dashboard WebSocket connected')
      }

      ws.onclose = () => {
        console.log('Instructor dashboard WebSocket disconnected')
      }

      ws.onerror = (error) => {
        console.error('Instructor dashboard WebSocket error:', error)
      }

      return ws
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      return null
    }
  }
}

export const instructorDashboardService =
  InstructorDashboardService.getInstance()
