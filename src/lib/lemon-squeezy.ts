import {
  cancelSubscription,
  createCheckout,
  getCheckout,
  getCustomer,
  getSubscription,
  lemonSqueezySetup,
  listProducts,
  listVariants,
  updateSubscription,
} from '@lemonsqueezy/lemonsqueezy.js'
import type {
  Checkout,
  Customer,
  Product,
  Subscription,
  Variant,
} from '@lemonsqueezy/lemonsqueezy.js'

// Initialize Lemon Squeezy
const LEMON_SQUEEZY_API_KEY = import.meta.env.VITE_LEMON_SQUEEZY_API_KEY
const LEMON_SQUEEZY_STORE_ID = import.meta.env.VITE_LEMON_SQUEEZY_STORE_ID

if (LEMON_SQUEEZY_API_KEY) {
  lemonSqueezySetup({
    apiKey: LEMON_SQUEEZY_API_KEY,
    onError: (error) => console.error('Lemon Squeezy Error:', error),
  })
}

export interface CourseCheckoutData {
  courseId: string
  courseTitle: string
  price: number
  currency: string
  userId: string
  userEmail: string
  userName: string
}

export interface SubscriptionCheckoutData {
  planName: string
  variantId: string
  userId: string
  userEmail: string
  userName: string
}

export class LemonSqueezyService {
  private static instance: LemonSqueezyService

  public static getInstance(): LemonSqueezyService {
    if (!LemonSqueezyService.instance) {
      LemonSqueezyService.instance = new LemonSqueezyService()
    }
    return LemonSqueezyService.instance
  }

  private constructor() {
    if (!LEMON_SQUEEZY_API_KEY) {
      console.warn(
        'Lemon Squeezy API key not found. Payment functionality will be limited.',
      )
    }
  }

  /**
   * Create a checkout session for a course purchase
   */
  async createCourseCheckout(data: CourseCheckoutData): Promise<string> {
    try {
      const checkoutData = {
        data: {
          type: 'checkouts',
          attributes: {
            product_options: {
              name: data.courseTitle,
              description: `Access to ${data.courseTitle} course with lifetime access`,
            },
            checkout_options: {
              embed: false,
              media: true,
              logo: true,
            },
            checkout_data: {
              email: data.userEmail,
              name: data.userName,
              custom: {
                course_id: data.courseId,
                user_id: data.userId,
                purchase_type: 'course',
              },
            },
            expires_at: null, // No expiration
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: LEMON_SQUEEZY_STORE_ID || '',
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: this.getOrCreateCourseVariant(data),
              },
            },
          },
        },
      }

      const checkout = await createCheckout(
        LEMON_SQUEEZY_STORE_ID || '',
        checkoutData as any,
      )

      if (checkout.error) {
        throw new Error(checkout.error.message)
      }

      return (
        (checkout.data as { data: { attributes: { url: string } } }).data
          .attributes.url || ''
      )
    } catch (error) {
      console.error('Error creating course checkout:', error)
      throw new Error('Failed to create checkout session')
    }
  }

  /**
   * Create a checkout session for subscription
   */
  async createSubscriptionCheckout(
    data: SubscriptionCheckoutData,
  ): Promise<string> {
    try {
      const checkoutData = {
        data: {
          type: 'checkouts',
          attributes: {
            product_options: {
              name: `${data.planName} Subscription`,
              description: `Monthly access to all premium courses and features`,
            },
            checkout_options: {
              embed: false,
              media: true,
              logo: true,
            },
            checkout_data: {
              email: data.userEmail,
              name: data.userName,
              custom: {
                user_id: data.userId,
                purchase_type: 'subscription',
                plan_name: data.planName,
              },
            },
            expires_at: null,
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: LEMON_SQUEEZY_STORE_ID || '',
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: data.variantId,
              },
            },
          },
        },
      }

      const checkout = await createCheckout(
        LEMON_SQUEEZY_STORE_ID || '',
        checkoutData as any,
      )

      if (checkout.error) {
        throw new Error(checkout.error.message)
      }

      return (
        (checkout.data as { data: { attributes: { url: string } } }).data
          .attributes.url || ''
      )
    } catch (error) {
      console.error('Error creating subscription checkout:', error)
      throw new Error('Failed to create checkout session')
    }
  }

  /**
   * Get checkout details by ID
   */
  async getCheckoutById(checkoutId: string): Promise<Checkout | null> {
    try {
      const checkout = await getCheckout(checkoutId)

      if (checkout.error) {
        throw new Error(checkout.error.message)
      }

      return (checkout.data as { data: any }).data ?? null
    } catch (error) {
      console.error('Error fetching checkout:', error)
      return null
    }
  }

  /**
   * Get all available products
   */
  async getProducts(): Promise<Array<Product>> {
    try {
      const products = await listProducts({
        filter: { storeId: LEMON_SQUEEZY_STORE_ID },
      })

      if (products.error) {
        throw new Error(products.error.message)
      }

      return (products.data as { data: any }).data ?? []
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  /**
   * Get variants for a product
   */
  async getProductVariants(productId: string): Promise<Array<Variant>> {
    try {
      const variants = await listVariants({
        filter: { productId },
      })

      if (variants.error) {
        throw new Error(variants.error.message)
      }

      return (variants.data as { data: any }).data ?? []
    } catch (error) {
      console.error('Error fetching variants:', error)
      return []
    }
  }

  /**
   * Get subscription details
   */
  async getSubscriptionById(
    subscriptionId: string,
  ): Promise<Subscription | null> {
    try {
      const subscription = await getSubscription(subscriptionId)

      if (subscription.error) {
        throw new Error(subscription.error.message)
      }

      return (subscription.data as { data: any }).data ?? null
    } catch (error) {
      console.error('Error fetching subscription:', error)
      return null
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscriptionById(subscriptionId: string): Promise<boolean> {
    try {
      const result = await cancelSubscription(subscriptionId)

      if (result.error) {
        throw new Error(result.error.message)
      }

      return true
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return false
    }
  }

  /**
   * Update subscription (pause/resume/change billing)
   */
  async updateSubscriptionById(
    subscriptionId: string,
    updates: {
      pause?: { mode: 'void' | 'free' }
      cancelled?: boolean
      billingAddress?: any
    },
  ): Promise<Subscription | null> {
    try {
      const result = await updateSubscription(subscriptionId, {
        data: {
          type: 'subscriptions',
          id: subscriptionId,
          attributes: updates,
        },
      } as any)

      if (result.error) {
        throw new Error(result.error.message)
      }

      return (result.data as { data: any }).data ?? null
    } catch (error) {
      console.error('Error updating subscription:', error)
      return null
    }
  }

  /**
   * Get customer details
   */
  async getCustomerById(customerId: string): Promise<Customer | null> {
    try {
      const customer = await getCustomer(customerId)

      if (customer.error) {
        throw new Error(customer.error.message)
      }

      return (customer.data as { data: any }).data ?? null
    } catch (error) {
      console.error('Error fetching customer:', error)
      return null
    }
  }

  /**
   * Create or get existing variant for a course
   * This is a helper method that would integrate with your backend
   */
  private getOrCreateCourseVariant(data: CourseCheckoutData): string {
    // In a real implementation, you would:
    // 1. Check if a variant exists for this course
    // 2. If not, create one via your backend
    // 3. Return the variant ID

    // For now, return a placeholder that should be configured per course
    return `variant_${data.courseId}`
  }

  /**
   * Validate webhook signature (to be implemented on backend)
   */
  static validateWebhookSignature(
    _payload: string,
    _signature: string,
    _secret: string,
  ): boolean {
    // This should be implemented on your backend for security
    // Using crypto.createHmac('sha256', secret).update(payload).digest('hex')
    return true // Placeholder
  }
}

// Export singleton instance
export const lemonSqueezyService = LemonSqueezyService.getInstance()

// Webhook event types
export enum WebhookEvents {
  ORDER_CREATED = 'order_created',
  ORDER_REFUNDED = 'order_refunded',
  SUBSCRIPTION_CREATED = 'subscription_created',
  SUBSCRIPTION_UPDATED = 'subscription_updated',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  SUBSCRIPTION_RESUMED = 'subscription_resumed',
  SUBSCRIPTION_EXPIRED = 'subscription_expired',
  SUBSCRIPTION_PAUSED = 'subscription_paused',
  SUBSCRIPTION_UNPAUSED = 'subscription_unpaused',
  INVOICE_PAID = 'subscription_payment_success',
  INVOICE_PAYMENT_FAILED = 'subscription_payment_failed',
}

// Types for webhook payloads
export interface WebhookPayload {
  meta: {
    event_name: WebhookEvents
    custom_data: {
      user_id?: string
      course_id?: string
      purchase_type?: 'course' | 'subscription'
      plan_name?: string
    }
  }
  data: {
    type: string
    id: string
    attributes: any
    relationships?: any
  }
}

export default lemonSqueezyService
