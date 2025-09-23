import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowUp,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

interface ForumTopic {
  id: string
  title: string
  content: string
  categoryId: string
  categoryName: string
  author: {
    id: string
    name: string
    avatar?: string
    role: 'student' | 'instructor' | 'admin'
  }
  createdAt: string
  updatedAt: string
  viewsCount: number
  repliesCount: number
  isPinned: boolean
  isLocked: boolean
  isSolved: boolean
  tags: Array<string>
  lastReply?: {
    author: string
    timestamp: string
  }
}

function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')

  // Mock data - replace with actual API calls
  const categories: Array<ForumCategory> = [
    {
      id: 'programming',
      name: 'Lập trình',
      description: 'Thảo luận về các ngôn ngữ lập trình và công nghệ',
      icon: Code,
      topicsCount: 1234,
      postsCount: 5678,
      lastActivity: '2 phút trước',
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    },
    {
      id: 'general',
      name: 'Thảo luận chung',
      description: 'Chia sẻ kinh nghiệm học tập và giao lưu',
      icon: MessageSquare,
      topicsCount: 856,
      postsCount: 3421,
      lastActivity: '5 phút trước',
      color: 'bg-green-500/10 text-green-600 border-green-200',
    },
    {
      id: 'help',
      name: 'Hỗ trợ kỹ thuật',
      description: 'Giải đáp thắc mắc về platform và khóa học',
      icon: HelpCircle,
      topicsCount: 432,
      postsCount: 1876,
      lastActivity: '10 phút trước',
      color: 'bg-orange-500/10 text-orange-600 border-orange-200',
    },
    {
      id: 'tips',
      name: 'Mẹo học tập',
      description: 'Chia sẻ phương pháp và kinh nghiệm học hiệu quả',
      icon: Lightbulb,
      topicsCount: 234,
      postsCount: 987,
      lastActivity: '15 phút trước',
      color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    },
    {
      id: 'showcase',
      name: 'Showcase dự án',
      description: 'Khoe dự án và nhận feedback từ cộng đồng',
      icon: Award,
      topicsCount: 345,
      postsCount: 1543,
      lastActivity: '30 phút trước',
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    },
  ]

  const topics: Array<ForumTopic> = [
    {
      id: '1',
      title: 'Làm thế nào để học React hiệu quả cho người mới bắt đầu?',
      content:
        'Mình mới bắt đầu học React và cảm thấy khá khó khăn. Có ai có kinh nghiệm chia sẻ không?',
      categoryId: 'programming',
      categoryName: 'Lập trình',
      author: {
        id: '1',
        name: 'Nguyễn Văn A',
        avatar: '/api/placeholder/32/32',
        role: 'student',
      },
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T14:15:00Z',
      viewsCount: 256,
      repliesCount: 18,
      isPinned: true,
      isLocked: false,
      isSolved: false,
      tags: ['react', 'javascript', 'beginner'],
      lastReply: {
        author: 'Trần Thị B',
        timestamp: '2 giờ trước',
      },
    },
    {
      id: '2',
      title: 'Chia sẻ dự án Todo App với React và TypeScript',
      content:
        'Vừa hoàn thành dự án Todo App sử dụng React và TypeScript. Mọi người góp ý nhé!',
      categoryId: 'showcase',
      categoryName: 'Showcase dự án',
      author: {
        id: '2',
        name: 'Lê Văn C',
        role: 'student',
      },
      createdAt: '2024-01-20T09:00:00Z',
      updatedAt: '2024-01-20T13:45:00Z',
      viewsCount: 142,
      repliesCount: 7,
      isPinned: false,
      isLocked: false,
      isSolved: true,
      tags: ['react', 'typescript', 'project'],
      lastReply: {
        author: 'Phạm Thị D',
        timestamp: '3 giờ trước',
      },
    },
    {
      id: '3',
      title: 'Video bài giảng không phát được trên Chrome',
      content:
        'Mình đang gặp vấn đề không thể phát video trên trình duyệt Chrome. Firefox thì bình thường.',
      categoryId: 'help',
      categoryName: 'Hỗ trợ kỹ thuật',
      author: {
        id: '3',
        name: 'Hoàng Văn E',
        role: 'student',
      },
      createdAt: '2024-01-20T08:15:00Z',
      updatedAt: '2024-01-20T12:30:00Z',
      viewsCount: 89,
      repliesCount: 12,
      isPinned: false,
      isLocked: false,
      isSolved: true,
      tags: ['technical', 'video', 'chrome'],
      lastReply: {
        author: 'Support Team',
        timestamp: '4 giờ trước',
      },
    },
  ]

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || topic.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

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
            <Button className="whitespace-nowrap">
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
                    {topics.reduce((sum, topic) => sum + topic.repliesCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Bài viết</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">2.1K</div>
                  <p className="text-xs text-muted-foreground">Thành viên</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">156</div>
                  <p className="text-xs text-muted-foreground">
                    Hoạt động hôm nay
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">89%</div>
                  <p className="text-xs text-muted-foreground">Giải quyết</p>
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
                  {filteredTopics.map((topic) => (
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
                        {topic.isSolved && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
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
                                {topic.author.name}
                                {getRoleIcon(topic.author.role)}
                              </span>
                              <span>•</span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${categories.find((c) => c.id === topic.categoryId)?.color}`}
                              >
                                {topic.categoryName}
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
                        {topic.tags.length > 0 && (
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
                              {topic.viewsCount.toLocaleString()} lượt xem
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {topic.repliesCount} trả lời
                            </span>
                          </div>

                          {topic.lastReply && (
                            <div className="text-xs text-muted-foreground">
                              <span className="hidden sm:inline">
                                Trả lời cuối:{' '}
                              </span>
                              <span className="font-medium">
                                {topic.lastReply.author}
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
                  ))}

                  {filteredTopics.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">
                        Không tìm thấy chủ đề nào
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Thử thay đổi từ khóa tìm kiếm hoặc tạo chủ đề mới
                      </p>
                      <Button>
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

            {/* Online Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Đang hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Nguyễn Văn A', role: 'student', status: 'online' },
                    {
                      name: 'Trần Thị B',
                      role: 'instructor',
                      status: 'online',
                    },
                    { name: 'Lê Văn C', role: 'student', status: 'online' },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1">
                          {getRoleIcon(user.role)}
                          <span className="text-xs text-muted-foreground capitalize">
                            {user.role === 'student'
                              ? 'Học viên'
                              : 'Giảng viên'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 text-center">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-green-600">42</span> thành
                    viên đang online
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
    </div>
  )
}
