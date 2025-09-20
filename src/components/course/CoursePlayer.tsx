import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Award,
  BookOpen,
  Bookmark,
  Brain,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  FileText,
  Filter,
  Flag,
  Grid3X3,
  Layers,
  List,
  Lock,
  Maximize,
  MessageCircle,
  Minimize,
  Monitor,
  MoreVertical,
  Note,
  Pause,
  Play,
  PlayCircle,
  Plus,
  Save,
  Search,
  Settings,
  Share2,
  SkipBack,
  SkipForward,
  Smartphone,
  Star,
  Subtitles,
  Tablet,
  Tag,
  Target,
  ThumbsUp,
  Users,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api-client'
import {
  formatVietnameseDate,
  formatVietnameseDuration,
  vietnameseTranslations,
} from '@/lib/vietnamese-locale'
import { cn } from '@/lib/utils'
import type { Course, Lecture, User } from '@/lib/types'

interface CoursePlayerProps {
  course: Course
  lectures: Array<Lecture>
  currentLectureId: string
  user: User
  onLectureChange?: (lectureId: string) => void
  onProgressUpdate?: (lectureId: string, progress: number) => void
  onComplete?: (lectureId: string) => void
}

interface PlayerSettings {
  playbackRate: number
  quality: string
  autoplay: boolean
  subtitles: boolean
  subtitleLanguage: string
  autoAdvance: boolean
  rememberPosition: boolean
}

interface Note {
  id: string
  lectureId: string
  timestamp: number
  content: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

interface Bookmark {
  id: string
  lectureId: string
  timestamp: number
  title: string
  description?: string
  createdAt: string
}

interface CourseProgress {
  lectureId: string
  watchedSeconds: number
  totalSeconds: number
  isCompleted: boolean
  lastWatchedAt: string
}

const DEFAULT_SETTINGS: PlayerSettings = {
  playbackRate: 1.0,
  quality: 'auto',
  autoplay: false,
  subtitles: true,
  subtitleLanguage: 'vi',
  autoAdvance: true,
  rememberPosition: true,
}

const PLAYBACK_RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
const QUALITY_OPTIONS = ['auto', '1080p', '720p', '480p', '360p']

export function CoursePlayer({
  course,
  lectures,
  currentLectureId,
  user,
  onLectureChange,
  onProgressUpdate,
  onComplete,
}: CoursePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [settings, setSettings] = useState<PlayerSettings>(DEFAULT_SETTINGS)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarTab, setSidebarTab] = useState('lectures')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notes, setNotes] = useState<Array<Note>>([])
  const [bookmarks, setBookmarks] = useState<Array<Bookmark>>([])
  const [newNote, setNewNote] = useState('')
  const [newBookmark, setNewBookmark] = useState({ title: '', description: '' })
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()

  const currentLecture = lectures.find((l) => l.id === currentLectureId)
  const currentIndex = lectures.findIndex((l) => l.id === currentLectureId)
  const nextLecture =
    currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null

  // Fetch course progress
  const { data: progressData } = useQuery({
    queryKey: ['course-progress', course.id, user.id],
    queryFn: () => api.getCourseProgress('user-token', course.id),
  })

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: (data: {
      lectureId: string
      progressPercentage: number
      watchTimeSeconds: number
    }) =>
      api.updateProgress('user-token', {
        course_id: course.id,
        lecture_id: data.lectureId,
        progress_percentage: data.progressPercentage,
        watch_time_seconds: data.watchTimeSeconds,
        is_completed: data.progressPercentage >= 90,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course-progress', course.id],
      })
    },
  })

  // Complete lecture mutation
  const completeLectureMutation = useMutation({
    mutationFn: (lectureId: string) =>
      api.completeLecture('user-token', {
        course_id: course.id,
        lecture_id: lectureId,
        watch_time_seconds: Math.floor(currentTime),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course-progress', course.id],
      })
      onComplete?.(currentLectureId)
    },
  })

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    const handleEnded = () => {
      setIsPlaying(false)
      if (settings.autoAdvance && nextLecture) {
        onLectureChange?.(nextLecture.id)
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [settings.autoAdvance, nextLecture, onLectureChange])

  // Progress tracking
  useEffect(() => {
    if (isPlaying && duration > 0) {
      progressIntervalRef.current = setInterval(() => {
        const progressPercentage = (currentTime / duration) * 100
        updateProgressMutation.mutate({
          lectureId: currentLectureId,
          progressPercentage,
          watchTimeSeconds: Math.floor(currentTime),
        })
        onProgressUpdate?.(currentLectureId, progressPercentage)
      }, 10000) // Update every 10 seconds
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying, currentTime, duration, currentLectureId])

  // Auto-complete lecture at 90%
  useEffect(() => {
    if (duration > 0 && currentTime / duration >= 0.9) {
      completeLectureMutation.mutate(currentLectureId)
    }
  }, [currentTime, duration, currentLectureId])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (value: Array<number>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: Array<number>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setSettings((prev) => ({ ...prev, playbackRate: rate }))
  }

  const skipTime = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      videoRef.current?.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  const addNote = () => {
    if (!newNote.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      lectureId: currentLectureId,
      timestamp: currentTime,
      content: newNote,
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes((prev) => [...prev, note])
    setNewNote('')
    setShowNoteDialog(false)
  }

  const addBookmark = () => {
    if (!newBookmark.title.trim()) return

    const bookmark: Bookmark = {
      id: Date.now().toString(),
      lectureId: currentLectureId,
      timestamp: currentTime,
      title: newBookmark.title,
      description: newBookmark.description,
      createdAt: new Date().toISOString(),
    }

    setBookmarks((prev) => [...prev, bookmark])
    setNewBookmark({ title: '', description: '' })
    setShowBookmarkDialog(false)
  }

  const jumpToTimestamp = (timestamp: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = timestamp
    setCurrentTime(timestamp)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const filteredLectures = lectures.filter((lecture) =>
    lecture.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const currentLectureNotes = notes.filter(
    (note) => note.lectureId === currentLectureId,
  )
  const currentLectureBookmarks = bookmarks.filter(
    (bookmark) => bookmark.lectureId === currentLectureId,
  )

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Main Player Container */}
      <div className="flex-1 flex">
        {/* Video Player */}
        <div className="flex-1 relative">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src={currentLecture?.video_url}
            poster={course.thumbnail_url}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => setTimeout(() => setShowControls(false), 3000)}
          />

          {/* Video Overlay */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 transition-opacity',
              showControls ? 'opacity-100' : 'opacity-0',
            )}
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => window.history.back()}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                <div className="text-white">
                  <h2 className="font-semibold">{course.title}</h2>
                  <p className="text-sm opacity-80">{currentLecture?.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  {sidebarCollapsed ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Center Play Button */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                >
                  <Play className="h-8 w-8 text-white" />
                </Button>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/80 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipTime(-10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipTime(10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Playback Speed */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        {settings.playbackRate}x
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {PLAYBACK_RATES.map((rate) => (
                        <DropdownMenuItem
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                        >
                          {rate}x
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Add Note */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNoteDialog(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Note className="h-4 w-4" />
                  </Button>

                  {/* Add Bookmark */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBookmarkDialog(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>

                  {/* Subtitles */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Subtitles className="h-4 w-4" />
                  </Button>

                  {/* Fullscreen */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    {isFullscreen ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="absolute top-16 right-4 w-80 bg-black/90 backdrop-blur-sm rounded-lg p-4 text-white">
              <h3 className="font-semibold mb-4">Cài đặt phát video</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoplay">Tự động phát</Label>
                  <Switch
                    id="autoplay"
                    checked={settings.autoplay}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, autoplay: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="autoAdvance">Tự động chuyển bài</Label>
                  <Switch
                    id="autoAdvance"
                    checked={settings.autoAdvance}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, autoAdvance: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="subtitles">Phụ đề</Label>
                  <Switch
                    id="subtitles"
                    checked={settings.subtitles}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, subtitles: checked }))
                    }
                  />
                </div>

                <div>
                  <Label className="text-sm">Chất lượng video</Label>
                  <Select
                    value={settings.quality}
                    onValueChange={(value) =>
                      setSettings((prev) => ({ ...prev, quality: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALITY_OPTIONS.map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {quality === 'auto' ? 'Tự động' : quality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-4"
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-96 bg-background border-l flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              <Tabs value={sidebarTab} onValueChange={setSidebarTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="lectures" className="text-xs">
                    <List className="h-3 w-3 mr-1" />
                    Bài học
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">
                    <Note className="h-3 w-3 mr-1" />
                    Ghi chú
                  </TabsTrigger>
                  <TabsTrigger value="bookmarks" className="text-xs">
                    <Bookmark className="h-3 w-3 mr-1" />
                    Đánh dấu
                  </TabsTrigger>
                  <TabsTrigger value="info" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Thông tin
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              <Tabs value={sidebarTab} className="h-full">
                {/* Lectures Tab */}
                <TabsContent
                  value="lectures"
                  className="p-4 space-y-4 m-0 h-full"
                >
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm bài học..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {filteredLectures.length} / {lectures.length} bài học
                    </div>
                  </div>

                  <div className="space-y-2">
                    {filteredLectures.map((lecture, index) => (
                      <Card
                        key={lecture.id}
                        className={cn(
                          'cursor-pointer transition-colors hover:bg-muted/50',
                          lecture.id === currentLectureId &&
                            'border-primary bg-primary/5',
                        )}
                        onClick={() => onLectureChange?.(lecture.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-1">
                              {lecture.id === currentLectureId ? (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Play className="h-3 w-3 text-white" />
                                </div>
                              ) : progressData?.completed_lectures?.includes(
                                  lecture.id,
                                ) ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : lecture.is_free ? (
                                <PlayCircle className="w-6 h-6 text-blue-500" />
                              ) : (
                                <Lock className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                {index + 1}. {lecture.title}
                              </h4>

                              {lecture.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                  {lecture.description}
                                </p>
                              )}

                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {lecture.duration_minutes && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {formatVietnameseDuration(
                                        lecture.duration_minutes,
                                      )}
                                    </span>
                                  </div>
                                )}

                                {lecture.is_free && (
                                  <Badge variant="outline" className="text-xs">
                                    Miễn phí
                                  </Badge>
                                )}
                              </div>

                              {/* Progress Bar for Current/Completed Lectures */}
                              {(lecture.id === currentLectureId ||
                                progressData?.completed_lectures?.includes(
                                  lecture.id,
                                )) && (
                                <div className="mt-2">
                                  <Progress
                                    value={
                                      lecture.id === currentLectureId
                                        ? (currentTime / duration) * 100
                                        : 100
                                    }
                                    className="h-1"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="p-4 space-y-4 m-0 h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Ghi chú của tôi</h3>
                    <Button size="sm" onClick={() => setShowNoteDialog(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Thêm
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {currentLectureNotes.map((note) => (
                      <Card key={note.id}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <button
                              onClick={() => jumpToTimestamp(note.timestamp)}
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              {formatTime(note.timestamp)}
                            </button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {note.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatVietnameseDate(note.createdAt, 'relative')}
                          </p>
                        </CardContent>
                      </Card>
                    ))}

                    {currentLectureNotes.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Note className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có ghi chú nào</p>
                        <p className="text-xs">
                          Nhấn nút "Thêm" để tạo ghi chú đầu tiên
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Bookmarks Tab */}
                <TabsContent
                  value="bookmarks"
                  className="p-4 space-y-4 m-0 h-full"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Đánh dấu</h3>
                    <Button
                      size="sm"
                      onClick={() => setShowBookmarkDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Thêm
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {currentLectureBookmarks.map((bookmark) => (
                      <Card key={bookmark.id}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <button
                              onClick={() =>
                                jumpToTimestamp(bookmark.timestamp)
                              }
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              {formatTime(bookmark.timestamp)}
                            </button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                          <h4 className="font-medium text-sm mb-1">
                            {bookmark.title}
                          </h4>
                          {bookmark.description && (
                            <p className="text-sm text-muted-foreground">
                              {bookmark.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatVietnameseDate(
                              bookmark.createdAt,
                              'relative',
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    ))}

                    {currentLectureBookmarks.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bookmark className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có đánh dấu nào</p>
                        <p className="text-xs">
                          Đánh dấu những phần quan trọng trong video
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Course Info Tab */}
                <TabsContent value="info" className="p-4 space-y-4 m-0 h-full">
                  <div>
                    <h3 className="font-semibold mb-3">Thông tin khóa học</h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {course.description}
                        </p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Giảng viên:
                          </span>
                          <p className="font-medium">
                            {course.instructor_name}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cấp độ:</span>
                          <p className="font-medium">{course.level}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Thời lượng:
                          </span>
                          <p className="font-medium">
                            {course.duration_minutes &&
                              formatVietnameseDuration(course.duration_minutes)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Bài học:
                          </span>
                          <p className="font-medium">{lectures.length}</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Thống kê</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Đánh giá:
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-warning" />
                              <span>{course.rating?.toFixed(1)}</span>
                              <span className="text-muted-foreground">
                                ({course.rating_count})
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Học viên:
                            </span>
                            <span>
                              {course.enrollment_count?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Share2 className="h-3 w-3 mr-1" />
                          Chia sẻ
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Tải về
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Next/Previous Lecture Controls */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!prevLecture}
                  onClick={() =>
                    prevLecture && onLectureChange?.(prevLecture.id)
                  }
                  className="flex-1"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Bài trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!nextLecture}
                  onClick={() =>
                    nextLecture && onLectureChange?.(nextLecture.id)
                  }
                  className="flex-1"
                >
                  Bài tiếp
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Note Dialog */}
      {showNoteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Thêm ghi chú
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNoteDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">
                  Thời điểm: {formatTime(currentTime)}
                </Label>
              </div>
              <Textarea
                placeholder="Nhập ghi chú của bạn..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button onClick={addNote} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu ghi chú
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNoteDialog(false)}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bookmark Dialog */}
      {showBookmarkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Thêm đánh dấu
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookmarkDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">
                  Thời điểm: {formatTime(currentTime)}
                </Label>
              </div>
              <div>
                <Label className="text-sm">Tiêu đề</Label>
                <Input
                  placeholder="Tiêu đề đánh dấu"
                  value={newBookmark.title}
                  onChange={(e) =>
                    setNewBookmark((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm">Mô tả (tùy chọn)</Label>
                <Textarea
                  placeholder="Mô tả chi tiết..."
                  value={newBookmark.description}
                  onChange={(e) =>
                    setNewBookmark((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addBookmark} className="flex-1">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Lưu đánh dấu
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBookmarkDialog(false)}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
