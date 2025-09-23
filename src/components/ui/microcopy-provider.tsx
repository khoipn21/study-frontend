/**
 * Microcopy Provider Component
 *
 * Centralized provider for all microcopy, error messages, loading states,
 * and accessibility text. Provides consistent interfaces for accessing
 * user-facing text throughout the application.
 */

import { createContext, useContext } from 'react'
import { microcopy } from '../../lib/microcopy'
import { getErrorMessage } from '../../lib/error-messages'
import {
  getFunLoadingMessage,
  getRandomLoadingMessage,
  getSequentialLoadingMessages,
} from '../../lib/loading-states'
import {
  getAccessibilityText,
  getAnnouncement,
  screenReaderUtils,
} from '../../lib/accessibility-text'
import type { ErrorMessage } from '../../lib/error-messages'
import type { LoadingCategory, LoadingState } from '../../lib/loading-states'
import type { AccessibilityText } from '../../lib/accessibility-text'
import type { ReactNode } from 'react'

interface MicrocopyContextType {
  // Main microcopy access
  text: typeof microcopy

  // Error message functions
  getError: (code: string) => ErrorMessage

  // Loading state functions
  getLoadingMessage: (category: string, subcategory: string) => LoadingState
  getLoadingSequence: (
    category: string,
    subcategory: string,
  ) => Array<LoadingState>
  getFunMessage: () => LoadingState

  // Accessibility functions
  getA11yText: (
    path: string,
    variables?: Record<string, string | number>,
  ) => AccessibilityText
  announce: (
    category: string,
    type: string,
    variables?: Record<string, string | number>,
  ) => string

  // Screen reader utilities
  screenReader: typeof screenReaderUtils
}

const MicrocopyContext = createContext<MicrocopyContextType | undefined>(
  undefined,
)

interface MicrocopyProviderProps {
  children: ReactNode
}

export function MicrocopyProvider({ children }: MicrocopyProviderProps) {
  const contextValue: MicrocopyContextType = {
    text: microcopy,
    getError: getErrorMessage,
    getLoadingMessage: getRandomLoadingMessage as (
      category: string,
      subcategory: string,
    ) => LoadingState,
    getLoadingSequence: getSequentialLoadingMessages as (
      category: string,
      subcategory: string,
    ) => Array<LoadingState>,
    getFunMessage: getFunLoadingMessage,
    getA11yText: getAccessibilityText as (
      path: string,
      variables?: Record<string, string | number>,
    ) => AccessibilityText,
    announce: getAnnouncement as (
      category: string,
      type: string,
      variables?: Record<string, string | number>,
    ) => string,
    screenReader: screenReaderUtils,
  }

  return (
    <MicrocopyContext.Provider value={contextValue}>
      {children}
    </MicrocopyContext.Provider>
  )
}

export function useMicrocopy() {
  const context = useContext(MicrocopyContext)
  if (context === undefined) {
    throw new Error('useMicrocopy must be used within a MicrocopyProvider')
  }
  return context
}

// Specialized hooks for common use cases

// Hook for video player text
export function useVideoText() {
  const { text, getA11yText } = useMicrocopy()

  return {
    controls: text.video.playback,
    quality: text.video.quality,
    buffering: text.video.buffering,
    errors: text.video.errors,
    accessibility: {
      player: getA11yText('videoPlayer.player'),
      controls: getA11yText('videoPlayer.controls'),
      progress: getA11yText('videoPlayer.progress'),
    },
  }
}

// Hook for error handling
export function useErrorText() {
  const { getError } = useMicrocopy()

  return {
    get: getError,
    video: {
      loadFailed: getError('VIDEO_LOAD_FAILED'),
      networkError: getError('VIDEO_NETWORK_ERROR'),
      formatUnsupported: getError('VIDEO_FORMAT_UNSUPPORTED'),
    },
    auth: {
      invalidCredentials: getError('AUTH_INVALID_CREDENTIALS'),
      sessionExpired: getError('AUTH_SESSION_EXPIRED'),
      accountLocked: getError('AUTH_ACCOUNT_LOCKED'),
    },
    payment: {
      cardDeclined: getError('PAYMENT_CARD_DECLINED'),
      processingError: getError('PAYMENT_PROCESSING_ERROR'),
    },
  }
}

// Hook for loading states
export function useLoadingText() {
  const { getLoadingMessage, getLoadingSequence, getFunMessage } =
    useMicrocopy()

  return {
    video: {
      processing: () => getLoadingMessage('video', 'processing'),
      streaming: () => getLoadingMessage('video', 'streaming'),
    },
    course: {
      loading: () => getLoadingMessage('course', 'loading'),
      enrollment: () => getLoadingMessage('course', 'enrollment'),
    },
    ai: {
      thinking: () => getLoadingMessage('ai', 'thinking'),
      processing: () => getLoadingMessage('ai', 'processing'),
    },
    fun: getFunMessage,
    sequence: getLoadingSequence,
  }
}

// Hook for accessibility text
export function useAccessibilityText() {
  const { getA11yText, announce, screenReader } = useMicrocopy()

  return {
    get: getA11yText,
    announce,
    navigation: {
      menu: getA11yText('navigation.mainMenu'),
      breadcrumb: getA11yText('navigation.breadcrumb'),
      pagination: getA11yText('navigation.pagination'),
    },
    forms: {
      login: getA11yText('forms.login'),
      registration: getA11yText('forms.registration'),
      search: getA11yText('forms.search'),
    },
    video: {
      player: getA11yText('videoPlayer.player'),
      controls: getA11yText('videoPlayer.controls'),
      progress: getA11yText('videoPlayer.progress'),
    },
    screenReader,
  }
}

// Hook for course-specific text
export function useCourseText() {
  const { text, getA11yText } = useMicrocopy()

  return {
    enrollment: text.courses.enrollment,
    navigation: text.courses.navigation,
    progress: text.progress,
    accessibility: {
      lessonList: getA11yText('courseContent.lessonList'),
      lessonItem: getA11yText('courseContent.lessonItem'),
      progress: getA11yText('courseContent.progressIndicator'),
    },
  }
}

// Hook for AI assistant text
export function useAIText() {
  const { text, getA11yText, getLoadingMessage } = useMicrocopy()

  return {
    welcome: text.ai.welcome,
    prompts: text.ai.prompts,
    tips: text.ai.tips,
    errors: text.ai.errors,
    loading: () => getLoadingMessage('ai', 'thinking'),
    accessibility: {
      chat: getA11yText('aiAssistant.chat'),
      input: getA11yText('aiAssistant.input'),
      messages: getA11yText('aiAssistant.messages'),
    },
  }
}

// Component for live announcements (for screen readers)
interface LiveAnnouncerProps {
  message: string
  priority?: 'polite' | 'assertive'
  id?: string
}

export function LiveAnnouncer({
  message,
  priority = 'polite',
  id,
}: LiveAnnouncerProps) {
  return (
    <div
      id={id}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  )
}

// Component for error display with accessibility
interface ErrorDisplayProps {
  errorCode: string
  className?: string
  showIcon?: boolean
  showAction?: boolean
  onAction?: () => void
}

export function ErrorDisplay({
  errorCode,
  className = '',
  showIcon = true,
  showAction = true,
  onAction,
}: ErrorDisplayProps) {
  const { getError } = useMicrocopy()
  const error = getError(errorCode)

  return (
    <div
      className={`error-container ${className}`}
      role="alert"
      aria-live="assertive"
    >
      {showIcon && error.icon && (
        <div className="error-icon" aria-hidden="true">
          {/* Icon would be rendered here based on error.icon */}
        </div>
      )}

      <div className="error-content">
        <h3 className="error-title">{error.title}</h3>
        <p className="error-message">{error.message}</p>

        {error.helpText && (
          <p className="error-help" id={`${errorCode}-help`}>
            {error.helpText}
          </p>
        )}

        {showAction && error.action && (
          <button
            className="error-action"
            onClick={onAction || error.action.onClick}
            aria-describedby={error.helpText ? `${errorCode}-help` : undefined}
          >
            {error.action.label}
          </button>
        )}
      </div>
    </div>
  )
}

// Component for loading states with accessibility
interface LoadingDisplayProps {
  category: LoadingCategory
  subcategory: string
  showTips?: boolean
  className?: string
}

export function LoadingDisplay({
  category,
  subcategory,
  showTips = true,
  className = '',
}: LoadingDisplayProps) {
  const { getLoadingMessage } = useMicrocopy()
  const loading = getLoadingMessage(category, subcategory)

  return (
    <div
      className={`loading-container ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-content">
        {loading.icon && (
          <div
            className={`loading-icon ${loading.animation || ''}`}
            aria-hidden="true"
          >
            {/* Icon would be rendered here based on loading.icon */}
          </div>
        )}

        <h3 className="loading-message">{loading.message}</h3>

        {loading.submessage && (
          <p className="loading-submessage">{loading.submessage}</p>
        )}

        {loading.progress && (
          <div
            className="loading-progress"
            role="progressbar"
            aria-label="Loading progress"
          >
            {/* Progress bar would be rendered here */}
          </div>
        )}

        {showTips && loading.tips && loading.tips.length > 0 && (
          <div className="loading-tips">
            <h4>💡 Did you know?</h4>
            <ul>
              {loading.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// Component for progress indicators with accessibility
interface ProgressDisplayProps {
  current: number
  total: number
  unit?: string
  showPercentage?: boolean
  className?: string
}

export function ProgressDisplay({
  current,
  total,
  unit = 'items',
  showPercentage = true,
  className = '',
}: ProgressDisplayProps) {
  const { screenReader } = useMicrocopy()
  const percentage = Math.round((current / total) * 100)
  const description = screenReader.describeProgress(current, total, unit)

  return (
    <div className={`progress-container ${className}`}>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={description}
        aria-label="Progress indicator"
      >
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>

      <div className="progress-text">
        {showPercentage && (
          <span className="progress-percentage">{percentage}%</span>
        )}
        <span className="progress-description">
          {current} of {total} {unit}
        </span>
      </div>

      {/* Screen reader only text */}
      <span className="sr-only">{description}</span>
    </div>
  )
}

export default MicrocopyProvider
