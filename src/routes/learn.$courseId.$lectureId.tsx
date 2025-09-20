import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Maximize,
  Menu,
  MessageSquare,
  Pause,
  Play,
  Settings,
  Star,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { api } from '@/lib/api-client'

export const Route = createFileRoute('/learn/$courseId/$lectureId')({
  component: LearningEnvironment,
})

interface Lecture {
  id: string
  title: string
  description: string
  video_url: string
  duration_minutes: number
  order_number: number
  is_free: boolean
  resources?: Array<{
    id: string
    title: string
    type: 'pdf' | 'video' | 'text' | 'link'
    url: string
  }>
}

interface Course {
  id: string
  title: string
  description: string
  instructor_name: string
  instructor_avatar?: string
  lectures: Array<Lecture>
  total_duration?: number
  enrollment_count: number
  rating: number
  rating_count: number
  level?: string
  price?: number
  currency?: string
  thumbnail_url?: string
  duration_minutes?: number
  tags?: Array<string>
}

interface Note {
  id: string
  content: string
  timestamp: number
  created_at: string
}

function LearningEnvironment() {
  const { courseId, lectureId } = Route.useParams()
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime] = useState(0)
  const [duration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSidebar, setShowSidebar] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState<Array<Note>>([])

  // Fetch course data with lectures
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ['course-with-lectures', courseId],
    queryFn: async () => {
      try {
        // Get course info and lectures separately, then combine
        const [courseResponse, lecturesResponse] = await Promise.all([
          api.getCourse(courseId),
          api.listLectures(courseId, { page: 1, page_size: 100 }), // Get all lectures for now
        ])

        // Map backend data to frontend format
        const courseData = courseResponse.data
        const lecturesData = lecturesResponse.data?.lectures || []

        // Sort lectures by order_number
        const sortedLectures = lecturesData
          .sort((a, b) => (a.order_number || 0) - (b.order_number || 0))
          .map((lecture) => ({
            ...lecture,
            order_number: lecture.order_number || 0,
            resources: [], // Resources will be loaded separately if needed
            duration_minutes: lecture.duration_minutes || 0,
          }))

        return {
          ...courseData,
          lectures: sortedLectures,
          total_duration: courseData?.duration_minutes,
          enrollment_count: courseData?.enrollment_count || 0,
          rating: courseData?.rating || 0,
          rating_count: courseData?.rating_count || 0,
          instructor_name: courseData?.instructor_name || 'Unknown Instructor',
        } as Course
      } catch (error) {
        console.error('Failed to fetch course data:', error)
        throw error
      }
    },
    enabled: !!courseId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Find current lecture
  const currentLecture = course?.lectures?.find((l) => l.id === lectureId)
  const currentLectureIndex =
    course?.lectures?.findIndex((l) => l.id === lectureId) ?? -1
  const nextLecture = course?.lectures?.[currentLectureIndex + 1]
  const prevLecture = course?.lectures?.[currentLectureIndex - 1]

  // Calculate progress
  const completedLectures = currentLectureIndex + 1
  const totalLectures = course?.lectures?.length ?? 0
  const courseProgress =
    totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0

  // Video controls
  const togglePlayback = () => setIsPlaying(!isPlaying)
  const toggleMute = () => setIsMuted(!isMuted)
  const handlePlaybackRateChange = (rate: number) => setPlaybackRate(rate)

  // Notes functionality
  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        timestamp: currentTime,
        created_at: new Date().toISOString(),
      }
      setNotes([...notes, note])
      setNewNote('')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải khóa học...</p>
        </div>
      </div>
    )
  }

  if (courseError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-destructive">
            Lỗi tải khóa học
          </h2>
          <p className="text-muted-foreground mb-4">
            {courseError instanceof Error
              ? courseError.message
              : 'Không thể tải thông tin khóa học'}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mr-2"
          >
            Thử lại
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  if (!course || !currentLecture) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Không tìm thấy bài giảng
          </h2>
          <p className="text-muted-foreground mb-4">
            {!course
              ? 'Khóa học không tồn tại.'
              : 'Bài giảng bạn đang tìm kiếm không tồn tại.'}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              void navigate({ to: '/courses' })
            }}
          >
            Về trang khóa học
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="font-semibold truncate max-w-[300px]">
              {course.title}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>
                {completedLectures}/{totalLectures} bài
              </span>
              <Progress value={courseProgress} className="w-24" />
              <span>{Math.round(courseProgress)}%</span>
            </div>

            <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            {currentLecture.video_url ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    {currentLecture.title}
                  </p>
                  <p className="text-sm opacity-75">
                    Thời lượng: {currentLecture.duration_minutes} phút
                  </p>
                  <p className="text-xs opacity-50 mt-2">
                    Video player sẽ được tích hợp ở đây
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    {currentLecture.title}
                  </p>
                  <p className="text-sm opacity-75">Video chưa sẵn sàng</p>
                </div>
              </div>
            )}

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
              <div className="space-y-2">
                {/* Progress Bar */}
                <div className="relative">
                  <Progress
                    value={duration > 0 ? (currentTime / duration) * 100 : 0}
                    className="h-1"
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePlayback}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>

                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={playbackRate}
                      onChange={(e) =>
                        handlePlaybackRateChange(Number(e.target.value))
                      }
                      className="bg-black/50 text-white text-sm rounded px-2 py-1"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lecture Content */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Lecture Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">{currentLecture.title}</h1>
                  <Badge
                    variant={currentLecture.is_free ? 'secondary' : 'default'}
                  >
                    {currentLecture.is_free ? 'Miễn phí' : 'Trả phí'}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  {currentLecture.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {currentLecture.duration_minutes} phút
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrollment_count.toLocaleString()} học viên
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                    {course.rating} ({course.rating_count} đánh giá)
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={!prevLecture}
                  onClick={() => {
                    if (prevLecture) {
                      void navigate({
                        to: `/learn/${courseId}/${prevLecture.id}`,
                      })
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Bài trước
                </Button>

                <span className="text-sm text-muted-foreground">
                  Bài {currentLectureIndex + 1} / {totalLectures}
                </span>

                <Button
                  disabled={!nextLecture}
                  onClick={() => {
                    if (nextLecture) {
                      void navigate({
                        to: `/learn/${courseId}/${nextLecture.id}`,
                      })
                    }
                  }}
                >
                  Bài tiếp theo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Tabs Content */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="resources">Tài liệu</TabsTrigger>
                  <TabsTrigger value="notes">Ghi chú</TabsTrigger>
                  <TabsTrigger value="discussions">Thảo luận</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Về bài giảng này</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {currentLecture.description}
                      </p>
                      <div className="space-y-2">
                        <h4 className="font-medium">Nội dung sẽ được học:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Khái niệm cơ bản về React</li>
                          <li>• Cách thiết lập môi trường phát triển</li>
                          <li>• Tạo component đầu tiên</li>
                          <li>• Hiểu về JSX và cách sử dụng</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Giảng viên</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={course.instructor_avatar} />
                          <AvatarFallback>
                            {course.instructor_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {course.instructor_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Senior Frontend Developer
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tài liệu bài giảng</CardTitle>
                      <CardDescription>
                        Tải xuống các tài liệu hỗ trợ cho bài giảng này
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentLecture.resources &&
                      currentLecture.resources.length > 0 ? (
                        <div className="space-y-3">
                          {currentLecture.resources.map((resource) => (
                            <div
                              key={resource.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                  {resource.type === 'pdf' && (
                                    <BookOpen className="h-4 w-4 text-primary" />
                                  )}
                                  {resource.type === 'video' && (
                                    <Play className="h-4 w-4 text-primary" />
                                  )}
                                  {resource.type === 'link' && (
                                    <Download className="h-4 w-4 text-primary" />
                                  )}
                                  {resource.type === 'text' && (
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {resource.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {resource.type}
                                  </p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Tải xuống
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          Không có tài liệu cho bài giảng này
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ghi chú của bạn</CardTitle>
                      <CardDescription>
                        Tạo ghi chú cho thời điểm hiện tại:{' '}
                        {formatTime(currentTime)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Viết ghi chú của bạn..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                          />
                          <Button onClick={addNote} disabled={!newNote.trim()}>
                            Thêm ghi chú
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {notes.map((note) => (
                            <div
                              key={note.id}
                              className="p-3 border rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">
                                  {formatTime(note.timestamp)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(note.created_at).toLocaleDateString(
                                    'vi-VN',
                                  )}
                                </span>
                              </div>
                              <p className="text-sm">{note.content}</p>
                            </div>
                          ))}
                          {notes.length === 0 && (
                            <p className="text-muted-foreground text-center py-4">
                              Chưa có ghi chú nào
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="discussions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thảo luận</CardTitle>
                      <CardDescription>
                        Trao đổi với giảng viên và học viên khác
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Tính năng thảo luận sẽ sớm được cập nhật
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Sidebar - Desktop */}
        <div
          className={`hidden md:block w-80 border-l bg-muted/30 ${showSidebar ? '' : 'hidden'}`}
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Nội dung khóa học</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {completedLectures}/{totalLectures} bài hoàn thành
            </div>
            <Progress value={courseProgress} className="mt-2" />
          </div>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="p-2">
              {course.lectures.map((lecture, index) => (
                <div
                  key={lecture.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                    lecture.id === lectureId
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() =>
                    (window.location.href = `/learn/${courseId}/${lecture.id}`)
                  }
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {index < currentLectureIndex ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : index === currentLectureIndex ? (
                        <Play className="h-4 w-4 text-primary" />
                      ) : (
                        <div className="h-4 w-4 border border-muted-foreground rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {lecture.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {lecture.duration_minutes} phút
                        </span>
                        {lecture.is_free && (
                          <Badge variant="secondary" className="text-xs">
                            Miễn phí
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
          <SheetContent side="right" className="w-80 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Nội dung khóa học</SheetTitle>
              <SheetDescription>
                {completedLectures}/{totalLectures} bài hoàn thành
              </SheetDescription>
              <Progress value={courseProgress} className="mt-2" />
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="p-2">
                {course.lectures.map((lecture, index) => (
                  <div
                    key={lecture.id}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                      lecture.id === lectureId
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      window.location.href = `/learn/${courseId}/${lecture.id}`
                      setShowSidebar(false)
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {index < currentLectureIndex ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : index === currentLectureIndex ? (
                          <Play className="h-4 w-4 text-primary" />
                        ) : (
                          <div className="h-4 w-4 border border-muted-foreground rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {lecture.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {lecture.duration_minutes} phút
                          </span>
                          {lecture.is_free && (
                            <Badge variant="secondary" className="text-xs">
                              Miễn phí
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
