import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Lock,
  MessageCircle,
  MessageSquare,
  Pin,
  Share,
  Shield,
  Star,
  Tag,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import { CreateReplyDialog } from '@/components/forum/create-reply-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/forum/topics/$topicId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { topicId } = Route.useParams()
  const [replyOpen, setReplyOpen] = useState(false)
  const [currentUser] = useState({
    id: '1',
    name: 'Current User',
    role: 'student' as const,
  })

  // Mock topic data - replace with actual API call
  const topic = {
    id: topicId,
    title: 'Làm thế nào để học React hiệu quả cho người mới bắt đầu?',
    content: `
      <p>Chào mọi người!</p>
      <p>Mình mới bắt đầu học React và cảm thấy khá khó khăn với những khái niệm như:</p>
      <ul>
        <li>Components và Props</li>
        <li>State và Lifecycle</li>
        <li>Hooks (useState, useEffect)</li>
      </ul>
      <p>Có ai có kinh nghiệm và lời khuyên để học React hiệu quả không? Mình đang tự học qua documentation và một số tutorial online nhưng vẫn cảm thấy chưa thực sự hiểu sâu.</p>
      <p>Cảm ơn mọi người! 🙏</p>
    `,
    category: 'Lập trình',
    courseId: undefined,
    author: {
      id: '2',
      name: 'Nguyễn Văn A',
      avatar: '/api/placeholder/40/40',
      role: 'student' as const,
    },
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    status: 'approved' as const,
    viewCount: 256,
    postCount: 3,
    isPinned: true,
    isLocked: false,
    pinOrder: 1,
    tags: ['react', 'javascript', 'beginner'],
    lastReply: {
      authorName: 'Trần Thị B',
      timestamp: '2 giờ trước',
    },
  }

  // Mock posts data - replace with actual API call
  const posts = [
    {
      id: '1',
      content: `
        <p>Chào bạn! Mình đã học React được 2 năm và có một số gợi ý:</p>
        <ol>
          <li><strong>Nắm vững JavaScript ES6+</strong> trước khi học React</li>
          <li>Bắt đầu với <strong>functional components</strong> và hooks thay vì class components</li>
          <li>Làm nhiều project nhỏ để thực hành</li>
        </ol>
        <p>Bạn có thể tham khảo khóa học React trên trang này, khá hay đấy! Chúc bạn học tốt!</p>
      `,
      author: {
        id: '3',
        name: 'Trần Thị B',
        avatar: '/api/placeholder/40/40',
        role: 'instructor' as const,
      },
      createdAt: '2024-01-20T11:15:00Z',
      updatedAt: '2024-01-20T11:15:00Z',
      status: 'approved' as const,
      isAnswer: false,
      isPinned: false,
      pinOrder: null,
      voteCount: 5,
      userVote: null, // 'up' | 'down' | null
    },
    {
      id: '2',
      content: `
        <p>Cảm ơn <span class="mention">@Trần Thị B</span> đã chia sẻ!</p>
        <p>Mình cũng muốn bổ sung thêm:</p>
        <ul>
          <li>Đọc kỹ React documentation - nó viết rất chi tiết và dễ hiểu</li>
          <li>Tham gia các group Facebook về React để hỏi đáp</li>
          <li>Code mỗi ngày, dù chỉ 30 phút</li>
        </ul>
        <blockquote>
          <p>"Practice makes perfect" - Thực hành nhiều sẽ giúp bạn hiểu sâu hơn!</p>
        </blockquote>
      `,
      author: {
        id: '4',
        name: 'Lê Văn C',
        avatar: '/api/placeholder/40/40',
        role: 'student' as const,
      },
      createdAt: '2024-01-20T12:30:00Z',
      updatedAt: '2024-01-20T12:30:00Z',
      status: 'approved' as const,
      isAnswer: false,
      isPinned: false,
      pinOrder: null,
      voteCount: 2,
      userVote: 'up',
    },
    {
      id: '3',
      content: `
        <p>Rất cảm ơn mọi người đã chia sẻ! 🎉</p>
        <p>Mình sẽ làm theo lời khuyên và sẽ update tiến độ học tập sau nhé.</p>
        <p><strong>Câu trả lời này đã giải quyết được thắc mắc của mình.</strong></p>
      `,
      author: {
        id: '2',
        name: 'Nguyễn Văn A',
        avatar: '/api/placeholder/40/40',
        role: 'student' as const,
      },
      createdAt: '2024-01-20T14:15:00Z',
      updatedAt: '2024-01-20T14:15:00Z',
      status: 'approved' as const,
      isAnswer: true, // Marked as accepted answer
      isPinned: false,
      pinOrder: null,
      voteCount: 8,
      userVote: null,
    },
  ]

  const handleReplySubmit = async (data: { content: string }) => {
    try {
      // TODO: Replace with actual API call
      console.log('Submitting reply:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert('Bài trả lời đã được gửi và chờ duyệt!')
      setReplyOpen(false)

      // Refresh posts
      // refetchPosts()
    } catch (error) {
      throw new Error('Không thể gửi bài trả lời. Vui lòng thử lại.')
    }
  }

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      // TODO: Replace with actual API call
      console.log('Voting on post:', postId, voteType)
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Failed to vote:', error)
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
            Gi강ng viên
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
