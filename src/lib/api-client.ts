import { config } from './config'
import type { AuthResponse, Course, Enrollment, Lecture, Video } from './types'

// Choose implementation (mock or real)

type GatewayResponse<T> = {
  success: boolean
  message: string
  data?: T
  error?: string
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
  const headers: HeadersInit = { ...(opts.headers || {}) }
  // Only set JSON content-type when we actually send a JSON body
  const hasBody = typeof opts.body !== 'undefined' && !(opts.body instanceof FormData)
  if (hasBody) headers['Content-Type'] = 'application/json'
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`

  const res = await fetch(url, { ...opts, headers })
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await res.json() : await res.text()

  if (!res.ok) {
    const msg = isJson && body?.message ? body.message : res.statusText
    throw new ApiError(msg || 'Request failed', res.status)
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
    if (params.page) search.set('page', String(params.page))
    if (params.page_size) search.set('page_size', String(params.page_size))
    if (params.q) search.set('q', params.q)
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
    if (params.page) search.set('page', String(params.page))
    if (params.page_size) search.set('page_size', String(params.page_size))
    const qs = search.toString()
    return requestGateway<{
        lectures: Array<Lecture>
        total: number
        page: number
        page_size: number
        total_pages: number
      }>(`/courses/${courseId}/lectures${qs ? `?${qs}` : ''}`)
  },

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
    if (params.page) search.set('page', String(params.page))
    if (params.page_size) search.set('page_size', String(params.page_size))
    const qs = search.toString()
    return requestGateway<{
        enrollments: Array<Enrollment>
        total: number
        page: number
        page_size: number
        total_pages: number
      }>(`/enrollments${qs ? `?${qs}` : ''}`, { token })
  },

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
  deleteCourse: (token: string, id: string) =>
    requestGateway<null>(`/courses/${id}`, { method: 'DELETE', token }),
  createLecture: (
    token: string,
    payload: { course_id: string; title: string; description?: string; order_number?: number; duration_minutes?: number; video_url?: string; video_id?: string; is_free?: boolean },
  ) =>
    requestGateway<Lecture>('/courses/lectures', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  // Video (proxied)
  getVideo: (videoId: string) => request<any>(`/videos/${videoId}`),
  listCourseVideos: (courseId: string) => request<any>(`/videos/course/${courseId}`),
  // Progress
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
    request<GatewayResponse<any>>('/progress/update', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  getLectureProgress: (token: string, courseId: string, lectureId: string) =>
    request<GatewayResponse<any>>(
      `/progress/courses/${courseId}/lectures/${lectureId}`,
      { token },
    ),
  getCourseProgress: (token: string, courseId: string) =>
    request<GatewayResponse<any>>(`/progress/courses/${courseId}`, { token }),
  getCourseCompletion: (token: string, courseId: string) =>
    request<GatewayResponse<any>>(`/progress/courses/${courseId}/completion`, {
      token,
    }),
  completeLecture: (
    token: string,
    payload: { course_id: string; lecture_id: string; watch_time_seconds: number },
  ) =>
    request<GatewayResponse<any>>('/progress/lectures/complete', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  // Analytics
  getUserAnalytics: (token: string) =>
    request<GatewayResponse<any>>('/analytics/user', { token }),

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
      return r.json()
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
    return request<any>(`/files${qs ? `?${qs}` : ''}`, { token })
  },
  deleteFile: (token: string, fileId: string) =>
    request<any>(`/files/${fileId}`, { method: 'DELETE', token }),
  getFileMetadata: (token: string, fileId: string) =>
    request<any>(`/files/${fileId}/metadata`, { token }),
  startMultipart: (
    token: string,
    payload: { filename: string; content_type?: string; bucket?: string },
  ) =>
    request<any>('/files/upload/start', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  getMultipartUrls: (
    token: string,
    uploadId: string,
    payload: { part_numbers: Array<number> },
  ) =>
    request<any>(`/files/upload/${uploadId}/parts`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  completeMultipart: (
    token: string,
    uploadId: string,
    payload: { parts: Array<{ part_number: number; etag: string }> },
  ) =>
    request<any>(`/files/upload/${uploadId}/complete`, {
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
    return request<any>(`/forum/topics${qs ? `?${qs}` : ''}`)
  },
  getTopic: (topicId: string) => request<any>(`/forum/topics/${topicId}`),
  listTopicPosts: (
    topicId: string,
    params: Record<string, string | number | undefined> = {},
  ) => {
    const s = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) s.set(k, String(v))
    })
    const qs = s.toString()
    return request<any>(`/forum/topics/${topicId}/posts${qs ? `?${qs}` : ''}`)
  },
  createTopic: (token: string, payload: any) =>
    request<any>('/forum/topics', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  createPost: (token: string, payload: any) =>
    request<any>('/forum/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  // Payments
  createPaymentMethod: (token: string, payload: any) =>
    request<any>('/payments/methods', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  listPaymentMethods: (token: string) => request<any>('/payments/methods', { token }),
  setDefaultPaymentMethod: (token: string, methodId: string) =>
    request<any>(`/payments/methods/${methodId}/default`, { method: 'PUT', token }),
  deletePaymentMethod: (token: string, methodId: string) =>
    request<any>(`/payments/methods/${methodId}`, { method: 'DELETE', token }),
  purchaseCourse: (token: string, courseId: string, payload: any) =>
    request<any>(`/payments/purchase/course/${courseId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  listTransactions: (
    token: string,
    params: Record<string, string | number> = {},
  ) => {
    const s = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => s.set(k, String(v)))
    const qs = s.toString()
    return request<any>(`/payments/transactions${qs ? `?${qs}` : ''}`, { token })
  },
  listSubscriptions: (token: string) => request<any>('/payments/subscriptions', { token }),
  createSubscription: (token: string, payload: any) =>
    request<any>('/payments/subscriptions', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  updateSubscription: (token: string, subscriptionId: string, payload: any) =>
    request<any>(`/payments/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      token,
    }),

  // Chatbot (REST)
  listChatSessions: (token: string, params: Record<string, string | number> = {}) => {
    const s = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => s.set(k, String(v)))
    const qs = s.toString()
    return request<any>(`/chat/sessions${qs ? `?${qs}` : ''}`, { token })
  },
  createChatSession: (token: string, payload: any) =>
    request<any>('/chat/sessions', { method: 'POST', body: JSON.stringify(payload), token }),
  sendChatMessage: (token: string, sessionId: string, payload: any) =>
    request<any>(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
}
