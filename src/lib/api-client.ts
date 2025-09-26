import { config } from './config'
import type {
  AuthResponse,
  Course,
  CoursePurchase,
  Enrollment,
  Lecture,
  Video,
} from './types'

// Choose implementation (mock or real)

type GatewayResponse<T> = {
  success: boolean
  message: string
  data?: T
  error?: string
}

type VideoData = {
  id: string
  filename: string
  url: string
  content_type: string
  size: number
  duration?: number
  thumbnail_url?: string
}

type ProgressData = {
  course_id: string
  lecture_id: string
  progress_percentage: number
  watch_time_seconds: number
  is_completed: boolean
  last_watched_at: string
}

type FileData = {
  id: string
  filename: string
  content_type: string
  size: number
  bucket: string
  is_public: boolean
  url: string
  metadata?: Record<string, unknown>
}

type UploadUrlData = {
  upload_url: string
  file_id: string
  expires_at: string
}

type MultipartUpload = {
  upload_id: string
  key: string
  bucket: string
}

type MultipartUrls = {
  urls: Array<{ part_number: number; url: string }>
}

type ForumTopic = {
  id: string
  title: string
  description?: string
  created_by: string
  created_at: string
  updated_at: string
  posts_count: number
}

type ForumPost = {
  id: string
  topic_id: string
  content: string
  created_by: string
  created_at: string
  updated_at: string
}

type PaymentMethod = {
  id: string
  type: string
  last_four?: string
  brand?: string
  is_default: boolean
  created_at: string
}

type Transaction = {
  id: string
  amount: number
  currency: string
  status: string
  description?: string
  created_at: string
}

type Subscription = {
  id: string
  plan_id: string
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
}

type ChatSession = {
  id: string
  title?: string
  created_at: string
  updated_at: string
  messages_count: number
}

type ChatMessage = {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

type StudentNote = {
  id: string
  user_id: string
  course_id: string
  lecture_id: string
  content: string
  video_timestamp?: number
  created_at: string
  updated_at: string
}

type AnalyticsData = {
  total_courses: number
  total_enrollments: number
  total_watch_time: number
  completion_rate: number
  revenue: number
  growth_metrics: Record<string, number>
}

export class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

// Low-level fetch wrapper
async function request<T>(
  path: string,
  opts: RequestInit & { token?: string } = {},
): Promise<T> {
  const url = `${config.apiBaseUrl}${path}`
  const headers: Record<string, string> = {}

  // Convert headers to Record<string, string>
  if (opts.headers) {
    if (opts.headers instanceof Headers) {
      for (const [key, value] of opts.headers.entries()) {
        headers[key] = value
      }
    } else if (typeof opts.headers === 'object') {
      Object.assign(headers, opts.headers)
    }
  }
  // Only set JSON content-type when we actually send a JSON body
  const hasBody =
    typeof opts.body !== 'undefined' && !(opts.body instanceof FormData)
  if (hasBody) headers['Content-Type'] = 'application/json'
  if (opts.token !== undefined && opts.token !== null && opts.token !== '')
    headers['Authorization'] = `Bearer ${opts.token}`

  const res = await fetch(url, { ...opts, headers })
  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const body: unknown = isJson ? await res.json() : await res.text()

  if (!res.ok) {
    const bodyWithMessage = body as { message?: string }
    const msg =
      isJson &&
      bodyWithMessage.message !== undefined &&
      bodyWithMessage.message !== null &&
      bodyWithMessage.message !== ''
        ? bodyWithMessage.message
        : res.statusText
    const error = new ApiError(msg ?? 'Request failed', res.status)

    // Handle 401 errors globally to trigger logout
    if (res.status === 401) {
      // Clear auth data on 401 errors
      if (typeof window !== 'undefined') {
        localStorage.removeItem('study.auth')
        // Trigger a custom event that the auth context can listen to
        window.dispatchEvent(new CustomEvent('auth:logout'))
      }
    }

    throw error
  }

  return body as T
}

// Wrapper for gateway-handled responses: throws on success=false
async function requestGateway<T>(
  path: string,
  opts: RequestInit & { token?: string } = {},
) {
  const res = await request<GatewayResponse<T>>(path, opts)
  if (!res.success) {
    const msg = res.error || res.message || 'Request failed'
    throw new ApiError(msg)
  }
  return res
}

// High-level API surface used by hooks/routes
export const api = {
  // Auth
  register: (payload: {
    username: string
    email: string
    password: string
    role?: 'student' | 'instructor' | 'admin'
  }) =>
    requestGateway<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    requestGateway<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  profile: (token: string) =>
    request<{ id: string; roles: Array<string> }>('/auth/profile', { token }),

  // Courses
  listCourses: (
    params: { page?: number; page_size?: number; q?: string } = {},
  ) => {
    const search = new URLSearchParams()
    if (params.page !== undefined) search.set('page', String(params.page))
    if (params.page_size !== undefined)
      search.set('page_size', String(params.page_size))
    if (params.q !== undefined && params.q !== '') search.set('q', params.q)
    const qs = search.toString()
    return requestGateway<{
      courses: Array<Course>
      total: number
      page: number
      page_size: number
      total_pages: number
    }>(`/courses${qs ? `?${qs}` : ''}`)
  },

  getCourse: (id: string) => requestGateway<Course>(`/courses/${id}`),

  listLectures: (
    courseId: string,
    params: { page?: number; page_size?: number } = {},
  ) => {
    const search = new URLSearchParams()
    if (params.page !== undefined) search.set('page', String(params.page))
    if (params.page_size !== undefined)
      search.set('page_size', String(params.page_size))
    const qs = search.toString()
    return requestGateway<{
      lectures: Array<Lecture>
      total: number
      page: number
      page_size: number
      total_pages: number
    }>(`/courses/${courseId}/lectures${qs ? `?${qs}` : ''}`)
  },

  getLecture: (lectureId: string) =>
    requestGateway<Lecture>(`/courses/lectures/${lectureId}`),

  enroll: (token: string, courseId: string) =>
    requestGateway<Enrollment>(`/courses/${courseId}/enroll`, {
      method: 'POST',
      token,
    }),

  // Enrollments
  listEnrollments: (
    token: string,
    params: { page?: number; page_size?: number } = {},
  ) => {
    const search = new URLSearchParams()
    if (params.page !== undefined) search.set('page', String(params.page))
    if (params.page_size !== undefined)
      search.set('page_size', String(params.page_size))
    const qs = search.toString()
    return requestGateway<{
      enrollments: Array<Enrollment>
      total: number
      page: number
      page_size: number
      total_pages: number
    }>(`/enrollments${qs ? `?${qs}` : ''}`, { token })
  },

  // My enrolled courses (for academic dashboard)
  getMyEnrolledCourses: (token: string) =>
    requestGateway<{
      courses: Array<
        Course & {
          enrollment: Enrollment
          progress: number
          last_accessed?: string
          next_lecture_id?: string
        }
      >
    }>('/enrollments/my-courses', { token }),

  // Course access control
  checkCourseAccess: (token: string, courseId: string) =>
    requestGateway<{
      has_access: boolean
      access_level: 'none' | 'preview' | 'full'
      enrollment?: Enrollment
      purchase?: CoursePurchase
    }>(`/courses/${courseId}/access`, { token }),

  // Video streaming
  getLectureStream: (token: string, lectureId: string) =>
    requestGateway<{
      stream_url: string
      video_data: Video
    }>(`/lectures/${lectureId}/stream`, { token }),

  // Course management (instructor)
  createCourse: (
    token: string,
    payload: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>> & {
      title: string
      description?: string
      instructor_id: string
      price?: number
      currency?: string
    },
  ) =>
    requestGateway<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  updateCourse: (token: string, id: string, payload: Partial<Course>) =>
    requestGateway<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      token,
    }),
  updateCourseWithFile: (token: string, id: string, formData: FormData) =>
    fetch(`${config.apiBaseUrl}/courses/${id}/upload`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(async (r) => {
      if (!r.ok) throw new ApiError(r.statusText, r.status)
      const response = (await r.json()) as GatewayResponse<Course>
      if (!response.success) {
        throw new ApiError(
          response.error || response.message || 'Request failed',
        )
      }
      return response
    }),
  deleteCourse: (token: string, id: string) =>
    requestGateway<null>(`/courses/${id}`, { method: 'DELETE', token }),
  createLecture: (
    token: string,
    payload: {
      course_id: string
      title: string
      description?: string
      order_number?: number
      duration_minutes?: number
      video_url?: string
      video_id?: string
      is_free?: boolean
    },
  ) =>
    requestGateway<Lecture>('/courses/lectures', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  // Video (proxied)
  getVideo: (token: string, videoId: string) =>
    request<VideoData>(`/videos/${videoId}`, { token }),
  listCourseVideos: (courseId: string) =>
    request<{ videos: Array<VideoData> }>(`/videos/course/${courseId}`),
  getVideoUploadUrl: (token: string, filename: string, size: number) =>
    request<UploadUrlData>('/videos/upload-url', {
      method: 'POST',
      token,
      body: JSON.stringify({ filename, size }),
    }),
  // Progress tracking
  trackProgress: (
    token: string,
    payload: {
      course_id: string
      lecture_id: string
      progress_percentage: number
      watch_time_seconds: number
      is_completed: boolean
    },
  ) =>
    request<GatewayResponse<ProgressData>>('/progress/track', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  updateProgress: (
    token: string,
    payload: {
      course_id: string
      lecture_id: string
      progress_percentage: number
      watch_time_seconds: number
      is_completed: boolean
    },
  ) =>
    request<GatewayResponse<ProgressData>>('/progress/update', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  getLectureProgress: (token: string, courseId: string, lectureId: string) =>
    request<GatewayResponse<ProgressData>>(
      `/progress/courses/${courseId}/lectures/${lectureId}`,
      { token },
    ),
  getCourseProgress: (token: string, courseId: string) =>
    request<GatewayResponse<{ progress: Array<ProgressData> }>>(
      `/progress/courses/${courseId}`,
      { token },
    ),
  getCourseCompletion: (token: string, courseId: string) =>
    request<
      GatewayResponse<{
        completion_rate: number
        completed_lectures: number
        total_lectures: number
      }>
    >(`/progress/courses/${courseId}/completion`, {
      token,
    }),
  completeLecture: (
    token: string,
    payload: {
      course_id: string
      lecture_id: string
      watch_time_seconds: number
    },
  ) =>
    request<GatewayResponse<ProgressData>>('/progress/lectures/complete', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  // Analytics
  getUserAnalytics: (token: string) =>
    request<GatewayResponse<AnalyticsData>>('/analytics/user', { token }),

  // Files (Bucket)
  uploadFile: (
    token: string,
    form: FormData, // include: file, bucket?, is_public?, metadata?
  ) =>
    fetch(`${config.apiBaseUrl}/files/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    }).then(async (r) => {
      if (!r.ok) throw new ApiError(r.statusText, r.status)
      return r.json() as Promise<FileData>
    }),
  listFiles: (
    token: string,
    params: {
      page?: number
      limit?: number
      bucket?: string
      content_type?: string
      search?: string
      is_public?: string
      sort?: string
      order?: string
    } = {},
  ) => {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (typeof v === 'number' || (typeof v === 'string' && v !== '')) {
        search.set(k, String(v))
      }
    })
    const qs = search.toString()
    return request<{
      files: Array<FileData>
      total: number
      page: number
      limit: number
    }>(`/files${qs ? `?${qs}` : ''}`, { token })
  },
  deleteFile: (token: string, fileId: string) =>
    request<{ success: boolean }>(`/files/${fileId}`, {
      method: 'DELETE',
      token,
    }),
  getFileMetadata: (token: string, fileId: string) =>
    request<{ metadata: Record<string, unknown> }>(
      `/files/${fileId}/metadata`,
      { token },
    ),
  startMultipart: (
    token: string,
    payload: { filename: string; content_type?: string; bucket?: string },
  ) =>
    request<MultipartUpload>('/files/upload/start', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  getMultipartUrls: (
    token: string,
    uploadId: string,
    payload: { part_numbers: Array<number> },
  ) =>
    request<MultipartUrls>(`/files/upload/${uploadId}/parts`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  completeMultipart: (
    token: string,
    uploadId: string,
    payload: { parts: Array<{ part_number: number; etag: string }> },
  ) =>
    request<FileData>(`/files/upload/${uploadId}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  // Forum
  listTopics: (params: Record<string, string | number | undefined> = {}) => {
    const s = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) s.set(k, String(v))
    })
    const qs = s.toString()
    return request<{
      topics: Array<ForumTopic>
      total: number
      page: number
      limit: number
    }>(`/forum/topics${qs ? `?${qs}` : ''}`)
  },
  getTopic: (topicId: string) =>
    request<ForumTopic>(`/forum/topics/${topicId}`),
  listTopicPosts: (
    topicId: string,
    params: Record<string, string | number | undefined> = {},
  ) => {
    const s = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) s.set(k, String(v))
    })
    const qs = s.toString()
    return request<{
      posts: Array<ForumPost>
      total: number
      page: number
      limit: number
    }>(`/forum/topics/${topicId}/posts${qs ? `?${qs}` : ''}`)
  },
  createTopic: (
    token: string,
    payload: Omit<
      ForumTopic,
      'id' | 'created_by' | 'created_at' | 'updated_at' | 'posts_count'
    >,
  ) =>
    request<ForumTopic>('/forum/topics', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  createPost: (
    token: string,
    payload: Omit<ForumPost, 'id' | 'created_by' | 'created_at' | 'updated_at'>,
  ) =>
    request<ForumPost>('/forum/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  // Payments
  createPaymentMethod: (
    token: string,
    payload: Omit<PaymentMethod, 'id' | 'is_default' | 'created_at'>,
  ) =>
    request<PaymentMethod>('/payments/methods', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  listPaymentMethods: (token: string) =>
    request<{ payment_methods: Array<PaymentMethod> }>('/payments/methods', {
      token,
    }),
  setDefaultPaymentMethod: (token: string, methodId: string) =>
    request<{ success: boolean }>(`/payments/methods/${methodId}/default`, {
      method: 'PUT',
      token,
    }),
  deletePaymentMethod: (token: string, methodId: string) =>
    request<{ success: boolean }>(`/payments/methods/${methodId}`, {
      method: 'DELETE',
      token,
    }),
  purchaseCourse: (
    token: string,
    courseId: string,
    payload: { payment_method_id: string; amount?: number },
  ) =>
    request<{ transaction: Transaction; enrollment: Enrollment }>(
      `/payments/purchase/course/${courseId}`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        token,
      },
    ),
  listTransactions: (
    token: string,
    params: Record<string, string | number> = {},
  ) => {
    const s = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => s.set(k, String(v)))
    const qs = s.toString()
    return request<{
      transactions: Array<Transaction>
      total: number
      page: number
      limit: number
    }>(`/payments/transactions${qs ? `?${qs}` : ''}`, {
      token,
    })
  },
  listSubscriptions: (token: string) =>
    request<{ subscriptions: Array<Subscription> }>('/payments/subscriptions', {
      token,
    }),
  createSubscription: (
    token: string,
    payload: { plan_id: string; payment_method_id?: string },
  ) =>
    request<Subscription>('/payments/subscriptions', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  updateSubscription: (
    token: string,
    subscriptionId: string,
    payload: Partial<Pick<Subscription, 'cancel_at_period_end'>>,
  ) =>
    request<Subscription>(`/payments/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      token,
    }),

  // Chatbot (REST)
  listChatSessions: (
    token: string,
    params: Record<string, string | number> = {},
  ) => {
    const s = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => s.set(k, String(v)))
    const qs = s.toString()
    return request<{
      sessions: Array<ChatSession>
      total: number
      page: number
      limit: number
    }>(`/chat/sessions${qs ? `?${qs}` : ''}`, { token })
  },
  createChatSession: (
    token: string,
    payload: { title?: string; context?: Record<string, unknown> },
  ) =>
    request<ChatSession>('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  sendChatMessage: (
    token: string,
    sessionId: string,
    payload: { content: string; role?: 'user' },
  ) =>
    request<ChatMessage>(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  // Student Notes
  createNote: (
    token: string,
    payload: {
      course_id: string
      lecture_id: string
      content: string
      video_timestamp?: number
    },
  ) =>
    request<StudentNote>('/notes', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  getLectureNotes: (token: string, courseId: string, lectureId: string) =>
    request<{ notes: Array<StudentNote> }>(
      `/notes/courses/${courseId}/lectures/${lectureId}`,
      {
        token,
      },
    ),

  updateNote: (token: string, noteId: string, content: string) =>
    request<StudentNote>(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
      token,
    }),

  deleteNote: (token: string, noteId: string) =>
    request<{ success: boolean }>(`/notes/${noteId}`, {
      method: 'DELETE',
      token,
    }),
}

// Enhanced API client with automatic token injection and better error handling
class ApiClient {
  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    try {
      const auth = localStorage.getItem('study.auth')
      if (auth === null || auth === undefined || auth === '') return null
      const parsed = JSON.parse(auth) as { token?: string }
      return parsed.token ?? null
    } catch {
      return null
    }
  }

  private isTokenValid(token: string | null): boolean {
    if (token === null || token === undefined || token === '') return false
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return false
      const payload = JSON.parse(atob(parts[1])) as { exp?: number }
      const now = Math.floor(Date.now() / 1000)
      return Boolean(
        payload.exp !== undefined &&
          payload.exp !== null &&
          payload.exp > now + 60,
      )
    } catch {
      return false
    }
  }

  private getAuthToken(providedToken?: string): string | null {
    const token = providedToken ?? this.getStoredToken()

    // Validate token and clear if invalid
    if (
      token !== null &&
      token !== undefined &&
      token !== '' &&
      !this.isTokenValid(token)
    ) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('study.auth')
        window.dispatchEvent(new CustomEvent('auth:logout'))
      }
      return null
    }

    return token
  }

  async get<T = unknown>(
    path: string,
    options: { token?: string } = {},
  ): Promise<T> {
    const token = this.getAuthToken(options.token)
    return request<T>(path, { method: 'GET', token: token ?? undefined })
  }

  async post<T = unknown>(
    path: string,
    data?: unknown,
    options: {
      token?: string
      headers?: Record<string, string>
      onUploadProgress?: (progressEvent: unknown) => void
    } = {},
  ): Promise<T> {
    const token = this.getAuthToken(options.token)
    const body = data instanceof FormData ? data : JSON.stringify(data)

    const requestOptions: RequestInit & {
      token?: string
      onUploadProgress?: unknown
    } = {
      method: 'POST',
      body,
      headers: options.headers,
      token: token ?? undefined,
    }

    if (options.onUploadProgress) {
      requestOptions.onUploadProgress = options.onUploadProgress
    }

    return request<T>(path, requestOptions)
  }

  async put<T = unknown>(
    path: string,
    data?: unknown,
    options: { token?: string } = {},
  ): Promise<T> {
    const token = this.getAuthToken(options.token)
    return request<T>(path, {
      method: 'PUT',
      body:
        data !== undefined && data !== null ? JSON.stringify(data) : undefined,
      token: token ?? undefined,
    })
  }

  async patch<T = unknown>(
    path: string,
    data?: unknown,
    options: { token?: string } = {},
  ): Promise<T> {
    const token = this.getAuthToken(options.token)
    return request<T>(path, {
      method: 'PATCH',
      body:
        data !== undefined && data !== null ? JSON.stringify(data) : undefined,
      token: token ?? undefined,
    })
  }

  async delete<T = unknown>(
    path: string,
    options: { token?: string } = {},
  ): Promise<T> {
    const token = this.getAuthToken(options.token)
    return request<T>(path, { method: 'DELETE', token: token ?? undefined })
  }
}

// Create singleton instance for instructor dashboard
export const apiClient = new ApiClient()
