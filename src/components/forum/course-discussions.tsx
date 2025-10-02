import {
  BookOpen,
  CheckCircle,
  Clock,
  MessageSquare,
  PlusCircle,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ApprovalPanel } from './approval-panel'
import { CreateTopicDialog } from './create-topic-dialog'
import { TopicCard } from './topic-card'

import type { TopicData } from './topic-card'

interface CourseDiscussionsProps {
  courseId: string
  courseName: string
  currentUserId?: string
  currentUserRole?: 'student' | 'instructor' | 'admin'
  isInstructor?: boolean
  isEnrolled?: boolean
}

export function CourseDiscussions({
  courseId,
  courseName,
  currentUserId,
  currentUserRole = 'student',
  isInstructor = false,
  isEnrolled = false,
}: CourseDiscussionsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [createTopicOpen, setCreateTopicOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('discussions')

  // Mock data - replace with actual API calls
  const topics: Array<TopicData> = [
    {
      id: '1',
      title: 'Câu hỏi về bài 5: React Hooks',
      content: 'Mình không hiểu rõ về useEffect, có thể giải thích thêm không?',
      category: 'Thảo luận khóa học',
      courseId,
      author: {
        id: '2',
        name: 'Nguyễn Văn A',
        avatar: '/api/placeholder/32/32',
        role: 'student',
      },
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T14:15:00Z',
      status: 'approved',
      viewCount: 45,
      postCount: 3,
      isPinned: true,
      isLocked: false,
      pinOrder: 1,
      tags: ['react', 'hooks', 'useeffect'],
      lastReply: {
        authorName: 'Giảng viên',
        timestamp: '1 giờ trước',
      },
    },
    {
      id: '2',
      title: 'Bài tập tuần 3 - Có thể gia hạn không?',
      content:
        'Do có việc gia đình bận, em có thể nộp bài tập muộn 2 ngày được không ạ?',
      category: 'Thảo luận khóa học',
      courseId,
      author: {
        id: '3',
        name: 'Trần Thị B',
        role: 'student',
      },
      createdAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-01-20T11:30:00Z',
      status: 'pending',
      viewCount: 12,
      postCount: 0,
      isPinned: false,
      isLocked: false,
      tags: ['assignment', 'extension'],
    },
    {
      id: '3',
      title: 'Chia sẻ source code project cuối khóa',
      content: 'Mình muốn chia sẻ project đã hoàn thành để mọi người tham khảo',
      category: 'Thảo luận khóa học',
      courseId,
      author: {
        id: '4',
        name: 'Lê Văn C',
        role: 'student',
      },
      createdAt: '2024-01-19T16:20:00Z',
      updatedAt: '2024-01-20T08:45:00Z',
      status: 'approved',
      viewCount: 89,
      postCount: 7,
      isPinned: false,
      isLocked: false,
      tags: ['project', 'sharing', 'completed'],
      lastReply: {
        authorName: 'Phạm Thị D',
        timestamp: '30 phút trước',
      },
    },
  ]

  const pendingTopics = topics.filter((topic) => topic.status === 'pending')
  const approvedTopics = topics.filter((topic) => topic.status === 'approved')

  const filteredTopics = approvedTopics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleCreateTopic = async (data: any) => {
    try {
      // TODO: Replace with actual API call
      console.log('Creating course topic:', { ...data, courseId })
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert('Chủ đề đã được tạo và gửi đến giảng viên để duyệt!')
    } catch (error) {
      throw new Error('Không thể tạo chủ đề. Vui lòng thử lại.')
    }
  }

  const handleApproveTopic = async (topicId: string) => {
    try {
      // TODO: Replace with actual API call
      console.log('Approving topic:', topicId)
      await new Promise((resolve) => setTimeout(resolve, 500))
      alert('Chủ đề đã được duyệt!')
    } catch (error) {
      throw new Error('Không thể duyệt chủ đề')
    }
  }

  const handleRejectTopic = async (topicId: string) => {
    try {
      // TODO: Replace with actual API call
      console.log('Rejecting topic:', topicId)
      await new Promise((resolve) => setTimeout(resolve, 500))
      alert('Chủ đề đã bị từ chối!')
    } catch (error) {
      throw new Error('Không thể từ chối chủ đề')
    }
  }

  if (!isEnrolled) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Cần đăng ký khóa học</h3>
          <p className="text-muted-foreground mb-4">
            Bạn cần đăng ký khóa học này để tham gia thảo luận
          </p>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Đăng ký khóa học
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Thảo luận khóa học</h3>
          <p className="text-muted-foreground">
            Trao đổi, hỏi đáp về nội dung khóa học "{courseName}"
          </p>
        </div>

        <Button
          onClick={() => setCreateTopicOpen(true)}
          disabled={currentUserRole !== 'student' && !isInstructor}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Tạo chủ đề
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Thảo luận ({approvedTopics.length})
          </TabsTrigger>
          {isInstructor && (
            <TabsTrigger value="approval" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Chờ duyệt ({pendingTopics.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold">{approvedTopics.length}</div>
                <p className="text-xs text-muted-foreground">Chủ đề</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-xl font-bold">
                  {approvedTopics.reduce(
                    (sum, topic) => sum + topic.postCount,
                    0,
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Bài viết</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-xl font-bold">
                  {new Set(topics.map((t) => t.author.id)).size}
                </div>
                <p className="text-xs text-muted-foreground">Người tham gia</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-xl font-bold">
                  {topics.filter((t) => t.postCount > 0).length}
                </div>
                <p className="text-xs text-muted-foreground">Đã trả lời</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm trong thảo luận khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Mới nhất</SelectItem>
                <SelectItem value="popular">Phổ biến</SelectItem>
                <SelectItem value="mostReplies">Nhiều trả lời</SelectItem>
                <SelectItem value="unanswered">Chưa trả lời</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topics List */}
          <div className="space-y-4">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">
                    {searchQuery
                      ? 'Không tìm thấy chủ đề nào'
                      : 'Chưa có thảo luận nào'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? 'Thử thay đổi từ khóa tìm kiếm'
                      : 'Hãy là người đầu tiên tạo chủ đề thảo luận cho khóa học này'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setCreateTopicOpen(true)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Tạo chủ đề đầu tiên
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Approval Tab (Instructor only) */}
        {isInstructor && (
          <TabsContent value="approval">
            <ApprovalPanel
              pendingTopics={pendingTopics}
              onApproveTopic={handleApproveTopic}
              onRejectTopic={handleRejectTopic}
              userRole="instructor"
              courseId={courseId}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Create Topic Dialog */}
      <CreateTopicDialog
        open={createTopicOpen}
        onOpenChange={setCreateTopicOpen}
        onSubmit={handleCreateTopic}
        courseId={courseId}
      />
    </div>
  )
}
