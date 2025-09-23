import React, { useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  Bot,
  Loader2,
  MessageSquare,
  Play,
  Send,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { aiChatService } from '@/lib/ai-chat'
import { cn } from '@/lib/utils'
import { ChatMessage } from './ChatMessage'
import type {
  ChatContext,
  ChatMessage as ChatMessageType,
  ChatSession,
} from '@/lib/ai-chat'

interface ChatInterfaceProps {
  context?: ChatContext
  className?: string
  embedded?: boolean
  height?: string
}

export function ChatInterface({
  context,
  className,
  embedded = false,
  height = 'h-96',
}: ChatInterfaceProps) {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<Array<ChatMessageType>>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<string>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    initializeChat()
  }, [context])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadSuggestions()
  }, [context])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeChat = async () => {
    try {
      const session = await aiChatService.createSession(context)
      setCurrentSession(session)
      setMessages(session.messages)
    } catch (error) {
      console.error('Error initializing chat:', error)
    }
  }

  const loadSuggestions = async () => {
    if (!context) return

    try {
      let newSuggestions: Array<string> = []

      if (context.courseId) {
        newSuggestions = await aiChatService.getCourseSuggestions(
          context.courseId,
        )
      } else if (context.lectureId) {
        newSuggestions = await aiChatService.getLectureSuggestions(
          context.lectureId,
        )
      }

      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Error loading suggestions:', error)
    }
  }

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim()
    if (!content || !currentSession) return

    const userMessage: ChatMessageType = {
      id: `msg_${Date.now()}_user`,
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      courseId: context?.courseId,
      lectureId: context?.lectureId,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const aiResponse = await aiChatService.sendMessage({
        message: content,
        context,
        sessionId: currentSession.id,
      })

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error('Error sending message:', error)

      const errorMessage: ChatMessageType = {
        id: `msg_${Date.now()}_error`,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    inputRef.current?.focus()
  }

  const handleCopy = () => {
    // Show a brief confirmation that content was copied
    // Could implement a toast notification here
  }

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    // Send feedback to the AI service for model improvement
    console.log(`Feedback for ${messageId}: ${feedback}`)
  }

  const quickActions = [
    {
      icon: BookOpen,
      label: 'Explain this topic',
      action: () => handleSendMessage('Can you explain this topic in detail?'),
    },
    {
      icon: Play,
      label: 'Show examples',
      action: () =>
        handleSendMessage('Can you show me some practical examples?'),
    },
    {
      icon: MessageSquare,
      label: 'Ask a question',
      action: () => inputRef.current?.focus(),
    },
  ]

  return (
    <div
      className={cn(
        'flex flex-col bg-background border rounded-lg',
        embedded ? 'shadow-sm' : 'shadow-lg',
        className,
      )}
    >
      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">AI Tutor</h3>
              <p className="text-sm text-muted-foreground">
                {context?.courseId
                  ? 'Course Assistant'
                  : context?.lectureId
                    ? 'Lecture Helper'
                    : 'General Study Assistant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        className={cn('flex-1 overflow-y-auto', height, embedded && 'min-h-0')}
      >
        {/* Welcome Message */}
        {messages.length <= 1 && (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                {context?.courseId
                  ? 'Course AI Assistant'
                  : 'AI Tutor Ready to Help'}
              </h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                I'm here to help you understand concepts, answer questions, and
                guide your learning journey. Ask me anything!
              </p>
            </div>

            {/* Quick Actions */}
            {!embedded && (
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className="gap-2"
                    >
                      <Icon className="h-3 w-3" />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Popular questions:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors text-left max-w-48"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onCopy={handleCopy}
            onFeedback={handleFeedback}
            onSuggestionClick={handleSuggestionClick}
          />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 p-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              placeholder="Ask me anything about your studies..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="min-h-[40px] max-h-32 resize-none pr-12"
            />
            <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">
              {inputValue.length > 0 && <span>{inputValue.length}/2000</span>}
            </div>
          </div>

          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="h-10 w-10 p-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {context && (
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 bg-primary rounded-full"></div>
              Context-aware responses
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
