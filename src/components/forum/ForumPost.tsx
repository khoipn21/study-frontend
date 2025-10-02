import { useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle,
  Clock,
  Edit,
  MoreVertical,
  Pin,
  Reply,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { forumApi } from '@/lib/api/forum'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

import { AnswerMarker } from './AnswerMarker'
import { VoteButtons } from './VoteButtons'

interface ForumPostProps {
  post: {
    id: string
    topic_id?: string
    topicId?: string
    content: string
    author?: {
      id: string
      username: string
      role: string
      avatar?: string | null
      name?: string
    }
    created_at?: string
    createdAt?: string
    updated_at?: string
    updatedAt?: string
    is_pinned?: boolean
    isPinned?: boolean
    pin_order?: number | null
    pinOrder?: number | null
    vote_total?: number
    voteTotal?: number
    user_vote?: 'up' | 'down' | null
    userVote?: 'up' | 'down' | null
    is_edited?: boolean
    isEdited?: boolean
    is_answer?: boolean
    isAnswer?: boolean
    status?: 'pending' | 'approved' | 'rejected'
  }
  onReply?: () => void
  onEdit?: (postId: string) => void
  onDelete?: (postId: string) => void
  onMarkAsAnswer?: (postId: string) => Promise<void>
  onUnmarkAsAnswer?: (postId: string) => Promise<void>
  topicAuthorId?: string
  showActions?: boolean
}

export function ForumPost({
  post,
  onReply,
  onEdit,
  onDelete,
  onMarkAsAnswer,
  onUnmarkAsAnswer,
  topicAuthorId,
  showActions = true,
}: ForumPostProps) {
  const { user, token } = useAuth()
  const queryClient = useQueryClient()
  const [isPinning, setIsPinning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin'
  const isAuthor = user?.id === post.author?.id
  const isPinned = post.is_pinned || post.isPinned || false
  const isAnswer = post.is_answer || post.isAnswer || false
  const isPending = post.status === 'pending'
  const createdAt = post.created_at || post.createdAt || ''
  const author = post.author
  const canManageAnswer =
    user &&
    (user.id === topicAuthorId ||
      user.role === 'instructor' ||
      user.role === 'admin')

  const handleTogglePin = async () => {
    if (!token || !isInstructor) return

    setIsPinning(true)
    try {
      await forumApi.togglePinPost(post.id, token)
      toast.success(isPinned ? 'Post unpinned' : 'Post pinned')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    } catch (error) {
      toast.error('Failed to pin post')
      console.error('Pin error:', error)
    } finally {
      setIsPinning(false)
    }
  }

  const handleDelete = async () => {
    if (!token || !onDelete) return

    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.',
    )
    if (!confirmed) return

    setIsDeleting(true)
    try {
      await onDelete(post.id)
      toast.success('Post deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    } catch (error) {
      toast.error('Failed to delete post')
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        isPinned && 'border-primary/50 bg-primary/5',
        isAnswer &&
          'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20',
        isPending &&
          'border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20',
      )}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <VoteButtons
            post={{
              id: post.id,
              vote_total: post.vote_total || post.voteTotal || 0,
              user_vote: post.user_vote || post.userVote || null,
            }}
          />

          <div className="flex-1 min-w-0">
            {/* Post header with author info and status */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status badges */}
                <div className="flex items-center gap-1">
                  {isAnswer && (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Answer
                    </Badge>
                  )}
                  {isPinned && (
                    <Badge variant="secondary" className="gap-1">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </Badge>
                  )}
                  {isPending && (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                    >
                      <Clock className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </div>

                {/* Author info */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {author?.username?.[0]?.toUpperCase() ||
                        author?.name?.[0]?.toUpperCase() ||
                        'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">
                    {author?.name || author?.username || 'Unknown User'}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {author?.role || 'student'}
                  </Badge>
                </div>

                <span className="text-xs text-muted-foreground">
                  {formatDate(createdAt)}
                </span>

                {(post.is_edited || post.isEdited) && (
                  <span className="text-xs text-muted-foreground italic">
                    (edited)
                  </span>
                )}
              </div>

              {/* Actions dropdown */}
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* Answer marking */}
                    {canManageAnswer && onMarkAsAnswer && onUnmarkAsAnswer && (
                      <>
                        {!isAnswer ? (
                          <DropdownMenuItem
                            onClick={() => onMarkAsAnswer(post.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Answer
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onUnmarkAsAnswer(post.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Unmark as Answer
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                      </>
                    )}

                    {/* Pin management */}
                    {isInstructor && (
                      <DropdownMenuItem
                        onClick={handleTogglePin}
                        disabled={isPinning}
                      >
                        <Pin className="h-4 w-4 mr-2" />
                        {isPinned ? 'Unpin' : 'Pin'} Post
                      </DropdownMenuItem>
                    )}

                    {/* Edit */}
                    {isAuthor && onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(post.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}

                    {/* Delete */}
                    {(isAuthor || isInstructor) && onDelete && (
                      <DropdownMenuItem
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Post content */}
            <div
              className="prose prose-sm dark:prose-invert max-w-none mb-3"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Post actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {onReply && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onReply}
                    className="h-8"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>

              {/* Answer marker */}
              {canManageAnswer && onMarkAsAnswer && !isAnswer && (
                <AnswerMarker
                  postId={post.id}
                  topicAuthorId={topicAuthorId}
                  isAnswer={isAnswer}
                  onMarkAsAnswer={onMarkAsAnswer}
                  onUnmarkAsAnswer={onUnmarkAsAnswer}
                  compact
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
