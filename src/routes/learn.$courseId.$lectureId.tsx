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
  Edit3,
  Filter,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Play,
  Search,
  Star,
  Trash2,
  Users,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { api } from '@/lib/api-client'
import { VideoPlayer } from '@/components/VideoPlayer'
import {
  useCourseAccess,
  useProgressTracking,
  useStudentNotes,
  useVideoStream,
} from '@/lib/learning-hooks'

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

function LearningEnvironment() {
  const { courseId, lectureId } = Route.useParams()
  const navigate = useNavigate()
  const [showSidebar, setShowSidebar] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [editingNote, setEditingNote] = useState<{
    id: string
    content: string
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'bookmarked'>(
    'all',
  )

  // Check course access
  const { data: accessData } = useCourseAccess(courseId)
  const hasAccess = accessData?.data?.has_access ?? false

  // Video streaming
  const { data: streamData } = useVideoStream(lectureId, hasAccess)

  // Progress tracking
  const progressTracking = useProgressTracking(courseId, lectureId)

  // Notes management
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    isCreating,
    isUpdating,
    isDeleting,
  } = useStudentNotes(courseId, lectureId)

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

  // Video event handlers
  const handleVideoPlay = () => {
    progressTracking.startTracking()
  }

  const handleVideoPause = () => {
    progressTracking.stopTracking()
  }

  const handleVideoProgress = (percentage: number) => {
    progressTracking.updateProgress(percentage)
  }

  const handleVideoEnded = () => {
    progressTracking.completeLecture()
    progressTracking.stopTracking()
  }

  // Notes functionality
  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(newNote, progressTracking.watchTime)
      setNewNote('')
    }
  }

  const handleEditNote = (noteId: string, content: string) => {
    setEditingNote({ id: noteId, content })
  }

  const handleSaveEdit = () => {
    if (editingNote && editingNote.content.trim()) {
      updateNote(editingNote.id, editingNote.content)
      setEditingNote(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingNote(null)
  }

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId)
  }

  // Filter and search notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesFilter = (() => {
      switch (filterType) {
        case 'recent':
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          return new Date(note.created_at) >= oneWeekAgo
        case 'bookmarked':
          // For future implementation when we add bookmark feature
          return true
        default:
          return true
      }
    })()
    return matchesSearch && matchesFilter
  })

  // Jump to video timestamp
  const handleJumpToTimestamp = (timestamp: number) => {
    // This would integrate with the video player to seek to the specific time
    console.log('Jump to timestamp:', timestamp)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get video URL from stream data or fallback to lecture video_url
  const videoUrl = streamData?.data?.stream_url || currentLecture?.video_url

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
          <div className="aspect-video">
            <VideoPlayer
              src={videoUrl}
              title={currentLecture.title}
              poster={course.thumbnail_url}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onProgress={handleVideoProgress}
              onEnded={handleVideoEnded}
              className="w-full h-full"
            />
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

                <TabsContent value="notes" className="space-y-6">
                  {/* Notes Header with Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">
                        Academic Notes
                      </h2>
                      <p className="text-muted-foreground">
                        Build your knowledge base with organized, timestamped
                        notes
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search notes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setFilterType('all')}
                          >
                            All Notes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setFilterType('recent')}
                          >
                            Recent (7 days)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setFilterType('bookmarked')}
                          >
                            Bookmarked
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* New Note Creation */}
                  <Card className="border-dashed">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                        <CardTitle className="text-lg">
                          Create New Note
                        </CardTitle>
                        <Badge variant="secondary" className="ml-auto">
                          {formatTime(progressTracking.watchTime)}
                        </Badge>
                      </div>
                      <CardDescription>
                        Capture your thoughts and insights at the current video
                        timestamp
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Write your academic note here... Consider including key concepts, questions, or insights."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            {newNote.length} characters
                          </p>
                          <Button
                            onClick={handleAddNote}
                            disabled={!newNote.trim() || isCreating}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {isCreating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Creating...
                              </>
                            ) : (
                              'Add Note'
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes List */}
                  <div className="space-y-4">
                    {filteredNotes.length > 0 && (
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Your Notes ({filteredNotes.length})
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {filterType === 'all'
                            ? 'All notes'
                            : filterType === 'recent'
                              ? 'Recent notes'
                              : 'Bookmarked notes'}
                        </p>
                      </div>
                    )}

                    {filteredNotes.map((note) => (
                      <Card
                        key={note.id}
                        className="academic-note-card hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {/* Note Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleJumpToTimestamp(
                                      note.video_timestamp || 0,
                                    )
                                  }
                                  className="font-mono text-xs"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  {note.video_timestamp
                                    ? formatTime(note.video_timestamp)
                                    : '00:00'}
                                </Button>
                                <Badge variant="secondary" className="text-xs">
                                  {new Date(note.created_at).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    },
                                  )}
                                </Badge>
                                {note.updated_at !== note.created_at && (
                                  <Badge variant="outline" className="text-xs">
                                    Edited
                                  </Badge>
                                )}
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleEditNote(note.id, note.content)
                                    }
                                  >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit Note
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Note
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete Note
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this
                                          note? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteNote(note.id)
                                          }
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          disabled={isDeleting}
                                        >
                                          {isDeleting
                                            ? 'Deleting...'
                                            : 'Delete'}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Note Content */}
                            <div className="prose prose-sm max-w-none">
                              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                {note.content}
                              </p>
                            </div>

                            {/* Note Footer */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                              <span>
                                Created:{' '}
                                {new Date(note.created_at).toLocaleString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  },
                                )}
                              </span>
                              {note.updated_at !== note.created_at && (
                                <span>
                                  Modified:{' '}
                                  {new Date(note.updated_at).toLocaleString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    },
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredNotes.length === 0 && (
                      <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            {searchQuery ? 'No notes found' : 'No notes yet'}
                          </h3>
                          <p className="text-muted-foreground text-center max-w-md">
                            {searchQuery
                              ? `No notes match your search "${searchQuery}". Try adjusting your search terms.`
                              : 'Start taking notes to build your academic knowledge base. Click "Add Note" above to create your first note.'}
                          </p>
                          {searchQuery && (
                            <Button
                              variant="outline"
                              onClick={() => setSearchQuery('')}
                              className="mt-4"
                            >
                              Clear Search
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Edit Note Dialog */}
                  <Dialog
                    open={!!editingNote}
                    onOpenChange={() => setEditingNote(null)}
                  >
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Edit Note</DialogTitle>
                        <DialogDescription>
                          Make changes to your note. Click save when you're
                          done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="note-content">Note Content</Label>
                          <Textarea
                            id="note-content"
                            value={editingNote?.content || ''}
                            onChange={(e) =>
                              setEditingNote(
                                editingNote
                                  ? { ...editingNote, content: e.target.value }
                                  : null,
                              )
                            }
                            className="min-h-[150px] resize-none"
                            placeholder="Edit your note content..."
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {editingNote?.content.length || 0} characters
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          onClick={handleSaveEdit}
                          disabled={!editingNote?.content.trim() || isUpdating}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isUpdating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
