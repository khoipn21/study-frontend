import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Download,
  MessageSquare,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  List,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/learn/$courseId/$lectureId')({
  component: LearnPage,
})

function VideoPlayer({ 
  src, 
  onProgress, 
  onComplete,
  initialProgress = 0,
  className 
}: {
  src: string
  onProgress: (time: number, percentage: number) => void
  onComplete: () => void
  initialProgress?: number
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [buffered, setBuffered] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoading(false)
      setDuration(video.duration)
      // Start from saved progress
      if (initialProgress > 0) {
        video.currentTime = (initialProgress / 100) * video.duration
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      const progress = (video.currentTime / video.duration) * 100
      onProgress(video.currentTime, progress)
      
      // Mark as complete when 90% watched
      if (progress >= 90) {
        onComplete()
      }
    }

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const bufferedPercentage = (bufferedEnd / video.duration) * 100
        setBuffered(bufferedPercentage)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete()
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onProgress, onComplete, initialProgress])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return
    
    const time = (value[0] / 100) * duration
    video.currentTime = time
    setCurrentTime(time)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const skipTime = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration))
  }

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  return (
    <div 
      className={cn("relative group bg-black rounded-lg overflow-hidden", className)}
      onMouseMove={showControlsTemporarily}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Play/Pause Button (Center) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            className="w-16 h-16 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress Bar */}
          <div className="relative">
            {/* Buffered Progress */}
            <div className="absolute inset-0 bg-white/20 rounded-full h-1">
              <div 
                className="bg-white/40 h-full rounded-full transition-all duration-300"
                style={{ width: `${buffered}%` }}
              />
            </div>
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="relative z-10"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={() => skipTime(-10)}>
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={() => skipTime(10)}>
                <SkipForward className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={toggleMute}>
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              <span className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <select 
                value={playbackRate} 
                onChange={(e) => changePlaybackRate(Number(e.target.value))}
                className="bg-black/50 text-white text-sm rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LectureSidebar({ 
  lectures, 
  currentLectureId, 
  courseId, 
  onLectureSelect 
}: {
  lectures: any[]
  currentLectureId: string
  courseId: string
  onLectureSelect?: (lectureId: string) => void
}) {
  return (
    <div className="w-80 bg-card border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <List className="h-5 w-5" />
          Course Content
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {lectures.map((lecture, index) => {
            const isActive = lecture.id === currentLectureId
            const isCompleted = false // You can add completion logic here
            
            return (
              <Link
                key={lecture.id}
                to="/learn/$courseId/$lectureId"
                params={{ courseId, lectureId: lecture.id }}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
                onClick={() => onLectureSelect?.(lecture.id)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 text-xs font-bold flex items-center justify-center",
                      isActive 
                        ? "border-primary-foreground text-primary-foreground" 
                        : "border-muted-foreground text-muted-foreground"
                    )}>
                      {lecture.order_number || index + 1}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-medium text-sm line-clamp-2",
                    isActive ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {lecture.title}
                  </h4>
                  
                  {lecture.duration_minutes && (
                    <div className={cn(
                      "flex items-center gap-1 mt-1 text-xs",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      <Clock className="h-3 w-3" />
                      <span>{lecture.duration_minutes}m</span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function LearnPage() {
  const { courseId, lectureId } = Route.useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [showSidebar, setShowSidebar] = useState(true)
  const [watchTime, setWatchTime] = useState(0)
  
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => (await api.getCourse(courseId)).data!
  })
  
  const { data: lecturesData, isLoading: lecturesLoading } = useQuery({
    queryKey: ['lectures', courseId],
    queryFn: async () => (await api.listLectures(courseId, { page: 1, page_size: 200 })).data!
  })
  
  const { data: progressData } = useQuery({
    queryKey: ['progress', courseId, lectureId],
    queryFn: async () => {
      if (!token) return null
      try {
        const res = await api.getUserProgress(token, courseId, lectureId)
        return res.data
      } catch {
        return null
      }
    },
    enabled: !!user && !!token
  })

  const currentLecture = useMemo(() => {
    return lecturesData?.lectures.find((l) => l.id === lectureId)
  }, [lecturesData, lectureId])

  const currentIndex = useMemo(() => {
    return lecturesData?.lectures.findIndex((l) => l.id === lectureId) ?? -1
  }, [lecturesData, lectureId])

  const { data: video, isLoading: videoLoading } = useQuery({
    queryKey: ['video', currentLecture?.video_id],
    queryFn: async () => {
      if (!currentLecture?.video_id) return null
      const res = await api.getVideo(currentLecture.video_id)
      return res.data
    },
    enabled: !!currentLecture?.video_id,
  })

  const updateProgressMutation = useMutation({
    mutationFn: async ({ time, percentage }: { time: number; percentage: number }) => {
      if (!token) return
      return api.updateProgress(token, {
        course_id: courseId,
        lecture_id: lectureId,
        progress_percentage: percentage,
        watch_time_seconds: Math.floor(time),
        is_completed: percentage >= 90
      })
    }
  })

  const completeLectureMutation = useMutation({
    mutationFn: async () => {
      if (!token) return
      return api.completeLecture(token, { 
        course_id: courseId, 
        lecture_id: lectureId, 
        watch_time_seconds: Math.floor(watchTime)
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['progress'] })
    }
  })

  const handleProgress = (time: number, percentage: number) => {
    setWatchTime(time)
    updateProgressMutation.mutate({ time, percentage })
  }

  const handleComplete = () => {
    completeLectureMutation.mutate()
  }

  const navigateToLecture = (direction: 'prev' | 'next') => {
    if (!lecturesData?.lectures) return
    
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (newIndex >= 0 && newIndex < lecturesData.lectures.length) {
      const nextLecture = lecturesData.lectures[newIndex]
      navigate({
        to: '/learn/$courseId/$lectureId',
        params: { courseId, lectureId: nextLecture.id }
      })
    }
  }

  if (courseLoading || lecturesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading course content...</span>
        </div>
      </div>
    )
  }

  if (!course || !currentLecture) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Content not found</h2>
        <p className="text-muted-foreground mb-4">
          The course or lecture you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/courses">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      {showSidebar && (
        <LectureSidebar
          lectures={lecturesData?.lectures || []}
          currentLectureId={lectureId}
          courseId={courseId}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <List className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link 
                  to="/courses/$courseId" 
                  params={{ courseId }}
                  className="hover:text-foreground transition-colors"
                >
                  {course.title}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">
                  {currentLecture.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToLecture('prev')}
                disabled={currentIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToLecture('next')}
                disabled={currentIndex >= (lecturesData?.lectures.length || 0) - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/courses/$courseId" params={{ courseId }}>
                  <X className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 p-4">
          <div className="max-w-5xl mx-auto space-y-6">
            {video?.stream_url ? (
              <VideoPlayer
                src={video.stream_url}
                onProgress={handleProgress}
                onComplete={handleComplete}
                initialProgress={progressData?.progress_percentage || 0}
                className="aspect-video w-full"
              />
            ) : (
              <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Video Available</h3>
                  <p className="text-muted-foreground">
                    This lecture doesn't have a video yet.
                  </p>
                </div>
              </div>
            )}

            {/* Lecture Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold font-academic mb-2">
                  {currentLecture.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {currentLecture.duration_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{currentLecture.duration_minutes} minutes</span>
                    </div>
                  )}
                  
                  {progressData && (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>{Math.round(progressData.progress_percentage)}% complete</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {progressData && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(progressData.progress_percentage)}%
                      </span>
                    </div>
                    <Progress value={progressData.progress_percentage} className="h-2" />
                  </div>
                )}
              </div>

              {/* Description */}
              {currentLecture.description && (
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold mb-3">About this lecture</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentLecture.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => completeLectureMutation.mutate()}
                  disabled={completeLectureMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {completeLectureMutation.isPending ? 'Marking Complete...' : 'Mark Complete'}
                </Button>

                <Button variant="outline" asChild>
                  <Link to="/forum" search={{ course_id: courseId }}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Discuss
                  </Link>
                </Button>

                {video && (
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Resources
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

