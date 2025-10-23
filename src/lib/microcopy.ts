/**
 * Comprehensive Microcopy Library for Video Learning Platform
 *
 * This file contains all user-facing text organized by feature and context.
 * Designed for a professional yet approachable learning environment.
 */

export const microcopy = {
  // =============================================================================
  // VIDEO STREAMING & PLAYBACK
  // =============================================================================
  video: {
    quality: {
      adjusting: 'Adjusting video quality for smoother playback...',
      optimized: 'Video quality optimized for your connection',
      upgrading: 'Better connection detected. Upgrading to HD...',
      downgrading: 'Switching to lower quality for stable playback',
      settings: {
        auto: 'Auto (Recommended)',
        hd: 'HD 1080p',
        standard: 'Standard 720p',
        low: 'Low 480p',
        audioOnly: 'Audio Only',
      },
    },

    buffering: {
      loading: 'Loading your lesson...',
      optimizing: 'Optimizing stream for your connection...',
      almostReady: 'Almost ready to continue...',
      preparing: 'Preparing high-quality video...',
      reconnecting: 'Reconnecting to improve playback...',
    },

    playback: {
      play: 'Play lesson',
      pause: 'Pause lesson',
      replay: 'Replay from beginning',
      continue: 'Continue where you left off',
      skip: 'Skip to next lesson',
      previous: 'Go to previous lesson',
      speed: {
        label: 'Playback speed',
        options: {
          '0.5': '0.5x (Slow)',
          '0.75': '0.75x',
          '1': '1x (Normal)',
          '1.25': '1.25x',
          '1.5': '1.5x',
          '2': '2x (Fast)',
        },
      },
    },

    controls: {
      fullscreen: 'Enter fullscreen',
      exitFullscreen: 'Exit fullscreen',
      volume: 'Adjust volume',
      mute: 'Mute audio',
      unmute: 'Unmute audio',
      captions: 'Toggle captions',
      transcript: 'View transcript',
      notes: 'Take notes',
      bookmark: 'Bookmark this moment',
    },

    offline: {
      download: 'Download this lesson for offline viewing',
      downloading: 'Downloading lesson... {progress}% complete',
      downloaded: 'Lesson downloaded. Available offline',
      expired: 'Offline content expired. Redownload to continue',
      notAvailable: 'Offline viewing not available for this lesson',
    },

    errors: {
      connectionLost: 'Connection restored. Resuming video...',
      loadFailed: 'Unable to load video. Please check your connection',
      formatNotSupported: 'Video format not supported by your browser',
      restricted: 'This content requires course enrollment',
      expired: 'Your access to this content has expired',
    },
  },

  // =============================================================================
  // LEARNING PROGRESS & ACHIEVEMENTS
  // =============================================================================
  progress: {
    tracking: {
      started: "Great start! You've begun your learning journey",
      milestone25: "You're making excellent progress! 25% complete",
      milestone50: "Halfway there! You're doing amazing - 50% complete",
      milestone75: 'Almost finished! Keep up the great work - 75% complete',
      completed: "Congratulations! You've completed this course",
      resumed: 'Welcome back! Continuing from where you left off',
    },

    achievements: {
      firstLesson: 'Achievement unlocked: First Lesson Complete!',
      streakDay3: "🔥 3-day learning streak! You're on fire!",
      streakWeek1: '🏆 One week strong! Consistency is key to mastery',
      fastLearner: '⚡ Fast Learner: Completed 5 lessons in one day',
      nightOwl: '🦉 Night Owl: Learning after 10 PM',
      earlyBird: '🌅 Early Bird: Learning before 7 AM',
      perfectScore: '💯 Perfect Score: Aced the quiz on first try',
    },

    encouragement: {
      almostDone: "You're almost there! One more push to finish",
      keepGoing: "You're making great progress! Keep going",
      comeback: 'Welcome back! Ready to continue your journey?',
      dailyGoal: 'Just {minutes} minutes to reach your daily goal',
      weeklyGoal: "You're {percentage}% toward your weekly learning goal",
    },

    milestones: {
      chapterComplete: "Congratulations! You've mastered Chapter {number}",
      moduleComplete: 'Module complete! Ready for the next challenge?',
      skillUnlocked: 'New skill unlocked: {skill}',
      certificateEarned: 'Certificate earned! Share your achievement',
    },
  },

  // =============================================================================
  // AI ASSISTANT & CHATBOT
  // =============================================================================
  ai: {
    welcome: {
      first:
        "Hi! I'm your AI learning assistant. I'm here to help you understand concepts, answer questions, and guide your learning journey.",
      returning:
        "Welcome back! I'm here to help with your learning. What would you like to explore today?",
      contextual:
        "I noticed you're studying {topic}. Would you like me to explain any concepts or provide additional examples?",
    },

    prompts: {
      clarification:
        'Would you like me to explain this concept in more detail?',
      examples: 'I can provide more examples if that would be helpful',
      practice: 'Ready to test your understanding with a practice question?',
      summary: "Would you like a summary of what we've covered so far?",
      nextSteps:
        "Based on your progress, here's what I recommend studying next",
    },

    responses: {
      thinking: 'Let me think about that for a moment...',
      analyzing: 'Analyzing your question and finding the best answer...',
      preparing: 'Preparing a personalized explanation for you...',
      searching: 'Searching course materials for relevant information...',
      generating: 'Creating examples tailored to your learning style...',
    },

    tips: {
      studyTip:
        '💡 Pro tip: Try the practice exercises to reinforce your learning',
      timeManagement:
        '⏰ Consider taking a 5-minute break to help retain information',
      reviewSuggestion:
        '📚 You might want to review the previous lesson before continuing',
      practiceReminder:
        '🎯 Practice makes perfect! Try the interactive exercises',
      notesTip: '📝 Taking notes can improve retention by up to 34%',
    },

    errors: {
      unavailable: "I'm temporarily unavailable. Please try again in a moment",
      overloaded: "I'm currently helping many students. Please wait a moment",
      misunderstood:
        "I didn't quite understand that. Could you rephrase your question?",
      outOfScope:
        "That's outside my expertise area, but I can help with course content",
      technical: "I'm experiencing technical difficulties. Please try again",
    },
  },

  // =============================================================================
  // COURSE NAVIGATION & ENROLLMENT
  // =============================================================================
  courses: {
    enrollment: {
      enroll: 'Enroll in Course',
      enrolling: 'Processing enrollment...',
      enrolled: 'Successfully enrolled! Ready to start learning?',
      alreadyEnrolled: "You're already enrolled in this course",
      requiresPayment: 'Complete payment to access full course content',
      preview: 'Preview this course',
      startLearning: 'Start Learning',
      continueLearning: 'Continue Learning',
    },

    navigation: {
      previousLesson: 'Previous Lesson',
      nextLesson: 'Next Lesson',
      backToCourse: 'Back to Course Overview',
      viewAllLessons: 'View All Lessons',
      courseProgress: 'Course Progress: {percentage}%',
      timeRemaining: 'Approximately {time} remaining',
      completionTime: 'Estimated completion: {time}',
    },

    filters: {
      all: 'All Courses',
      myLearning: 'My Learning',
      inProgress: 'In Progress',
      completed: 'Completed',
      bookmarked: 'Bookmarked',
      difficulty: {
        beginner: 'Beginner Friendly',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      },
    },

    status: {
      draft: 'Coming Soon',
      published: 'Available Now',
      archived: 'No Longer Available',
      premium: 'Premium Content',
      free: 'Free Course',
    },
  },

  // =============================================================================
  // USER AUTHENTICATION & ACCOUNT
  // =============================================================================
  auth: {
    login: {
      welcome: 'Welcome back to your learning journey',
      title: 'Sign In',
      email: 'Email address',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      noAccount: 'New to learning? Create an account',
      socialLogin: 'Continue with {provider}',
      rememberMe: 'Keep me signed in',
    },

    register: {
      welcome: 'Start your learning journey today',
      title: 'Create Account',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      password: 'Create password',
      confirmPassword: 'Confirm password',
      hasAccount: 'Already have an account? Sign in',
      terms: 'I agree to the Terms of Service and Privacy Policy',
    },

    forgotPassword: {
      title: 'Reset Your Password',
      description: "Enter your email and we'll send you a reset link",
      email: 'Email address',
      submit: 'Send Reset Link',
      sent: 'Reset link sent! Check your email',
      backToLogin: 'Back to Sign In',
    },

    profile: {
      title: 'Your Learning Profile',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password',
      notifications: 'Notification Settings',
      privacy: 'Privacy Settings',
      deleteAccount: 'Delete Account',
      signOut: 'Sign Out',
    },

    settings: {
      title: 'Settings',
      profile: 'Profile',
      security: 'Security',
      account: 'Account',
      personalInfo: 'Personal Information',
      username: 'Username',
      email: 'Email',
      avatar: 'Profile Picture',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      saving: 'Saving...',
      passwordManagement: 'Password Management',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      passwordRequirements: 'Password must be at least 8 characters long',
      passwordMismatch: 'Passwords do not match',
      updateSuccess: 'Profile updated successfully',
      updateError: 'Failed to update profile',
      passwordSuccess: 'Password changed successfully',
      passwordError: 'Failed to change password',
      invalidCurrentPassword: 'Current password is incorrect',
    },
  },

  // =============================================================================
  // LOADING STATES & PROCESSING
  // =============================================================================
  loading: {
    video: {
      processing: 'Converting your video for optimal streaming...',
      uploading: 'Uploading video... {percentage}% complete',
      analyzing: 'Analyzing video content for best quality...',
      preparing: 'Preparing your video for all devices...',
      finalizing: 'Almost ready! Finalizing video processing...',
    },

    course: {
      loading: 'Loading course content...',
      preparing: 'Preparing your personalized learning experience...',
      syncing: 'Syncing your progress across devices...',
      updating: 'Updating course materials...',
      optimizing: 'Optimizing content for your connection...',
    },

    ai: {
      thinking: 'Let me think about that...',
      analyzing: 'Analyzing your question...',
      generating: 'Crafting the perfect explanation...',
      searching: 'Finding the most relevant information...',
      personalizing: 'Tailoring response to your learning style...',
    },

    data: {
      syncing: 'Syncing your data across devices...',
      backup: 'Backing up your progress...',
      restore: 'Restoring your learning history...',
      updating: 'Updating your dashboard...',
      calculating: 'Calculating your progress statistics...',
    },

    general: {
      loading: 'Loading...',
      processing: 'Processing your request...',
      almostDone: 'Almost finished...',
      preparing: 'Preparing your content...',
      optimizing: 'Optimizing for the best experience...',
    },
  },

  // =============================================================================
  // COMPREHENSIVE ERROR MESSAGES
  // =============================================================================
  errors: {
    network: {
      offline: {
        title: "You're offline",
        message:
          'No internet connection detected. Some features may be limited.',
        action: 'Continue with downloaded content',
      },
      slow: {
        title: 'Slow connection detected',
        message:
          "We've automatically adjusted video quality for smoother playback.",
        action: 'Change quality settings',
      },
      timeout: {
        title: 'Connection timeout',
        message:
          'The request took too long. Please check your internet connection.',
        action: 'Try again',
      },
      failed: {
        title: 'Connection failed',
        message: 'Unable to connect to our servers. Please try again.',
        action: 'Retry connection',
      },
    },

    video: {
      loadFailed: {
        title: 'Video unavailable',
        message:
          "We couldn't load this video. It might be processing or temporarily unavailable.",
        action: 'Try refreshing the page',
      },
      formatUnsupported: {
        title: 'Video format not supported',
        message:
          "Your browser doesn't support this video format. Try using a modern browser.",
        action: 'Update browser',
      },
      corrupted: {
        title: 'Video file corrupted',
        message: "This video appears to be damaged. We're working to fix it.",
        action: 'Report issue',
      },
      processing: {
        title: 'Video still processing',
        message:
          'This video is being optimized for streaming. Please check back in a few minutes.',
        action: 'Check again later',
      },
    },

    auth: {
      invalidCredentials: {
        title: 'Invalid credentials',
        message:
          'The email or password you entered is incorrect. Please try again.',
        action: 'Reset password',
      },
      accountLocked: {
        title: 'Account temporarily locked',
        message:
          'Too many failed login attempts. Please wait 15 minutes or reset your password.',
        action: 'Reset password',
      },
      sessionExpired: {
        title: 'Session expired',
        message:
          "You've been signed out for security. Please sign in again to continue.",
        action: 'Sign in again',
      },
      accessDenied: {
        title: 'Access denied',
        message:
          "You don't have permission to view this content. Enrollment may be required.",
        action: 'View enrollment options',
      },
    },

    payment: {
      cardDeclined: {
        title: 'Payment declined',
        message:
          'Your card was declined. Please check your details or try a different payment method.',
        action: 'Update payment method',
      },
      processingError: {
        title: 'Payment processing error',
        message:
          "There was an issue processing your payment. You haven't been charged.",
        action: 'Try again',
      },
      subscriptionExpired: {
        title: 'Subscription expired',
        message:
          'Your subscription has expired. Renew to continue accessing premium content.',
        action: 'Renew subscription',
      },
    },

    upload: {
      fileTooLarge: {
        title: 'File too large',
        message: "The file you're trying to upload exceeds our 2GB limit.",
        action: 'Choose smaller file',
      },
      formatNotSupported: {
        title: 'File format not supported',
        message: 'Please upload videos in MP4, MOV, or AVI format.',
        action: 'Convert file format',
      },
      uploadFailed: {
        title: 'Upload failed',
        message:
          'Something went wrong during upload. Your progress has been saved.',
        action: 'Resume upload',
      },
    },

    general: {
      somethingWrong: {
        title: 'Something went wrong',
        message: 'An unexpected error occurred. Our team has been notified.',
        action: 'Try again',
      },
      maintenance: {
        title: 'Scheduled maintenance',
        message:
          "We're performing brief maintenance to improve your experience. We'll be back shortly.",
        action: 'Check status page',
      },
      featureUnavailable: {
        title: 'Feature temporarily unavailable',
        message: 'This feature is being updated. Please check back soon.',
        action: 'Return to dashboard',
      },
    },
  },

  // =============================================================================
  // ACCESSIBILITY SUPPORT
  // =============================================================================
  accessibility: {
    screenReader: {
      videoPlayer: 'Video player for lesson: {title}',
      playButton: 'Play video lesson',
      pauseButton: 'Pause video playback',
      progressBar: 'Video progress: {current} of {total}',
      volumeSlider: 'Volume control, currently at {level}%',
      qualitySelector: 'Video quality selector, currently {quality}',
      fullscreenToggle: 'Toggle fullscreen mode',
      captionsToggle: 'Toggle closed captions',
      courseProgress:
        'Course progress: {completed} of {total} lessons completed',
      navigationMenu: 'Course navigation menu',
      lessonList: 'List of {count} lessons in this course',
    },

    altText: {
      courseThumbnail: 'Course thumbnail for {title}',
      instructorPhoto: 'Photo of instructor {name}',
      achievementBadge: 'Achievement badge for {achievement}',
      progressChart: 'Progress chart showing {percentage}% completion',
      loadingSpinner: 'Content is loading, please wait',
      errorIcon: 'Error indicator',
      successIcon: 'Success indicator',
      warningIcon: 'Warning indicator',
    },

    announcements: {
      videoStarted: 'Video playback started',
      videoPaused: 'Video playback paused',
      videoEnded: 'Video playback completed',
      lessonCompleted: 'Lesson marked as complete',
      progressSaved: 'Your progress has been saved',
      qualityChanged: 'Video quality changed to {quality}',
      errorOccurred: 'An error has occurred: {message}',
    },
  },

  // =============================================================================
  // NOTIFICATIONS & REMINDERS
  // =============================================================================
  notifications: {
    study: {
      dailyReminder:
        'Time to continue your learning journey! You have {minutes} minutes until your daily goal.',
      streakRisk:
        "Don't break your {days}-day streak! Complete a lesson today.",
      newContent: 'New lesson available in {course}',
      assignmentDue: 'Assignment due tomorrow in {course}',
      liveSession: 'Live session with {instructor} starts in {minutes} minutes',
    },

    progress: {
      milestone: "Congratulations! You've completed {percentage}% of {course}",
      certificate: "You've earned a certificate for completing {course}!",
      skillMastery: "You've mastered {skill}! Ready for the next challenge?",
      weeklyGoal: "You've reached your weekly learning goal of {hours} hours!",
    },

    social: {
      forumReply: '{user} replied to your forum post',
      studyBuddy: '{user} completed the same lesson as you',
      instructorMessage: 'New message from your instructor',
      groupActivity: 'New activity in your study group',
    },

    system: {
      maintenance: 'Scheduled maintenance tonight from 2-4 AM EST',
      newFeature: 'New feature available: {feature}',
      securityAlert: 'New sign-in detected from {location}',
      dataExport: 'Your data export is ready for download',
    },
  },

  // =============================================================================
  // CALL-TO-ACTION MESSAGES
  // =============================================================================
  cta: {
    enrollment: {
      primary: 'Start Learning Today',
      secondary: 'Enroll Now',
      free: 'Get Started Free',
      trial: 'Start Free Trial',
      upgrade: 'Upgrade to Premium',
    },

    engagement: {
      takeQuiz: 'Test Your Knowledge',
      nextLesson: 'Continue to Next Lesson',
      practiceExercise: 'Try Practice Exercise',
      joinDiscussion: 'Join the Discussion',
      shareProgress: 'Share Your Achievement',
    },

    completion: {
      finishCourse: 'Complete Your Course',
      earnCertificate: 'Earn Your Certificate',
      reviewContent: "Review What You've Learned",
      rateExperience: 'Rate This Course',
      exploreMore: 'Explore More Courses',
    },
  },

  // =============================================================================
  // INSTRUCTOR DASHBOARD
  // =============================================================================
  instructor: {
    // Welcome & Onboarding
    welcome: {
      first: {
        title: 'Welcome to your Instructor Dashboard!',
        subtitle:
          'Transform your expertise into engaging online courses that inspire and educate learners worldwide.',
        cta: 'Create Your First Course',
      },
      returning: {
        title: 'Welcome back, {name}!',
        subtitle: 'Ready to continue building amazing learning experiences?',
        quickStats:
          'Your courses have {students} enrolled students and {revenue} in earnings',
      },
      milestone: {
        first100:
          "Congratulations! You've reached 100 students across your courses",
        first1000: 'Amazing achievement! 1,000+ students are learning from you',
        firstRevenue:
          'Your first earnings milestone: ${amount} in course revenue!',
      },
    },

    // Course Creation & Management
    courses: {
      creation: {
        title: 'Create New Course',
        subtitle:
          'Share your knowledge and build a course that makes a difference',
        steps: {
          planning: 'Plan your course structure and learning objectives',
          content: 'Upload your video lessons and course materials',
          details: 'Add course description, pricing, and preview content',
          review: 'Review and publish your course to the marketplace',
        },
        tips: {
          structure: 'Well-structured courses see 40% higher completion rates',
          quality: 'High-quality video keeps students engaged longer',
          description: 'Clear course descriptions improve enrollment by 60%',
          preview: 'Preview videos increase enrollment rates by 30%',
        },
      },

      status: {
        draft: {
          label: 'Draft',
          description:
            'Your course is being prepared and not yet visible to students',
          nextStep: 'Continue editing to publish',
        },
        review: {
          label: 'Under Review',
          description:
            'Our team is reviewing your course for quality and compliance',
          timeframe: 'Reviews typically take 24-48 hours',
        },
        published: {
          label: 'Published',
          description: 'Your course is live and available to students',
          action: 'View live course',
        },
        suspended: {
          label: 'Suspended',
          description: 'Course temporarily unavailable due to policy review',
          action: 'Contact support',
        },
      },

      management: {
        editCourse: 'Edit Course Content',
        viewAnalytics: 'View Performance Analytics',
        manageStudents: 'Manage Enrolled Students',
        updatePricing: 'Update Course Pricing',
        promoteCourse: 'Promote Your Course',
      },
    },

    // Video Upload & Processing
    video: {
      upload: {
        dragDrop: 'Drag and drop your video files here, or click to browse',
        supported: 'Supported formats: MP4, MOV, AVI (max 5GB per file)',
        processing:
          'Your video is being processed for optimal streaming quality',
        queue: "Video queued for processing. We'll notify you when it's ready.",

        progress: {
          uploading: 'Uploading: {filename} ({progress}% complete)',
          processing: 'Processing: {filename} - Optimizing for all devices',
          complete: 'Complete: {filename} is ready for your students',
        },

        tips: {
          quality: 'For best results, upload videos in 1080p HD resolution',
          audio:
            'Clear audio is crucial - consider using an external microphone',
          length: 'Keep lessons 5-15 minutes for optimal engagement',
          lighting:
            'Good lighting makes a significant difference in video quality',
        },
      },

      processing: {
        analyzing: 'Analyzing your video for optimal compression and quality',
        transcoding: 'Converting your video for smooth playback on all devices',
        thumbnails: 'Generating thumbnail options for your video',
        captions: 'Auto-generating captions (you can edit these later)',
        finalizing: 'Almost done! Preparing your video for student viewing',

        estimated:
          'Estimated processing time: {minutes} minutes for {duration} video',
        notification: "We'll email you when processing is complete",
      },

      errors: {
        uploadFailed: {
          title: 'Upload failed',
          message:
            'There was an issue uploading your video. Your progress has been saved.',
          actions: ['Resume Upload', 'Try Different File', 'Contact Support'],
        },
        processingFailed: {
          title: 'Processing failed',
          message: 'We encountered an issue processing your video file.',
          actions: ['Try Again', 'Upload Different Format', 'Get Help'],
        },
        corruptFile: {
          title: 'File appears corrupted',
          message: 'The video file seems to be damaged or incomplete.',
          actions: [
            'Upload Again',
            'Try Different File',
            'Check File Integrity',
          ],
        },
        quotaExceeded: {
          title: 'Storage quota exceeded',
          message:
            "You've reached your storage limit. Upgrade or delete unused content.",
          actions: ['Upgrade Plan', 'Manage Storage', 'Delete Old Files'],
        },
      },
    },

    // Analytics & Performance
    analytics: {
      overview: {
        title: 'Course Performance Overview',
        subtitle:
          'Track how your courses are performing and engage with your students',

        metrics: {
          totalStudents: 'Total Enrolled Students',
          averageRating: 'Average Course Rating',
          completionRate: 'Average Completion Rate',
          totalRevenue: 'Total Revenue Generated',
          monthlyEarnings: "This Month's Earnings",
          activeStudents: 'Active Students (Last 30 Days)',
        },

        insights: {
          trend:
            'Your enrollment is trending {direction} with {percentage}% change this month',
          performance:
            'Your courses perform {comparison} compared to similar courses',
          engagement:
            'Student engagement is {level} with {time} average watch time',
        },
      },

      engagement: {
        watchTime:
          'Students spent {hours} hours learning from your courses this month',
        completion:
          '{percentage}% of students complete your courses (platform average: {average}%)',
        ratings: 'Your courses maintain a {rating}/5 star average rating',
        feedback: 'You have {count} new student reviews to respond to',
      },

      loading: {
        calculating: 'Calculating your course analytics...',
        aggregating: 'Aggregating student data across all courses...',
        updating: 'Updating real-time performance metrics...',
        generating: 'Generating detailed insights for your dashboard...',
      },
    },

    // Student Management
    students: {
      overview: {
        title: 'Your Students',
        subtitle: 'Connect with and support your learning community',

        stats: {
          total: '{count} total students across all courses',
          active: '{count} students active in the last 7 days',
          completed: '{count} students have completed at least one course',
          engaged: '{count} students have left reviews or asked questions',
        },
      },

      communication: {
        announcement: {
          title: 'Send Course Announcement',
          placeholder:
            'Share important updates, resources, or encouragement with your students...',
          send: 'Send to All Students',
          schedule: 'Schedule for Later',
        },

        responses: {
          questions: 'You have {count} new student questions awaiting response',
          reviews: '{count} recent reviews on your courses',
          discussions: '{count} active discussions in your course forums',
        },
      },

      support: {
        helpCenter: 'Student asked for help with: "{topic}"',
        technical: 'Technical issue reported in: {lesson}',
        feedback: 'Course feedback received: {rating}/5 stars',
        suggestion: 'Student suggestion: "{content}"',
      },
    },

    // Revenue & Earnings
    revenue: {
      overview: {
        title: 'Earnings Dashboard',
        subtitle: 'Track your course revenue and payment information',

        metrics: {
          thisMonth: 'This Month: ${amount}',
          lastMonth: 'Last Month: ${amount} ({change}% change)',
          allTime: 'All-Time Revenue: ${amount}',
          pending: 'Pending Payout: ${amount}',
          nextPayout: 'Next Payout: {date}',
        },
      },

      milestones: {
        first100: "Congratulations! You've earned your first $100",
        first1000: 'Amazing milestone: $1,000 in course revenue!',
        first5000: 'Outstanding achievement: $5,000 earned from teaching!',
        monthly1000: "You've hit $1,000 monthly recurring revenue!",
      },

      payouts: {
        processing: 'Your payout of ${amount} is being processed',
        sent: 'Payout of ${amount} sent to your account on {date}',
        failed: 'Payout failed - please update your payment information',
        scheduled: 'Next automatic payout scheduled for {date}',
      },
    },

    // Course Quality & Compliance
    quality: {
      review: {
        pending: 'Your course is being reviewed for quality and compliance',
        approved: "Course approved! It's now live on the marketplace",
        changes: 'Minor changes requested - please review the feedback',
        rejected: 'Course needs revision before publication',
      },

      guidelines: {
        content: 'Ensure your content is original and provides clear value',
        video: 'Videos should be high quality with clear audio',
        description:
          'Course descriptions should accurately represent the content',
        structure: 'Organize content in logical, easy-to-follow sections',
      },

      feedback: {
        improvements: 'Suggestions for improving your course quality',
        technical: 'Technical requirements for course submission',
        content: 'Content guidelines and best practices',
        marketing: 'Tips for writing compelling course descriptions',
      },
    },

    // Help & Support
    support: {
      quickHelp: {
        title: 'Quick Help',
        topics: [
          'How to upload and organize course content',
          'Best practices for video quality',
          'Understanding course analytics',
          'Managing student communications',
          'Optimizing course descriptions',
          'Pricing strategies for courses',
        ],
      },

      resources: {
        teachingGuide: 'Complete Guide to Online Teaching',
        videoTips: 'Video Production Best Practices',
        marketingHelp: 'Course Marketing Strategies',
        communityForum: 'Instructor Community Forum',
        supportTicket: 'Submit Support Ticket',
      },

      contact: {
        general: 'General questions about teaching on our platform',
        technical: 'Technical issues with course creation or uploads',
        billing: 'Questions about payments and revenue',
        policy: 'Course guidelines and policy questions',
      },
    },

    // Empty States
    empty: {
      noCourses: {
        title: 'Ready to share your expertise?',
        message:
          'Create your first course and start building your teaching career',
        cta: 'Create Your First Course',
        tips: [
          "Choose a topic you're passionate about",
          'Plan your course structure before recording',
          'Start with shorter lessons for better engagement',
        ],
      },

      noStudents: {
        title: 'Your students will appear here',
        message:
          "Once students enroll in your courses, you'll see their progress and can communicate with them",
        cta: 'Promote Your Course',
      },

      noAnalytics: {
        title: 'Analytics will show once you have student activity',
        message:
          'Data will appear here as students enroll and engage with your courses',
        tips: [
          'Share your course on social media',
          'Optimize your course title and description',
          'Create engaging preview content',
        ],
      },

      noRevenue: {
        title: 'Start earning from your expertise',
        message:
          'Your revenue will be tracked here once students purchase your courses',
        cta: 'Set Course Pricing',
      },
    },

    // Loading States
    loading: {
      dashboard: 'Loading your instructor dashboard...',
      courses: 'Loading your course library...',
      analytics: 'Calculating course performance metrics...',
      students: 'Loading student information...',
      revenue: 'Loading earnings data...',
      uploads: 'Processing your video uploads...',
    },

    // Success Messages
    success: {
      courseCreated:
        'Course created successfully! You can now add content and publish.',
      coursePublished:
        'Your course is now live! Students can discover and enroll.',
      videoUploaded: 'Video uploaded successfully and is being processed.',
      announcementSent: 'Announcement sent to all enrolled students.',
      priceUpdated: 'Course pricing updated successfully.',
      profileUpdated: 'Your instructor profile has been updated.',
    },

    // Confirmation Messages
    confirmations: {
      deleteCourse: {
        title: 'Delete Course',
        message:
          'Are you sure you want to delete "{courseTitle}"? This action cannot be undone.',
        warning:
          'This will remove the course for all {studentCount} enrolled students.',
        actions: ['Cancel', 'Delete Course'],
      },

      unpublishCourse: {
        title: 'Unpublish Course',
        message: 'This will make your course unavailable to new students.',
        impact: 'Existing students will retain access to the content.',
        actions: ['Cancel', 'Unpublish'],
      },

      massAnnouncement: {
        title: 'Send to All Students',
        message:
          'This announcement will be sent to {count} students across all your courses.',
        actions: ['Cancel', 'Send Announcement'],
      },
    },

    // Tooltips & Help Text
    tooltips: {
      courseTitle:
        'Choose a clear, descriptive title that explains what students will learn',
      pricing:
        'Consider your target audience and course value when setting prices',
      categories:
        'Select the most relevant category to help students find your course',
      prerequisites:
        'List any skills or knowledge students need before taking your course',
      learningOutcomes:
        'Describe specific skills students will gain after completing your course',
      videoQuality:
        "Upload in highest quality available - we'll optimize for all devices",
      courseThumbnail:
        'Eye-catching thumbnails can increase enrollment by up to 30%',
      promoCodes:
        'Promotional codes can help boost initial enrollment and reviews',
    },

    // Notifications
    notifications: {
      newStudent: '{studentName} just enrolled in your course "{courseTitle}"',
      newReview: 'New {rating}-star review on "{courseTitle}": "{excerpt}"',
      milestone: "Congratulations! You've reached {count} total students",
      payout: 'Your earnings of ${amount} have been processed',
      courseApproved:
        'Great news! Your course "{courseTitle}" has been approved',
      videoProcessed: 'Video "{title}" is now ready for students',
      questionAsked: 'New student question in "{courseTitle}": "{preview}"',
      achievement: 'Achievement unlocked: {achievementName}',
    },
  },
} as const

// Type definitions for TypeScript support
export type MicrocopyKeys = keyof typeof microcopy
export type VideoKeys = keyof typeof microcopy.video
export type ProgressKeys = keyof typeof microcopy.progress
export type AIKeys = keyof typeof microcopy.ai
export type ErrorKeys = keyof typeof microcopy.errors
export type InstructorKeys = keyof typeof microcopy.instructor
