import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Shield,
  Star,
  Tag,
  X,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { cn } from '@/lib/utils'

export interface TopicData {
  id: string
  title: string
  content: string
  category: string
  courseId?: string
  author: {
    id: string
    name: string
    avatar?: string
    role: 'student' | 'instructor' | 'admin'
  }
  createdAt: string
  updatedAt: string
  status: 'pending' | 'approved' | 'rejected'
  viewCount: number
  postCount: number
  isPinned: boolean
  isLocked: boolean
  pinOrder?: number
  tags: Array<string>
  lastReply?: {
    authorName: string
    timestamp: string
  }
}

interface TopicCardProps {
  topic: TopicData
  currentUserId?: string
  currentUserRole?: string
  onApprove?: (topicId: string) => void
  onReject?: (topicId: string) => void
  onPin?: (topicId: string, pinOrder: number) => void
  onUnpin?: (topicId: string) => void
  onLock?: (topicId: string) => void
  onUnlock?: (topicId: string) => void
  showApprovalActions?: boolean
  className?: string
}

export function TopicCard({
  topic,
  currentUserId,
  currentUserRole,
  onApprove,
  onReject,
  onPin,
  onUnpin,
  onLock,
  onUnlock,
  showApprovalActions = false,
  className,
}: TopicCardProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'instructor':
        return <Star className="h-3 w-3 text-yellow-500" />
      case 'admin':
        return <Shield className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-200 bg-yellow-50"
          >
            <Clock className="h-3 w-3 mr-1" />
            Chờ duyệt
          </Badge>
        )
      case 'approved':
        return (
          <Badge
            variant="outline"
            className="text-green-600 border-green-200 bg-green-50"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã duyệt
          </Badge>
        )
      case 'rejected':
        return (
          <Badge
            variant="outline"
            className="text-red-600 border-red-200 bg-red-50"
          >
            <X className="h-3 w-3 mr-1" />
            Từ chối
          </Badge>
        )
      default:
        return null
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    )

    if (diffInHours < 1) return 'Vừa xong'
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    return `${Math.floor(diffInHours / 24)} ngày trước`
  }

  const canManage =
    currentUserRole === 'admin' ||
    (currentUserRole === 'instructor' && topic.courseId) ||
    topic.author.id === currentUserId

  return (
    <Card
      className={cn(
        'hover:shadow-md transition-shadow',
        topic.isPinned && 'border-primary/30 bg-primary/5',
        topic.status === 'pending' && 'border-yellow-200 bg-yellow-50/30',
        topic.status === 'rejected' && 'border-red-200 bg-red-50/30',
        className,
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start gap-4 p-4">
          {/* Topic Status Icons */}
          <div className="flex flex-col gap-1 mt-1">
            {topic.isPinned && (
              <div className="relative">
                <Pin className="h-4 w-4 text-primary" />
                {topic.pinOrder && topic.pinOrder > 1 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-primary text-primary-foreground rounded-full w-3 h-3 flex items-center justify-center text-[10px]">
                    {topic.pinOrder}
                  </span>
                )}
              </div>
            )}
            {topic.isLocked && (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
            {topic.status === 'pending' && (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
          </div>

          {/* Author Avatar */}
          <Avatar className="h-10 w-10 border-2 border-border/50">
            <AvatarImage src={topic.author.avatar} />
            <AvatarFallback className="text-xs">
              {topic.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Topic Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-1">
                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                    <Link
                      to="/forum/topics/$topicId"
                      params={{ topicId: topic.id }}
                      className="hover:underline"
                    >
                      {topic.title}
                    </Link>
                  </h3>
                  {getStatusBadge(topic.status)}
                </div>

                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {topic.author.name}
                    {getRoleIcon(topic.author.role)}
                  </span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {topic.category}
                  </Badge>
                  {topic.courseId && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        Khóa học
                      </Badge>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTimeAgo(topic.createdAt)}
                  </span>
                </div>
              </div>

              {/* Actions Menu */}
              {(canManage || showApprovalActions) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {showApprovalActions && topic.status === 'pending' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onApprove?.(topic.id)}
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Duyệt chủ đề
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onReject?.(topic.id)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Từ chối
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    {canManage && (
                      <>
                        {topic.isPinned ? (
                          <DropdownMenuItem onClick={() => onUnpin?.(topic.id)}>
                            <Pin className="h-4 w-4 mr-2" />
                            Bỏ ghim
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onPin?.(topic.id, 1)}
                          >
                            <Pin className="h-4 w-4 mr-2" />
                            Ghim chủ đề
                          </DropdownMenuItem>
                        )}

                        {topic.isLocked ? (
                          <DropdownMenuItem
                            onClick={() => onUnlock?.(topic.id)}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Mở khóa
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => onLock?.(topic.id)}>
                            <Lock className="h-4 w-4 mr-2" />
                            Khóa chủ đề
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Tags */}
            {topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {topic.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Topic Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {topic.viewCount.toLocaleString()} lượt xem
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {topic.postCount} trả lời
                </span>
              </div>

              {topic.lastReply && (
                <div className="text-xs text-muted-foreground">
                  <span className="hidden sm:inline">Trả lời cuối: </span>
                  <span className="font-medium">
                    {topic.lastReply.authorName}
                  </span>
                  <span className="hidden sm:inline">
                    {' '}
                    • {topic.lastReply.timestamp}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
