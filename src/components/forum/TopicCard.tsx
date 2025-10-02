import { Link } from '@tanstack/react-router'
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  MessageSquare,
  Pin,
  Star,
  Tag,
} from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import type { Topic } from '@/lib/api/forum'

interface TopicCardProps {
  topic: Topic
  isSelected?: boolean
  onSelect?: (topicId: string) => void
  isLoading?: boolean
  compact?: boolean
}

export function TopicCard({
  topic,
  isSelected = false,
  onSelect,
  isLoading = false,
  compact = false,
}: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(isSelected)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getAuthorInfo = () => {
    if (topic.author) {
      return {
        name: topic.author?.name || 'Unknown User',
        avatar: topic.author.avatar,
        role: topic.author.role,
      }
    }
    return {
      name: `User ${topic.created_by_id?.substring(0, 8)}`,
      avatar: null,
      role: 'student',
    }
  }

  const authorInfo = getAuthorInfo()
  const isPinned = topic.isPinned || topic.is_sticky || false
  const isPending = topic.status === 'pending'
  const postCount = topic.postCount || topic.post_count || 0
  const viewCount = topic.viewCount || topic.view_count || 0

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(topic.id)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  const cardContent = (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isPinned && 'border-primary/50 bg-primary/5',
        isPending &&
          'border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20',
        compact && 'p-0 border-0 bg-transparent hover:bg-transparent',
      )}
      onClick={handleCardClick}
    >
      {!compact && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Topic Title and Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {isPinned && (
                  <Pin className="h-4 w-4 text-primary fill-current" />
                )}
                {isPending && <Clock className="h-4 w-4 text-orange-500" />}
                {topic.lastReply && <Star className="h-3 w-3 text-green-500" />}
              </div>

              <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-2">
                {topic.title}
              </h3>

              {/* Author and meta info */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px]">
                      {authorInfo.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{authorInfo.name}</span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    {authorInfo.role}
                  </Badge>
                </div>
                <span>•</span>
                <span>
                  {formatRelativeTime(topic.created_at || topic.createdAt)}
                </span>
              </div>

              {/* Tags */}
              {topic.tags && topic.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {topic.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      <Tag className="h-2.5 w-2.5 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {topic.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{topic.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{postCount} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{viewCount} views</span>
                </div>
                {topic.lastReply && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Last: {formatRelativeTime(topic.lastReply.timestamp)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Category and expand/collapse */}
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className="text-xs">
                {topic.category}
              </Badge>
              {onSelect && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {isSelected ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      {/* Compact view */}
      {compact && (
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isPinned && <Pin className="h-3 w-3 text-primary" />}
              {isPending && <Clock className="h-3 w-3 text-orange-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{topic.title}</h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span>{authorInfo.name}</span>
                <span>•</span>
                <span>
                  {formatRelativeTime(topic.created_at || topic.createdAt)}
                </span>
                <span>•</span>
                <span>{postCount} replies</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {topic.category}
            </Badge>
          </div>
        </CardContent>
      )}

      {/* Pending status indicator */}
      {isPending && !compact && (
        <div className="px-4 pb-3">
          <Badge
            variant="secondary"
            className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
          >
            <Clock className="h-3 w-3 mr-1" />
            Awaiting approval
          </Badge>
        </div>
      )}
    </Card>
  )

  // If onSelect is provided, wrap in Link for navigation
  if (onSelect) {
    return (
      <Link
        to="/forum/topics/$topicId"
        params={{ topicId: topic.id }}
        className="block"
      >
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

export function TopicCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <Card className={compact ? 'p-0 border-0 bg-transparent' : ''}>
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
