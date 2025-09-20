export interface ForumUser {
  id: string
  username: string
  avatar?: string
  role: 'student' | 'instructor' | 'admin'
  reputation: number
  joinDate: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: ForumUser
  courseId?: string
  category: ForumCategory
  tags: Array<string>
  createdAt: string
  updatedAt: string
  views: number
  votes: number
  isLocked: boolean
  isPinned: boolean
  isSolved: boolean
  replies: Array<ForumReply>
  userVote?: 'up' | 'down' | null
}

export interface ForumReply {
  id: string
  content: string
  author: ForumUser
  postId: string
  parentId?: string
  createdAt: string
  updatedAt: string
  votes: number
  isAccepted: boolean
  userVote?: 'up' | 'down' | null
  replies?: Array<ForumReply>
}

export interface ForumCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  postCount: number
}

export interface ForumStats {
  totalPosts: number
  totalReplies: number
  totalUsers: number
  mostActiveUsers: Array<ForumUser>
  recentPosts: Array<ForumPost>
}

export interface CreatePostData {
  title: string
  content: string
  categoryId: string
  courseId?: string
  tags: Array<string>
}

export interface CreateReplyData {
  content: string
  postId: string
  parentId?: string
}

export class ForumService {
  private static instance: ForumService

  public static getInstance(): ForumService {
    if (ForumService.instance === undefined) {
      ForumService.instance = new ForumService()
    }
    return ForumService.instance
  }

  private constructor() {}

  async getPosts(params: {
    categoryId?: string
    courseId?: string
    search?: string
    sortBy?: 'recent' | 'popular' | 'unanswered' | 'solved'
    page?: number
    limit?: number
  }): Promise<{ posts: Array<ForumPost>; total: number }> {
    const {
      categoryId,
      courseId,
      search,
      sortBy = 'recent',
      page = 1,
      limit = 20,
    } = params

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      })

      if (categoryId) queryParams.append('categoryId', categoryId)
      if (courseId) queryParams.append('courseId', courseId)
      if (search) queryParams.append('search', search)

      const response = await fetch(`/api/v1/forum/posts?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch posts')

      return await response.json()
    } catch (error) {
      console.error('Error fetching posts:', error)
      return this.getMockPosts(params)
    }
  }

  async getPost(id: string): Promise<ForumPost | null> {
    try {
      const response = await fetch(`/api/v1/forum/posts/${id}`)
      if (!response.ok) throw new Error('Failed to fetch post')

      return await response.json()
    } catch (error) {
      console.error('Error fetching post:', error)
      return this.getMockPost(id)
    }
  }

  async createPost(data: CreatePostData): Promise<ForumPost> {
    try {
      const response = await fetch('/api/v1/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create post')

      return await response.json()
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  async createReply(data: CreateReplyData): Promise<ForumReply> {
    try {
      const response = await fetch('/api/v1/forum/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create reply')

      return await response.json()
    } catch (error) {
      console.error('Error creating reply:', error)
      throw error
    }
  }

  async votePost(postId: string, vote: 'up' | 'down'): Promise<void> {
    try {
      const response = await fetch(`/api/v1/forum/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote }),
      })

      if (!response.ok) throw new Error('Failed to vote on post')
    } catch (error) {
      console.error('Error voting on post:', error)
      throw error
    }
  }

  async voteReply(replyId: string, vote: 'up' | 'down'): Promise<void> {
    try {
      const response = await fetch(`/api/v1/forum/replies/${replyId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote }),
      })

      if (!response.ok) throw new Error('Failed to vote on reply')
    } catch (error) {
      console.error('Error voting on reply:', error)
      throw error
    }
  }

  async acceptReply(replyId: string): Promise<void> {
    try {
      const response = await fetch(`/api/v1/forum/replies/${replyId}/accept`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to accept reply')
    } catch (error) {
      console.error('Error accepting reply:', error)
      throw error
    }
  }

  async getCategories(): Promise<Array<ForumCategory>> {
    try {
      const response = await fetch('/api/v1/forum/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')

      return await response.json()
    } catch (error) {
      console.error('Error fetching categories:', error)
      return this.getMockCategories()
    }
  }

  async getForumStats(): Promise<ForumStats> {
    try {
      const response = await fetch('/api/v1/forum/stats')
      if (!response.ok) throw new Error('Failed to fetch forum stats')

      return await response.json()
    } catch (error) {
      console.error('Error fetching forum stats:', error)
      return this.getMockStats()
    }
  }

  private getMockCategories(): Array<ForumCategory> {
    return [
      {
        id: '1',
        name: 'General Discussion',
        description: 'General discussions about courses and learning',
        icon: 'MessageSquare',
        color: 'blue',
        postCount: 156,
      },
      {
        id: '2',
        name: 'Programming',
        description: 'Coding questions and programming help',
        icon: 'Code',
        color: 'green',
        postCount: 243,
      },
      {
        id: '3',
        name: 'Design',
        description: 'UI/UX design discussions and feedback',
        icon: 'Palette',
        color: 'purple',
        postCount: 89,
      },
      {
        id: '4',
        name: 'Career Advice',
        description: 'Career guidance and job search tips',
        icon: 'Briefcase',
        color: 'orange',
        postCount: 67,
      },
      {
        id: '5',
        name: 'Study Groups',
        description: 'Form study groups and find study partners',
        icon: 'Users',
        color: 'pink',
        postCount: 34,
      },
    ]
  }

  private getMockStats(): ForumStats {
    return {
      totalPosts: 589,
      totalReplies: 1247,
      totalUsers: 1834,
      mostActiveUsers: [
        {
          id: '1',
          username: 'sarah_dev',
          avatar: '/avatars/sarah.jpg',
          role: 'instructor',
          reputation: 2450,
          joinDate: '2023-01-15',
        },
        {
          id: '2',
          username: 'alex_student',
          role: 'student',
          reputation: 1280,
          joinDate: '2023-03-22',
        },
      ],
      recentPosts: [],
    }
  }

  private getMockPosts(params: any): {
    posts: Array<ForumPost>
    total: number
  } {
    const mockPosts: Array<ForumPost> = [
      {
        id: '1',
        title: 'Best practices for React state management?',
        content:
          "I'm working on a large React application and struggling with state management. What are the current best practices?",
        author: {
          id: '2',
          username: 'alex_student',
          role: 'student',
          reputation: 1280,
          joinDate: '2023-03-22',
        },
        category: this.getMockCategories()[1],
        tags: ['react', 'state-management', 'javascript'],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        views: 45,
        votes: 8,
        isLocked: false,
        isPinned: false,
        isSolved: false,
        replies: [],
        userVote: null,
      },
    ]

    return { posts: mockPosts, total: mockPosts.length }
  }

  private getMockPost(id: string): ForumPost | null {
    return {
      id,
      title: 'Best practices for React state management?',
      content:
        "I'm working on a large React application and struggling with state management. What are the current best practices? Should I use Redux, Zustand, or stick with React's built-in state management?",
      author: {
        id: '2',
        username: 'alex_student',
        role: 'student',
        reputation: 1280,
        joinDate: '2023-03-22',
      },
      category: this.getMockCategories()[1],
      tags: ['react', 'state-management', 'javascript'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      views: 45,
      votes: 8,
      isLocked: false,
      isPinned: false,
      isSolved: false,
      replies: [
        {
          id: '1',
          content:
            'For large applications, I recommend Redux Toolkit. It provides excellent developer experience and scales well.',
          author: {
            id: '1',
            username: 'sarah_dev',
            role: 'instructor',
            reputation: 2450,
            joinDate: '2023-01-15',
          },
          postId: id,
          createdAt: '2024-01-15T11:15:00Z',
          updatedAt: '2024-01-15T11:15:00Z',
          votes: 12,
          isAccepted: true,
          userVote: null,
        },
      ],
      userVote: null,
    }
  }
}

export const forumService = ForumService.getInstance()
