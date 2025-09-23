/**
 * Engaging Loading State Messages and Components
 *
 * Creates delightful waiting experiences with contextual, educational,
 * and encouraging messages that keep users engaged during processing.
 */

export interface LoadingState {
  message: string
  submessage?: string
  icon?: string
  animation?: 'spin' | 'pulse' | 'bounce' | 'fade'
  duration?: 'short' | 'medium' | 'long'
  tips?: Array<string>
  progress?: boolean
}

export const loadingMessages = {
  // =============================================================================
  // VIDEO PROCESSING & STREAMING
  // =============================================================================
  videoProcessing: {
    uploading: [
      {
        message: 'Converting your video for optimal streaming...',
        submessage: "We're creating multiple quality versions for all devices",
        icon: 'video',
        animation: 'pulse',
        duration: 'long',
        progress: true,
        tips: [
          'Higher quality videos take longer to process but provide better learning experiences',
          'You can continue working on other parts of your course while this processes',
          'Our system automatically optimizes videos for mobile, tablet, and desktop viewing',
        ],
      },
      {
        message: 'Analyzing video content and generating thumbnails...',
        submessage: 'Creating preview images and extracting key frames',
        icon: 'image',
        animation: 'fade',
        duration: 'medium',
        tips: [
          'Thumbnails help students quickly identify course content',
          'We generate multiple thumbnails so you can choose the best one',
        ],
      },
      {
        message: 'Optimizing audio quality and adding captions...',
        submessage:
          'Enhancing audio clarity and generating automatic transcripts',
        icon: 'headphones',
        animation: 'pulse',
        duration: 'long',
        tips: [
          'Clear audio is crucial for effective learning',
          'Automatic captions make your content accessible to all learners',
          'You can edit generated captions for perfect accuracy',
        ],
      },
      {
        message: 'Almost ready! Finalizing video processing...',
        submessage: 'Adding final touches and preparing for streaming',
        icon: 'check-circle',
        animation: 'bounce',
        duration: 'short',
        tips: [
          'Your video will be available across all quality levels',
          'Students can adjust quality based on their connection speed',
        ],
      },
    ],

    streaming: [
      {
        message: 'Loading your lesson...',
        submessage: 'Preparing high-quality video for your device',
        icon: 'play-circle',
        animation: 'spin',
        duration: 'short',
      },
      {
        message: 'Optimizing stream for your connection...',
        submessage: 'Selecting the best quality for smooth playback',
        icon: 'wifi',
        animation: 'pulse',
        duration: 'short',
        tips: [
          'We automatically adjust quality based on your internet speed',
          'You can manually change quality in the video settings',
        ],
      },
      {
        message: 'Buffering... Almost ready to continue!',
        submessage: 'Loading the next segment of your lesson',
        icon: 'loader',
        animation: 'spin',
        duration: 'short',
      },
      {
        message: 'Reconnecting to improve playback quality...',
        submessage:
          'Establishing the best connection for uninterrupted learning',
        icon: 'refresh-cw',
        animation: 'spin',
        duration: 'medium',
      },
    ],
  },

  // =============================================================================
  // COURSE & CONTENT LOADING
  // =============================================================================
  courseContent: {
    loading: [
      {
        message: 'Preparing your personalized learning experience...',
        submessage: 'Loading course content tailored to your progress',
        icon: 'book-open',
        animation: 'pulse',
        duration: 'medium',
        tips: [
          'Your dashboard shows courses based on your interests and goals',
          'Bookmark courses you want to take later',
          'Check out the recommended learning paths',
        ],
      },
      {
        message: 'Syncing your progress across devices...',
        submessage: 'Making sure you can continue where you left off',
        icon: 'refresh-cw',
        animation: 'spin',
        duration: 'short',
        tips: [
          'Your progress is automatically saved every few seconds',
          'You can switch between devices without losing your place',
          'Offline progress syncs when you reconnect to the internet',
        ],
      },
      {
        message: 'Loading course materials...',
        submessage: 'Gathering lessons, exercises, and resources',
        icon: 'folder-open',
        animation: 'fade',
        duration: 'medium',
        tips: [
          "Take notes as you learn - they're saved automatically",
          'Download materials for offline study',
          'Use the course discussion forum to ask questions',
        ],
      },
      {
        message: 'Calculating your learning path...',
        submessage: 'Determining the best order for your lessons',
        icon: 'map',
        animation: 'pulse',
        duration: 'short',
        tips: [
          'Lessons are ordered to build on previous knowledge',
          'You can skip to any lesson if you have the prerequisites',
          'Suggested learning time is based on average completion rates',
        ],
      },
    ],

    enrollment: [
      {
        message: 'Processing your enrollment...',
        submessage: 'Setting up your access to course materials',
        icon: 'user-plus',
        animation: 'pulse',
        duration: 'short',
      },
      {
        message: 'Preparing your course dashboard...',
        submessage: 'Customizing your learning experience',
        icon: 'layout-dashboard',
        animation: 'fade',
        duration: 'medium',
        tips: [
          'Your course dashboard tracks progress and upcoming deadlines',
          'Set learning goals to stay motivated',
          'Join the course community to connect with other learners',
        ],
      },
    ],
  },

  // =============================================================================
  // AI ASSISTANT & CHAT
  // =============================================================================
  aiAssistant: {
    thinking: [
      {
        message: 'Let me think about that for a moment...',
        submessage: 'Analyzing your question and course context',
        icon: 'brain',
        animation: 'pulse',
        duration: 'short',
      },
      {
        message: 'Searching through course materials...',
        submessage: 'Finding the most relevant information for you',
        icon: 'search',
        animation: 'spin',
        duration: 'medium',
        tips: [
          'I can explain concepts in different ways until they click',
          'Ask follow-up questions for deeper understanding',
          'I can provide examples related to your field of interest',
        ],
      },
      {
        message: 'Crafting the perfect explanation...',
        submessage: 'Tailoring my response to your learning style',
        icon: 'edit-3',
        animation: 'fade',
        duration: 'short',
        tips: [
          'I adapt explanations based on your previous questions',
          'Let me know if you prefer visual, practical, or theoretical explanations',
        ],
      },
      {
        message: 'Generating examples and analogies...',
        submessage: 'Making complex concepts easier to understand',
        icon: 'lightbulb',
        animation: 'bounce',
        duration: 'medium',
        tips: [
          'Real-world examples help bridge theory and practice',
          "Ask for more examples if the first one doesn't resonate",
        ],
      },
    ],

    processing: [
      {
        message: 'Understanding your learning context...',
        submessage: 'Considering your progress and course materials',
        icon: 'target',
        animation: 'pulse',
        duration: 'short',
      },
      {
        message: 'Connecting concepts across your courses...',
        submessage: "Finding relationships between what you're learning",
        icon: 'link',
        animation: 'fade',
        duration: 'medium',
      },
    ],
  },

  // =============================================================================
  // DATA OPERATIONS
  // =============================================================================
  dataOperations: {
    saving: [
      {
        message: 'Saving your progress...',
        submessage: 'Your learning journey is being preserved',
        icon: 'save',
        animation: 'pulse',
        duration: 'short',
      },
      {
        message: 'Backing up your notes and bookmarks...',
        submessage: 'Ensuring your study materials are safe',
        icon: 'shield',
        animation: 'fade',
        duration: 'short',
        tips: [
          'Your notes are automatically backed up every few minutes',
          'Bookmarks sync across all your devices',
        ],
      },
    ],

    syncing: [
      {
        message: 'Syncing your data across devices...',
        submessage: 'Making sure everything is up to date',
        icon: 'refresh-cw',
        animation: 'spin',
        duration: 'medium',
        tips: [
          'Changes made on one device appear on all your devices',
          "Sync happens automatically when you're online",
          'Offline changes sync when you reconnect',
        ],
      },
      {
        message: 'Updating your learning statistics...',
        submessage: 'Calculating your progress and achievements',
        icon: 'trending-up',
        animation: 'pulse',
        duration: 'short',
      },
    ],

    loading: [
      {
        message: 'Loading your learning dashboard...',
        submessage: 'Gathering your courses, progress, and recommendations',
        icon: 'layout-dashboard',
        animation: 'fade',
        duration: 'medium',
        tips: [
          'Your dashboard shows personalized course recommendations',
          'Track your learning streaks and goals',
          'See how you compare to other learners (anonymously)',
        ],
      },
    ],
  },

  // =============================================================================
  // PAYMENT & BILLING
  // =============================================================================
  payment: {
    processing: [
      {
        message: 'Processing your payment securely...',
        submessage: 'Your transaction is encrypted and protected',
        icon: 'credit-card',
        animation: 'pulse',
        duration: 'medium',
        tips: [
          'We use bank-level encryption to protect your payment information',
          "You'll receive a confirmation email once payment is complete",
          'Premium access activates immediately after payment',
        ],
      },
      {
        message: 'Upgrading your account...',
        submessage: 'Unlocking premium features and content',
        icon: 'star',
        animation: 'bounce',
        duration: 'short',
        tips: [
          'Premium includes unlimited course access',
          'Download courses for offline learning',
          'Get priority support from instructors',
        ],
      },
      {
        message: 'Activating your subscription...',
        submessage: 'Setting up your premium learning experience',
        icon: 'check-circle',
        animation: 'fade',
        duration: 'short',
      },
    ],
  },

  // =============================================================================
  // SYSTEM OPERATIONS
  // =============================================================================
  system: {
    initializing: [
      {
        message: 'Initializing your learning environment...',
        submessage: 'Setting up everything for the best experience',
        icon: 'settings',
        animation: 'spin',
        duration: 'medium',
        tips: [
          "We're optimizing the platform for your device and connection",
          'This only takes a moment on your first visit',
          'Subsequent loads will be much faster',
        ],
      },
      {
        message: 'Checking for updates and new features...',
        submessage: 'Making sure you have the latest improvements',
        icon: 'download',
        animation: 'pulse',
        duration: 'short',
      },
    ],

    maintenance: [
      {
        message: 'Performing quick maintenance...',
        submessage: 'Optimizing performance for a better experience',
        icon: 'wrench',
        animation: 'spin',
        duration: 'short',
        tips: [
          'Maintenance helps keep the platform running smoothly',
          'Your progress and data are safely backed up during maintenance',
        ],
      },
    ],
  },

  // =============================================================================
  // ASSESSMENT & QUIZ LOADING
  // =============================================================================
  assessment: {
    loading: [
      {
        message: 'Preparing your quiz...',
        submessage: 'Loading questions tailored to your learning progress',
        icon: 'clipboard-list',
        animation: 'pulse',
        duration: 'short',
        tips: [
          "Quizzes help reinforce what you've learned",
          "Don't worry about perfect scores - learning is the goal",
          'You can retake quizzes to improve your understanding',
        ],
      },
      {
        message: 'Customizing questions for your level...',
        submessage: 'Adapting difficulty based on your progress',
        icon: 'target',
        animation: 'fade',
        duration: 'medium',
        tips: [
          'Questions get progressively challenging as you improve',
          'Hints are available if you get stuck',
          'Wrong answers provide learning opportunities',
        ],
      },
      {
        message: 'Generating practice scenarios...',
        submessage: 'Creating real-world applications of your knowledge',
        icon: 'puzzle',
        animation: 'bounce',
        duration: 'medium',
        tips: [
          'Practice scenarios help you apply theoretical knowledge',
          'Work through problems step-by-step',
          "Learn from mistakes - they're part of the process",
        ],
      },
    ],

    grading: [
      {
        message: 'Evaluating your responses...',
        submessage: 'Providing detailed feedback on your answers',
        icon: 'check-square',
        animation: 'pulse',
        duration: 'short',
      },
      {
        message: 'Calculating your score and progress...',
        submessage: 'Updating your learning statistics',
        icon: 'calculator',
        animation: 'spin',
        duration: 'short',
        tips: [
          'Scores help track your progress over time',
          'Focus on understanding concepts, not just getting high scores',
        ],
      },
    ],
  },
}

// Helper function to get random loading message for a category
export function getRandomLoadingMessage(
  category: keyof typeof loadingMessages,
  subcategory: string,
): LoadingState {
  const categoryMessages = loadingMessages[category] as Record<
    string,
    Array<LoadingState>
  >
  const messages = categoryMessages[subcategory]
  if (!messages || !Array.isArray(messages)) {
    return getDefaultLoadingMessage()
  }

  const randomIndex = Math.floor(Math.random() * messages.length)
  return messages[randomIndex]
}

// Helper function to get sequential loading messages (for multi-step processes)
export function getSequentialLoadingMessages(
  category: keyof typeof loadingMessages,
  subcategory: string,
): Array<LoadingState> {
  const categoryMessages = loadingMessages[category] as Record<
    string,
    Array<LoadingState>
  >
  const messages = categoryMessages[subcategory]
  if (!messages || !Array.isArray(messages)) {
    return [getDefaultLoadingMessage()]
  }

  return messages
}

// Default loading message for fallback
export function getDefaultLoadingMessage(): LoadingState {
  return {
    message: 'Loading...',
    submessage: 'Please wait while we prepare your content',
    icon: 'loader',
    animation: 'spin',
    duration: 'short',
  }
}

// Fun loading messages for long waits
export const funLoadingMessages: Array<LoadingState> = [
  {
    message: 'Did you know?',
    submessage:
      'The human brain can process visual information 60,000 times faster than text!',
    icon: 'lightbulb',
    animation: 'bounce',
  },
  {
    message: 'Learning tip:',
    submessage:
      'Taking breaks every 25 minutes can improve retention by up to 25%!',
    icon: 'clock',
    animation: 'pulse',
  },
  {
    message: 'Fun fact:',
    submessage:
      'Your brain forms new neural pathways every time you learn something new!',
    icon: 'brain',
    animation: 'fade',
  },
  {
    message: 'Study hack:',
    submessage:
      'Teaching someone else is one of the most effective ways to learn!',
    icon: 'users',
    animation: 'bounce',
  },
  {
    message: 'Memory boost:',
    submessage:
      'Writing notes by hand activates different brain regions than typing!',
    icon: 'edit-3',
    animation: 'pulse',
  },
]

// Get a random fun fact for extended loading times
export function getFunLoadingMessage(): LoadingState {
  const randomIndex = Math.floor(Math.random() * funLoadingMessages.length)
  return funLoadingMessages[randomIndex]
}

// Loading message categories for easy access
export const loadingCategories = {
  video: {
    processing: 'Video Processing',
    streaming: 'Video Streaming',
  },
  course: {
    loading: 'Course Loading',
    enrollment: 'Enrollment Process',
  },
  ai: {
    thinking: 'AI Processing',
    processing: 'Content Analysis',
  },
  data: {
    saving: 'Data Saving',
    syncing: 'Data Synchronization',
    loading: 'Data Loading',
  },
  payment: {
    processing: 'Payment Processing',
  },
  system: {
    initializing: 'System Initialization',
    maintenance: 'System Maintenance',
  },
  assessment: {
    loading: 'Assessment Loading',
    grading: 'Assessment Grading',
  },
} as const

export type LoadingCategory = keyof typeof loadingCategories
export type LoadingSubcategory<T extends LoadingCategory> =
  keyof (typeof loadingCategories)[T]
