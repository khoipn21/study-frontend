import type { Stripe } from '@stripe/stripe-js'

// Core Stripe payment types
export interface StripePaymentIntent {
  id: string
  client_secret: string
  amount: number
  currency: string
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'requires_action'
    | 'processing'
    | 'requires_capture'
    | 'canceled'
    | 'succeeded'
  metadata: Record<string, string>
  created: number
}

export interface StripeCustomer {
  id: string
  email?: string
  name?: string
  metadata: Record<string, string>
}

export interface StripeProduct {
  id: string
  name: string
  description?: string
  images: Array<string>
  metadata: Record<string, string>
  active: boolean
  created: number
  updated: number
}

export interface StripePrice {
  id: string
  product: string | StripeProduct
  unit_amount: number
  currency: string
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year'
    interval_count: number
  }
  metadata: Record<string, string>
  active: boolean
  created: number
}

export interface StripeSubscription {
  id: string
  customer: string | StripeCustomer
  items: {
    data: Array<{
      id: string
      price: StripePrice
      quantity: number
    }>
  }
  status:
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid'
    | 'paused'
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  metadata: Record<string, string>
  created: number
}

// Course-specific payment types
export interface CoursePaymentData {
  courseId: string
  courseTitle: string
  coursePrice: number
  currency: string
  userId: string
  userEmail: string
  userName: string
  userRole?: string
}

export interface SubscriptionPaymentData {
  planName: string
  planId: string
  userId: string
  userEmail: string
  userName: string
  features: Array<string>
}

// Payment intent creation requests
export interface CreatePaymentIntentRequest {
  amount: number
  currency: string
  courseId: string
  userId: string
  userEmail: string
  automatic_payment_methods?: {
    enabled: boolean
  }
  metadata?: Record<string, string>
}

export interface CreateSubscriptionRequest {
  customerId: string
  priceId: string
  metadata?: Record<string, string>
  trial_period_days?: number
  expand?: Array<string>
}

// Payment form data types
export interface PaymentFormData {
  email: string
  name: string
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  phone?: string
}

export interface PaymentMethodData {
  type: 'card'
  card: {
    token?: string
  }
  billing_details: {
    email: string
    name: string
    phone?: string
    address?: {
      line1: string
      line2?: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  }
}

// Payment status types
export type PaymentStatus =
  | 'idle'
  | 'loading'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'

export interface PaymentState {
  status: PaymentStatus
  error: string | null
  paymentIntent: StripePaymentIntent | null
  isLoading: boolean
}

// Component prop types
export interface CoursePaymentButtonProps {
  courseId: string
  courseTitle: string
  price: number
  currency?: string
  originalPrice?: number
  discountPercentage?: number
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'default' | 'lg'
  disabled?: boolean
  onSuccess?: (paymentIntent: StripePaymentIntent) => void
  onError?: (error: string) => void
}

export interface StripePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  courseTitle: string
  price: number
  currency?: string
  originalPrice?: number
  onSuccess?: (paymentIntent: StripePaymentIntent) => void
  onError?: (error: string) => void
  className?: string
}

export interface PaymentFormProps {
  paymentIntent: StripePaymentIntent
  onSuccess: (paymentIntent: StripePaymentIntent) => void
  onError: (error: string) => void
  onProcessing?: () => void
  isLoading?: boolean
  className?: string
}

export interface EnrollmentStatusProps {
  courseId: string
  userId: string
  className?: string
}

export interface CourseAccessGuardProps {
  courseId: string
  children: React.ReactNode
  fallback?: React.ReactNode
  showPaymentPrompt?: boolean
}

// API response types
export interface StripeApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CreatePaymentIntentResponse {
  payment_intent_id: string
  client_secret: string
  amount: number
  currency: string
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'requires_action'
    | 'processing'
    | 'requires_capture'
    | 'canceled'
    | 'succeeded'
  customer_id: string
  transaction_id: string
  metadata?: Record<string, string>
}

export interface PaymentSuccessResponse {
  payment_intent: StripePaymentIntent
  enrollment: {
    id: string
    user_id: string
    course_id: string
    status: 'active'
    enrolled_at: string
  }
  transaction: {
    id: string
    amount: number
    currency: string
    status: 'completed'
    stripe_payment_intent_id: string
    created_at: string
  }
}

// Hook return types
export interface UseStripePaymentReturn {
  processPayment: (formData: PaymentFormData) => Promise<void>
  paymentState: PaymentState
  resetPayment: () => void
}

export interface UseEnrollmentStatusReturn {
  isEnrolled: boolean
  isLoading: boolean
  error: string | null
  enrollment: {
    id: string
    status: string
    enrolled_at: string
  } | null
  refetch: () => void
}

// Stripe Elements types
export interface StripeElementsOptions {
  stripe: Stripe | null
  options: {
    clientSecret?: string
    appearance?: {
      theme?: 'stripe' | 'night' | 'flat'
      variables?: Record<string, string>
    }
    fonts?: Array<{
      family: string
      src: string
    }>
    locale?: string
  }
}

// Error handling types
export interface StripeErrorDetails {
  type: string
  code?: string
  param?: string
  message: string
  decline_code?: string
  charge?: string
  payment_intent?: StripePaymentIntent
  payment_method?: {
    id: string
    type: string
  }
}

export interface PaymentError {
  type: 'stripe_error' | 'validation_error' | 'api_error' | 'network_error'
  message: string
  code?: string
  details?: StripeErrorDetails
}

// Webhook types for backend integration
export interface StripeWebhookEvent {
  id: string
  object: 'event'
  type: string
  data: {
    object: any
  }
  created: number
  livemode: boolean
  pending_webhooks: number
  request: {
    id: string | null
    idempotency_key: string | null
  }
}

export interface PaymentIntentWebhookData {
  id: string
  amount: number
  currency: string
  status: string
  customer?: string
  metadata: Record<string, string>
  charges: {
    data: Array<{
      id: string
      amount: number
      currency: string
      status: string
      receipt_email: string | null
    }>
  }
}

// Course access and enrollment types
export interface CourseAccessLevel {
  level: 'none' | 'preview' | 'full'
  expires_at?: string
  granted_at: string
}

export interface CourseEnrollment {
  id: string
  user_id: string
  course_id: string
  access_level: CourseAccessLevel['level']
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  stripe_payment_intent_id?: string
  stripe_subscription_id?: string
  enrolled_at: string
  expires_at?: string
  last_accessed?: string
}

// Configuration types
export interface StripeConfig {
  publishableKey: string
  // Note: apiVersion is handled by the backend, not needed for client-side configuration
  appearance: {
    theme: 'stripe' | 'night' | 'flat'
    variables: Record<string, string>
  }
  elementOptions: {
    style: {
      base: Record<string, string>
      invalid: Record<string, string>
    }
  }
}
