import { loadStripe } from '@stripe/stripe-js'
import React, { createContext, useContext, useEffect, useState } from 'react'

import type { Stripe, StripeError } from '@stripe/stripe-js'

// Stripe publishable key from environment/config
const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51SAmvbIv3xXfwtNmlpEBkkePEiJvErs9TAiLF9iqQr66jKCQv1dNPInjLzmcmp4aKfBQPPCBUVIfJWlkuTKo15AM000WKE9ma5'

interface StripeContextValue {
  stripe: Stripe | null
  isLoading: boolean
  error: string | null
  publishableKey: string
}

const StripeContext = createContext<StripeContextValue | undefined>(undefined)

interface StripeProviderProps {
  children: React.ReactNode
}

export function StripeProvider({ children }: StripeProviderProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!STRIPE_PUBLISHABLE_KEY) {
          throw new Error('Stripe publishable key is not configured')
        }

        const stripeInstance = await loadStripe(STRIPE_PUBLISHABLE_KEY, {
          // Optional: Add additional Stripe options
          locale: 'en',
        })

        if (!stripeInstance) {
          throw new Error('Failed to initialize Stripe')
        }

        setStripe(stripeInstance)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load Stripe'
        setError(errorMessage)
        console.error('Stripe initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeStripe()
  }, [])

  const contextValue: StripeContextValue = {
    stripe,
    isLoading,
    error,
    publishableKey: STRIPE_PUBLISHABLE_KEY,
  }

  return (
    <StripeContext.Provider value={contextValue}>
      {children}
    </StripeContext.Provider>
  )
}

export function useStripe(): StripeContextValue {
  const context = useContext(StripeContext)
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider')
  }
  return context
}

// Helper hook for handling Stripe errors
export function useStripeErrorHandler() {
  const formatStripeError = (error: StripeError | Error | unknown): string => {
    if (!error) return 'An unknown error occurred'

    // Handle Stripe-specific errors
    if (typeof error === 'object' && error !== null && 'type' in error) {
      const stripeError = error as StripeError

      switch (stripeError.type) {
        case 'card_error':
          return stripeError.message || 'Your card was declined'
        case 'validation_error':
          return 'Invalid payment information provided'
        case 'api_connection_error':
          return 'Network error occurred. Please try again'
        case 'api_error':
          return 'A server error occurred. Please try again'
        case 'authentication_error':
          return 'Authentication with payment provider failed'
        case 'rate_limit_error':
          return 'Too many requests. Please wait and try again'
        default:
          return stripeError.message || 'Payment processing error'
      }
    }

    // Handle generic errors
    if (error instanceof Error) {
      return error.message
    }

    return 'An unexpected error occurred'
  }

  return { formatStripeError }
}

// Configuration helper
export const stripeConfig = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  // Note: apiVersion is handled by the backend, not needed for client-side Stripe.js

  // Payment options
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0070f3',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '6px',
    },
  },

  // Element options
  elementOptions: {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  },
} as const
