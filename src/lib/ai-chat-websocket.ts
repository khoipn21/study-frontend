import type { ChatMessage } from './ai-chat'

export interface WebSocketMessage {
  type: 'chat' | 'response' | 'error' | 'typing' | 'welcome' | 'joined' | 'left'
  session_id?: string
  content?: string
  role?: 'user' | 'assistant'
  message_id?: string
  data?: unknown
  error?: string
}

type MessageCallback = (message: ChatMessage) => void
type ErrorCallback = (error: string) => void
type ConnectCallback = () => void

export class AIChatWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageCallbacks: Set<MessageCallback> = new Set()
  private errorCallbacks: Set<ErrorCallback> = new Set()
  private connectCallbacks: Set<ConnectCallback> = new Set()
  private pingInterval: NodeJS.Timeout | null = null
  private token: string | null = null
  private baseUrl = 'ws://localhost:8080/api/v1/chat/ws'

  constructor() {
    this.getAuthToken()
  }

  private getAuthToken(): void {
    try {
      const storage = localStorage.getItem('study.auth')
      if (!storage) return
      const parsed = JSON.parse(storage) as { token: string | null }
      this.token = parsed.token
    } catch {
      this.token = null
    }
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (!this.token) {
        reject(new Error('Authentication required'))
        return
      }

      // Add token as query parameter
      const url = `${this.baseUrl}?token=${encodeURIComponent(this.token)}`

      try {
        this.ws = new WebSocket(url)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          this.startPing()
          this.connectCallbacks.forEach((cb) => cb())
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data as string) as WebSocketMessage
            this.handleMessage(data)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.stopPing()
          this.attemptReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private handleMessage(data: WebSocketMessage): void {
    switch (data.type) {
      case 'response':
      case 'chat': {
        if (data.content && data.role) {
          const message: ChatMessage = {
            id: data.message_id || this.generateUUID(),
            content: data.content,
            role: data.role,
            timestamp: new Date().toISOString(),
          }
          this.messageCallbacks.forEach((cb) => cb(message))
        }
        break
      }
      case 'error': {
        const errorMsg = data.error || 'Unknown error'
        this.errorCallbacks.forEach((cb) => cb(errorMsg))
        break
      }
      case 'welcome':
      case 'joined':
      case 'left':
        // Info messages, can be logged if needed
        console.log(`WebSocket event: ${data.type}`, data)
        break
      case 'typing':
        // Typing indicator, can be handled if needed
        break
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.errorCallbacks.forEach((cb) =>
        cb('Failed to reconnect after multiple attempts'),
      )
      return
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
    this.reconnectAttempts++

    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`,
    )

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error)
      })
    }, delay)
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000) // Ping every 30 seconds
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  public sendMessage(content: string, sessionId?: string): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      this.errorCallbacks.forEach((cb) => cb('WebSocket is not connected'))
      return
    }

    const message: WebSocketMessage = {
      type: 'chat',
      content,
      session_id: sessionId,
    }

    this.ws.send(JSON.stringify(message))
  }

  public sendTypingIndicator(isTyping: boolean, sessionId?: string): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return

    const message: WebSocketMessage = {
      type: 'typing',
      session_id: sessionId,
      data: { is_typing: isTyping },
    }

    this.ws.send(JSON.stringify(message))
  }

  public joinSession(sessionId: string): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return

    this.ws.send(
      JSON.stringify({
        type: 'join',
        session_id: sessionId,
      }),
    )
  }

  public leaveSession(sessionId: string): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return

    this.ws.send(
      JSON.stringify({
        type: 'leave',
        session_id: sessionId,
      }),
    )
  }

  public onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback)
    return () => this.messageCallbacks.delete(callback)
  }

  public onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.add(callback)
    return () => this.errorCallbacks.delete(callback)
  }

  public onConnect(callback: ConnectCallback): () => void {
    this.connectCallbacks.add(callback)
    return () => this.connectCallbacks.delete(callback)
  }

  public disconnect(): void {
    this.stopPing()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageCallbacks.clear()
    this.errorCallbacks.clear()
    this.connectCallbacks.clear()
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
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
}

export const aiChatWebSocket = new AIChatWebSocket()
