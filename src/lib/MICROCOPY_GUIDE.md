# Comprehensive Microcopy System Guide

This guide explains how to use the complete microcopy system for the video-focused learning platform. The system provides professional, accessible, and engaging text for all user interactions.

## Overview

The microcopy system consists of five main components:

1. **Main Microcopy Library** (`microcopy.ts`) - All user-facing text organized by feature
2. **Error Message System** (`error-messages.ts`) - Contextual error handling with recovery actions
3. **Email Templates** (`email-templates.ts`) - Transactional email content with HTML/text versions
4. **Loading States** (`loading-states.ts`) - Engaging messages during wait times
5. **Accessibility Text** (`accessibility-text.ts`) - Screen reader and assistive technology support

## Quick Start

### 1. Setup the Provider

Wrap your app with the MicrocopyProvider:

```tsx
import { MicrocopyProvider } from './components/ui/microcopy-provider'

function App() {
  return (
    <MicrocopyProvider>
      <YourAppContent />
    </MicrocopyProvider>
  )
}
```

### 2. Use Specialized Hooks

```tsx
import {
  useVideoText,
  useErrorText,
  useLoadingText,
} from './components/ui/microcopy-provider'

function VideoPlayer() {
  const video = useVideoText()
  const errors = useErrorText()
  const loading = useLoadingText()

  return (
    <div>
      <button aria-label={video.accessibility.controls.play.label}>
        {video.controls.play}
      </button>

      {error && <ErrorDisplay errorCode="VIDEO_LOAD_FAILED" />}

      {isLoading && (
        <LoadingDisplay category="videoProcessing" subcategory="streaming" />
      )}
    </div>
  )
}
```

## Main Microcopy Library

### Video Streaming Text

```tsx
const { text } = useMicrocopy()

// Quality adjustment messages
text.video.quality.adjusting // "Adjusting video quality for smoother playback..."
text.video.quality.optimized // "Video quality optimized for your connection"

// Buffering states
text.video.buffering.loading // "Loading your lesson..."
text.video.buffering.optimizing // "Optimizing stream for your connection..."

// Playback controls
text.video.playback.play // "Play lesson"
text.video.playback.pause // "Pause lesson"
text.video.playback.speed.options['1.25'] // "1.25x"

// Offline functionality
text.video.offline.download // "Download this lesson for offline viewing"
text.video.offline.downloading // "Downloading lesson... {progress}% complete"
```

### Learning Progress Text

```tsx
// Progress tracking
text.progress.tracking.milestone50 // "Halfway there! You're doing amazing - 50% complete"
text.progress.tracking.completed // "Congratulations! You've completed this course"

// Achievements
text.progress.achievements.streakDay3 // "🔥 3-day learning streak! You're on fire!"
text.progress.achievements.perfectScore // "💯 Perfect Score: Aced the quiz on first try"

// Encouragement
text.progress.encouragement.keepGoing // "You're making great progress! Keep going"
text.progress.encouragement.dailyGoal // "Just {minutes} minutes to reach your daily goal"
```

### AI Assistant Text

```tsx
// Welcome messages
text.ai.welcome.first // "Hi! I'm your AI learning assistant..."
text.ai.welcome.contextual // "I noticed you're studying {topic}..."

// Prompts and suggestions
text.ai.prompts.clarification // "Would you like me to explain this concept in more detail?"
text.ai.prompts.examples // "I can provide more examples if that would be helpful"

// Tips and responses
text.ai.tips.studyTip // "💡 Pro tip: Try the practice exercises to reinforce your learning"
text.ai.responses.analyzing // "Analyzing your question and finding the best answer..."
```

## Error Message System

### Using Error Messages

```tsx
const { getError } = useErrorText()

// Get specific error
const videoError = getError('VIDEO_LOAD_FAILED')

// Error structure
interface ErrorMessage {
  code: string
  title: string // "Video temporarily unavailable"
  message: string // "We couldn't load this video right now..."
  severity: 'info' | 'warning' | 'error' | 'critical'
  action?: {
    label: string // "Try again"
    href?: string // Link to help page
    onClick?: () => void // Action function
  }
  helpText?: string // Additional guidance
  icon?: string // Icon identifier
  autoRetry?: boolean // Whether to auto-retry
  retryDelay?: number // Delay before retry
}
```

### Error Categories

```tsx
// Video errors
VIDEO_LOAD_FAILED
VIDEO_NETWORK_ERROR
VIDEO_FORMAT_UNSUPPORTED
VIDEO_QUALITY_DEGRADED
VIDEO_DRM_ERROR

// Authentication errors
AUTH_INVALID_CREDENTIALS
AUTH_ACCOUNT_LOCKED
AUTH_SESSION_EXPIRED
AUTH_EMAIL_NOT_VERIFIED

// Payment errors
PAYMENT_CARD_DECLINED
PAYMENT_PROCESSING_ERROR
SUBSCRIPTION_EXPIRED
ENROLLMENT_REQUIRED

// Upload errors
UPLOAD_FILE_TOO_LARGE
UPLOAD_FORMAT_UNSUPPORTED
UPLOAD_NETWORK_ERROR
UPLOAD_QUOTA_EXCEEDED
```

### Error Display Component

```tsx
<ErrorDisplay
  errorCode="VIDEO_LOAD_FAILED"
  showIcon={true}
  showAction={true}
  onAction={() => retryVideoLoad()}
  className="my-error-styles"
/>
```

## Email Templates

### Using Email Templates

```tsx
import {
  getEmailTemplate,
  replaceTemplateVariables,
} from './lib/email-templates'

// Get template
const template = getEmailTemplate('WELCOME_NEW_USER')

// Replace variables
const htmlContent = replaceTemplateVariables(template.htmlContent, {
  firstName: 'John',
  verificationLink: 'https://example.com/verify/token',
})

const textContent = replaceTemplateVariables(template.textContent, {
  firstName: 'John',
  verificationLink: 'https://example.com/verify/token',
})
```

### Available Templates

#### Authentication Templates

- `WELCOME_NEW_USER` - Welcome email with verification
- `EMAIL_VERIFICATION` - Email verification only
- `PASSWORD_RESET` - Password reset instructions

#### Course Templates

- `COURSE_ENROLLMENT_CONFIRMATION` - Enrollment success
- `COURSE_COMPLETION_CERTIFICATE` - Course completion with certificate

#### Progress Templates

- `LEARNING_STREAK_MILESTONE` - Learning streak achievements
- `PROGRESS_MILESTONE` - Course progress milestones

#### Payment Templates

- `PAYMENT_CONFIRMATION` - Payment and subscription confirmation

#### Instructor Templates

- `NEW_STUDENT_ENROLLMENT` - New student notifications

### Template Structure

```tsx
interface EmailTemplate {
  subject: string // "Welcome to Your Learning Journey! 🎓"
  htmlContent: string // Full HTML email with styling
  textContent: string // Plain text version
  category:
    | 'auth'
    | 'course'
    | 'progress'
    | 'payment'
    | 'notification'
    | 'instructor'
  variables: string[] // ['firstName', 'verificationLink']
}
```

## Loading States

### Using Loading Messages

```tsx
const { getLoadingMessage, getLoadingSequence } = useLoadingText()

// Single random message
const loading = getLoadingMessage('videoProcessing', 'uploading')

// Sequential messages for multi-step processes
const sequence = getLoadingSequence('videoProcessing', 'uploading')

// Fun educational messages for long waits
const funMessage = getFunLoadingMessage()
```

### Loading Categories

```tsx
// Video processing
videoProcessing: {
  uploading: [
    "Converting your video for optimal streaming...",
    "Analyzing video content and generating thumbnails...",
    "Optimizing audio quality and adding captions...",
    "Almost ready! Finalizing video processing..."
  ],
  streaming: [
    "Loading your lesson...",
    "Optimizing stream for your connection...",
    "Buffering... Almost ready to continue!"
  ]
}

// Course content
courseContent: {
  loading: [
    "Preparing your personalized learning experience...",
    "Syncing your progress across devices...",
    "Loading course materials..."
  ],
  enrollment: [
    "Processing your enrollment...",
    "Preparing your course dashboard..."
  ]
}

// AI assistant
aiAssistant: {
  thinking: [
    "Let me think about that for a moment...",
    "Searching through course materials...",
    "Crafting the perfect explanation..."
  ]
}
```

### Loading Display Component

```tsx
<LoadingDisplay
  category="videoProcessing"
  subcategory="uploading"
  showTips={true}
  className="my-loading-styles"
/>
```

## Accessibility System

### Using Accessibility Text

```tsx
const { getA11yText, announce, screenReader } = useAccessibilityText()

// Get accessibility text with variables
const videoProgress = getA11yText('videoPlayer.progress.seekBar', {
  currentTime: '2:30',
  totalTime: '10:00',
})

// Make announcements for screen readers
const announcement = announce('video', 'played')

// Use screen reader utilities
const progressDescription = screenReader.describeProgress(3, 10, 'lessons')
const timeDescription = screenReader.describeTime(150) // "2 minutes and 30 seconds"
const listDescription = screenReader.describeList(5, 'course')
```

### Accessibility Components

#### Live Announcer

```tsx
<LiveAnnouncer
  message="Video playback started"
  priority="polite"
  id="video-announcer"
/>
```

#### Progress Display

```tsx
<ProgressDisplay
  current={7}
  total={10}
  unit="lessons"
  showPercentage={true}
  className="course-progress"
/>
```

### ARIA Labels and Descriptions

```tsx
// Video player with full accessibility
<video
  aria-label={getA11yText('videoPlayer.player').label}
  aria-describedby="video-description"
>
  <source src={videoUrl} type="video/mp4" />
</video>

<div id="video-description" className="sr-only">
  {getA11yText('videoPlayer.player').description}
</div>

// Interactive button with state
<button
  aria-label={getA11yText('videoPlayer.controls.play').label}
  aria-describedby="play-hint"
  onClick={handlePlay}
>
  Play
</button>

<div id="play-hint" className="sr-only">
  {getA11yText('videoPlayer.controls.play').hint}
</div>
```

## Best Practices

### 1. Consistent Voice and Tone

- **Professional yet approachable** - Suitable for learning environments
- **Encouraging and supportive** - Builds confidence in learners
- **Clear and concise** - Eliminates confusion and ambiguity
- **Action-oriented** - Guides users toward desired outcomes

### 2. Error Message Guidelines

- **Explain what happened** in plain language
- **Provide clear next steps** or recovery actions
- **Include helpful context** without overwhelming the user
- **Use appropriate severity levels** (info, warning, error, critical)

### 3. Loading State Best Practices

- **Set expectations** with estimated times when possible
- **Provide educational value** with tips and facts during long waits
- **Use progressive disclosure** for multi-step processes
- **Keep messages relevant** to the current context

### 4. Accessibility Requirements

- **Provide alternative text** for all images and icons
- **Use semantic HTML** with proper ARIA labels
- **Support keyboard navigation** with clear focus indicators
- **Include screen reader announcements** for state changes

### 5. Email Template Guidelines

- **Mobile-first design** with responsive layouts
- **Clear call-to-action buttons** that stand out
- **Include both HTML and text versions** for compatibility
- **Test across email clients** to ensure proper rendering

## Advanced Usage

### Custom Error Handling

```tsx
function VideoPlayerWithErrorHandling() {
  const [error, setError] = useState<string | null>(null)
  const { getError } = useErrorText()

  const handleVideoError = (event: Event) => {
    const target = event.target as HTMLVideoElement

    switch (target.error?.code) {
      case MediaError.MEDIA_ERR_NETWORK:
        setError('VIDEO_NETWORK_ERROR')
        break
      case MediaError.MEDIA_ERR_DECODE:
        setError('VIDEO_FORMAT_UNSUPPORTED')
        break
      default:
        setError('VIDEO_LOAD_FAILED')
    }
  }

  return (
    <div>
      <video onError={handleVideoError} />
      {error && (
        <ErrorDisplay
          errorCode={error}
          onAction={() => {
            setError(null)
            // Retry logic here
          }}
        />
      )}
    </div>
  )
}
```

### Sequential Loading States

```tsx
function VideoUploadProcessor() {
  const [step, setStep] = useState(0)
  const { getLoadingSequence } = useLoadingText()
  const loadingSteps = getLoadingSequence('videoProcessing', 'uploading')

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % loadingSteps.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [loadingSteps.length])

  return (
    <LoadingDisplay
      category="videoProcessing"
      subcategory="uploading"
      showTips={step === 0} // Only show tips on first step
    />
  )
}
```

### Dynamic Email Generation

```tsx
async function sendCourseCompletionEmail(userId: string, courseId: string) {
  const user = await getUser(userId)
  const course = await getCourse(courseId)
  const template = getEmailTemplate('COURSE_COMPLETION_CERTIFICATE')

  const variables = {
    firstName: user.firstName,
    courseTitle: course.title,
    completionDate: new Date().toLocaleDateString(),
    certificateUrl: `${baseUrl}/certificates/${courseId}/${userId}`,
    nextCourseRecommendations: await getRecommendations(userId),
  }

  const htmlContent = replaceTemplateVariables(template.htmlContent, variables)
  const textContent = replaceTemplateVariables(template.textContent, variables)
  const subject = replaceTemplateVariables(template.subject, variables)

  await sendEmail({
    to: user.email,
    subject,
    html: htmlContent,
    text: textContent,
  })
}
```

## Customization

### Adding New Microcopy

1. **Add to main library** (`microcopy.ts`):

```tsx
export const microcopy = {
  // ... existing content
  newFeature: {
    welcome: 'Welcome to our new feature!',
    description: 'This feature helps you learn more effectively',
    cta: 'Try it now',
  },
}
```

2. **Create specialized hook**:

```tsx
export function useNewFeatureText() {
  const { text } = useMicrocopy()
  return text.newFeature
}
```

### Adding New Error Types

1. **Add to error messages** (`error-messages.ts`):

```tsx
'NEW_FEATURE_ERROR': {
  code: 'NEW_FEATURE_ERROR',
  title: 'Feature unavailable',
  message: 'This feature is temporarily unavailable.',
  severity: 'warning',
  action: {
    label: 'Try again later',
    onClick: () => window.location.reload()
  },
  icon: 'alert-triangle'
}
```

2. **Add to error categories**:

```tsx
export const errorCategories = {
  // ... existing categories
  newFeature: ['NEW_FEATURE_ERROR'],
}
```

### Adding New Email Templates

1. **Add template** (`email-templates.ts`):

```tsx
NEW_TEMPLATE: {
  subject: 'Your Subject Here',
  category: 'notification',
  variables: ['userName', 'actionUrl'],
  htmlContent: `<!-- HTML version -->`,
  textContent: `Plain text version`
}
```

2. **Update helper functions** if needed for new categories.

## Performance Considerations

### Bundle Size Optimization

- Tree-shake unused microcopy sections
- Lazy load email templates if not used on client
- Consider splitting large accessibility text into modules

### Caching Strategies

- Cache compiled email templates
- Memoize accessibility text computations
- Store user preference for error message verbosity

### Internationalization Preparation

- Structure supports easy i18n integration
- Variable substitution system works with translation keys
- ARIA labels can be localized while maintaining structure

This comprehensive microcopy system provides a solid foundation for creating inclusive, engaging, and professional user experiences across your video learning platform.
