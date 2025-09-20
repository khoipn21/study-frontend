/**
 * Advanced Error Message System
 *
 * Provides contextual, helpful error messages with recovery actions
 * and user-friendly explanations for all platform errors.
 */

export interface ErrorMessage {
  code: string
  title: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  helpText?: string
  icon?: string
  autoRetry?: boolean
  retryDelay?: number
}

export const errorMessages: Record<string, ErrorMessage> = {
  // =============================================================================
  // VIDEO STREAMING ERRORS
  // =============================================================================
  VIDEO_LOAD_FAILED: {
    code: 'VIDEO_LOAD_FAILED',
    title: 'Video temporarily unavailable',
    message:
      "We couldn't load this video right now. It might be processing or experiencing temporary issues.",
    severity: 'error',
    action: {
      label: 'Try again',
      onClick: () => window.location.reload(),
    },
    helpText:
      'If this persists, the video might still be processing. Try again in 5-10 minutes.',
    icon: 'video-off',
    autoRetry: true,
    retryDelay: 5000,
  },

  VIDEO_NETWORK_ERROR: {
    code: 'VIDEO_NETWORK_ERROR',
    title: 'Connection interrupted',
    message:
      "Your internet connection was interrupted. We've paused the video to prevent data loss.",
    severity: 'warning',
    action: {
      label: 'Resume playback',
      onClick: () => {}, // Will be handled by video player
    },
    helpText:
      'Check your internet connection. Your progress has been saved automatically.',
    icon: 'wifi-off',
    autoRetry: true,
    retryDelay: 3000,
  },

  VIDEO_FORMAT_UNSUPPORTED: {
    code: 'VIDEO_FORMAT_UNSUPPORTED',
    title: 'Browser compatibility issue',
    message:
      "Your browser doesn't support this video format. Please use a modern browser like Chrome, Firefox, or Safari.",
    severity: 'error',
    action: {
      label: 'Download audio version',
      href: '/audio-fallback',
    },
    helpText: 'Updating your browser usually resolves this issue.',
    icon: 'browser',
  },

  VIDEO_QUALITY_DEGRADED: {
    code: 'VIDEO_QUALITY_DEGRADED',
    title: 'Video quality adjusted',
    message:
      "We've automatically lowered video quality due to your connection speed for smoother playback.",
    severity: 'info',
    action: {
      label: 'Adjust quality manually',
      onClick: () => {}, // Open quality selector
    },
    helpText: 'You can manually adjust quality in the video settings.',
    icon: 'settings',
  },

  VIDEO_DRM_ERROR: {
    code: 'VIDEO_DRM_ERROR',
    title: 'Content protection error',
    message:
      'There was an issue with content protection. Please refresh the page and try again.',
    severity: 'error',
    action: {
      label: 'Refresh page',
      onClick: () => window.location.reload(),
    },
    helpText:
      'This usually resolves by refreshing. If not, try clearing your browser cache.',
    icon: 'shield-alert',
  },

  // =============================================================================
  // AUTHENTICATION ERRORS
  // =============================================================================
  AUTH_INVALID_CREDENTIALS: {
    code: 'AUTH_INVALID_CREDENTIALS',
    title: 'Sign-in failed',
    message:
      'The email or password you entered is incorrect. Please check your details and try again.',
    severity: 'error',
    action: {
      label: 'Reset password',
      href: '/auth/forgot-password',
    },
    helpText: 'Make sure Caps Lock is off and check for typos.',
    icon: 'key',
  },

  AUTH_ACCOUNT_LOCKED: {
    code: 'AUTH_ACCOUNT_LOCKED',
    title: 'Account temporarily locked',
    message:
      'Your account has been temporarily locked due to multiple failed login attempts.',
    severity: 'warning',
    action: {
      label: 'Reset password',
      href: '/auth/forgot-password',
    },
    helpText:
      'For security, accounts are locked after 5 failed attempts. Try again in 15 minutes or reset your password.',
    icon: 'lock',
  },

  AUTH_SESSION_EXPIRED: {
    code: 'AUTH_SESSION_EXPIRED',
    title: 'Session expired',
    message:
      "For your security, you've been automatically signed out. Please sign in again to continue.",
    severity: 'info',
    action: {
      label: 'Sign in',
      href: '/auth/login',
    },
    helpText: 'Your learning progress has been saved automatically.',
    icon: 'clock',
  },

  AUTH_EMAIL_NOT_VERIFIED: {
    code: 'AUTH_EMAIL_NOT_VERIFIED',
    title: 'Email verification required',
    message: 'Please verify your email address to access all features.',
    severity: 'warning',
    action: {
      label: 'Resend verification',
      onClick: () => {}, // Trigger email resend
    },
    helpText: 'Check your inbox and spam folder for the verification email.',
    icon: 'mail',
  },

  // =============================================================================
  // PAYMENT & SUBSCRIPTION ERRORS
  // =============================================================================
  PAYMENT_CARD_DECLINED: {
    code: 'PAYMENT_CARD_DECLINED',
    title: 'Payment declined',
    message:
      'Your payment method was declined. Please check your card details or try a different payment method.',
    severity: 'error',
    action: {
      label: 'Update payment method',
      href: '/settings/billing',
    },
    helpText:
      'Common causes: insufficient funds, expired card, or incorrect billing address.',
    icon: 'credit-card',
  },

  PAYMENT_PROCESSING_ERROR: {
    code: 'PAYMENT_PROCESSING_ERROR',
    title: 'Payment processing error',
    message:
      "We encountered an issue processing your payment. Don't worry - you haven't been charged.",
    severity: 'error',
    action: {
      label: 'Try again',
      onClick: () => {}, // Retry payment
    },
    helpText:
      'If this continues, please contact support. Your payment information is secure.',
    icon: 'alert-triangle',
  },

  SUBSCRIPTION_EXPIRED: {
    code: 'SUBSCRIPTION_EXPIRED',
    title: 'Subscription expired',
    message:
      'Your premium subscription has expired. Renew to continue accessing premium content.',
    severity: 'warning',
    action: {
      label: 'Renew subscription',
      href: '/billing/renew',
    },
    helpText:
      'You can still access free content while your subscription is expired.',
    icon: 'calendar-x',
  },

  ENROLLMENT_REQUIRED: {
    code: 'ENROLLMENT_REQUIRED',
    title: 'Enrollment required',
    message: 'You need to enroll in this course to access this content.',
    severity: 'info',
    action: {
      label: 'Enroll now',
      href: '/courses/enroll',
    },
    helpText: 'Many courses offer free previews before enrollment.',
    icon: 'book-open',
  },

  // =============================================================================
  // UPLOAD & FILE ERRORS
  // =============================================================================
  UPLOAD_FILE_TOO_LARGE: {
    code: 'UPLOAD_FILE_TOO_LARGE',
    title: 'File too large',
    message:
      "The file you're uploading exceeds our 2GB limit. Please choose a smaller file or compress your video.",
    severity: 'error',
    action: {
      label: 'Learn about compression',
      href: '/help/video-compression',
    },
    helpText:
      'Video compression can reduce file size by 70-80% without noticeable quality loss.',
    icon: 'file-x',
  },

  UPLOAD_FORMAT_UNSUPPORTED: {
    code: 'UPLOAD_FORMAT_UNSUPPORTED',
    title: 'File format not supported',
    message:
      'Please upload videos in MP4, MOV, AVI, or WebM format for best compatibility.',
    severity: 'error',
    action: {
      label: 'See supported formats',
      href: '/help/supported-formats',
    },
    helpText:
      'Free video converters are available online to change your file format.',
    icon: 'file-type',
  },

  UPLOAD_NETWORK_ERROR: {
    code: 'UPLOAD_NETWORK_ERROR',
    title: 'Upload interrupted',
    message:
      'Your upload was interrupted due to a connection issue. Your progress has been saved.',
    severity: 'warning',
    action: {
      label: 'Resume upload',
      onClick: () => {}, // Resume upload function
    },
    helpText: 'Large uploads can be resumed from where they left off.',
    icon: 'upload',
  },

  UPLOAD_QUOTA_EXCEEDED: {
    code: 'UPLOAD_QUOTA_EXCEEDED',
    title: 'Storage limit reached',
    message:
      "You've reached your storage limit. Delete some files or upgrade your plan to continue uploading.",
    severity: 'warning',
    action: {
      label: 'Manage storage',
      href: '/settings/storage',
    },
    helpText: 'Instructors get 50GB storage. Students get 5GB for assignments.',
    icon: 'hard-drive',
  },

  // =============================================================================
  // COURSE & CONTENT ERRORS
  // =============================================================================
  COURSE_NOT_FOUND: {
    code: 'COURSE_NOT_FOUND',
    title: 'Course not found',
    message:
      "This course doesn't exist or has been removed. It might have been moved or archived.",
    severity: 'error',
    action: {
      label: 'Browse all courses',
      href: '/courses',
    },
    helpText: 'If you bookmarked this course, check your enrollment history.',
    icon: 'search-x',
  },

  LECTURE_UNAVAILABLE: {
    code: 'LECTURE_UNAVAILABLE',
    title: 'Lesson temporarily unavailable',
    message:
      'This lesson is being updated or processed. Please check back in a few minutes.',
    severity: 'warning',
    action: {
      label: 'View other lessons',
      href: '/course/lessons',
    },
    helpText: 'Your progress in other lessons is not affected.',
    icon: 'clock',
  },

  PREREQUISITE_NOT_MET: {
    code: 'PREREQUISITE_NOT_MET',
    title: 'Prerequisites required',
    message:
      'You need to complete the previous lessons before accessing this content.',
    severity: 'info',
    action: {
      label: 'Go to previous lesson',
      onClick: () => {}, // Navigate to prerequisite
    },
    helpText: 'This ensures you have the foundation needed for this lesson.',
    icon: 'arrow-left',
  },

  // =============================================================================
  // SYSTEM & NETWORK ERRORS
  // =============================================================================
  NETWORK_OFFLINE: {
    code: 'NETWORK_OFFLINE',
    title: "You're offline",
    message:
      'No internet connection detected. You can still access downloaded content.',
    severity: 'warning',
    action: {
      label: 'View offline content',
      href: '/offline',
    },
    helpText: 'Your progress will sync automatically when you reconnect.',
    icon: 'wifi-off',
  },

  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    title: 'Server temporarily unavailable',
    message:
      'Our servers are experiencing high traffic. Please wait a moment and try again.',
    severity: 'error',
    action: {
      label: 'Check status',
      href: 'https://status.studyplatform.com',
    },
    helpText: 'This usually resolves within a few minutes. Your data is safe.',
    icon: 'server-crash',
    autoRetry: true,
    retryDelay: 10000,
  },

  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    title: 'Too many requests',
    message:
      "You're making requests too quickly. Please wait a moment before trying again.",
    severity: 'warning',
    helpText: 'This limit protects our servers and your experience.',
    icon: 'gauge',
  },

  MAINTENANCE_MODE: {
    code: 'MAINTENANCE_MODE',
    title: 'Scheduled maintenance',
    message:
      "We're performing brief maintenance to improve your experience. We'll be back shortly.",
    severity: 'info',
    action: {
      label: 'Check status',
      href: 'https://status.studyplatform.com',
    },
    helpText:
      'Maintenance usually takes 15-30 minutes. Your data is being backed up.',
    icon: 'wrench',
  },

  // =============================================================================
  // AI ASSISTANT ERRORS
  // =============================================================================
  AI_UNAVAILABLE: {
    code: 'AI_UNAVAILABLE',
    title: 'AI assistant temporarily unavailable',
    message:
      'The AI assistant is currently busy helping other students. Please try again in a moment.',
    severity: 'warning',
    action: {
      label: 'Try again',
      onClick: () => {}, // Retry AI request
    },
    helpText: 'You can continue learning while waiting for the AI assistant.',
    icon: 'bot',
    autoRetry: true,
    retryDelay: 15000,
  },

  AI_CONTEXT_TOO_LONG: {
    code: 'AI_CONTEXT_TOO_LONG',
    title: 'Message too long',
    message:
      'Your message is too long for the AI to process. Please try breaking it into smaller questions.',
    severity: 'warning',
    helpText: 'Shorter, specific questions get better responses.',
    icon: 'message-square-x',
  },

  AI_CONTENT_FILTERED: {
    code: 'AI_CONTENT_FILTERED',
    title: 'Content not suitable for AI assistance',
    message:
      'The AI assistant can only help with course-related questions and learning topics.',
    severity: 'info',
    helpText:
      'Try asking about course concepts, explanations, or study strategies.',
    icon: 'shield',
  },

  // =============================================================================
  // FORUM & COMMUNITY ERRORS
  // =============================================================================
  FORUM_POST_TOO_LONG: {
    code: 'FORUM_POST_TOO_LONG',
    title: 'Post too long',
    message:
      'Forum posts are limited to 5,000 characters. Please shorten your post.',
    severity: 'warning',
    helpText: 'Consider breaking long posts into multiple shorter ones.',
    icon: 'edit-3',
  },

  FORUM_MODERATION_REQUIRED: {
    code: 'FORUM_MODERATION_REQUIRED',
    title: 'Post pending review',
    message:
      'Your post is being reviewed by moderators and will appear shortly.',
    severity: 'info',
    helpText: 'New accounts have posts reviewed for the first week.',
    icon: 'eye',
  },

  // =============================================================================
  // GENERAL FALLBACK ERRORS
  // =============================================================================
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    title: 'Something unexpected happened',
    message:
      'We encountered an unexpected error. Our team has been automatically notified.',
    severity: 'error',
    action: {
      label: 'Try again',
      onClick: () => window.location.reload(),
    },
    helpText:
      'If this keeps happening, please contact support with the error code.',
    icon: 'alert-circle',
  },

  FEATURE_COMING_SOON: {
    code: 'FEATURE_COMING_SOON',
    title: 'Feature coming soon',
    message:
      'This feature is currently in development and will be available soon.',
    severity: 'info',
    action: {
      label: 'Return to dashboard',
      href: '/dashboard',
    },
    helpText: "We'll notify you when new features are ready.",
    icon: 'clock',
  },
}

// Helper function to get error message by code
export function getErrorMessage(code: string): ErrorMessage {
  return errorMessages[code] ?? errorMessages['UNKNOWN_ERROR']
}

// Helper function to check if error should auto-retry
export function shouldAutoRetry(code: string): boolean {
  const error = getErrorMessage(code)
  return error.autoRetry || false
}

// Helper function to get retry delay
export function getRetryDelay(code: string): number {
  const error = getErrorMessage(code)
  return error.retryDelay || 5000
}

// Error severity levels with their properties
export const errorSeverityConfig = {
  info: {
    color: 'blue',
    icon: 'info',
    dismissible: true,
    autoHide: true,
    duration: 5000,
  },
  warning: {
    color: 'yellow',
    icon: 'alert-triangle',
    dismissible: true,
    autoHide: false,
    duration: 0,
  },
  error: {
    color: 'red',
    icon: 'alert-circle',
    dismissible: true,
    autoHide: false,
    duration: 0,
  },
  critical: {
    color: 'red',
    icon: 'alert-octagon',
    dismissible: false,
    autoHide: false,
    duration: 0,
  },
}

// Context-specific error categories
export const errorCategories = {
  video: [
    'VIDEO_LOAD_FAILED',
    'VIDEO_NETWORK_ERROR',
    'VIDEO_FORMAT_UNSUPPORTED',
    'VIDEO_QUALITY_DEGRADED',
    'VIDEO_DRM_ERROR',
  ],
  auth: [
    'AUTH_INVALID_CREDENTIALS',
    'AUTH_ACCOUNT_LOCKED',
    'AUTH_SESSION_EXPIRED',
    'AUTH_EMAIL_NOT_VERIFIED',
  ],
  payment: [
    'PAYMENT_CARD_DECLINED',
    'PAYMENT_PROCESSING_ERROR',
    'SUBSCRIPTION_EXPIRED',
    'ENROLLMENT_REQUIRED',
  ],
  upload: [
    'UPLOAD_FILE_TOO_LARGE',
    'UPLOAD_FORMAT_UNSUPPORTED',
    'UPLOAD_NETWORK_ERROR',
    'UPLOAD_QUOTA_EXCEEDED',
  ],
  course: ['COURSE_NOT_FOUND', 'LECTURE_UNAVAILABLE', 'PREREQUISITE_NOT_MET'],
  network: [
    'NETWORK_OFFLINE',
    'SERVER_ERROR',
    'RATE_LIMIT_EXCEEDED',
    'MAINTENANCE_MODE',
  ],
  ai: ['AI_UNAVAILABLE', 'AI_CONTEXT_TOO_LONG', 'AI_CONTENT_FILTERED'],
  forum: ['FORUM_POST_TOO_LONG', 'FORUM_MODERATION_REQUIRED'],
}

export type ErrorCategory = keyof typeof errorCategories
export type ErrorSeverity = keyof typeof errorSeverityConfig
