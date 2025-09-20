/**
 * Accessibility-Friendly Microcopy Library
 *
 * Comprehensive text content designed for screen readers, keyboard navigation,
 * and assistive technologies. Ensures inclusive learning experiences for all users.
 */

export interface AccessibilityText {
  label: string
  description?: string
  instructions?: string
  hint?: string
  error?: string
  success?: string
}

export const accessibilityText = {
  // =============================================================================
  // VIDEO PLAYER ACCESSIBILITY
  // =============================================================================
  videoPlayer: {
    player: {
      label: 'Video lesson player',
      description: 'Interactive video player for course content',
      instructions: 'Use spacebar to play/pause, arrow keys to seek, M to mute',
    },

    controls: {
      play: {
        label: 'Play video',
        description: 'Start video playback',
        hint: 'Keyboard shortcut: Spacebar',
      },
      pause: {
        label: 'Pause video',
        description: 'Pause video playback',
        hint: 'Keyboard shortcut: Spacebar',
      },
      replay: {
        label: 'Replay video',
        description: 'Restart video from the beginning',
      },
      mute: {
        label: 'Mute audio',
        description: 'Turn off video audio',
        hint: 'Keyboard shortcut: M',
      },
      unmute: {
        label: 'Unmute audio',
        description: 'Turn on video audio',
        hint: 'Keyboard shortcut: M',
      },
      fullscreen: {
        label: 'Enter fullscreen mode',
        description: 'Expand video to fill entire screen',
        hint: 'Keyboard shortcut: F or Escape to exit',
      },
      exitFullscreen: {
        label: 'Exit fullscreen mode',
        description: 'Return video to normal size',
        hint: 'Keyboard shortcut: Escape',
      },
      captions: {
        label: 'Toggle closed captions',
        description: 'Show or hide video subtitles',
        hint: 'Captions help with comprehension and accessibility',
      },
      transcript: {
        label: 'View video transcript',
        description: 'Open searchable text version of video content',
      },
      settings: {
        label: 'Video settings',
        description: 'Adjust playback speed, quality, and other options',
      },
    },

    progress: {
      seekBar: {
        label: 'Video progress',
        description: 'Current playback position: {currentTime} of {totalTime}',
        instructions:
          'Use left and right arrow keys to seek backward and forward',
      },
      volume: {
        label: 'Volume control',
        description: 'Audio volume level: {level} percent',
        instructions: 'Use up and down arrow keys to adjust volume',
      },
      buffer: {
        label: 'Loading progress',
        description: 'Video buffered: {percentage} percent',
      },
    },

    quality: {
      selector: {
        label: 'Video quality settings',
        description: 'Choose video resolution and bandwidth usage',
        options: {
          auto: 'Automatic quality based on connection speed',
          hd: 'High definition 1080p - requires fast internet',
          standard: 'Standard definition 720p - balanced quality and speed',
          low: 'Low definition 480p - for slower connections',
          audioOnly: 'Audio only - no video, minimal bandwidth',
        },
      },
    },

    speed: {
      selector: {
        label: 'Playback speed settings',
        description: 'Adjust how fast or slow the video plays',
        options: {
          '0.5': 'Half speed - good for complex topics',
          '0.75': 'Three-quarter speed - slightly slower',
          '1': 'Normal speed - default playback rate',
          '1.25': 'One and quarter speed - slightly faster',
          '1.5': 'One and half speed - faster review',
          '2': 'Double speed - quick review',
        },
      },
    },

    status: {
      loading: 'Video is loading. Please wait.',
      buffering: 'Video is buffering. Playback will resume automatically.',
      error: 'Video failed to load. Try refreshing the page.',
      ended: 'Video has finished playing.',
      paused: 'Video is paused.',
      playing: 'Video is currently playing.',
    },
  },

  // =============================================================================
  // NAVIGATION & MENU ACCESSIBILITY
  // =============================================================================
  navigation: {
    mainMenu: {
      label: 'Main navigation menu',
      description: 'Primary site navigation',
      instructions:
        'Use arrow keys to navigate, Enter to select, Escape to close',
    },

    courseMenu: {
      label: 'Course navigation menu',
      description: 'Navigate between course lessons and sections',
      instructions: 'Shows {current} of {total} lessons',
    },

    breadcrumb: {
      label: 'Breadcrumb navigation',
      description: 'Shows your current location: {path}',
      instructions: 'Use to navigate back to previous sections',
    },

    pagination: {
      label: 'Page navigation',
      description: 'Page {current} of {total}',
      previous: 'Go to previous page',
      next: 'Go to next page',
      first: 'Go to first page',
      last: 'Go to last page',
      page: 'Go to page {number}',
    },

    tabs: {
      label: 'Content sections',
      description: 'Switch between different content areas',
      instructions: 'Use arrow keys to navigate tabs, Enter to activate',
      current: 'Currently viewing {tabName}',
    },
  },

  // =============================================================================
  // COURSE CONTENT ACCESSIBILITY
  // =============================================================================
  courseContent: {
    lessonList: {
      label: 'Course lessons',
      description: 'List of {count} lessons in this course',
      instructions: 'Use arrow keys to browse, Enter to start lesson',
    },

    lessonItem: {
      label: 'Lesson: {title}',
      description: 'Duration: {duration}, Status: {status}',
      completed: 'Completed lesson',
      inProgress: 'Lesson in progress',
      locked: 'Lesson locked - complete prerequisites first',
      available: 'Lesson available to start',
    },

    progressIndicator: {
      label: 'Course progress',
      description:
        'You have completed {completed} of {total} lessons ({percentage} percent)',
      milestone:
        "Congratulations! You've reached {percentage} percent completion",
    },

    quiz: {
      question: {
        label: 'Quiz question {current} of {total}',
        description: 'Multiple choice question',
        instructions: 'Select your answer and press Enter or click Submit',
      },
      options: {
        label: 'Answer options',
        description: 'Choose the best answer from the options below',
        correct: 'Correct answer',
        incorrect: 'Incorrect answer',
        selected: 'Your selected answer',
      },
      result: {
        correct: 'Correct! {explanation}',
        incorrect: 'Incorrect. The correct answer is: {correct}. {explanation}',
        score: 'Quiz completed. Your score: {score} out of {total}',
      },
    },
  },

  // =============================================================================
  // FORMS & INPUT ACCESSIBILITY
  // =============================================================================
  forms: {
    login: {
      title: 'Sign in to your account',
      email: {
        label: 'Email address',
        description: 'Enter your registered email address',
        error: 'Please enter a valid email address',
        required: 'Email address is required',
      },
      password: {
        label: 'Password',
        description: 'Enter your account password',
        error: 'Password must be at least 8 characters',
        required: 'Password is required',
        show: 'Show password',
        hide: 'Hide password',
      },
      submit: {
        label: 'Sign in',
        description: 'Submit login form',
        loading: 'Signing you in...',
      },
      forgotPassword: {
        label: 'Forgot your password?',
        description: 'Reset your password via email',
      },
    },

    registration: {
      title: 'Create your learning account',
      firstName: {
        label: 'First name',
        description: 'Enter your first name',
        required: 'First name is required',
      },
      lastName: {
        label: 'Last name',
        description: 'Enter your last name',
        required: 'Last name is required',
      },
      email: {
        label: 'Email address',
        description: 'Enter a valid email address for your account',
        error: 'Please enter a valid email address',
        required: 'Email address is required',
      },
      password: {
        label: 'Create password',
        description:
          'Password must be at least 8 characters with uppercase, lowercase, and numbers',
        requirements:
          'Requirements: 8+ characters, uppercase, lowercase, number',
        error: 'Password does not meet requirements',
        required: 'Password is required',
      },
      confirmPassword: {
        label: 'Confirm password',
        description: 'Re-enter your password to confirm',
        error: 'Passwords do not match',
        required: 'Password confirmation is required',
      },
      terms: {
        label: 'I agree to the Terms of Service and Privacy Policy',
        description: 'You must agree to the terms to create an account',
        required: 'You must agree to the terms of service',
      },
    },

    search: {
      input: {
        label: 'Search courses',
        description: 'Search for courses, instructors, or topics',
        placeholder: 'What would you like to learn?',
        instructions: 'Type your search terms and press Enter',
      },
      results: {
        label: 'Search results',
        description: "Found {count} courses matching '{query}'",
        empty: 'No courses found matching your search',
        loading: 'Searching for courses...',
      },
      filters: {
        label: 'Filter search results',
        description: 'Narrow down results by category, level, or price',
        category: 'Filter by subject category',
        level: 'Filter by difficulty level',
        price: 'Filter by price range',
        duration: 'Filter by course length',
      },
    },
  },

  // =============================================================================
  // AI ASSISTANT ACCESSIBILITY
  // =============================================================================
  aiAssistant: {
    chat: {
      label: 'AI learning assistant chat',
      description: 'Ask questions and get help with your studies',
      instructions: 'Type your question and press Enter to send',
    },

    input: {
      label: 'Ask the AI assistant',
      description: 'Type your question about the course content',
      placeholder: 'Ask me anything about this lesson...',
      instructions: 'Be specific for better responses',
    },

    messages: {
      user: {
        label: 'Your message',
        description: 'Message from you to the AI assistant',
      },
      assistant: {
        label: 'AI assistant response',
        description: 'Response from your AI learning assistant',
      },
      typing: {
        label: 'AI assistant is typing',
        description: 'The assistant is preparing a response to your question',
      },
    },

    suggestions: {
      label: 'Suggested questions',
      description: 'Common questions about this topic',
      instructions: 'Click or press Enter to ask a suggested question',
    },

    status: {
      online: 'AI assistant is online and ready to help',
      offline: 'AI assistant is temporarily unavailable',
      thinking: 'AI assistant is thinking about your question',
      error: 'AI assistant encountered an error. Please try again.',
    },
  },

  // =============================================================================
  // DASHBOARD & STATISTICS
  // =============================================================================
  dashboard: {
    overview: {
      label: 'Learning dashboard overview',
      description: 'Summary of your learning progress and achievements',
    },

    stats: {
      coursesCompleted: {
        label: 'Courses completed',
        description: 'You have completed {count} courses',
        singular: 'You have completed 1 course',
        plural: 'You have completed {count} courses',
      },
      hoursLearned: {
        label: 'Hours of learning',
        description: 'You have spent {hours} hours learning',
        milestone: 'Congratulations on {hours} hours of learning!',
      },
      streak: {
        label: 'Learning streak',
        description: 'You have learned for {days} consecutive days',
        active: 'Your current learning streak is {days} days',
        broken: 'Start a new learning streak today!',
      },
      achievements: {
        label: 'Achievements earned',
        description: 'You have earned {count} achievement badges',
        recent: 'Most recent achievement: {achievement}',
      },
    },

    goals: {
      label: 'Learning goals',
      description: 'Track progress toward your learning objectives',
      daily: {
        label: 'Daily goal',
        description: 'Learn for {minutes} minutes today',
        progress: 'Progress: {current} of {target} minutes',
        completed: 'Daily goal completed! Great work!',
      },
      weekly: {
        label: 'Weekly goal',
        description: 'Complete {lessons} lessons this week',
        progress: 'Progress: {current} of {target} lessons',
        completed: "Weekly goal achieved! You're on fire!",
      },
    },
  },

  // =============================================================================
  // ERROR STATES & ALERTS
  // =============================================================================
  alerts: {
    error: {
      label: 'Error message',
      description: 'An error has occurred that requires your attention',
      dismiss: 'Dismiss error message',
    },
    warning: {
      label: 'Warning message',
      description: 'Important information that may affect your experience',
      dismiss: 'Dismiss warning message',
    },
    success: {
      label: 'Success message',
      description: 'Action completed successfully',
      dismiss: 'Dismiss success message',
    },
    info: {
      label: 'Information message',
      description: 'Helpful information about the current action',
      dismiss: 'Dismiss information message',
    },
  },

  // =============================================================================
  // LOADING & PROGRESS INDICATORS
  // =============================================================================
  loading: {
    spinner: {
      label: 'Loading',
      description: 'Content is loading, please wait',
    },
    progress: {
      label: 'Progress indicator',
      description: 'Loading progress: {percentage} percent complete',
    },
    skeleton: {
      label: 'Loading placeholder',
      description: 'Content is being loaded',
    },
  },

  // =============================================================================
  // KEYBOARD SHORTCUTS
  // =============================================================================
  shortcuts: {
    global: {
      help: 'Press ? to view keyboard shortcuts',
      search: 'Press / to focus search',
      menu: 'Press M to open main menu',
      home: 'Press H to go to homepage',
    },
    video: {
      playPause: 'Press Space to play or pause video',
      mute: 'Press M to mute or unmute',
      fullscreen: 'Press F for fullscreen, Escape to exit',
      seek: 'Use arrow keys to seek forward and backward',
      volume: 'Use Up/Down arrows to adjust volume',
      speed: 'Press + or - to change playback speed',
    },
    navigation: {
      next: 'Press N to go to next lesson',
      previous: 'Press P to go to previous lesson',
      bookmark: 'Press B to bookmark current lesson',
      notes: 'Press T to take notes',
    },
  },
}

// Helper function to get accessibility text with variable substitution
export function getAccessibilityText(
  path: string,
  variables: Record<string, string | number> = {},
): AccessibilityText {
  const keys = path.split('.')
  let text: any = accessibilityText

  // Navigate to the nested property
  for (const key of keys) {
    if (text && typeof text === 'object' && key in text) {
      text = text[key]
    } else {
      return {
        label: 'Content not found',
        description: 'Accessibility text not available for this element',
      }
    }
  }

  // If it's not an AccessibilityText object, return default
  if (!text || typeof text !== 'object' || !('label' in text)) {
    return {
      label: 'Content',
      description: 'Interactive element',
    }
  }

  // Substitute variables in all text fields
  const result: AccessibilityText = { ...text }
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string') {
      result[key as keyof AccessibilityText] = substituteVariables(
        value,
        variables,
      )
    }
  }

  return result
}

// Helper function to substitute variables in text
function substituteVariables(
  text: string,
  variables: Record<string, string | number>,
): string {
  let result = text
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g')
    result = result.replace(regex, String(value))
  }
  return result
}

// ARIA live region announcements
export const liveAnnouncements = {
  navigation: {
    pageChanged: 'Navigated to {pageName}',
    lessonStarted: 'Started lesson: {lessonTitle}',
    lessonCompleted: 'Completed lesson: {lessonTitle}',
    courseEnrolled: 'Successfully enrolled in {courseTitle}',
    courseCompleted: 'Congratulations! Completed course: {courseTitle}',
  },

  video: {
    played: 'Video playback started',
    paused: 'Video playback paused',
    ended: 'Video playback completed',
    qualityChanged: 'Video quality changed to {quality}',
    speedChanged: 'Playback speed changed to {speed}',
    error: 'Video error: {message}',
  },

  forms: {
    submitted: 'Form submitted successfully',
    saved: 'Changes saved automatically',
    error: 'Form error: {message}',
    fieldError: 'Error in {fieldName}: {error}',
  },

  ai: {
    responseReady: 'AI assistant response ready',
    typing: 'AI assistant is typing a response',
    error: 'AI assistant is temporarily unavailable',
  },

  progress: {
    updated: 'Progress updated: {percentage} percent complete',
    goalReached: 'Goal achieved: {goalName}',
    achievementUnlocked: 'New achievement unlocked: {achievement}',
    streakMilestone: 'Learning streak milestone: {days} days',
  },
}

// Get announcement text with variable substitution
export function getAnnouncement(
  category: keyof typeof liveAnnouncements,
  type: string,
  variables: Record<string, string | number> = {},
): string {
  const announcement = liveAnnouncements[category][type]
  if (!announcement) {
    return 'Status updated'
  }

  return substituteVariables(announcement, variables)
}

// Screen reader utilities
export const screenReaderUtils = {
  // Describe complex UI states
  describeProgress: (
    current: number,
    total: number,
    unit: string = 'items',
  ): string => {
    const percentage = Math.round((current / total) * 100)
    return `Progress: ${current} of ${total} ${unit} completed, ${percentage} percent`
  },

  // Describe time durations in accessible format
  describeTime: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours} hours, ${minutes} minutes, and ${remainingSeconds} seconds`
    } else if (minutes > 0) {
      return `${minutes} minutes and ${remainingSeconds} seconds`
    } else {
      return `${remainingSeconds} seconds`
    }
  },

  // Describe lists and collections
  describeList: (count: number, itemType: string): string => {
    if (count === 0) {
      return `No ${itemType}s available`
    } else if (count === 1) {
      return `1 ${itemType}`
    } else {
      return `List of ${count} ${itemType}s`
    }
  },

  // Describe interactive states
  describeButton: (
    label: string,
    pressed?: boolean,
    expanded?: boolean,
  ): string => {
    let description = `${label} button`

    if (pressed !== undefined) {
      description += pressed ? ', pressed' : ', not pressed'
    }

    if (expanded !== undefined) {
      description += expanded ? ', expanded' : ', collapsed'
    }

    return description
  },
}

export type AccessibilityPath = string
export type AnnouncementCategory = keyof typeof liveAnnouncements
