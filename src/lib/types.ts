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
