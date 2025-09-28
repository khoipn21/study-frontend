// Extended types for Course Management System
import type { Course } from './types'

// Wizard Step Types
export interface WizardStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
  isComplete: boolean
  isActive: boolean
  isValid?: boolean
}

export interface WizardState {
  currentStep: number
  formData: Partial<Course>
  isSubmitting: boolean
  canProceed: boolean
  errors: Record<string, Array<string>>
}

// Course Creation Form Data
export interface CourseCreationData {
  // Step 1: Basic Information
  title: string
  description: string
  category: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  price: number
  currency: 'VND' | 'USD'
  thumbnail_url?: string

  // Step 2: Course Details
  learning_outcomes: Array<string>
  requirements: Array<string>
  language: string
  tags: Array<string>
  estimated_duration_hours: number

  // Step 3: Course Settings
  status: 'draft' | 'published' | 'under_review'
  start_date?: string
  end_date?: string
  max_students?: number
  auto_approve_enrollment: boolean
  allow_previews: boolean
  has_certificate: boolean
  mobile_access: boolean

  // Step 4: Lectures
  lectures: Array<LectureCreationData>

  // Step 5: Resources (Global/Course-level resources)
  resources: Array<CourseResource>

  // Step 6: Videos
  videos: Array<ProcessedVideo>
}

// Lecture Management
export interface LectureCreationData {
  id?: string
  title: string
  description?: string
  type: 'video' | 'quiz' | 'reading' | 'assignment'
  order_number: number
  duration_minutes?: number
  is_free: boolean
  video_id?: string
  quiz_data?: QuizData
  reading_content?: string
  assignment_data?: AssignmentData
  resources?: Array<CourseResource>
}

export interface QuizData {
  questions: Array<QuizQuestion>
  passing_score: number
  time_limit_minutes?: number
  attempts_allowed: number
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: Array<string>
  correct_answer: string | Array<string>
  explanation?: string
  points: number
}

export interface AssignmentData {
  title: string
  description: string
  instructions: string
  submission_format: 'text' | 'file' | 'url'
  max_file_size_mb?: number
  allowed_file_types?: Array<string>
  due_date?: string
  points: number
}

// Resource Management
export interface CourseResource {
  id: string
  filename: string
  original_name: string
  file_type: string
  file_size: number
  download_url: string
  is_public: boolean
  folder_path?: string
  description?: string
  uploaded_at: string
}

// Video Upload Management
export interface VideoUpload {
  id: string
  file: File
  filename: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  cloudflare_id?: string
  thumbnail_url?: string
  duration_seconds?: number
  error_message?: string
  lecture_id?: string
}

export interface ProcessedVideo {
  id: string
  cloudflare_id: string
  filename: string
  thumbnail_url: string
  duration_seconds: number
  file_size: number
  status: 'ready' | 'processing' | 'error'
  stream_url: string
  preview_url?: string
}

// Data Table Types
export interface CourseTableData extends Course {
  instructor_name: string
  enrollment_count: number
  revenue: number
  last_updated: string
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface TableState {
  sorting: SortingState
  columnFilters: ColumnFiltersState
  rowSelection: Record<string, boolean>
  pagination: PaginationState
}

// Import from @tanstack/react-table
type SortingState = Array<{
  id: string
  desc: boolean
}>

type ColumnFiltersState = Array<{
  id: string
  value: unknown
}>

type PaginationState = {
  pageIndex: number
  pageSize: number
}

// Dashboard Analytics
export interface InstructorStats {
  totalCourses: number
  totalStudents: number
  totalRevenue: number
  averageRating: number
  coursesPublished: number
  coursesDraft: number
  monthlyRevenue: Array<number>
  enrollmentTrends: Array<{
    month: string
    enrollments: number
  }>
  topCourses: Array<{
    id: string
    title: string
    enrollments: number
    revenue: number
    rating: number
  }>
}

export interface StudentStats {
  enrolledCourses: number
  completedCourses: number
  totalWatchTime: number
  averageProgress: number
  certificates: number
  streakDays: number
  recentActivity: Array<{
    type: 'enrollment' | 'completion' | 'progress'
    course_title: string
    timestamp: string
  }>
}

// Search and Filtering
export interface CourseSearchParams {
  query?: string
  category?: Array<string>
  difficulty_level?: Array<string>
  price_range?: [number, number]
  duration_range?: [number, number]
  rating_min?: number
  is_free?: boolean
  has_certificate?: boolean
  language?: Array<string>
  instructor_id?: string
  page?: number
  page_size?: number
  sort_by?:
    | 'popularity'
    | 'rating'
    | 'price_low'
    | 'price_high'
    | 'newest'
    | 'duration'
  sort_order?: 'asc' | 'desc'
}

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface FilterGroup {
  label: string
  key: keyof CourseSearchParams
  type: 'checkbox' | 'range' | 'select' | 'radio'
  options?: Array<FilterOption>
  min?: number
  max?: number
}

// Course Management Actions
export interface CourseAction {
  type:
    | 'edit'
    | 'delete'
    | 'publish'
    | 'unpublish'
    | 'duplicate'
    | 'analytics'
    | 'students'
  label: string
  icon: React.ComponentType
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  requiresConfirmation?: boolean
  confirmationMessage?: string
}

// Form Validation Schemas (Zod)
export interface ValidationError {
  field: string
  message: string
}

export interface StepValidation {
  isValid: boolean
  errors: Array<ValidationError>
  warnings?: Array<ValidationError>
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Array<ValidationError>
}

export interface PaginatedResponse<T> {
  data: Array<T>
  total: number
  page: number
  page_size: number
  total_pages: number
}

// Upload Types
export interface FileUploadProgress {
  fileId: string
  filename: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

export interface CloudflareStreamResponse {
  uid: string
  thumbnail: string
  playback: {
    hls: string
    dash: string
  }
  status: {
    state:
      | 'pendingupload'
      | 'downloading'
      | 'queued'
      | 'inprogress'
      | 'ready'
      | 'error'
    pctComplete: string
    errorReasonCode?: string
    errorReasonText?: string
  }
  meta: {
    name: string
    [key: string]: any
  }
  created: string
  modified: string
  size?: number
  preview?: string
  duration?: number
}

// UI Component Types
export interface CourseCardProps {
  course: Course
  variant?: 'default' | 'compact' | 'featured'
  showInstructor?: boolean
  showProgress?: boolean
  showPricing?: boolean
  onEnroll?: (course: Course) => void
  onPreview?: (course: Course) => void
  onEdit?: (course: Course) => void
  onDelete?: (courseId: string) => void
}

export interface ResponsiveLayoutProps {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  getGridCols: (mobile: number, tablet: number, desktop: number) => number
}

// Theme and Styling
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    destructive: string
    muted: string
    background: string
    foreground: string
  }
  fonts: {
    sans: Array<string>
    mono: Array<string>
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
}

// Loading States
export interface LoadingState {
  isLoading: boolean
  error?: string
  retryCount: number
  lastRetryAt?: string
}

export interface AsyncState<T> extends LoadingState {
  data?: T
  isSuccess: boolean
  isError: boolean
}

// Form Hook Types
export interface UseFormReturn<T> {
  register: any
  handleSubmit: any
  watch: any
  setValue: any
  getValues: any
  formState: {
    errors: Record<keyof T, any>
    isSubmitting: boolean
    isValid: boolean
    isDirty: boolean
    touchedFields: Record<keyof T, boolean>
    dirtyFields: Record<keyof T, boolean>
  }
  reset: (values?: Partial<T>) => void
  trigger: (fields?: keyof T | Array<keyof T>) => Promise<boolean>
}

// Payment Integration
export interface LemonSqueezyProduct {
  id: string
  name: string
  description: string
  price: number
  currency: string
  checkout_url: string
}

export interface PaymentIntent {
  id: string
  course_id: string
  user_id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed'
  payment_method: string
  created_at: string
}

// Error Handling
export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export interface GlobalError {
  id: string
  type: 'network' | 'validation' | 'permission' | 'unknown'
  message: string
  details?: any
  timestamp: string
  context?: {
    route: string
    user_id?: string
    action?: string
  }
}

// Accessibility
export interface A11yProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  role?: string
  tabIndex?: number
}

export interface KeyboardNavigation {
  onKeyDown: (event: React.KeyboardEvent) => void
  focusableElements: Array<HTMLElement>
  currentFocusIndex: number
}
