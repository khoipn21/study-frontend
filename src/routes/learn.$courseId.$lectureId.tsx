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
  Eye,
  File,
  FileText,
  Filter,
  Image,
  Loader2,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Play,
  Search,
  Star,
  Trash2,
  Users,
  Video,
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
import { useResourceService } from '@/lib/resource-service'
import { ResourcePreviewModal } from '@/components/ResourcePreviewModal'
import type { ResourceData } from '@/lib/resource-service'

export const Route = createFileRoute('/learn/$courseId/$lectureId')({
  component: LearningEnvironment,
})

// Utility functions for file handling
function getFileIcon(
  filename: string,
  fileType: string,
  resourceType?: string,
) {
  const extension = filename.toLowerCase().split('.').pop()
  const mimeType = fileType.toLowerCase()

  // Use resource_type first if available (from API)
  if (resourceType) {
    switch (resourceType.toLowerCase()) {
      case 'image': {
        return <Image className="h-4 w-4 text-blue-500" />
      }
      case 'video': {
        return <Video className="h-4 w-4 text-red-500" />
      }
      case 'pdf': {
        return <FileText className="h-4 w-4 text-red-600" />
      }
      case 'document': {
        return <FileText className="h-4 w-4 text-blue-600" />
      }
      case 'spreadsheet': {
        return <FileText className="h-4 w-4 text-green-600" />
      }
      case 'presentation': {
        return <FileText className="h-4 w-4 text-orange-600" />
      }
      case 'audio': {
        return <Play className="h-4 w-4 text-purple-500" />
      }
      case 'archive': {
        return <Download className="h-4 w-4 text-gray-500" />
      }
    }
  }

  // Fallback to MIME type detection
  if (mimeType.startsWith('image/')) {
    return <Image className="h-4 w-4 text-blue-500" />
  }
  if (mimeType.startsWith('video/')) {
    return <Video className="h-4 w-4 text-red-500" />
  }
  if (mimeType === 'application/pdf') {
    return <FileText className="h-4 w-4 text-red-600" />
  }
  if (mimeType.includes('document') || mimeType.includes('word')) {
    return <FileText className="h-4 w-4 text-blue-600" />
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return <FileText className="h-4 w-4 text-green-600" />
  }
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return <FileText className="h-4 w-4 text-orange-600" />
  }

  // Fallback to extension
  switch (extension) {
    case 'pdf': {
      return <FileText className="h-4 w-4 text-red-600" />
    }
    case 'doc':
    case 'docx': {
      return <FileText className="h-4 w-4 text-blue-600" />
    }
    case 'xls':
    case 'xlsx': {
      return <FileText className="h-4 w-4 text-green-600" />
    }
    case 'ppt':
    case 'pptx': {
      return <FileText className="h-4 w-4 text-orange-600" />
    }
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp': {
      return <Image className="h-4 w-4 text-blue-500" />
    }
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm': {
      return <Video className="h-4 w-4 text-red-500" />
    }
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac': {
      return <Play className="h-4 w-4 text-purple-500" />
    }
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz': {
      return <Download className="h-4 w-4 text-gray-500" />
    }
    case 'txt':
    case 'md':
    case 'csv': {
      return <FileText className="h-4 w-4 text-gray-600" />
    }
    default: {
      return <File className="h-4 w-4 text-gray-500" />
    }
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileTypeDisplay(fileType: string, resourceType?: string): string {
  // Use resource_type first if available
  if (resourceType) {
    switch (resourceType.toLowerCase()) {
      case 'image':
        return 'Image'
      case 'video':
        return 'Video'
      case 'pdf':
        return 'PDF Document'
      case 'document':
        return 'Document'
      case 'spreadsheet':
        return 'Spreadsheet'
      case 'presentation':
        return 'Presentation'
      case 'audio':
        return 'Audio'
      case 'archive':
        return 'Archive'
      default:
        return resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
    }
  }
  const mimeToDisplay: Record<string, string> = {
    'application/pdf': 'PDF Document',
    'application/msword': 'Word Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'Word Document',
    'application/vnd.ms-excel': 'Excel Spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      'Excel Spreadsheet',
    'application/vnd.ms-powerpoint': 'PowerPoint Presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      'PowerPoint Presentation',
    'text/plain': 'Text File',
    'text/csv': 'CSV File',
    'application/zip': 'ZIP Archive',
    'application/x-rar-compressed': 'RAR Archive',
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/svg+xml': 'SVG Image',
    'video/mp4': 'MP4 Video',
    'video/webm': 'WebM Video',
    'audio/mp3': 'MP3 Audio',
    'audio/wav': 'WAV Audio',
  }

  return (
    mimeToDisplay[fileType] ||
    fileType.split('/').pop()?.toUpperCase() ||
    'File'
  )
}

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
    filename: string
    original_name: string
    file_type: string
    file_size: number
    download_url: string
    is_public: boolean
    resource_type: string
    uploaded_at: string
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
  learning_outcomes?: Array<string>
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

  // Resource preview state
  const [previewResource, setPreviewResource] = useState<ResourceData | null>(
    null,
  )
  const [downloadingResources, setDownloadingResources] = useState<Set<string>>(
    new Set(),
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

  // Resource service
  const resourceService = useResourceService()

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
            resources: lecture.resources || [], // Include resources from API
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
        case 'recent': {
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          return new Date(note.created_at) >= oneWeekAgo
        }
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

  // Handle resource download
  const handleResourceDownload = async (resourceId: string) => {
    try {
      const resource = currentLecture?.resources?.find(
        (r) => r.id === resourceId,
      )
      if (!resource) return

      // Add to downloading set
      setDownloadingResources((prev) => new Set(prev).add(resourceId))

      // Use resource service for authenticated download
      await resourceService.downloadResource(resource as ResourceData)
    } catch (error) {
      console.error('Download failed:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to download resource. Please try again.',
      )
    } finally {
      // Remove from downloading set
      setDownloadingResources((prev) => {
        const next = new Set(prev)
        next.delete(resourceId)
        return next
      })
    }
  }

  // Handle resource preview
  const handleResourcePreview = (resource: any) => {
    setPreviewResource(resource as ResourceData)
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
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    )
  }

  if (courseError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-destructive">
            Course loading error
          </h2>
          <p className="text-muted-foreground mb-4">
            {courseError instanceof Error
              ? courseError.message
              : 'Unable to load course information'}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mr-2"
          >
            Try again
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </div>
    )
  }

  if (!course || !currentLecture) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Lecture not found</h2>
          <p className="text-muted-foreground mb-4">
            {!course
              ? 'The course does not exist.'
              : 'The lecture you are looking for does not exist.'}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              void navigate({ to: '/courses' })
            }}
          >
            Back to courses
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
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="font-semibold truncate max-w-[300px]">
              {course.title}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>
                {completedLectures}/{totalLectures} lectures
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
                    {currentLecture.is_free ? 'Free' : 'Premium'}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  {currentLecture.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {currentLecture.duration_minutes} minutes
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrollment_count.toLocaleString()} students
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                    {course.rating} ({course.rating_count} ratings)
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
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Lecture {currentLectureIndex + 1} / {totalLectures}
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
                  Next Lecture
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Tabs Content */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>About this lecture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {currentLecture.description}
                      </p>
                      {course.learning_outcomes &&
                        course.learning_outcomes.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">
                              Nội dung sẽ được học:
                            </h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {course.learning_outcomes
                                .slice(0, 4)
                                .map((outcome, index) => (
                                  <li key={index}>• {outcome}</li>
                                ))}
                            </ul>
                          </div>
                        )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={course.instructor_avatar} />
                          <AvatarFallback>
                            {(course.instructor_name || 'I').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {course.instructor_name || 'Course Instructor'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Expert Instructor
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Lecture Resources
                        {currentLecture.resources &&
                          currentLecture.resources.length > 0 && (
                            <span className="ml-auto text-sm font-normal text-muted-foreground">
                              {currentLecture.resources.length}{' '}
                              {currentLecture.resources.length === 1
                                ? 'file'
                                : 'files'}
                            </span>
                          )}
                      </CardTitle>
                      <CardDescription>
                        Download supporting materials and additional resources
                        for this lecture
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentLecture.resources &&
                      currentLecture.resources.length > 0 ? (
                        <div className="space-y-3">
                          {currentLecture.resources.map((resource) => (
                            <div
                              key={resource.id}
                              className="group border rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              {/* Desktop Layout */}
                              <div className="hidden sm:flex items-center justify-between p-4">
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                  <div className="flex-shrink-0 w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center">
                                    {getFileIcon(
                                      resource.filename,
                                      resource.file_type,
                                      resource.resource_type,
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p
                                        className="font-medium text-sm truncate"
                                        title={resource.original_name}
                                      >
                                        {resource.original_name}
                                      </p>
                                      {!resource.is_public && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                          Premium
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <File className="h-3 w-3" />
                                        {getFileTypeDisplay(
                                          resource.file_type,
                                          resource.resource_type,
                                        )}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Download className="h-3 w-3" />
                                        {formatFileSize(resource.file_size)}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(
                                          resource.uploaded_at,
                                        ).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  {resourceService.canPreview(
                                    resource as ResourceData,
                                  ) && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="gap-2"
                                      onClick={() =>
                                        handleResourcePreview(resource)
                                      }
                                    >
                                      <Eye className="h-4 w-4" />
                                      Preview
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() =>
                                      handleResourceDownload(resource.id)
                                    }
                                    disabled={downloadingResources.has(
                                      resource.id,
                                    )}
                                  >
                                    {downloadingResources.has(resource.id) ? (
                                      <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Downloading...
                                      </>
                                    ) : (
                                      <>
                                        <Download className="h-4 w-4" />
                                        Download
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>

                              {/* Mobile Layout */}
                              <div className="sm:hidden p-4">
                                <div className="flex items-start space-x-3 mb-3">
                                  <div className="flex-shrink-0 w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center">
                                    {getFileIcon(
                                      resource.filename,
                                      resource.file_type,
                                      resource.resource_type,
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <p
                                        className="font-medium text-sm leading-tight"
                                        title={resource.original_name}
                                      >
                                        {resource.original_name}
                                      </p>
                                      {!resource.is_public && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 flex-shrink-0">
                                          Premium
                                        </span>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground mb-3">
                                      <span className="flex items-center gap-1">
                                        <File className="h-3 w-3" />
                                        {getFileTypeDisplay(
                                          resource.file_type,
                                          resource.resource_type,
                                        )}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Download className="h-3 w-3" />
                                        {formatFileSize(resource.file_size)}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(
                                          resource.uploaded_at,
                                        ).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {resourceService.canPreview(
                                    resource as ResourceData,
                                  ) && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="flex-1 gap-2"
                                      onClick={() =>
                                        handleResourcePreview(resource)
                                      }
                                    >
                                      <Eye className="h-4 w-4" />
                                      Preview
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 gap-2"
                                    onClick={() =>
                                      handleResourceDownload(resource.id)
                                    }
                                    disabled={downloadingResources.has(
                                      resource.id,
                                    )}
                                  >
                                    {downloadingResources.has(resource.id) ? (
                                      <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Downloading...
                                      </>
                                    ) : (
                                      <>
                                        <Download className="h-4 w-4" />
                                        Download
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Resources Summary */}
                          <div className="mt-6 p-4 bg-muted/20 rounded-lg border-dashed border">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                              <span className="text-muted-foreground">
                                Total resources:{' '}
                                {currentLecture.resources.length}
                              </span>
                              <span className="text-muted-foreground">
                                Total size:{' '}
                                {formatFileSize(
                                  currentLecture.resources.reduce(
                                    (total, resource) =>
                                      total + resource.file_size,
                                    0,
                                  ),
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="mx-auto w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            No resources available
                          </h3>
                          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                            This lecture doesn&apos;t have any additional
                            resources at the moment. Check back later or contact
                            the instructor for more materials.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Resource Usage Tips */}
                  {currentLecture.resources &&
                    currentLecture.resources.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Tips for using resources
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-start gap-3 text-sm">
                            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold">
                                1
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                Download for offline access
                              </p>
                              <p className="text-muted-foreground">
                                Save resources to your device to access them
                                anytime, even without internet.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 text-sm">
                            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-green-600 dark:text-green-400 text-xs font-semibold">
                                2
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                Review alongside the video
                              </p>
                              <p className="text-muted-foreground">
                                Use these materials as reference while watching
                                the lecture for better understanding.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 text-sm">
                            <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-purple-600 dark:text-purple-400 text-xs font-semibold">
                                3
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                Take notes and annotate
                              </p>
                              <p className="text-muted-foreground">
                                Add your own notes to downloaded resources to
                                create personalized study materials.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
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
                            <div className="max-w-none">
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
                          Make changes to your note. Click save when you&apos;re
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
                        {/* <DialogClose asChild>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </DialogClose> */}
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
                      <CardTitle>Discussions</CardTitle>
                      <CardDescription>
                        Interact with instructors and other students
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Discussion feature will be updated soon
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
              <h3 className="font-semibold">Course content</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {completedLectures}/{totalLectures} lectures completed
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
                          {lecture.duration_minutes} minutes
                        </span>
                        {lecture.is_free && (
                          <Badge variant="secondary" className="text-xs">
                            Free
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
              <SheetTitle>Course content</SheetTitle>
              <SheetDescription>
                {completedLectures}/{totalLectures} lectures completed
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
                            {lecture.duration_minutes} minutes
                          </span>
                          {lecture.is_free && (
                            <Badge variant="secondary" className="text-xs">
                              Free
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

        {/* Resource Preview Modal */}
        <ResourcePreviewModal
          resource={previewResource}
          isOpen={!!previewResource}
          onClose={() => setPreviewResource(null)}
          onDownload={(resource) => handleResourceDownload(resource.id)}
        />
      </div>
    </div>
  )
}
