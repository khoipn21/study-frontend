export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: string
  courseId?: string
  lectureId?: string
  metadata?: {
    sources?: Array<{
      title: string
      url: string
      type: 'course' | 'lecture' | 'forum' | 'documentation'
    }>
    confidence?: number
    suggestions?: Array<string>
    codeSnippets?: Array<{
      language: string
      code: string
    }>
  }
}

export interface ChatSession {
  id: string
  title: string
  messages: Array<ChatMessage>
  createdAt: string
  updatedAt: string
  courseId?: string
  lectureId?: string
}

export interface ChatSessionInfo {
  session_id: string
  title: string
  last_message: string
  message_count: number
  created_at: string
  updated_at: string
}

export interface ChatContext {
  courseId?: string
  lectureId?: string
  currentProgress?: number
  userLevel?: 'beginner' | 'intermediate' | 'advanced'
  learningGoals?: Array<string>
}

export interface SendMessageRequest {
  message: string
  context?: ChatContext
  sessionId?: string
}

export class AIChatService {
  private static instance: AIChatService
  private baseUrl = import.meta.env.VITE_API_BASE_URL

  public static getInstance(): AIChatService {
    if (AIChatService.instance === undefined) {
      AIChatService.instance = new AIChatService()
    }
    return AIChatService.instance
  }

  private constructor() {}

  private getAuthToken(): string | null {
    try {
      const storage = localStorage.getItem('study.auth')
      if (!storage) return null
      const parsed = JSON.parse(storage) as { token: string | null }
      return parsed.token
    } catch {
      return null
    }
  }

  async sendMessage(request: SendMessageRequest): Promise<ChatMessage> {
    try {
      const token = this.getAuthToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${this.baseUrl}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: request.message,
          session_id: request.sessionId,
          course_id: request.context?.courseId,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(
          (error as { error?: string }).error || 'Failed to send message',
        )
      }

      const data = (await response.json()) as {
        session_id: string
        message_id: string
        content: string
        role: 'assistant'
        tokens_used: number
        created_at: string
      }

      return {
        id: data.message_id,
        content: data.content,
        role: data.role,
        timestamp: data.created_at,
        courseId: request.context?.courseId,
        lectureId: request.context?.lectureId,
      }
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  async getRateLimit(): Promise<{
    limit: number
    usage: number
    remaining: number
  }> {
    try {
      const token = this.getAuthToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${this.baseUrl}/rate-limit`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch rate limit')

      return await response.json()
    } catch (error) {
      console.error('Error fetching rate limit:', error)
      return { limit: 10, usage: 0, remaining: 10 }
    }
  }

  async getChatHistory(): Promise<Array<ChatSessionInfo>> {
    try {
      const token = this.getAuthToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${this.baseUrl}/chat/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch chat history')

      const data = (await response.json()) as {
        sessions: Array<ChatSessionInfo>
      }
      return data.sessions || []
    } catch (error) {
      console.error('Error fetching chat history:', error)
      return []
    }
  }

  async getSessionMessages(sessionId: string): Promise<Array<ChatMessage>> {
    try {
      const token = this.getAuthToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(
        `${this.baseUrl}/chat/history/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) throw new Error('Failed to fetch session messages')

      const data = (await response.json()) as {
        messages: Array<{
          id: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          tokens_used: number
          created_at: string
        }>
      }

      return (data.messages || []).map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: msg.created_at,
      }))
    } catch (error) {
      console.error('Error fetching session messages:', error)
      return []
    }
  }

  async deleteSessionHistory(sessionId: string): Promise<void> {
    try {
      const token = this.getAuthToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(
        `${this.baseUrl}/chat/history/${sessionId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) throw new Error('Failed to delete session')
    } catch (error) {
      console.error('Error deleting session:', error)
      throw error
    }
  }

  async getSessions(_courseId?: string): Promise<Array<ChatSession>> {
    return this.getMockSessions(_courseId)
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    return this.getMockSession(sessionId)
  }

  async createSession(context?: ChatContext): Promise<ChatSession> {
    return this.createMockSession(context)
  }

  async deleteSession(_sessionId: string): Promise<void> {
    console.log('Delete session not implemented yet')
  }

  async updateSessionTitle(_sessionId: string, _title: string): Promise<void> {
    console.log('Update session title not implemented yet')
  }

  async getCourseSuggestions(courseId: string): Promise<Array<string>> {
    try {
      const response = await fetch(
        `/api/v1/ai-chat/suggestions/course/${courseId}`,
      )
      if (!response.ok) throw new Error('Failed to fetch suggestions')

      const data = (await response.json()) as { suggestions: Array<string> }
      return data.suggestions
    } catch (error) {
      console.error('Error fetching course suggestions:', error)
      return this.getMockSuggestions(courseId)
    }
  }

  async getLectureSuggestions(lectureId: string): Promise<Array<string>> {
    try {
      const response = await fetch(
        `/api/v1/ai-chat/suggestions/lecture/${lectureId}`,
      )
      if (!response.ok) throw new Error('Failed to fetch suggestions')

      const data = (await response.json()) as { suggestions: Array<string> }
      return data.suggestions
    } catch (error) {
      console.error('Error fetching lecture suggestions:', error)
      return this.getMockSuggestions('lecture')
    }
  }

  // Mock methods for session management (backend doesn't have these endpoints yet)
  private getMockSessions(courseId?: string): Array<ChatSession> {
    const baseSessions = [
      {
        id: 'session_1',
        title: 'Understanding React Hooks',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:45:00Z',
        courseId: 'react-course',
        messages: [],
      },
      {
        id: 'session_2',
        title: 'JavaScript Array Methods',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
        courseId: 'js-fundamentals',
        messages: [],
      },
      {
        id: 'session_3',
        title: 'General Programming Questions',
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:45:00Z',
        messages: [],
      },
    ]

    return courseId
      ? baseSessions.filter((session) => session.courseId === courseId)
      : baseSessions
  }

  private getMockSession(sessionId: string): ChatSession | null {
    const sessions = this.getMockSessions()
    const session = sessions.find((s) => s.id === sessionId)

    if (!session) return null

    return {
      ...session,
      messages: [
        {
          id: 'msg_1',
          content: 'Hello! How can I help you today?',
          role: 'assistant',
          timestamp: session.createdAt,
        },
        {
          id: 'msg_2',
          content: 'I have a question about React hooks',
          role: 'user',
          timestamp: '2024-01-15T10:35:00Z',
        },
        {
          id: 'msg_3',
          content:
            'React hooks are functions that let you use state and other React features in functional components. The most commonly used hooks are useState and useEffect. Would you like me to explain how they work?',
          role: 'assistant',
          timestamp: '2024-01-15T10:36:00Z',
          metadata: {
            confidence: 0.92,
            sources: [
              {
                title: 'React Hooks Documentation',
                url: 'https://reactjs.org/docs/hooks-intro.html',
                type: 'documentation',
              },
            ],
            suggestions: [
              'Can you show me examples of useState?',
              'How do I use useEffect?',
              'What are the rules of hooks?',
            ],
          },
        },
      ],
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      },
    )
  }

  private createMockSession(context?: ChatContext): ChatSession {
    const sessionId = this.generateUUID()
    const now = new Date().toISOString()

    return {
      id: sessionId,
      title: 'New Chat Session',
      messages: [
        {
          id: this.generateUUID(),
          content: context?.courseId
            ? "Hello! I'm here to help you with your course. What would you like to know?"
            : "Hello! I'm your AI tutor. How can I assist you today?",
          role: 'assistant',
          timestamp: now,
          courseId: context?.courseId,
          lectureId: context?.lectureId,
        },
      ],
      createdAt: now,
      updatedAt: now,
      courseId: context?.courseId,
      lectureId: context?.lectureId,
    }
  }

  private getMockSuggestions(contextType: string): Array<string> {
    const suggestions = {
      'react-course': [
        'How do React hooks work?',
        'What is the difference between props and state?',
        'How do I handle forms in React?',
        'Can you explain the component lifecycle?',
      ],
      'js-fundamentals': [
        'What are arrow functions?',
        'How do promises work?',
        'Explain async/await',
        'What is the difference between let, const, and var?',
      ],
      lecture: [
        'Can you summarize this lecture?',
        'What are the key takeaways?',
        'I need help with the practice exercises',
        'How does this relate to previous topics?',
      ],
      default: [
        'Help me understand this concept',
        'Can you provide more examples?',
        'What should I study next?',
        "I'm having trouble with...",
      ],
    }

    return (
      suggestions[contextType as keyof typeof suggestions] ??
      suggestions.default
    )
  }
}

export const aiChatService = AIChatService.getInstance()
