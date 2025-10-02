import React, { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useAuth } from '@/lib/auth-context'
import type { RichTextEditorRef } from '@/components/ui/rich-text-editor'

interface PostEditorProps {
  placeholder?: string
  onSubmit?: (content: string) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  minHeight?: number
  maxHeight?: number
  autoFocus?: boolean
  initialValue?: string
  showToolbar?: boolean
  className?: string
}

export function PostEditor({
  placeholder = 'Write your reply...',
  onSubmit,
  onCancel,
  submitLabel = 'Post Reply',
  cancelLabel = 'Cancel',
  autoFocus = true,
  initialValue = '',
  className = '',
}: PostEditorProps) {
  const { token } = useAuth()
  const editorRef = useRef<RichTextEditorRef>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!token) {
      toast.error('You must be logged in to post')
      return
    }

    const content = editorRef.current?.getContent() || ''

    if (!content.trim() || content === '<p></p>') {
      toast.error('Please write something before posting')
      return
    }

    if (!onSubmit) return

    setIsSubmitting(true)
    try {
      await onSubmit(content)
      editorRef.current?.clear()
    } catch (error) {
      toast.error('Failed to post. Please try again.')
      console.error('Post error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-focus on mount if requested
  React.useEffect(() => {
    if (autoFocus && editorRef.current) {
      setTimeout(() => {
        editorRef.current?.focus()
      }, 100)
    }
  }, [autoFocus])

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4" onKeyDown={handleKeyDown}>
          <RichTextEditor
            ref={editorRef}
            content={initialValue}
            placeholder={placeholder}
          />

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p>
                Use{' '}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  @username
                </kbd>{' '}
                to mention users
              </p>
              <p>
                Press{' '}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  Ctrl+Enter
                </kbd>{' '}
                to submit
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  {cancelLabel}
                </Button>
              )}
              <Button onClick={handleSubmit} disabled={isSubmitting || !token}>
                {isSubmitting ? 'Posting...' : submitLabel}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for inline replies
export function CompactPostEditor({
  onSubmit,
  placeholder = 'Write a quick reply...',
  className = '',
}: {
  onSubmit?: (content: string) => Promise<void>
  placeholder?: string
  className?: string
}) {
  const { token } = useAuth()
  const editorRef = useRef<RichTextEditorRef>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async () => {
    if (!token) {
      toast.error('You must be logged in to post')
      return
    }

    const content = editorRef.current?.getContent() || ''

    if (!content.trim() || content === '<p></p>') {
      toast.error('Please write something before posting')
      return
    }

    if (!onSubmit) return

    setIsSubmitting(true)
    try {
      await onSubmit(content)
      editorRef.current?.clear()
      setIsExpanded(false)
    } catch (error) {
      toast.error('Failed to post. Please try again.')
      console.error('Post error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isExpanded) {
    return (
      <div className={className}>
        <div
          onClick={() => setIsExpanded(true)}
          className="border border-input rounded-md px-4 py-3 text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors"
        >
          {placeholder}
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-3">
        <div className="space-y-3">
          <RichTextEditor ref={editorRef} placeholder={placeholder} />

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsExpanded(false)
                editorRef.current?.clear()
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting || !token}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
