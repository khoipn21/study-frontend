// Selected shared types for frontend usage (matching FRONTEND_API.md)

export type Role = 'student' | 'instructor' | 'admin'

export type User = {
  id: string
  username: string
  email: string
  role: Role
}

export type AuthResponse = {
  user: User
  token: string
}

export type Paged<T> = {
  total: number
  page: number
  page_size?: number
  total_pages?: number
  limit?: number
  items?: Array<T> // for generic local helpers
}

export type Course = {
  id: string
  title: string
  description?: string
  instructor_id?: string
  instructor_name?: string
  category?: string
  level?: string
  price?: number
  currency?: string
  thumbnail_url?: string
  status?: string
  duration_minutes?: number
  enrollment_count?: number
  rating?: number
  rating_count?: number
  tags?: Array<string>
  created_at?: string
  updated_at?: string
  // Enhanced marketplace fields
  is_free?: boolean
  access_type?: 'free' | 'paid' | 'subscription'
  original_price?: number
  discount_percentage?: number
  preview_duration_minutes?: number
  preview_video_url?: string
  is_featured?: boolean
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  language?: string
  subtitles?: Array<string>
  requirements?: Array<string>
  learning_outcomes?: Array<string>
  total_lectures?: number
  total_quizzes?: number
  total_assignments?: number
  certificate_available?: boolean
  lifetime_access?: boolean
  mobile_access?: boolean
  completion_rate?: number
  average_completion_time_hours?: number
}

export type CourseAccess = {
  user_id: string
  course_id: string
  access_level: 'none' | 'preview' | 'full'
  access_expires_at?: string
  purchase_id?: string
  subscription_id?: string
  granted_at: string
  last_accessed?: string
}

export type CoursePurchase = {
  id: string
  user_id: string
  course_id: string
  purchase_type: 'course' | 'subscription'
  amount: number
  currency: string
  payment_provider: 'lemon_squeezy'
  payment_id: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  purchased_at: string
  refunded_at?: string
  expires_at?: string
}

export type CourseFilter = {
  category?: Array<string>
  level?: Array<string>
  price_range?: {
    min: number
    max: number
  }
  duration_range?: {
    min: number
    max: number
  }
  rating_min?: number
  access_type?: Array<'free' | 'paid' | 'subscription'>
  language?: Array<string>
  has_certificate?: boolean
  is_featured?: boolean
  instructor_id?: string
  search_query?: string
  sort_by?:
    | 'popularity'
    | 'rating'
    | 'price_low'
    | 'price_high'
    | 'newest'
    | 'duration'
}

export type CourseSearchResult = {
  courses: Array<Course>
  total: number
  page: number
  page_size: number
  total_pages: number
  filters_applied: CourseFilter
}

export type Lecture = {
  id: string
  course_id: string
  title: string
  description?: string
  order_number?: number
  duration_minutes?: number
  video_url?: string
  video_id?: string
  status?: string
  is_free?: boolean
  resources?: Array<{
    id: string
    filename: string
    original_name: string
    file_type: string
    file_size: number
    download_url: string
    is_public: boolean
    resource_type: string
    uploaded_at: string
  }>
  created_at?: string
  updated_at?: string
}

export type Video = {
  id: string
  cloudflare_uid: string
  title: string
  description?: string
  duration_seconds?: number
  file_size_bytes?: number
  upload_user_id: string
  course_id?: string
  lecture_id?: string
  status?: string
  visibility?: string
  thumbnail_url?: string
  stream_url?: string
  preview_url?: string
  metadata?: any
  created_at?: string
  updated_at?: string
}

export type Enrollment = {
  id: string
  user_id: string
  course_id: string
  status?: string
  progress_percentage?: number
  completed_lectures?: number
  total_lectures?: number
  total_watch_time_seconds?: number
  enrolled_at?: string
  last_accessed?: string
  completed_at?: string
  created_at?: string
  updated_at?: string
}
