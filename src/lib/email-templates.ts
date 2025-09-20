/**
 * Email Template Collection for Learning Platform
 *
 * Professional, branded email templates for all transactional communications.
 * Templates include both HTML and plain text versions for maximum compatibility.
 */

export interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent: string
  category:
    | 'auth'
    | 'course'
    | 'progress'
    | 'payment'
    | 'notification'
    | 'instructor'
  variables: Array<string>
}

export const emailTemplates: Record<string, EmailTemplate> = {
  // =============================================================================
  // AUTHENTICATION & ACCOUNT EMAILS
  // =============================================================================
  WELCOME_NEW_USER: {
    subject: 'Welcome to Your Learning Journey! 🎓',
    category: 'auth',
    variables: ['firstName', 'verificationLink'],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to StudyPlatform</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">Welcome to StudyPlatform</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Your journey to mastery begins now</p>
        </div>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px 0;">Hi {{firstName}}! 👋</h2>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">We're excited to help you learn, grow, and achieve your goals.</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #2563eb; margin-bottom: 15px;">Get Started in 3 Easy Steps:</h3>
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="display: flex; align-items: flex-start; gap: 15px;">
              <div style="background: #dbeafe; color: #2563eb; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; shrink: 0;">1</div>
              <div>
                <strong>Verify your email</strong><br>
                <span style="color: #666;">Click the button below to confirm your account</span>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 15px;">
              <div style="background: #dbeafe; color: #2563eb; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; shrink: 0;">2</div>
              <div>
                <strong>Complete your profile</strong><br>
                <span style="color: #666;">Tell us about your learning goals and interests</span>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 15px;">
              <div style="background: #dbeafe; color: #2563eb; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; shrink: 0;">3</div>
              <div>
                <strong>Start learning</strong><br>
                <span style="color: #666;">Browse our catalog and enroll in your first course</span>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <a href="{{verificationLink}}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email & Get Started</a>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">💡 Pro Tips for Success:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li>Set aside dedicated time each day for learning</li>
            <li>Take notes and practice what you learn</li>
            <li>Join course discussions to learn from others</li>
            <li>Don't hesitate to ask questions - we're here to help!</li>
          </ul>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>Need help? Reply to this email or visit our <a href="{{helpCenterUrl}}" style="color: #2563eb;">Help Center</a></p>
          <p style="margin: 10px 0 0 0;">Happy learning!<br>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
Welcome to StudyPlatform!

Hi {{firstName}},

We're excited to help you learn, grow, and achieve your goals.

Get Started in 3 Easy Steps:
1. Verify your email - Click the link below to confirm your account
2. Complete your profile - Tell us about your learning goals
3. Start learning - Browse our catalog and enroll in your first course

Verify your email: {{verificationLink}}

Pro Tips for Success:
• Set aside dedicated time each day for learning
• Take notes and practice what you learn
• Join course discussions to learn from others
• Don't hesitate to ask questions - we're here to help!

Need help? Reply to this email or visit our Help Center: {{helpCenterUrl}}

Happy learning!
The StudyPlatform Team
    `,
  },

  EMAIL_VERIFICATION: {
    subject: 'Verify Your Email Address',
    category: 'auth',
    variables: ['firstName', 'verificationLink'],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb;">Verify Your Email</h1>
        </div>

        <p>Hi {{firstName}},</p>

        <p>Please verify your email address to complete your account setup and access all features.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{verificationLink}}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>

        <p style="color: #666; font-size: 14px;">This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
Verify Your Email

Hi {{firstName}},

Please verify your email address to complete your account setup and access all features.

Verification link: {{verificationLink}}

This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.

The StudyPlatform Team
    `,
  },

  PASSWORD_RESET: {
    subject: 'Reset Your Password',
    category: 'auth',
    variables: ['firstName', 'resetLink'],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb;">Reset Your Password</h1>
        </div>

        <p>Hi {{firstName}},</p>

        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{resetLink}}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e;"><strong>Security tip:</strong> This link will expire in 1 hour for your security.</p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
Reset Your Password

Hi {{firstName}},

We received a request to reset your password. If you didn't make this request, you can safely ignore this email.

Reset your password: {{resetLink}}

Security tip: This link will expire in 1 hour for your security.

The StudyPlatform Team
    `,
  },

  // =============================================================================
  // COURSE ENROLLMENT & MANAGEMENT
  // =============================================================================
  COURSE_ENROLLMENT_CONFIRMATION: {
    subject: 'Welcome to {{courseTitle}}! 🎉',
    category: 'course',
    variables: [
      'firstName',
      'courseTitle',
      'instructorName',
      'courseUrl',
      'estimatedDuration',
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0 0 15px 0;">🎉 Enrollment Confirmed!</h1>
          <h2 style="margin: 0; font-weight: normal; opacity: 0.9;">{{courseTitle}}</h2>
        </div>

        <p>Hi {{firstName}},</p>

        <p>Congratulations! You're now enrolled in <strong>{{courseTitle}}</strong> with instructor {{instructorName}}. You're about to embark on an exciting learning journey!</p>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #0369a1;">📚 Course Details:</h3>
          <p style="margin: 5px 0;"><strong>Instructor:</strong> {{instructorName}}</p>
          <p style="margin: 5px 0;"><strong>Estimated Duration:</strong> {{estimatedDuration}}</p>
          <p style="margin: 5px 0;"><strong>Your Progress:</strong> Ready to start!</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{courseUrl}}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Start Learning Now</a>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">💡 Make the Most of Your Course:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li>Take notes as you watch each lesson</li>
            <li>Practice with the provided exercises</li>
            <li>Ask questions in the course discussion forum</li>
            <li>Set a regular study schedule</li>
          </ul>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Happy learning!<br>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
Enrollment Confirmed! 🎉

Hi {{firstName}},

Congratulations! You're now enrolled in {{courseTitle}} with instructor {{instructorName}}.

Course Details:
• Instructor: {{instructorName}}
• Estimated Duration: {{estimatedDuration}}
• Your Progress: Ready to start!

Start learning: {{courseUrl}}

Make the Most of Your Course:
• Take notes as you watch each lesson
• Practice with the provided exercises
• Ask questions in the course discussion forum
• Set a regular study schedule

Happy learning!
The StudyPlatform Team
    `,
  },

  // =============================================================================
  // PROGRESS & ACHIEVEMENT EMAILS
  // =============================================================================
  COURSE_COMPLETION_CERTIFICATE: {
    subject: "🏆 Congratulations! You've completed {{courseTitle}}",
    category: 'progress',
    variables: [
      'firstName',
      'courseTitle',
      'completionDate',
      'certificateUrl',
      'nextCourseRecommendations',
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">🏆</div>
          <h1 style="margin: 0 0 15px 0;">Congratulations!</h1>
          <h2 style="margin: 0; font-weight: normal; opacity: 0.9;">You've completed {{courseTitle}}</h2>
        </div>

        <p>Hi {{firstName}},</p>

        <p>What an achievement! You've successfully completed <strong>{{courseTitle}}</strong> on {{completionDate}}. Your dedication to learning is truly commendable.</p>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; color: #92400e;">📜 Your Certificate is Ready!</h3>
          <p style="margin: 0 0 20px 0; color: #92400e;">Share your achievement with the world</p>
          <a href="{{certificateUrl}}" style="background: #f59e0b; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Download Certificate</a>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; color: #0369a1;">🚀 Ready for Your Next Challenge?</h3>
          <p style="margin: 0 0 15px 0; color: #0369a1;">Based on what you've learned, here are some courses you might enjoy:</p>
          <div style="color: #1e40af;">{{nextCourseRecommendations}}</div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{dashboardUrl}}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Explore More Courses</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Keep up the excellent work!<br>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
🏆 Congratulations! You've completed {{courseTitle}}

Hi {{firstName}},

What an achievement! You've successfully completed {{courseTitle}} on {{completionDate}}. Your dedication to learning is truly commendable.

📜 Your Certificate is Ready!
Download your certificate: {{certificateUrl}}

🚀 Ready for Your Next Challenge?
Based on what you've learned, here are some courses you might enjoy:
{{nextCourseRecommendations}}

Explore more courses: {{dashboardUrl}}

Keep up the excellent work!
The StudyPlatform Team
    `,
  },

  LEARNING_STREAK_MILESTONE: {
    subject: "🔥 {{streakDays}}-Day Learning Streak! You're on fire!",
    category: 'progress',
    variables: [
      'firstName',
      'streakDays',
      'totalHours',
      'encouragementMessage',
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">🔥</div>
          <h1 style="margin: 0 0 15px 0;">{{streakDays}}-Day Streak!</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">You're absolutely crushing it!</p>
        </div>

        <p>Hi {{firstName}},</p>

        <p>{{encouragementMessage}} You've been learning consistently for {{streakDays}} days straight, and that's absolutely amazing!</p>

        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #dc2626;">📊 Your Learning Stats:</h3>
          <p style="margin: 5px 0;"><strong>Current Streak:</strong> {{streakDays}} days</p>
          <p style="margin: 5px 0;"><strong>Total Learning Time:</strong> {{totalHours}} hours</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> Learning Champion! 🏆</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">💡 Keep the Momentum Going:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li>Even 10 minutes of learning counts toward your streak</li>
            <li>Set reminders to maintain your consistency</li>
            <li>Share your achievement with friends for motivation</li>
            <li>Reward yourself for this amazing dedication!</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{continueUrl}}" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Continue Learning</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Keep the fire burning!<br>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
🔥 {{streakDays}}-Day Learning Streak!

Hi {{firstName}},

{{encouragementMessage}} You've been learning consistently for {{streakDays}} days straight!

📊 Your Learning Stats:
• Current Streak: {{streakDays}} days
• Total Learning Time: {{totalHours}} hours
• Status: Learning Champion! 🏆

💡 Keep the Momentum Going:
• Even 10 minutes of learning counts toward your streak
• Set reminders to maintain your consistency
• Share your achievement with friends for motivation
• Reward yourself for this amazing dedication!

Continue learning: {{continueUrl}}

Keep the fire burning!
The StudyPlatform Team
    `,
  },

  // =============================================================================
  // PAYMENT & BILLING EMAILS
  // =============================================================================
  PAYMENT_CONFIRMATION: {
    subject: 'Payment Confirmed - Welcome to Premium! 💎',
    category: 'payment',
    variables: [
      'firstName',
      'planName',
      'amount',
      'currency',
      'nextBillingDate',
      'invoiceUrl',
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">💎</div>
          <h1 style="margin: 0 0 15px 0;">Welcome to Premium!</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your payment has been confirmed</p>
        </div>

        <p>Hi {{firstName}},</p>

        <p>Thank you for your payment! Your {{planName}} subscription is now active, and you have access to all premium features.</p>

        <div style="background: #f8fafc; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #374151;">💳 Payment Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #666;">Plan:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: bold;">{{planName}}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #666;">Amount:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: bold;">{{amount}} {{currency}}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #666;">Next Billing:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: bold;">{{nextBillingDate}}</td>
            </tr>
          </table>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #0369a1;">🌟 Premium Benefits Now Available:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #0369a1;">
            <li>Unlimited access to all courses</li>
            <li>Download courses for offline viewing</li>
            <li>Priority support from instructors</li>
            <li>Advanced progress analytics</li>
            <li>Ad-free learning experience</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{explorerUrl}}" style="background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 10px;">Explore Premium Courses</a>
          <a href="{{invoiceUrl}}" style="background: transparent; color: #8b5cf6; padding: 15px 30px; text-decoration: none; border: 2px solid #8b5cf6; border-radius: 8px; font-weight: bold; display: inline-block;">Download Invoice</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Questions about billing? <a href="{{supportUrl}}" style="color: #8b5cf6;">Contact Support</a></p>
          <p style="margin: 10px 0 0 0;">The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
Payment Confirmed - Welcome to Premium! 💎

Hi {{firstName}},

Thank you for your payment! Your {{planName}} subscription is now active.

💳 Payment Details:
• Plan: {{planName}}
• Amount: {{amount}} {{currency}}
• Next Billing: {{nextBillingDate}}

🌟 Premium Benefits Now Available:
• Unlimited access to all courses
• Download courses for offline viewing
• Priority support from instructors
• Advanced progress analytics
• Ad-free learning experience

Explore premium courses: {{explorerUrl}}
Download invoice: {{invoiceUrl}}

Questions about billing? Contact Support: {{supportUrl}}

The StudyPlatform Team
    `,
  },

  // =============================================================================
  // INSTRUCTOR NOTIFICATIONS
  // =============================================================================
  NEW_STUDENT_ENROLLMENT: {
    subject: '👥 New Student Enrolled in {{courseTitle}}',
    category: 'instructor',
    variables: [
      'instructorName',
      'studentName',
      'courseTitle',
      'enrollmentCount',
      'courseUrl',
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">👥</div>
          <h1 style="margin: 0 0 15px 0;">New Student Enrolled!</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">{{courseTitle}}</p>
        </div>

        <p>Hi {{instructorName}},</p>

        <p>Great news! <strong>{{studentName}}</strong> has just enrolled in your course "{{courseTitle}}". You now have {{enrollmentCount}} students learning from you!</p>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #0369a1;">📊 Course Stats:</h3>
          <p style="margin: 5px 0;"><strong>Total Enrollments:</strong> {{enrollmentCount}}</p>
          <p style="margin: 5px 0;"><strong>Course:</strong> {{courseTitle}}</p>
          <p style="margin: 5px 0;"><strong>Latest Student:</strong> {{studentName}}</p>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px;">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">💡 Engage with Your Students:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #92400e;">
            <li>Welcome new students personally</li>
            <li>Answer questions promptly in discussions</li>
            <li>Share additional resources and tips</li>
            <li>Encourage students to practice and apply what they learn</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{courseUrl}}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Course Dashboard</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Keep inspiring minds!<br>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
👥 New Student Enrolled!

Hi {{instructorName}},

Great news! {{studentName}} has just enrolled in your course "{{courseTitle}}". You now have {{enrollmentCount}} students learning from you!

📊 Course Stats:
• Total Enrollments: {{enrollmentCount}}
• Course: {{courseTitle}}
• Latest Student: {{studentName}}

💡 Engage with Your Students:
• Welcome new students personally
• Answer questions promptly in discussions
• Share additional resources and tips
• Encourage students to practice and apply what they learn

View course dashboard: {{courseUrl}}

Keep inspiring minds!
The StudyPlatform Team
    `,
  },

  // =============================================================================
  // INSTRUCTOR DASHBOARD SPECIFIC EMAILS
  // =============================================================================
  COURSE_PUBLISHED_CONFIRMATION: {
    subject: '🎉 Your course "{{courseTitle}}" is now live!',
    category: 'instructor',
    variables: [
      'instructorName',
      'courseTitle',
      'courseUrl',
      'publishDate',
      'marketingKitUrl',
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
          <h1 style="margin: 0 0 15px 0;">Congratulations!</h1>
          <h2 style="margin: 0; font-weight: normal; opacity: 0.9;">Your course is now live</h2>
        </div>

        <p>Hi {{instructorName}},</p>

        <p>Fantastic news! Your course "<strong>{{courseTitle}}</strong>" has been successfully published and is now available to learners worldwide. Published on {{publishDate}}, students can now discover, preview, and enroll in your course.</p>

        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1e40af;">🚀 What happens next?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
            <li>Your course appears in search results and category listings</li>
            <li>Students can enroll and start learning immediately</li>
            <li>You'll receive notifications for enrollments and reviews</li>
            <li>Course analytics begin tracking student engagement</li>
          </ul>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; color: #92400e;">📈 Tips for success:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #92400e;">
            <li>Share your course on social media to boost initial enrollment</li>
            <li>Engage with early students and respond to questions promptly</li>
            <li>Monitor your course analytics to understand student behavior</li>
            <li>Consider creating promotional content to attract more learners</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{courseUrl}}" style="background: #3b82f6; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 10px;">View Live Course</a>
          <a href="{{marketingKitUrl}}" style="background: transparent; color: #3b82f6; padding: 15px 25px; text-decoration: none; border: 2px solid #3b82f6; border-radius: 8px; font-weight: bold; display: inline-block;">Get Marketing Kit</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Your teaching journey begins now!<br>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
🎉 Your course "{{courseTitle}}" is now live!

Hi {{instructorName}},

Fantastic news! Your course "{{courseTitle}}" has been successfully published and is now available to learners worldwide.

🚀 What happens next?
• Your course appears in search results and category listings
• Students can enroll and start learning immediately
• You'll receive notifications for enrollments and reviews
• Course analytics begin tracking student engagement

📈 Tips for success:
• Share your course on social media to boost initial enrollment
• Engage with early students and respond to questions promptly
• Monitor your course analytics to understand student behavior
• Consider creating promotional content to attract more learners

View live course: {{courseUrl}}
Get marketing kit: {{marketingKitUrl}}

Your teaching journey begins now!
The StudyPlatform Team
    `,
  },

  VIDEO_PROCESSING_COMPLETE: {
    subject: '✅ Video processed: "{{videoTitle}}" ready for students',
    category: 'instructor',
    variables: [
      'instructorName',
      'videoTitle',
      'courseName',
      'processingTime',
      'videoUrl',
      'addToCourseUrl',
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
          <h1 style="margin: 0 0 15px 0;">Video Ready!</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your video has been processed successfully</p>
        </div>

        <p>Hi {{instructorName}},</p>

        <p>Great news! Your video "<strong>{{videoTitle}}</strong>" has been successfully processed and optimized for streaming. It's now ready for your students across all devices.</p>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 15px 0; color: #065f46;">📹 Processing Details:</h3>
          <p style="margin: 5px 0; color: #065f46;"><strong>Video:</strong> {{videoTitle}}</p>
          <p style="margin: 5px 0; color: #065f46;"><strong>Course:</strong> {{courseName}}</p>
          <p style="margin: 5px 0; color: #065f46;"><strong>Processing Time:</strong> {{processingTime}}</p>
          <p style="margin: 5px 0; color: #065f46;"><strong>Status:</strong> Ready for students</p>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #0369a1;">🎯 Next Steps:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #0369a1;">
            <li>Preview your video to ensure quality meets your standards</li>
            <li>Edit auto-generated captions if needed</li>
            <li>Add the video to your course curriculum</li>
            <li>Notify students if this is a new lesson</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{videoUrl}}" style="background: #10b981; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 10px;">Preview Video</a>
          <a href="{{addToCourseUrl}}" style="background: transparent; color: #10b981; padding: 15px 25px; text-decoration: none; border: 2px solid #10b981; border-radius: 8px; font-weight: bold; display: inline-block;">Add to Course</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Happy teaching!<br>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
✅ Video processed: "{{videoTitle}}" ready for students

Hi {{instructorName}},

Great news! Your video "{{videoTitle}}" has been successfully processed and optimized for streaming.

📹 Processing Details:
• Video: {{videoTitle}}
• Course: {{courseName}}
• Processing Time: {{processingTime}}
• Status: Ready for students

🎯 Next Steps:
• Preview your video to ensure quality meets your standards
• Edit auto-generated captions if needed
• Add the video to your course curriculum
• Notify students if this is a new lesson

Preview video: {{videoUrl}}
Add to course: {{addToCourseUrl}}

Happy teaching!
The StudyPlatform Team
    `,
  },

  REVENUE_MILESTONE_100: {
    subject: "💰 Congratulations! You've earned your first $100",
    category: 'instructor',
    variables: [
      'instructorName',
      'totalRevenue',
      'courseCount',
      'studentCount',
      'nextPayoutDate',
      'dashboardUrl',
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">💰</div>
          <h1 style="margin: 0 0 15px 0;">First $100 Earned!</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">You're officially making money teaching!</p>
        </div>

        <p>Hi {{instructorName}},</p>

        <p>Fantastic milestone! You've reached your first <strong>${{ totalRevenue }}</strong> in course revenue. This proves that students value your expertise and are willing to invest in learning from you.</p>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin: 0 0 15px 0; color: #92400e;">📊 Your Teaching Impact:</h3>
          <p style="margin: 5px 0; color: #92400e;"><strong>Total Revenue:</strong> ${{ totalRevenue }}</p>
          <p style="margin: 5px 0; color: #92400e;"><strong>Courses Published:</strong> {{courseCount}}</p>
          <p style="margin: 5px 0; color: #92400e;"><strong>Students Taught:</strong> {{studentCount}}</p>
          <p style="margin: 5px 0; color: #92400e;"><strong>Next Payout:</strong> {{nextPayoutDate}}</p>
        </div>

        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1e40af;">🚀 Growing Your Revenue:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
            <li>Create additional courses to expand your catalog</li>
            <li>Optimize your course titles and descriptions</li>
            <li>Engage with students to improve ratings and reviews</li>
            <li>Consider promotional campaigns to boost enrollment</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{dashboardUrl}}" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Earnings Dashboard</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Keep up the excellent work!<br>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
💰 Congratulations! You've earned your first $100

Hi {{instructorName}},

Fantastic milestone! You've reached your first ${{ totalRevenue }} in course revenue.

📊 Your Teaching Impact:
• Total Revenue: ${{ totalRevenue }}
• Courses Published: {{courseCount}}
• Students Taught: {{studentCount}}
• Next Payout: {{nextPayoutDate}}

🚀 Growing Your Revenue:
• Create additional courses to expand your catalog
• Optimize your course titles and descriptions
• Engage with students to improve ratings and reviews
• Consider promotional campaigns to boost enrollment

View earnings dashboard: {{dashboardUrl}}

Keep up the excellent work!
The StudyPlatform Team
    `,
  },

  COURSE_REVIEW_NEEDED: {
    subject: '📝 Course revision needed: "{{courseTitle}}"',
    category: 'instructor',
    variables: [
      'instructorName',
      'courseTitle',
      'reviewFeedback',
      'editCourseUrl',
      'supportUrl',
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">📝</div>
          <h1 style="margin: 0 0 15px 0;">Course Revision Needed</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">Minor changes required before publication</p>
        </div>

        <p>Hi {{instructorName}},</p>

        <p>Your course "<strong>{{courseTitle}}</strong>" is almost ready for publication! Our review team has identified a few areas that need attention before we can approve it for the marketplace.</p>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin: 0 0 15px 0; color: #92400e;">📋 Required Changes:</h3>
          <div style="color: #92400e; background: white; padding: 15px; border-radius: 6px;">
            {{reviewFeedback}}
          </div>
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; color: #065f46;">✅ Don't worry - this is normal!</h3>
          <p style="margin: 0; color: #065f46;">Most courses require minor adjustments during the review process. These changes will help ensure your course provides the best possible experience for students. Once you've made these updates, simply resubmit your course for review.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{editCourseUrl}}" style="background: #f59e0b; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 10px;">Make Revisions</a>
          <a href="{{supportUrl}}" style="background: transparent; color: #f59e0b; padding: 15px 25px; text-decoration: none; border: 2px solid #f59e0b; border-radius: 8px; font-weight: bold; display: inline-block;">Contact Support</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>We're here to help you succeed!<br>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
📝 Course revision needed: "{{courseTitle}}"

Hi {{instructorName}},

Your course "{{courseTitle}}" is almost ready for publication! Our review team has identified a few areas that need attention.

📋 Required Changes:
{{reviewFeedback}}

✅ Don't worry - this is normal!
Most courses require minor adjustments during the review process. These changes will help ensure your course provides the best possible experience for students.

Make revisions: {{editCourseUrl}}
Contact support: {{supportUrl}}

We're here to help you succeed!
The StudyPlatform Team
    `,
  },

  STUDENT_QUESTION_ASKED: {
    subject: '❓ Student question in "{{courseTitle}}"',
    category: 'instructor',
    variables: [
      'instructorName',
      'studentName',
      'courseTitle',
      'lessonTitle',
      'questionText',
      'answerUrl',
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">❓</div>
          <h1 style="margin: 0 0 15px 0;">Student Needs Help</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">{{courseTitle}}</p>
        </div>

        <p>Hi {{instructorName}},</p>

        <p><strong>{{studentName}}</strong> asked a question in your course "<strong>{{courseTitle}}</strong>". Quick responses to student questions improve course ratings and student satisfaction.</p>

        <div style="background: #cffafe; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #06b6d4;">
          <h3 style="margin: 0 0 15px 0; color: #0e7490;">💬 Question Details:</h3>
          <p style="margin: 5px 0; color: #0e7490;"><strong>Student:</strong> {{studentName}}</p>
          <p style="margin: 5px 0; color: #0e7490;"><strong>Lesson:</strong> {{lessonTitle}}</p>
          <p style="margin: 15px 0 5px 0; color: #0e7490;"><strong>Question:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 6px; color: #0e7490; font-style: italic;">
            "{{questionText}}"
          </div>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; color: #92400e;">💡 Response Tips:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #92400e;">
            <li>Aim to respond within 24 hours</li>
            <li>Provide clear, detailed explanations</li>
            <li>Include relevant examples or resources</li>
            <li>Encourage follow-up questions if needed</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{answerUrl}}" style="background: #06b6d4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Answer Question</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Your expertise makes a difference!<br>The StudyPlatform Team</p>
        </div>
      </body>
      </html>
    `,
    textContent: `
❓ Student question in "{{courseTitle}}"

Hi {{instructorName}},

{{studentName}} asked a question in your course "{{courseTitle}}".

💬 Question Details:
• Student: {{studentName}}
• Lesson: {{lessonTitle}}
• Question: "{{questionText}}"

💡 Response Tips:
• Aim to respond within 24 hours
• Provide clear, detailed explanations
• Include relevant examples or resources
• Encourage follow-up questions if needed

Answer question: {{answerUrl}}

Your expertise makes a difference!
The StudyPlatform Team
    `,
  },
}

// Helper function to get template by key
export function getEmailTemplate(key: string): EmailTemplate | null {
  return emailTemplates[key] ?? null
}

// Helper function to get templates by category
export function getTemplatesByCategory(
  category: EmailTemplate['category'],
): Array<EmailTemplate> {
  return Object.values(emailTemplates).filter(
    (template) => template.category === category,
  )
}

// Helper function to replace variables in template content
export function replaceTemplateVariables(
  content: string,
  variables: Record<string, string>,
): string {
  let result = content

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value)
  }

  return result
}

// Email template categories
export const emailCategories = {
  auth: 'Authentication & Account',
  course: 'Course Management',
  progress: 'Learning Progress',
  payment: 'Billing & Payments',
  notification: 'Notifications',
  instructor: 'Instructor Updates',
} as const

export type EmailCategory = keyof typeof emailCategories
