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

  public static getInstance(): AIChatService {
    if (AIChatService.instance === undefined) {
      AIChatService.instance = new AIChatService()
    }
    return AIChatService.instance
  }

  private constructor() {}

  async sendMessage(request: SendMessageRequest): Promise<ChatMessage> {
    try {
      const response = await fetch('/api/v1/ai-chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = (await response.json()) as { message: string }
      return {
        id: Math.random().toString(36).substring(7),
        content: data.message,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        courseId: request.context?.courseId,
        lectureId: request.context?.lectureId,
      }
    } catch (error) {
      console.error('Error sending message:', error)
      return this.getMockResponse(request.message, request.context)
    }
  }

  async getSessions(courseId?: string): Promise<Array<ChatSession>> {
    try {
      const queryParams = new URLSearchParams()
      if (courseId) queryParams.append('courseId', courseId)

      const response = await fetch(`/api/v1/ai-chat/sessions?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch sessions')

      return await response.json()
    } catch (error) {
      console.error('Error fetching sessions:', error)
      return this.getMockSessions(courseId)
    }
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const response = await fetch(`/api/v1/ai-chat/sessions/${sessionId}`)
      if (!response.ok) throw new Error('Failed to fetch session')

      return await response.json()
    } catch (error) {
      console.error('Error fetching session:', error)
      return this.getMockSession(sessionId)
    }
  }

  async createSession(context?: ChatContext): Promise<ChatSession> {
    try {
      const response = await fetch('/api/v1/ai-chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      })

      if (!response.ok) throw new Error('Failed to create session')

      return await response.json()
    } catch (error) {
      console.error('Error creating session:', error)
      return this.createMockSession(context)
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`/api/v1/ai-chat/sessions/${sessionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete session')
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    try {
      const response = await fetch(`/api/v1/ai-chat/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) throw new Error('Failed to update session title')
    } catch (error) {
      console.error('Error updating session title:', error)
    }
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

  // Mock methods for development/fallback
  private getMockResponse(
    userMessage: string,
    context?: ChatContext,
  ): ChatMessage {
    const responses = [
      "I understand you're asking about this topic. Let me help break it down for you.",
      "That's a great question! Here's what I can tell you about this concept:",
      "Based on your current course progress, here's some additional context that might help:",
      'Let me provide some examples to illustrate this point better:',
      "I see you're working through this challenge. Here are some approaches you could try:",
    ]

    const mockSources = context?.courseId
      ? [
          {
            title: 'Course Lecture 3: Key Concepts',
            url: `/courses/${context.courseId}/lectures/3`,
            type: 'lecture' as const,
          },
          {
            title: 'Related Forum Discussion',
            url: '/forum/posts/123',
            type: 'forum' as const,
          },
        ]
      : []

    const mockSuggestions = [
      'Can you explain this concept with more examples?',
      'What are the common pitfalls to avoid here?',
      'How does this relate to other topics in the course?',
    ]

    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: `${responses[Math.floor(Math.random() * responses.length)]}\n\n${this.generateContextualResponse(userMessage, context)}`,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      courseId: context?.courseId,
      lectureId: context?.lectureId,
      metadata: {
        sources: mockSources,
        confidence: 0.85 + Math.random() * 0.15,
        suggestions: mockSuggestions,
      },
    }
  }

  private generateContextualResponse(
    userMessage: string,
    _context?: ChatContext,
  ): string {
    const message = userMessage.toLowerCase()

    if (message.includes('explain') || message.includes('what is')) {
      return "This concept is fundamental to understanding the broader topic. Here are the key points:\n\n• **Definition**: The core principle involves...\n• **Application**: You'll typically use this when...\n• **Best Practices**: Remember to always..."
    }

    if (message.includes('example') || message.includes('show me')) {
      return "Here's a practical example:\n\n```javascript\nfunction example() {\n  // This demonstrates the concept\n  return 'Hello, World!'\n}\n```\n\nThis example shows how to..."
    }

    if (
      message.includes('error') ||
      message.includes('problem') ||
      message.includes('bug')
    ) {
      return "Let's troubleshoot this step by step:\n\n1. **Check the basics**: Ensure you have...\n2. **Common causes**: This issue often happens when...\n3. **Solution**: Try this approach...\n\nIf you're still having issues, can you share your code?"
    }

    if (
      message.includes('difference') ||
      message.includes('vs') ||
      message.includes('compare')
    ) {
      return "Great question! Here's a comparison:\n\n**Option A**:\n• Pros: Fast, simple, widely supported\n• Cons: Limited flexibility\n• Use when: You need quick results\n\n**Option B**:\n• Pros: More flexible, powerful features\n• Cons: Steeper learning curve\n• Use when: You need advanced functionality"
    }

    return "I'd be happy to help you understand this better. Could you provide more specific details about what you'd like to know?"
  }

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

  private createMockSession(context?: ChatContext): ChatSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    return {
      id: sessionId,
      title: 'New Chat Session',
      messages: [
        {
          id: `msg_${Date.now()}`,
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
