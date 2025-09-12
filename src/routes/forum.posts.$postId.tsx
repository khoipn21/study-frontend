import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Calendar,
  Tag,
  User,
  Pin,
  Lock,
  CheckCircle,
  Reply,
  MoreVertical,
  Flag,
  Edit,
  ArrowLeft,
  Send,
} from 'lucide-react'
import {
  forumService,
  type ForumPost,
  type ForumReply,
  type CreateReplyData,
} from '@/lib/forum'
import { useAuth } from '@/lib/auth-context'
import { formatDistanceToNow, cn } from '@/lib/utils'

export const Route = createFileRoute('/forum/posts/$postId')({
  component: PostDetail,
})

function PostDetail() {
  const { postId } = Route.useParams()
  const { user } = useAuth()
  const [post, setPost] = useState<ForumPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    setIsLoading(true)
    try {
      const postData = await forumService.getPost(postId)
      if (postData) {
        setPost(postData)
      }
    } catch (error) {
      console.error('Error loading post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVotePost = async (vote: 'up' | 'down') => {
    if (!post) return
    
    try {
      await forumService.votePost(post.id, vote)
      
      setPost(prev => {
        if (!prev) return null
        
        let newVotes = prev.votes
        let newUserVote = vote
        
        if (prev.userVote === vote) {
          newUserVote = null
          newVotes = prev.userVote === 'up' ? prev.votes - 1 : prev.votes + 1
        } else if (prev.userVote) {
          newVotes = prev.userVote === 'up' ? prev.votes - 2 : prev.votes + 2
        } else {
          newVotes = vote === 'up' ? prev.votes + 1 : prev.votes - 1
        }
        
        return { ...prev, votes: newVotes, userVote: newUserVote }
      })
    } catch (error) {
      console.error('Error voting on post:', error)
    }
  }

  const handleVoteReply = async (replyId: string, vote: 'up' | 'down') => {
    if (!post) return
    
    try {
      await forumService.voteReply(replyId, vote)
      
      setPost(prev => {
        if (!prev) return null
        
        const updateReplyVotes = (replies: ForumReply[]): ForumReply[] => {
          return replies.map(reply => {
            if (reply.id === replyId) {
              let newVotes = reply.votes
              let newUserVote = vote
              
              if (reply.userVote === vote) {
                newUserVote = null
                newVotes = reply.userVote === 'up' ? reply.votes - 1 : reply.votes + 1
              } else if (reply.userVote) {
                newVotes = reply.userVote === 'up' ? reply.votes - 2 : reply.votes + 2
              } else {
                newVotes = vote === 'up' ? reply.votes + 1 : reply.votes - 1
              }
              
              return { ...reply, votes: newVotes, userVote: newUserVote }
            }
            
            if (reply.replies) {
              return { ...reply, replies: updateReplyVotes(reply.replies) }
            }
            
            return reply
          })
        }
        
        return { ...prev, replies: updateReplyVotes(prev.replies) }
      })
    } catch (error) {
      console.error('Error voting on reply:', error)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !post || !user) return

    setIsSubmittingReply(true)
    try {
      const replyData: CreateReplyData = {
        content: replyContent.trim(),
        postId: post.id,
        parentId: replyingTo || undefined,
      }

      const newReply = await forumService.createReply(replyData)
      
      setPost(prev => {
        if (!prev) return null
        return { ...prev, replies: [...prev.replies, newReply] }
      })
      
      setReplyContent('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Error submitting reply:', error)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleAcceptReply = async (replyId: string) => {
    try {
      await forumService.acceptReply(replyId)
      
      setPost(prev => {
        if (!prev) return null
        
        const updateReplyAcceptance = (replies: ForumReply[]): ForumReply[] => {
          return replies.map(reply => ({
            ...reply,
            isAccepted: reply.id === replyId,
            replies: reply.replies ? updateReplyAcceptance(reply.replies) : undefined,
          }))
        }
        
        return {
          ...prev,
          isSolved: true,
          replies: updateReplyAcceptance(prev.replies),
        }
      })
    } catch (error) {
      console.error('Error accepting reply:', error)
    }
  }

  const ReplyComponent = ({ reply, depth = 0 }: { reply: ForumReply; depth?: number }) => (
    <div className={cn('border-l-2 border-muted', depth > 0 && 'ml-6')}>
      <div className="academic-card p-4 ml-4">
        <div className="flex gap-3">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-1 min-w-[30px]">
            <button
              onClick={() => handleVoteReply(reply.id, 'up')}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <ThumbsUp className={cn(
                'h-3 w-3',
                reply.userVote === 'up' ? 'text-primary fill-current' : 'text-muted-foreground'
              )} />
            </button>
            <span className={cn(
              'text-xs font-medium',
              reply.votes > 0 ? 'text-success' : reply.votes < 0 ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {reply.votes}
            </span>
            <button
              onClick={() => handleVoteReply(reply.id, 'down')}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <ThumbsDown className={cn(
                'h-3 w-3',
                reply.userVote === 'down' ? 'text-destructive fill-current' : 'text-muted-foreground'
              )} />
            </button>
          </div>

          {/* Content Section */}
          <div className="flex-1">
            {reply.isAccepted && (
              <div className="mb-2 flex items-center gap-2 text-success">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Accepted Answer</span>
              </div>
            )}
            
            <div className="prose prose-sm max-w-none mb-3">
              <p>{reply.content}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {reply.author.avatar ? (
                  <img
                    src={reply.author.avatar}
                    alt={reply.author.username}
                    className="h-4 w-4 rounded-full"
                  />
                ) : (
                  <User className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">{reply.author.username}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-xs font-medium',
                    reply.author.role === 'instructor' && 'bg-primary/10 text-primary',
                    reply.author.role === 'admin' && 'bg-destructive/10 text-destructive',
                    reply.author.role === 'student' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {reply.author.role}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(reply.createdAt))}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {user && post?.author.id === user.id && !reply.isAccepted && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAcceptReply(reply.id)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingTo(reply.id)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>

        {reply.replies && reply.replies.map((childReply) => (
          <ReplyComponent key={childReply.id} reply={childReply} depth={depth + 1} />
        ))}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="academic-card p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Post not found</h2>
            <p className="text-muted-foreground">The post you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="ghost" className="gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Button>
        </div>

        {/* Post Header */}
        <div className="academic-card p-6 mb-6">
          <div className="flex gap-4">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <button
                onClick={() => handleVotePost('up')}
                className="p-2 rounded hover:bg-muted transition-colors"
                disabled={!user}
              >
                <ThumbsUp className={cn(
                  'h-6 w-6',
                  post.userVote === 'up' ? 'text-primary fill-current' : 'text-muted-foreground'
                )} />
              </button>
              <span className={cn(
                'text-xl font-bold',
                post.votes > 0 ? 'text-success' : post.votes < 0 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {post.votes}
              </span>
              <button
                onClick={() => handleVotePost('down')}
                className="p-2 rounded hover:bg-muted transition-colors"
                disabled={!user}
              >
                <ThumbsDown className={cn(
                  'h-6 w-6',
                  post.userVote === 'down' ? 'text-destructive fill-current' : 'text-muted-foreground'
                )} />
              </button>
            </div>

            {/* Content Section */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {post.isPinned && <Pin className="h-5 w-5 text-warning" />}
                  {post.isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
                  {post.isSolved && <CheckCircle className="h-5 w-5 text-success" />}
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `var(--color-${post.category.color}-100)`,
                      color: `var(--color-${post.category.color}-700)`,
                    }}
                  >
                    {post.category.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.replies.length} replies</span>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-4">{post.title}</h1>

              <div className="prose prose-lg max-w-none mb-6">
                <p>{post.content}</p>
              </div>

              {post.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.username}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User className="h-6 w-6 text-muted-foreground" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{post.author.username}</span>
                      <span
                        className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          post.author.role === 'instructor' && 'bg-primary/10 text-primary',
                          post.author.role === 'admin' && 'bg-destructive/10 text-destructive',
                          post.author.role === 'student' && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {post.author.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(post.createdAt))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
            </h2>
          </div>

          {post.replies.map((reply) => (
            <ReplyComponent key={reply.id} reply={reply} />
          ))}

          {/* Reply Form */}
          {user && !post.isLocked && (
            <div className="academic-card p-6">
              <h3 className="text-lg font-semibold mb-4">Your Reply</h3>
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts, answer the question, or contribute to the discussion..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={6}
                  maxLength={5000}
                  required
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {replyContent.length}/5000 characters
                  </div>
                  <Button type="submit" disabled={isSubmittingReply || !replyContent.trim()}>
                    {isSubmittingReply ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {isSubmittingReply ? 'Posting...' : 'Post Reply'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {!user && (
            <div className="academic-card p-6 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Join the Discussion</h3>
              <p className="text-muted-foreground mb-4">Log in to reply to this post and engage with the community.</p>
              <Button>Sign In</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}