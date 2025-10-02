import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowUp,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  Eye,
  HelpCircle,
  Lightbulb,
  Lock,
  MessageCircle,
  MessageSquare,
  Pin,
  PlusCircle,
  Search,
  Shield,
  Star,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import { CreateTopicDialog } from '@/components/forum/create-topic-dialog'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateTopic, useTopics } from '@/hooks/use-forum'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/forum/')({
  component: ForumPage,
})

interface ForumCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  topicsCount: number
  postsCount: number
  lastActivity: string
  color: string
}

function ForumPage() {
  const { token } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [createTopicOpen, setCreateTopicOpen] = useState(false)

  // Fetch topics from API
  const {
    data: topicsData,
    isLoading,
    error,
  } = useTopics({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  })

  const createTopicMutation = useCreateTopic()

  const topics = topicsData?.topics || []

  // Fetch categories from API - for now using fallback data based on topics
  // TODO: Replace with actual API call when categories endpoint is available
  const categories: Array<ForumCategory> = [
    {
      id: 'programming',
      name: 'Lập trình',
      description: 'Thảo luận về các ngôn ngữ lập trình và công nghệ',
      icon: Code,
      topicsCount: topics.filter((t) => t.category === 'programming').length,
      postsCount: topics
        .filter((t) => t.category === 'programming')
        .reduce((sum, t) => sum + (t.postCount || 0), 0),
      lastActivity: 'Gần đây',
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    },
    {
      id: 'general',
      name: 'Thảo luận chung',
      description: 'Chia sẻ kinh nghiệm học tập và giao lưu',
      icon: MessageSquare,
      topicsCount: topics.filter((t) => t.category === 'general').length,
      postsCount: topics
        .filter((t) => t.category === 'general')
        .reduce((sum, t) => sum + (t.postCount || 0), 0),
      lastActivity: 'Gần đây',
      color: 'bg-green-500/10 text-green-600 border-green-200',
    },
    {
      id: 'help',
      name: 'Hỗ trợ kỹ thuật',
      description: 'Giải đáp thắc mắc về platform và khóa học',
      icon: HelpCircle,
      topicsCount: topics.filter((t) => t.category === 'help').length,
      postsCount: topics
        .filter((t) => t.category === 'help')
        .reduce((sum, t) => sum + (t.postCount || 0), 0),
      lastActivity: 'Gần đây',
      color: 'bg-orange-500/10 text-orange-600 border-orange-200',
    },
    {
      id: 'tips',
      name: 'Mẹo học tập',
      description: 'Chia sẻ phương pháp và kinh nghiệm học hiệu quả',
      icon: Lightbulb,
      topicsCount: topics.filter((t) => t.category === 'tips').length,
      postsCount: topics
        .filter((t) => t.category === 'tips')
        .reduce((sum, t) => sum + (t.postCount || 0), 0),
      lastActivity: 'Gần đây',
      color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    },
    {
      id: 'showcase',
      name: 'Showcase dự án',
      description: 'Khoe dự án và nhận feedback từ cộng đồng',
      icon: Award,
      topicsCount: topics.filter((t) => t.category === 'showcase').length,
      postsCount: topics
        .filter((t) => t.category === 'showcase')
        .reduce((sum, t) => sum + (t.postCount || 0), 0),
      lastActivity: 'Gần đây',
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    },
  ]

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleCreateTopic = async (data: any) => {
    try {
      if (!token) {
        throw new Error('Bạn cần đăng nhập để tạo chủ đề mới')
      }
      await createTopicMutation.mutateAsync({ data, authToken: token })
      alert('Chủ đề đã được tạo và gửi để duyệt!')
    } catch (error) {
      throw new Error('Không thể tạo chủ đề. Vui lòng thử lại.')
    }
  }

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Diễn đàn học tập
              </h1>
              <p className="text-muted-foreground">
                Kết nối, thảo luận và học hỏi cùng cộng đồng{' '}
                {topics.length.toLocaleString()} thành viên
              </p>
            </div>
            <Button
              className="whitespace-nowrap"
              onClick={() => setCreateTopicOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Tạo chủ đề mới
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm chủ đề, nội dung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Mới nhất</SelectItem>
                <SelectItem value="popular">Phổ biến</SelectItem>
                <SelectItem value="mostReplies">Nhiều trả lời</SelectItem>
                <SelectItem value="mostViews">Nhiều lượt xem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Forum Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {topics.reduce(
                      (sum, topic) => sum + (topic.postCount || 0),
                      0,
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Bài viết</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {topics.reduce((sum) => sum + 1, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Người dùng</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {
                      topics.filter((t) => {
                        const createdDate = new Date(t.createdAt)
                        const today = new Date()
                        return (
                          createdDate.toDateString() === today.toDateString()
                        )
                      }).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Chủ đề hôm nay
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {topics.length > 0
                      ? Math.round(
                          (topics.filter((t) => t.status === 'approved')
                            .length /
                            topics.length) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">Đã duyệt</p>
                </CardContent>
              </Card>
            </div>

            {/* Topics List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Chủ đề thảo luận
                  </CardTitle>
                  <Badge variant="secondary">
                    {filteredTopics.length} chủ đề
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground mt-2">Đang tải...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">
                        Có lỗi xảy ra khi tải dữ liệu
                      </p>
                    </div>
                  ) : (
                    filteredTopics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        {/* Topic Status Icons */}
                        <div className="flex flex-col gap-1 mt-1">
                          {topic.isPinned && (
                            <Pin className="h-4 w-4 text-primary" />
                          )}
                          {topic.isLocked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          {topic.status === 'pending' && (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>

                        {/* Author Avatar */}
                        <Avatar className="h-10 w-10 border-2 border-border/50">
                          <AvatarImage src={topic.author?.avatar} />
                          <AvatarFallback className="text-xs">
                            {topic.author?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        {/* Topic Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                                <Link
                                  to="/forum/topics/$topicId"
                                  params={{ topicId: topic.id }}
                                  className="hover:underline"
                                >
                                  {topic.title}
                                </Link>
                              </h3>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  {topic.author?.name || 'Unknown'}
                                  {getRoleIcon(topic.author?.role || 'student')}
                                </span>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {topic.category}
                                </Badge>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatTimeAgo(topic.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          {topic.tags && topic.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {topic.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
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
                                {(topic.viewCount || 0).toLocaleString()} lượt
                                xem
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {topic.postCount || 0} trả lời
                              </span>
                            </div>

                            {topic.lastReply && (
                              <div className="text-xs text-muted-foreground">
                                <span className="hidden sm:inline">
                                  Trả lời cuối:{' '}
                                </span>
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

                        {/* Quick Action */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowUp className="h-4 w-4 rotate-45" />
                        </Button>
                      </div>
                    ))
                  )}

                  {!isLoading && !error && filteredTopics.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">
                        Không tìm thấy chủ đề nào
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Thử thay đổi từ khóa tìm kiếm hoặc tạo chủ đề mới
                      </p>
                      <Button onClick={() => setCreateTopicOpen(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Tạo chủ đề đầu tiên
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Danh mục thảo luận</CardTitle>
                <CardDescription>Khám phá các chủ đề đa dạng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <div
                        key={category.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground">
                            {category.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{category.topicsCount} chủ đề</span>
                            <span>•</span>
                            <span>{category.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Authors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Thành viên tích cực
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(
                    new Set(
                      topics
                        .slice(0, 10)
                        .map(
                          (t) =>
                            t.author?.name || (t as any).created_by?.username,
                        ),
                    ),
                  )
                    .filter(Boolean)
                    .slice(0, 5)
                    .map((authorName, index) => {
                      const authorTopics = topics.filter(
                        (t) =>
                          t.author?.name === authorName ||
                          (t as any).created_by?.username === authorName,
                      )
                      const authorRole =
                        authorTopics[0]?.author?.role ||
                        (authorTopics[0] as any).created_by?.role ||
                        'student'

                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {authorName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {authorName}
                            </p>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(authorRole)}
                              <span className="text-xs text-muted-foreground">
                                {authorTopics.length} chủ đề
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 text-center">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">
                      {
                        Array.from(
                          new Set(
                            topics.map(
                              (t) =>
                                t.author?.name ||
                                (t as any).created_by?.username,
                            ),
                          ),
                        ).length
                      }
                    </span>{' '}
                    thành viên đã tham gia
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Forum Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Quy tắc diễn đàn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Tôn trọng và lịch sự với mọi thành viên</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Không spam hoặc quảng cáo không liên quan</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Sử dụng tiêu đề mô tả rõ ràng</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Tìm kiếm trước khi tạo chủ đề mới</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Topic Dialog */}
      <CreateTopicDialog
        open={createTopicOpen}
        onOpenChange={setCreateTopicOpen}
        onSubmit={handleCreateTopic}
      />
    </div>
  )
}
