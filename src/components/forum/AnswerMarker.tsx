import { CheckCircle, Crown, Loader2, Star, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface AnswerMarkerProps {
  postId: string
  topicAuthorId?: string
  isAnswer?: boolean
  onMarkAsAnswer?: (postId: string) => Promise<void>
  onUnmarkAsAnswer?: (postId: string) => Promise<void>
  compact?: boolean
}

export function AnswerMarker({
  postId,
  topicAuthorId,
  isAnswer = false,
  onMarkAsAnswer,
  onUnmarkAsAnswer,
  compact = false,
}: AnswerMarkerProps) {
  const { user, token } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Only topic author or instructor/admin can mark answers
  const canManageAnswer =
    user &&
    (user.id === topicAuthorId ||
      user.role === 'instructor' ||
      user.role === 'admin')

  const handleMarkAsAnswer = async () => {
    if (!token || !onMarkAsAnswer) return

    setIsSubmitting(true)
    try {
      await onMarkAsAnswer(postId)
      toast.success('Post marked as answer!')
      setIsDialogOpen(false)
    } catch (error) {
      toast.error('Failed to mark as answer')
      console.error('Mark answer error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnmarkAsAnswer = async () => {
    if (!token || !onUnmarkAsAnswer) return

    setIsSubmitting(true)
    try {
      await onUnmarkAsAnswer(postId)
      toast.success('Answer unmarked')
    } catch (error) {
      toast.error('Failed to unmark answer')
      console.error('Unmark answer error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // If already marked as answer
  if (isAnswer) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
          compact && 'px-2 py-1 text-xs',
        )}
      >
        {compact ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Answer</span>
            {user?.role === 'instructor' || user?.role === 'admin' ? (
              <Crown className="h-3 w-3 ml-1" />
            ) : (
              <Star className="h-3 w-3 ml-1" />
            )}
          </>
        )}

        {/* Dropdown for unmarking */}
        {canManageAnswer && onUnmarkAsAnswer && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-green-200 dark:hover:bg-green-800/30"
              >
                <span className="sr-only">Answer options</span>
                <span>•</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleUnmarkAsAnswer}
                disabled={isSubmitting}
              >
                <Undo2 className="h-4 w-4 mr-2" />
                Unmark as Answer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    )
  }

  // Show mark as answer button if user can manage answers
  if (canManageAnswer && onMarkAsAnswer) {
    return (
      <>
        <Button
          variant="outline"
          size={compact ? 'sm' : 'default'}
          onClick={() => setIsDialogOpen(true)}
          className={cn(
            'border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/20',
            compact && 'h-7 px-2 text-xs',
          )}
        >
          {compact ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Answer
            </>
          )}
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark as Answer</DialogTitle>
              <DialogDescription>
                Are you sure you want to mark this post as the answer to the
                question? This will help other users quickly identify the
                solution.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMarkAsAnswer}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Marking...
                  </>
                ) : (
                  'Mark as Answer'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return null
}

// Badge component for showing answer status in lists
export function AnswerBadge({
  isAnswer,
  isCompact = false,
}: {
  isAnswer: boolean
  isCompact?: boolean
}) {
  if (!isAnswer) return null

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        isCompact && 'px-1.5 py-0.5 text-xs',
      )}
    >
      <CheckCircle className={cn('h-3 w-3', isCompact && 'h-2.5 w-2.5')} />
      {!isCompact && <span className="text-xs font-medium">Answer</span>}
    </div>
  )
}
