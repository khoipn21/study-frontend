import {
  Bot,
  Copy,
  ExternalLink,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn, formatDistanceToNow } from '@/lib/utils'

import type { ChatMessage as ChatMessageType } from '@/lib/ai-chat'

interface ChatMessageProps {
  message: ChatMessageType
  onCopy?: (content: string) => void
  onFeedback?: (messageId: string, feedback: 'up' | 'down') => void
  onSuggestionClick?: (suggestion: string) => void
}

export function ChatMessage({
  message,
  onCopy,
  onFeedback,
  onSuggestionClick,
}: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  const isSystem = message.role === 'system'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    onCopy?.(message.content)
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting for code blocks and links
    return content
      .split('\n')
      .map((line, index) => {
        // Code block detection
        if (line.startsWith('```')) {
          return null // Will be handled by code block component
        }

        // Bullet points
        if (line.startsWith('• ')) {
          return (
            <li key={index} className="ml-4 list-disc">
              {line.substring(2)}
            </li>
          )
        }

        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**')
          return (
            <p key={index} className="mb-2">
              {parts.map((part, partIndex) =>
                partIndex % 2 === 1 ? (
                  <strong key={partIndex}>{part}</strong>
                ) : (
                  part
                ),
              )}
            </p>
          )
        }

        // Regular paragraph
        return line.trim() ? (
          <p key={index} className="mb-2">
            {line}
          </p>
        ) : (
          <br key={index} />
        )
      })
      .filter(Boolean)
  }

  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const codeBlocks: Array<{ language: string; code: string }> = []
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push({
        language: match[1] || 'text',
        code: match[2].trim(),
      })
    }

    return codeBlocks
  }

  const contentWithoutCodeBlocks = message.content.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    '[CODE_BLOCK]',
  )
  const codeBlocks = extractCodeBlocks(message.content)
  let codeBlockIndex = 0

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex gap-3 p-4',
        isUser && 'flex-row-reverse bg-muted/30',
        isAssistant && 'bg-background',
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser && 'bg-primary text-primary-foreground',
          isAssistant && 'bg-secondary text-secondary-foreground',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className={cn('flex-1 space-y-2', isUser && 'text-right')}>
        <div
          className={cn(
            'inline-block max-w-[80%] rounded-lg px-4 py-2',
            isUser && 'bg-primary text-primary-foreground ml-auto',
            isAssistant && 'bg-card border',
          )}
        >
          <div className="max-w-none">
            {formatContent(contentWithoutCodeBlocks).map((element, index) => {
              if (
                typeof element === 'string' &&
                element === '[CODE_BLOCK]' &&
                codeBlocks[codeBlockIndex]
              ) {
                const codeBlock = codeBlocks[codeBlockIndex++]
                return (
                  <div key={index} className="my-3">
                    <div className="flex items-center justify-between bg-muted px-3 py-1 rounded-t-lg">
                      <span className="text-xs font-medium text-muted-foreground">
                        {codeBlock.language}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          navigator.clipboard.writeText(codeBlock.code)
                        }
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="bg-muted/50 p-3 rounded-b-lg overflow-x-auto">
                      <code className="text-sm">{codeBlock.code}</code>
                    </pre>
                  </div>
                )
              }
              return element
            })}
          </div>
        </div>

        {/* Message Metadata */}
        <div
          className={cn(
            'flex items-center gap-2 text-xs text-muted-foreground',
            isUser && 'justify-end',
          )}
        >
          <span>{formatDistanceToNow(new Date(message.timestamp))}</span>

          {isAssistant && message.metadata?.confidence && (
            <span className="px-2 py-1 bg-muted rounded">
              {Math.round(message.metadata.confidence * 100)}% confident
            </span>
          )}
        </div>

        {/* Sources */}
        {isAssistant &&
          message.metadata?.sources &&
          message.metadata.sources.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                Sources:
              </div>
              <div className="flex flex-wrap gap-2">
                {message.metadata.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs hover:bg-muted/80 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>{source.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

        {/* Suggestions */}
        {isAssistant &&
          message.metadata?.suggestions &&
          message.metadata.suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                Ask me:
              </div>
              <div className="flex flex-wrap gap-2">
                {message.metadata.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick?.(suggestion)}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs hover:bg-secondary/80 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Action Buttons */}
        {!isUser && (
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-6 px-2 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>

            {onFeedback && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onFeedback(message.id, 'up')}
                  className="h-6 px-2 text-xs"
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onFeedback(message.id, 'down')}
                  className="h-6 px-2 text-xs"
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
