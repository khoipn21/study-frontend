import { config } from './config'
import { ApiError } from './api-client'
import type {
  CourseEnrollment,
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  CreateSubscriptionRequest,
  PaymentSuccessResponse,
  StripeApiResponse,
  StripeCustomer,
  StripePaymentIntent,
  StripePrice,
  StripeProduct,
  StripeSubscription,
} from './stripe-types'

// Low-level request wrapper with Stripe-specific error handling
async function stripeRequest<T>(
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
    const bodyWithMessage = body as { message?: string; error?: string }
    const msg =
      isJson &&
      (bodyWithMessage.message !== undefined ||
        bodyWithMessage.error !== undefined)
        ? bodyWithMessage.message || bodyWithMessage.error
        : res.statusText

    const error = new ApiError(msg ?? 'Request failed', res.status)

    // Handle 401 errors globally to trigger logout
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('study.auth')
        window.dispatchEvent(new CustomEvent('auth:logout'))
      }
    }

    throw error
  }

  return body as T
}

// Wrapper for Stripe API responses
async function stripeApiRequest<T>(
  path: string,
  opts: RequestInit & { token?: string } = {},
): Promise<T> {
  const res = await stripeRequest<StripeApiResponse<T>>(path, opts)
  if (!res.success) {
    const msg = res.error || res.message || 'Stripe API request failed'
    throw new ApiError(msg)
  }
  if (!res.data) {
    throw new ApiError('No data returned from Stripe API')
  }
  return res.data
}

// High-level Stripe API methods
export const stripeApi = {
  // Payment Intents
  createPaymentIntent: (
    token: string,
    payload: CreatePaymentIntentRequest,
  ): Promise<CreatePaymentIntentResponse> =>
    stripeApiRequest<CreatePaymentIntentResponse>(
      '/payments/stripe/payment-intents',
      {
        method: 'POST',
        body: JSON.stringify(payload),
        token,
      },
    ),

  getPaymentIntent: (
    token: string,
    paymentIntentId: string,
  ): Promise<StripePaymentIntent> =>
    stripeApiRequest<StripePaymentIntent>(
      `/payments/stripe/payment-intents/${paymentIntentId}`,
      {
        token,
      },
    ),

  confirmPaymentIntent: (
    token: string,
    paymentIntentId: string,
    payload: { payment_method_id: string },
  ): Promise<StripePaymentIntent> =>
    stripeApiRequest<StripePaymentIntent>(
      `/payments/stripe/payment-intents/${paymentIntentId}/confirm`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        token,
      },
    ),

  // Course Purchase
  purchaseCourseWithStripe: (
    token: string,
    courseId: string,
    payload: {
      payment_method_id?: string
      payment_intent_id?: string
      amount?: number
    },
  ): Promise<PaymentSuccessResponse> =>
    stripeApiRequest<PaymentSuccessResponse>(
      `/payments/stripe/purchase/course/${courseId}`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        token,
      },
    ),

  // Customer Management
  createCustomer: (
    token: string,
    payload: {
      email: string
      name?: string
      phone?: string
      metadata?: Record<string, string>
    },
  ): Promise<StripeCustomer> =>
    stripeApiRequest<StripeCustomer>('/payments/stripe/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  getCustomer: (token: string, customerId: string): Promise<StripeCustomer> =>
    stripeApiRequest<StripeCustomer>(
      `/payments/stripe/customers/${customerId}`,
      {
        token,
      },
    ),

  updateCustomer: (
    token: string,
    customerId: string,
    payload: Partial<{
      email: string
      name: string
      phone: string
      metadata: Record<string, string>
    }>,
  ): Promise<StripeCustomer> =>
    stripeApiRequest<StripeCustomer>(
      `/payments/stripe/customers/${customerId}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
        token,
      },
    ),

  // Products and Prices
  createProduct: (
    token: string,
    payload: {
      name: string
      description?: string
      images?: Array<string>
      metadata?: Record<string, string>
    },
  ): Promise<StripeProduct> =>
    stripeApiRequest<StripeProduct>('/payments/stripe/products', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  getProduct: (token: string, productId: string): Promise<StripeProduct> =>
    stripeApiRequest<StripeProduct>(`/payments/stripe/products/${productId}`, {
      token,
    }),

  listProducts: (
    token: string,
    params: {
      limit?: number
      starting_after?: string
      ending_before?: string
      active?: boolean
    } = {},
  ): Promise<{ data: Array<StripeProduct>; has_more: boolean }> => {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        search.set(key, String(value))
      }
    })
    const qs = search.toString()
    return stripeApiRequest<{ data: Array<StripeProduct>; has_more: boolean }>(
      `/payments/stripe/products${qs ? `?${qs}` : ''}`,
      { token },
    )
  },

  createPrice: (
    token: string,
    payload: {
      product_id: string
      unit_amount: number
      currency: string
      recurring?: {
        interval: 'day' | 'week' | 'month' | 'year'
        interval_count?: number
      }
      metadata?: Record<string, string>
    },
  ): Promise<StripePrice> =>
    stripeApiRequest<StripePrice>('/payments/stripe/prices', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  getPrice: (token: string, priceId: string): Promise<StripePrice> =>
    stripeApiRequest<StripePrice>(`/payments/stripe/prices/${priceId}`, {
      token,
    }),

  listPrices: (
    token: string,
    params: {
      product?: string
      limit?: number
      starting_after?: string
      ending_before?: string
      active?: boolean
      recurring?: {
        interval?: 'day' | 'week' | 'month' | 'year'
      }
    } = {},
  ): Promise<{ data: Array<StripePrice>; has_more: boolean }> => {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'object') {
          search.set(key, JSON.stringify(value))
        } else {
          search.set(key, String(value))
        }
      }
    })
    const qs = search.toString()
    return stripeApiRequest<{ data: Array<StripePrice>; has_more: boolean }>(
      `/payments/stripe/prices${qs ? `?${qs}` : ''}`,
      { token },
    )
  },

  // Subscriptions
  createSubscription: (
    token: string,
    payload: CreateSubscriptionRequest,
  ): Promise<StripeSubscription> =>
    stripeApiRequest<StripeSubscription>('/payments/stripe/subscriptions', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  getSubscription: (
    token: string,
    subscriptionId: string,
  ): Promise<StripeSubscription> =>
    stripeApiRequest<StripeSubscription>(
      `/payments/stripe/subscriptions/${subscriptionId}`,
      {
        token,
      },
    ),

  updateSubscription: (
    token: string,
    subscriptionId: string,
    payload: Partial<{
      items: Array<{ id?: string; price: string; quantity?: number }>
      cancel_at_period_end: boolean
      metadata: Record<string, string>
    }>,
  ): Promise<StripeSubscription> =>
    stripeApiRequest<StripeSubscription>(
      `/payments/stripe/subscriptions/${subscriptionId}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
        token,
      },
    ),

  cancelSubscription: (
    token: string,
    subscriptionId: string,
    payload: { at_period_end?: boolean } = {},
  ): Promise<StripeSubscription> =>
    stripeApiRequest<StripeSubscription>(
      `/payments/stripe/subscriptions/${subscriptionId}`,
      {
        method: 'DELETE',
        body: JSON.stringify(payload),
        token,
      },
    ),

  listUserSubscriptions: (
    token: string,
    params: {
      customer?: string
      status?: string
      price?: string
      limit?: number
    } = {},
  ): Promise<{ data: Array<StripeSubscription>; has_more: boolean }> => {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        search.set(key, String(value))
      }
    })
    const qs = search.toString()
    return stripeApiRequest<{
      data: Array<StripeSubscription>
      has_more: boolean
    }>(`/payments/stripe/subscriptions${qs ? `?${qs}` : ''}`, { token })
  },

  // Course Enrollment and Access
  checkCourseAccess: (
    token: string,
    courseId: string,
  ): Promise<{
    has_access: boolean
    access_level: 'none' | 'preview' | 'full'
    enrollment: CourseEnrollment | null
  }> =>
    stripeApiRequest<{
      has_access: boolean
      access_level: 'none' | 'preview' | 'full'
      enrollment: CourseEnrollment | null
    }>(`/courses/${courseId}/access`, {
      token,
    }),

  getUserEnrollments: (
    token: string,
    params: {
      status?: 'active' | 'expired' | 'pending'
      page?: number
      limit?: number
    } = {},
  ): Promise<{
    enrollments: Array<CourseEnrollment>
    total: number
    page: number
    limit: number
  }> => {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        search.set(key, String(value))
      }
    })
    const qs = search.toString()
    return stripeApiRequest<{
      enrollments: Array<CourseEnrollment>
      total: number
      page: number
      limit: number
    }>(`/enrollments${qs ? `?${qs}` : ''}`, {
      token,
    })
  },

  // Payment History
  getUserPaymentHistory: (
    token: string,
    params: {
      page?: number
      limit?: number
      status?: string
    } = {},
  ): Promise<{
    transactions: Array<{
      id: string
      amount: number
      currency: string
      status: string
      stripe_payment_intent_id: string
      course_id?: string
      course_title?: string
      created_at: string
    }>
    total: number
    page: number
    limit: number
  }> => {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        search.set(key, String(value))
      }
    })
    const qs = search.toString()
    return stripeApiRequest<{
      transactions: Array<{
        id: string
        amount: number
        currency: string
        status: string
        stripe_payment_intent_id: string
        course_id?: string
        course_title?: string
        created_at: string
      }>
      total: number
      page: number
      limit: number
    }>(`/payments/stripe/transactions${qs ? `?${qs}` : ''}`, {
      token,
    })
  },

  // Webhook verification (for backend use)
  verifyWebhookSignature: (
    token: string,
    payload: {
      body: string
      signature: string
    },
  ): Promise<{ verified: boolean; event?: any }> =>
    stripeApiRequest<{ verified: boolean; event?: any }>(
      '/payments/stripe/webhooks/verify',
      {
        method: 'POST',
        body: JSON.stringify(payload),
        token,
      },
    ),
}

// Enhanced API client with automatic token injection for Stripe operations
export class StripeApiClient {
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

  async createPaymentIntent(
    payload: CreatePaymentIntentRequest,
    token?: string,
  ): Promise<CreatePaymentIntentResponse> {
    const authToken = this.getAuthToken(token)
    if (!authToken) throw new ApiError('Authentication required', 401)
    return stripeApi.createPaymentIntent(authToken, payload)
  }

  async purchaseCourse(
    courseId: string,
    payload: {
      payment_method_id?: string
      payment_intent_id?: string
      amount?: number
    },
    token?: string,
  ): Promise<PaymentSuccessResponse> {
    const authToken = this.getAuthToken(token)
    if (!authToken) throw new ApiError('Authentication required', 401)
    return stripeApi.purchaseCourseWithStripe(authToken, courseId, payload)
  }

  async checkCourseAccess(
    courseId: string,
    token?: string,
  ): Promise<{
    has_access: boolean
    access_level: 'none' | 'preview' | 'full'
    enrollment: CourseEnrollment | null
  }> {
    const authToken = this.getAuthToken(token)
    if (!authToken) throw new ApiError('Authentication required', 401)
    return stripeApi.checkCourseAccess(authToken, courseId)
  }

  async getUserEnrollments(
    params: {
      status?: 'active' | 'expired' | 'pending'
      page?: number
      limit?: number
    } = {},
    token?: string,
  ): Promise<{
    enrollments: Array<CourseEnrollment>
    total: number
    page: number
    limit: number
  }> {
    const authToken = this.getAuthToken(token)
    if (!authToken) throw new ApiError('Authentication required', 401)
    return stripeApi.getUserEnrollments(authToken, params)
  }

  async getPaymentHistory(
    params: {
      page?: number
      limit?: number
      status?: string
    } = {},
    token?: string,
  ): Promise<{
    transactions: Array<{
      id: string
      amount: number
      currency: string
      status: string
      stripe_payment_intent_id: string
      course_id?: string
      course_title?: string
      created_at: string
    }>
    total: number
    page: number
    limit: number
  }> {
    const authToken = this.getAuthToken(token)
    if (!authToken) throw new ApiError('Authentication required', 401)
    return stripeApi.getUserPaymentHistory(authToken, params)
  }
}

// Create singleton instance
export const stripeApiClient = new StripeApiClient()
