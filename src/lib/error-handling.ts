// Error handling utilities for the instructor dashboard

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

export class InstructorDashboardError extends Error {
  public code?: string
  public status?: number
  public details?: any

  constructor(message: string, code?: string, status?: number, details?: any) {
    super(message)
    this.name = 'InstructorDashboardError'
    this.code = code
    this.status = status
    this.details = details
  }
}

// Error types
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  REALTIME_ERROR: 'REALTIME_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

export type ErrorType = (typeof ErrorTypes)[keyof typeof ErrorTypes]

// Error message mapping
export const ErrorMessages: Record<ErrorType, string> = {
  [ErrorTypes.NETWORK_ERROR]:
    'Network connection failed. Please check your internet connection.',
  [ErrorTypes.AUTHENTICATION_ERROR]:
    'Authentication failed. Please log in again.',
  [ErrorTypes.AUTHORIZATION_ERROR]:
    'You do not have permission to perform this action.',
  [ErrorTypes.VALIDATION_ERROR]:
    'The provided data is invalid. Please check your input.',
  [ErrorTypes.SERVER_ERROR]: 'A server error occurred. Please try again later.',
  [ErrorTypes.UPLOAD_ERROR]: 'File upload failed. Please try again.',
  [ErrorTypes.PROCESSING_ERROR]:
    'Processing failed. Please contact support if the issue persists.',
  [ErrorTypes.REALTIME_ERROR]:
    'Real-time connection failed. Some features may not work properly.',
  [ErrorTypes.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
}

// Parse API errors
export function parseApiError(error: any): ApiError {
  if (error.response) {
    // HTTP error response
    const status = error.response.status
    const data = error.response.data

    let message = 'An error occurred'
    let code = ErrorTypes.UNKNOWN_ERROR

    if (status === 401) {
      code = ErrorTypes.AUTHENTICATION_ERROR
      message = ErrorMessages[ErrorTypes.AUTHENTICATION_ERROR]
    } else if (status === 403) {
      code = ErrorTypes.AUTHORIZATION_ERROR
      message = ErrorMessages[ErrorTypes.AUTHORIZATION_ERROR]
    } else if (status === 422) {
      code = ErrorTypes.VALIDATION_ERROR
      message = data.message || ErrorMessages[ErrorTypes.VALIDATION_ERROR]
    } else if (status >= 500) {
      code = ErrorTypes.SERVER_ERROR
      message = ErrorMessages[ErrorTypes.SERVER_ERROR]
    } else if (data.message) {
      message = data.message
    }

    return {
      message,
      code,
      status,
      details: data,
    }
  } else if (error.request) {
    // Network error
    return {
      message: ErrorMessages[ErrorTypes.NETWORK_ERROR],
      code: ErrorTypes.NETWORK_ERROR,
      details: error.request,
    }
  } else {
    // Other error
    return {
      message: error.message || ErrorMessages[ErrorTypes.UNKNOWN_ERROR],
      code: ErrorTypes.UNKNOWN_ERROR,
      details: error,
    }
  }
}

// Retry utilities
export interface RetryOptions {
  maxAttempts: number
  delay: number
  backoff: 'linear' | 'exponential'
  retryCondition?: (error: any) => boolean
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    retryCondition = (error) => {
      const apiError = parseApiError(error)
      return (
        apiError.code === ErrorTypes.NETWORK_ERROR ||
        (apiError.status && apiError.status >= 500)
      )
    },
  } = options

  let lastError: any

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      if (attempt === maxAttempts || !retryCondition(error)) {
        throw error
      }

      const waitTime =
        backoff === 'exponential'
          ? delay * Math.pow(2, attempt - 1)
          : delay * attempt

      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw lastError
}

// Error logging
export function logError(error: any, context?: string) {
  const apiError = parseApiError(error)

  console.error('Instructor Dashboard Error:', {
    context,
    message: apiError.message,
    code: apiError.code,
    status: apiError.status,
    details: apiError.details,
    timestamp: new Date().toISOString(),
  })

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { contexts: { dashboard: context } })
  }
}

// User-friendly error messages for specific contexts
export const ContextualErrorMessages = {
  courseUpload: {
    [ErrorTypes.UPLOAD_ERROR]:
      'Failed to upload course content. Please check your file and try again.',
    [ErrorTypes.VALIDATION_ERROR]:
      'Course information is invalid. Please check all required fields.',
    [ErrorTypes.PROCESSING_ERROR]:
      'Course is being processed. This may take a few minutes.',
  },
  videoUpload: {
    [ErrorTypes.UPLOAD_ERROR]:
      'Video upload failed. Please check your internet connection and file format.',
    [ErrorTypes.PROCESSING_ERROR]:
      "Video is being processed. You'll receive a notification when it's ready.",
    [ErrorTypes.VALIDATION_ERROR]:
      'Video file is invalid. Please check the format and size requirements.',
  },
  studentManagement: {
    [ErrorTypes.AUTHORIZATION_ERROR]:
      "You don't have permission to manage this student.",
    [ErrorTypes.VALIDATION_ERROR]:
      'Invalid student data. Please check your input.',
  },
  analytics: {
    [ErrorTypes.SERVER_ERROR]:
      'Analytics data is temporarily unavailable. Please try again later.',
    [ErrorTypes.NETWORK_ERROR]:
      'Unable to load analytics. Please check your connection.',
  },
  messaging: {
    [ErrorTypes.UPLOAD_ERROR]:
      'Failed to send attachment. Please try a smaller file.',
    [ErrorTypes.VALIDATION_ERROR]:
      'Message content is invalid. Please check your message.',
  },
} as const

export function getContextualErrorMessage(
  error: any,
  context: keyof typeof ContextualErrorMessages,
): string {
  const apiError = parseApiError(error)
  const contextMessages = ContextualErrorMessages[context]

  if (
    apiError.code &&
    contextMessages[apiError.code as keyof typeof contextMessages]
  ) {
    return contextMessages[apiError.code as keyof typeof contextMessages]
  }

  return apiError.message
}

// React hook for error handling
export function useErrorToast() {
  const [error, setError] = React.useState<ApiError | null>(null)

  const showError = React.useCallback((error: any, context?: string) => {
    const apiError = parseApiError(error)
    logError(error, context)
    setError(apiError)

    // Show toast notification
    // Note: This would integrate with your toast system
    console.error('Error:', apiError.message)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, showError, clearError }
}

// Graceful degradation utilities
export function withFallback<T>(
  operation: () => T,
  fallback: T,
  onError?: (error: any) => void,
): T {
  try {
    return operation()
  } catch (error) {
    onError?.(error)
    logError(error, 'fallback')
    return fallback
  }
}

export async function withAsyncFallback<T>(
  operation: () => Promise<T>,
  fallback: T,
  onError?: (error: any) => void,
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    onError?.(error)
    logError(error, 'async-fallback')
    return fallback
  }
}

// Validation helpers
export function validateRequired(value: any, fieldName: string): void {
  if (
    value == null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  ) {
    throw new InstructorDashboardError(
      `${fieldName} is required`,
      ErrorTypes.VALIDATION_ERROR,
    )
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new InstructorDashboardError(
      'Invalid email format',
      ErrorTypes.VALIDATION_ERROR,
    )
  }
}

export function validateFileSize(file: File, maxSizeMB: number): void {
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > maxSizeMB) {
    throw new InstructorDashboardError(
      `File size exceeds ${maxSizeMB}MB limit`,
      ErrorTypes.VALIDATION_ERROR,
    )
  }
}

export function validateFileType(
  file: File,
  allowedTypes: Array<string>,
): void {
  if (!allowedTypes.includes(file.type)) {
    throw new InstructorDashboardError(
      `File type ${file.type} is not allowed`,
      ErrorTypes.VALIDATION_ERROR,
    )
  }
}
