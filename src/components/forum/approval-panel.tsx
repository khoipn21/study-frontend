import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  MessageCircle,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import type { TopicData } from './topic-card'

interface ApprovalPanelProps {
  pendingTopics: Array<TopicData>
  pendingPosts?: Array<any> // Will define PostData later
  onApproveTopic: (topicId: string) => Promise<void>
  onRejectTopic: (topicId: string) => Promise<void>
  onApprovePost?: (postId: string) => Promise<void>
  onRejectPost?: (postId: string) => Promise<void>
  userRole: 'instructor' | 'admin'
  courseId?: string // For instructor panel
}

export function ApprovalPanel({
  pendingTopics,
  pendingPosts = [],
  onApproveTopic,
  onRejectTopic,
  onApprovePost,
  onRejectPost,
  userRole,
  courseId,
}: ApprovalPanelProps) {
  const [selectedAction, setSelectedAction] = useState<{
    type: 'approve' | 'reject'
    itemType: 'topic' | 'post'
    itemId: string
    itemTitle: string
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter topics based on user role
  const filteredTopics =
    userRole === 'instructor'
      ? pendingTopics.filter((topic) => topic.courseId === courseId)
      : pendingTopics

  const handleAction = async () => {
    if (!selectedAction) return

    setIsProcessing(true)
    try {
      if (selectedAction.itemType === 'topic') {
        if (selectedAction.type === 'approve') {
          await onApproveTopic(selectedAction.itemId)
        } else {
          await onRejectTopic(selectedAction.itemId)
        }
      } else {
        if (selectedAction.type === 'approve') {
          await onApprovePost?.(selectedAction.itemId)
        } else {
          await onRejectPost?.(selectedAction.itemId)
        }
      }
    } finally {
      setIsProcessing(false)
      setSelectedAction(null)
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'instructor':
        return <BookOpen className="h-3 w-3 text-blue-500" />
      case 'admin':
        return <Users className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Panel duyệt nội dung
          </h2>
          <p className="text-muted-foreground mt-1">
            {userRole === 'instructor'
              ? 'Duyệt nội dung thảo luận trong khóa học của bạn'
              : 'Duyệt tất cả nội dung thảo luận trên diễn đàn'}
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredTopics.length + pendingPosts.length} chờ duyệt
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{filteredTopics.length}</div>
            <p className="text-sm text-muted-foreground">Chủ đề chờ duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{pendingPosts.length}</div>
            <p className="text-sm text-muted-foreground">Bài viết chờ duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {filteredTopics.length + pendingPosts.length}
            </div>
            <p className="text-sm text-muted-foreground">Tổng cần xử lý</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="topics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Chủ đề ({filteredTopics.length})
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Bài viết ({pendingPosts.length})
          </TabsTrigger>
        </TabsList>

        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-4">
          {filteredTopics.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">
                  Không có chủ đề nào chờ duyệt
                </h3>
                <p className="text-muted-foreground">
                  Tất cả chủ đề đã được xem xét và xử lý
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTopics.map((topic) => (
                <Card
                  key={topic.id}
                  className="border-yellow-200 bg-yellow-50/30"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className="text-yellow-600 border-yellow-200"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Chờ duyệt
                          </Badge>
                          {topic.courseId && (
                            <Badge variant="secondary" className="text-xs">
                              Khóa học
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                          {topic.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={topic.author.avatar} />
                              <AvatarFallback className="text-xs">
                                {topic.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{topic.author.name}</span>
                            {getRoleIcon(topic.author.role)}
                          </div>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatTimeAgo(topic.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {topic.viewCount} lượt xem
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Content Preview */}
                    <div
                      className="text-sm text-muted-foreground mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: topic.content }}
                    />

                    {/* Tags */}
                    {topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {topic.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          setSelectedAction({
                            type: 'approve',
                            itemType: 'topic',
                            itemId: topic.id,
                            itemTitle: topic.title,
                          })
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          setSelectedAction({
                            type: 'reject',
                            itemType: 'topic',
                            itemId: topic.id,
                            itemTitle: topic.title,
                          })
                        }
                      >
                        <X className="h-4 w-4 mr-2" />
                        Từ chối
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          {pendingPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">
                  Không có bài viết nào chờ duyệt
                </h3>
                <p className="text-muted-foreground">
                  Tất cả bài viết đã được xem xét và xử lý
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4" />
              <p>Chức năng duyệt bài viết sẽ được bổ sung sau</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!selectedAction}
        onOpenChange={(open) => !open && setSelectedAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedAction?.type === 'approve'
                ? 'Duyệt nội dung'
                : 'Từ chối nội dung'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAction?.type === 'approve'
                ? `Bạn có chắc chắn muốn duyệt ${selectedAction?.itemType === 'topic' ? 'chủ đề' : 'bài viết'} "${selectedAction?.itemTitle}"? Nội dung sẽ hiển thị công khai.`
                : `Bạn có chắc chắn muốn từ chối ${selectedAction?.itemType === 'topic' ? 'chủ đề' : 'bài viết'} "${selectedAction?.itemTitle}"? Nội dung sẽ bị ẩn.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={isProcessing}
              className={cn(
                selectedAction?.type === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700',
              )}
            >
              {isProcessing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  {selectedAction?.type === 'approve' ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  {selectedAction?.type === 'approve' ? 'Duyệt' : 'Từ chối'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
