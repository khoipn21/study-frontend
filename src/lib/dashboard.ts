export interface DashboardStats {
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  totalWatchTime: number // in minutes
  streakDays: number
  certificatesEarned: number
  forumPosts: number
  chatSessions: number
}

export interface LearningProgress {
  courseId: string
  courseTitle: string
  courseThumbnail?: string
  instructor: string
  progress: number // 0-100
  lastWatched?: string
  nextLecture?: {
    id: string
    title: string
    duration: number
  }
  estimatedTimeToComplete: number // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

export interface RecentActivity {
  id: string
  type: 'course_started' | 'lecture_completed' | 'certificate_earned' | 'forum_post' | 'chat_session' | 'achievement_unlocked'
  title: string
  description: string
  timestamp: string
  courseId?: string
  lectureId?: string
  metadata?: {
    progress?: number
    duration?: number
    points?: number
  }
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'learning' | 'engagement' | 'milestone' | 'special'
  points: number
  unlockedAt?: string
  progress?: {
    current: number
    target: number
    unit: string
  }
}

export interface StudyGoal {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  target: number
  current: number
  unit: 'minutes' | 'lectures' | 'courses' | 'forum_posts'
  deadline?: string
  isCompleted: boolean
  createdAt: string
}

export interface LearningPath {
  id: string
  title: string
  description: string
  courses: Array<{
    id: string
    title: string
    isCompleted: boolean
    isUnlocked: boolean
    order: number
  }>
  progress: number
  estimatedTime: number // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

export interface DashboardData {
  stats: DashboardStats
  recentProgress: LearningProgress[]
  recentActivity: RecentActivity[]
  achievements: Achievement[]
  studyGoals: StudyGoal[]
  learningPaths: LearningPath[]
  upcomingDeadlines: Array<{
    id: string
    title: string
    type: 'assignment' | 'quiz' | 'goal' | 'course_deadline'
    dueDate: string
    priority: 'low' | 'medium' | 'high'
  }>
  recommendations: Array<{
    id: string
    type: 'course' | 'lecture' | 'learning_path'
    title: string
    reason: string
    thumbnail?: string
    rating: number
    studentsCount: number
  }>
}

export class DashboardService {
  private static instance: DashboardService
  
  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService()
    }
    return DashboardService.instance
  }

  private constructor() {}

  async getDashboardData(userId: string): Promise<DashboardData> {
    try {
      const response = await fetch(`/api/v1/dashboard/user/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      return this.getMockDashboardData()
    }
  }

  async updateStudyGoal(goalId: string, progress: number): Promise<void> {
    try {
      const response = await fetch(`/api/v1/dashboard/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
      })
      
      if (!response.ok) throw new Error('Failed to update study goal')
    } catch (error) {
      console.error('Error updating study goal:', error)
    }
  }

  async createStudyGoal(goal: Omit<StudyGoal, 'id' | 'current' | 'isCompleted' | 'createdAt'>): Promise<StudyGoal> {
    try {
      const response = await fetch('/api/v1/dashboard/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goal),
      })
      
      if (!response.ok) throw new Error('Failed to create study goal')
      
      return await response.json()
    } catch (error) {
      console.error('Error creating study goal:', error)
      throw error
    }
  }

  async getWeeklyStats(userId: string): Promise<Array<{
    date: string
    minutes: number
    lecturesCompleted: number
    coursesStarted: number
  }>> {
    try {
      const response = await fetch(`/api/v1/dashboard/stats/weekly/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch weekly stats')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching weekly stats:', error)
      return this.getMockWeeklyStats()
    }
  }

  private getMockDashboardData(): DashboardData {
    return {
      stats: {
        totalCourses: 8,
        completedCourses: 3,
        inProgressCourses: 2,
        totalWatchTime: 1247, // minutes
        streakDays: 12,
        certificatesEarned: 3,
        forumPosts: 15,
        chatSessions: 28,
      },
      recentProgress: [
        {
          courseId: 'react-mastery',
          courseTitle: 'React Mastery: Build Modern Web Applications',
          courseThumbnail: '/course-thumbnails/react-mastery.jpg',
          instructor: 'Sarah Wilson',
          progress: 68,
          lastWatched: '2024-01-15T14:30:00Z',
          nextLecture: {
            id: 'react-hooks-advanced',
            title: 'Advanced React Hooks Patterns',
            duration: 25,
          },
          estimatedTimeToComplete: 120,
          difficulty: 'intermediate',
          category: 'Web Development',
        },
        {
          courseId: 'typescript-fundamentals',
          courseTitle: 'TypeScript Fundamentals for Modern Development',
          courseThumbnail: '/course-thumbnails/typescript.jpg',
          instructor: 'Michael Chen',
          progress: 34,
          lastWatched: '2024-01-14T09:15:00Z',
          nextLecture: {
            id: 'ts-generics',
            title: 'Understanding TypeScript Generics',
            duration: 18,
          },
          estimatedTimeToComplete: 200,
          difficulty: 'intermediate',
          category: 'Programming Languages',
        },
      ],
      recentActivity: [
        {
          id: 'activity_1',
          type: 'lecture_completed',
          title: 'Completed: React State Management',
          description: 'You finished the lecture on advanced state management patterns',
          timestamp: '2024-01-15T14:30:00Z',
          courseId: 'react-mastery',
          lectureId: 'state-management',
          metadata: {
            duration: 22,
            progress: 68,
          },
        },
        {
          id: 'activity_2',
          type: 'achievement_unlocked',
          title: 'Achievement Unlocked: Study Streak!',
          description: 'You maintained a 12-day learning streak',
          timestamp: '2024-01-15T08:00:00Z',
          metadata: {
            points: 100,
          },
        },
        {
          id: 'activity_3',
          type: 'forum_post',
          title: 'Posted in React Community',
          description: 'Asked a question about React performance optimization',
          timestamp: '2024-01-14T16:20:00Z',
        },
      ],
      achievements: [
        {
          id: 'first_course',
          title: 'First Steps',
          description: 'Complete your first course',
          icon: 'GraduationCap',
          category: 'milestone',
          points: 100,
          unlockedAt: '2024-01-10T12:00:00Z',
        },
        {
          id: 'study_streak_7',
          title: 'Week Warrior',
          description: 'Study for 7 consecutive days',
          icon: 'Flame',
          category: 'learning',
          points: 150,
          unlockedAt: '2024-01-12T08:00:00Z',
        },
        {
          id: 'community_contributor',
          title: 'Community Contributor',
          description: 'Make 10 helpful forum posts',
          icon: 'MessageSquare',
          category: 'engagement',
          points: 200,
          progress: {
            current: 7,
            target: 10,
            unit: 'posts',
          },
        },
        {
          id: 'speed_learner',
          title: 'Speed Learner',
          description: 'Complete 5 lectures in one day',
          icon: 'Zap',
          category: 'special',
          points: 300,
          progress: {
            current: 3,
            target: 5,
            unit: 'lectures',
          },
        },
      ],
      studyGoals: [
        {
          id: 'daily_30min',
          title: 'Daily Learning',
          description: 'Study for at least 30 minutes every day',
          type: 'daily',
          target: 30,
          current: 22,
          unit: 'minutes',
          isCompleted: false,
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'weekly_react',
          title: 'React Mastery Progress',
          description: 'Complete 5 React lectures this week',
          type: 'weekly',
          target: 5,
          current: 3,
          unit: 'lectures',
          deadline: '2024-01-21T23:59:59Z',
          isCompleted: false,
          createdAt: '2024-01-15T00:00:00Z',
        },
      ],
      learningPaths: [
        {
          id: 'frontend_developer',
          title: 'Frontend Developer Path',
          description: 'Master modern frontend development with React, TypeScript, and modern tools',
          courses: [
            { id: 'html-css-basics', title: 'HTML & CSS Fundamentals', isCompleted: true, isUnlocked: true, order: 1 },
            { id: 'javascript-essentials', title: 'JavaScript Essentials', isCompleted: true, isUnlocked: true, order: 2 },
            { id: 'react-fundamentals', title: 'React Fundamentals', isCompleted: true, isUnlocked: true, order: 3 },
            { id: 'react-mastery', title: 'React Mastery', isCompleted: false, isUnlocked: true, order: 4 },
            { id: 'typescript-fundamentals', title: 'TypeScript Fundamentals', isCompleted: false, isUnlocked: true, order: 5 },
            { id: 'next-js-complete', title: 'Next.js Complete Guide', isCompleted: false, isUnlocked: false, order: 6 },
          ],
          progress: 60,
          estimatedTime: 45,
          difficulty: 'intermediate',
          category: 'Web Development',
        },
      ],
      upcomingDeadlines: [
        {
          id: 'goal_deadline_1',
          title: 'React Mastery Weekly Goal',
          type: 'goal',
          dueDate: '2024-01-21T23:59:59Z',
          priority: 'medium',
        },
        {
          id: 'course_deadline_1',
          title: 'TypeScript Course Assignment',
          type: 'assignment',
          dueDate: '2024-01-25T23:59:59Z',
          priority: 'high',
        },
      ],
      recommendations: [
        {
          id: 'rec_1',
          type: 'course',
          title: 'Advanced React Patterns',
          reason: 'Based on your progress in React Mastery',
          thumbnail: '/course-thumbnails/advanced-react.jpg',
          rating: 4.8,
          studentsCount: 15420,
        },
        {
          id: 'rec_2',
          type: 'course',
          title: 'Node.js Backend Development',
          reason: 'Perfect complement to your frontend skills',
          thumbnail: '/course-thumbnails/nodejs.jpg',
          rating: 4.7,
          studentsCount: 12830,
        },
        {
          id: 'rec_3',
          type: 'learning_path',
          title: 'Full Stack Developer Path',
          reason: 'Natural progression from Frontend Developer Path',
          rating: 4.9,
          studentsCount: 8540,
        },
      ],
    }
  }

  private getMockWeeklyStats() {
    const today = new Date()
    const stats = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      stats.push({
        date: date.toISOString().split('T')[0],
        minutes: Math.floor(Math.random() * 90) + 10,
        lecturesCompleted: Math.floor(Math.random() * 4),
        coursesStarted: i === 6 ? 1 : Math.floor(Math.random() * 2),
      })
    }
    
    return stats
  }
}

export const dashboardService = DashboardService.getInstance()