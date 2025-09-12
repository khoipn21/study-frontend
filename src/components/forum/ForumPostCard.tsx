import React from 'react'
import { Link } from '@tanstack/react-router'
import {
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Pin,
  Lock,
  CheckCircle,
  User,
  Calendar,
  Tag,
} from 'lucide-react'
import { ForumPost } from '@/lib/forum'
import { formatDistanceToNow } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ForumPostCardProps {
  post: ForumPost
  variant?: 'default' | 'compact'
  showCategory?: boolean
  className?: string
}

export function ForumPostCard({
  post,
  variant = 'default',
  showCategory = true,
  className,
}: ForumPostCardProps) {
  const isCompact = variant === 'compact'
  
  return (
    <div
      className={cn(
        'academic-card p-4 hover:shadow-md transition-shadow',
        isCompact && 'p-3',
        className
      )}
    >
      <div className="flex gap-3">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-1 min-w-[40px]">
          <button className="p-1 rounded hover:bg-muted transition-colors">
            <ThumbsUp className={cn(
              'h-4 w-4',
              post.userVote === 'up' ? 'text-primary fill-current' : 'text-muted-foreground'
            )} />
          </button>
          <span className={cn(
            'text-sm font-medium',
            post.votes > 0 ? 'text-success' : post.votes < 0 ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {post.votes}
          </span>
          <button className="p-1 rounded hover:bg-muted transition-colors">
            <ThumbsDown className={cn(
              'h-4 w-4',
              post.userVote === 'down' ? 'text-destructive fill-current' : 'text-muted-foreground'
            )} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {post.isPinned && (
                <Pin className="h-4 w-4 text-warning" />
              )}
              {post.isLocked && (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
              {post.isSolved && (
                <CheckCircle className="h-4 w-4 text-success" />
              )}
              {showCategory && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `var(--color-${post.category.color}-100)`,
                    color: `var(--color-${post.category.color}-700)`,
                  }}
                >
                  {post.category.name}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{post.replies.length}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <Link
            to="/forum/posts/$postId"
            params={{ postId: post.id }}
            className="block group"
          >
            <h3 className={cn(
              'font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2',
              isCompact ? 'text-sm' : 'text-base'
            )}>
              {post.title}
            </h3>
          </Link>

          {/* Content Preview */}
          {!isCompact && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {post.content}
            </p>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.username}
                    className="h-5 w-5 rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">{post.author.username}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-xs font-medium',
                    post.author.role === 'instructor' && 'bg-primary/10 text-primary',
                    post.author.role === 'admin' && 'bg-destructive/10 text-destructive',
                    post.author.role === 'student' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {post.author.role}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(post.createdAt))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}