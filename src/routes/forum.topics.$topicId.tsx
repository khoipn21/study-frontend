import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Loader2,
  Lock,
  MessageCircle,
  MessageSquare,
  Pin,
  Share,
  Shield,
  Star,
  Tag,
  Users,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'

import { CreateReplyDialog } from '@/components/forum/create-reply-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { forumApi, type Topic, type Post } from '@/lib/api/forum'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/forum/topics/$topicId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { topicId } = Route.useParams()
  const [replyOpen, setReplyOpen] = useState(false)
  const queryClient = useQueryClient()
  const { user, token } = useAuth()

  const [currentUser] = useState({
    id: '1',
    name: 'Current User',
    role: 'student' as const,
  })

  // Fetch topic data
  const {
    data: topicData,
    isLoading: topicLoading,
    error: topicError,
  } = useQuery<Topic>({
    queryKey: ['topic', topicId],
    queryFn: () => forumApi.getTopic(topicId),
  })

  // Fetch posts data
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery<{ posts: Post[]; total: number }>({
    queryKey: ['posts', topicId],
    queryFn: () => forumApi.getPosts(topicId, { limit: 100 }),
  })

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: ({
      postId,
      voteType,
    }: {
      postId: string
      voteType: 'up' | 'down'
    }) => {
      if (!token) {
        throw new Error('Bạn cần đăng nhập để vote')
      }
      return forumApi.votePost(postId, voteType, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', topicId] })
    },
    onError: (error) => {
      console.error('Vote error:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Không thể vote. Vui lòng đăng nhập và thử lại.',
      )
    },
  })

  // Helper function
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

  // Transform API data to component format
  const topic = topicData
    ? {
        id: topicData.id,
        title: topicData.title,
        content: topicData.description || topicData.content || '',
        category: topicData.category,
        courseId: topicData.course_id || topicData.courseId,
        author: topicData.created_by
          ? {
              id: topicData.created_by.id,
              name: topicData.created_by.username,
              avatar: topicData.created_by.avatar || undefined,
              role: topicData.created_by.role as
                | 'student'
                | 'instructor'
                | 'admin',
            }
          : {
              id: topicData.created_by_id,
              name: 'Unknown User',
              avatar: undefined,
              role: 'student' as const,
            },
        createdAt: topicData.created_at || topicData.createdAt,
        updatedAt: topicData.updated_at || topicData.updatedAt,
        status: topicData.status as 'pending' | 'approved' | 'rejected',
        viewCount: topicData.view_count || topicData.viewCount,
        postCount: topicData.post_count || topicData.postCount,
        isPinned: topicData.is_sticky || topicData.isPinned,
        isLocked: topicData.is_locked || topicData.isLocked,
        pinOrder: topicData.pin_order || topicData.pinOrder,
        tags: topicData.tags || [],
        lastReply: topicData.last_post_by
          ? {
              authorName: topicData.last_post_by.username,
              timestamp: formatTimeAgo(
                topicData.updated_at || topicData.updatedAt,
              ),
            }
          : undefined,
      }
    : null

  const posts = postsData?.posts
    ? postsData.posts.map((post) => ({
        id: post.id,
        content: post.content,
        author: post.author
          ? {
              id: post.author.id,
              name: post.author.username,
              avatar: post.author.avatar || undefined,
              role: post.author.role as 'student' | 'instructor' | 'admin',
            }
          : {
              id: post.author_id || 'unknown',
              name: 'Unknown User',
              avatar: undefined,
              role: 'student' as const,
            },
        createdAt:
          post.created_at || post.createdAt || new Date().toISOString(),
        updatedAt:
          post.updated_at || post.updatedAt || new Date().toISOString(),
        status: post.status as 'pending' | 'approved' | 'rejected',
        isAnswer: post.is_answer || post.isAnswer || false,
        isPinned: post.is_pinned || post.isPinned || false,
        pinOrder: post.pin_order || post.pinOrder || null,
        voteCount: post.vote_total || post.voteCount || 0,
        userVote: post.user_vote || post.userVote || null,
      }))
    : []

  const handleReplySubmit = async (data: { content: string }) => {
    try {
      if (!token) {
        throw new Error('Bạn cần đăng nhập để trả lời')
      }

      await forumApi.createPostNew(
        {
          topicId,
          content: data.content,
        },
        token,
      )

      alert('Bài trả lời đã được gửi và chờ duyệt!')
      setReplyOpen(false)

      // Refresh posts
      refetchPosts()
    } catch (error) {
      console.error('Failed to create post:', error)
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Không thể gửi bài trả lời. Vui lòng thử lại.',
      )
    }
  }

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      await voteMutation.mutateAsync({ postId, voteType })
    } catch (error) {
      console.error('Failed to vote:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'instructor':
        return <Star className="h-4 w-4 text-yellow-500" />
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'instructor':
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-yellow-100 text-yellow-800"
          >
            <Star className="h-3 w-3 mr-1" />
            Giảng viên
          </Badge>
        )
      case 'admin':
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-red-100 text-red-800"
          >
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Học viên
          </Badge>
        )
    }
  }

  // Loading state
  if (topicLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (topicError || postsError || !topic) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 max-w-4xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {topicError
                ? `Không thể tải chủ đề: ${topicError instanceof Error ? topicError.message : 'Unknown error'}`
                : postsError
                  ? `Không thể tải bài trả lời: ${postsError instanceof Error ? postsError.message : 'Unknown error'}`
                  : 'Không tìm thấy chủ đề'}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link to="/forum">Quay lại diễn đàn</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link
              to="/forum"
              className="hover:text-foreground transition-colors"
            >
              Diễn đàn
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{topic.category}</span>
          </div>
        </nav>

        {/* Topic Header */}
        <Card
          className={cn(
            'mb-6',
            topic.isPinned && 'border-primary/30 bg-primary/5',
          )}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {topic.isPinned && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      <Pin className="h-3 w-3 mr-1" />
                      Đã ghim
                    </Badge>
                  )}
                  {topic.isLocked && (
                    <Badge variant="outline" className="text-muted-foreground">
                      <Lock className="h-3 w-3 mr-1" />
                      Đã khóa
                    </Badge>
                  )}
                  <Badge variant="outline">{topic.category}</Badge>
                  {posts.some((p) => p.isAnswer) && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Đã giải quyết
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-2xl mb-3">{topic.title}</CardTitle>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={topic.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {topic.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {topic.author.name}
                        </span>
                        {getRoleIcon(topic.author.role)}
                      </div>
                      {getRoleBadge(topic.author.role)}
                    </div>
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatTimeAgo(topic.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {topic.viewCount} lượt xem
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {topic.postCount} trả lời
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {topic.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Topic Content */}
            <div
              className="prose prose-sm max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: topic.content }}
            />
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Câu trả lời ({posts.length})
            </h3>

            {!topic.isLocked && (
              <Button onClick={() => setReplyOpen(true)} size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Trả lời
              </Button>
            )}
          </div>

          {/* Posts List */}
          {posts.map((post) => (
            <Card
              key={post.id}
              className={cn(
                'relative',
                post.isAnswer && 'border-green-200 bg-green-50/30',
              )}
            >
              {post.isAnswer && (
                <div className="absolute -top-2 left-4">
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đáp án được chọn
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Vote Controls */}
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <Button
                      variant={post.userVote === 'up' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleVote(post.id, 'up')}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>

                    <span className="text-sm font-medium text-muted-foreground">
                      {post.voteCount}
                    </span>

                    <Button
                      variant={post.userVote === 'down' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleVote(post.id, 'down')}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1">
                    {/* Post Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {post.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {post.author.name}
                            </span>
                            {getRoleIcon(post.author.role)}
                          </div>
                          {getRoleBadge(post.author.role)}
                        </div>
                      </div>

                      <Separator orientation="vertical" className="h-6" />

                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>

                    {/* Post Body */}
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Post Actions */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Trả lời
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Chia sẻ
                      </Button>
                      {post.author.id === currentUser.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {posts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Chưa có câu trả lời nào</h3>
                <p className="text-muted-foreground mb-4">
                  Hãy là người đầu tiên trả lời chủ đề này
                </p>
                {!topic.isLocked && (
                  <Button onClick={() => setReplyOpen(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Viết câu trả lời
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reply Dialog */}
        <CreateReplyDialog
          open={replyOpen}
          onOpenChange={setReplyOpen}
          onSubmit={handleReplySubmit}
          topicTitle={topic.title}
          topicLocked={topic.isLocked}
        />
      </div>
    </div>
  )
}
