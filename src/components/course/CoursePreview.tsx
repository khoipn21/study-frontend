import {
  AlertTriangle,
  Clock,
  Eye,
  Lock,
  Maximize,
  Minimize,
  Pause,
  Play,
  ShoppingCart,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useCourseAccess } from '@/lib/course-marketplace-context'

import type { Course } from '@/lib/types'

interface CoursePreviewProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
  onPurchase?: (course: Course) => void
  previewDurationLimit?: number // in seconds
}

export function CoursePreview({
  course,
  isOpen,
  onClose,
  onPurchase,
  previewDurationLimit = 300, // 5 minutes default
}: CoursePreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { hasFullAccess } = useCourseAccess()

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [,] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Preview limitations
  const [previewTimeRemaining, setPreviewTimeRemaining] =
    useState(previewDurationLimit)
  const [showPreviewWarning, setShowPreviewWarning] = useState(false)
  const [previewExpired, setPreviewExpired] = useState(false)

  const hasFullCourseAccess = course ? hasFullAccess(course.id) : false

  // Get effective preview duration (course setting or default)
  const effectivePreviewLimit = course?.preview_duration_minutes
    ? course.preview_duration_minutes * 60
    : previewDurationLimit

  // Reset state when modal opens/closes or course changes
  useEffect(() => {
    if (!isOpen || !course) {
      setIsPlaying(false)
      setCurrentTime(0)
      setPreviewTimeRemaining(effectivePreviewLimit)
      setShowPreviewWarning(false)
      setPreviewExpired(false)
      setError(null)
      setIsLoading(true)
      return
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }, [isOpen, course, effectivePreviewLimit])

  // Preview time tracking for non-purchased courses
  useEffect(() => {
    if (!hasFullCourseAccess && isPlaying && previewTimeRemaining > 0) {
      const interval = setInterval(() => {
        setPreviewTimeRemaining((prev) => {
          const newTime = prev - 1
          if (newTime <= 30 && newTime > 0) {
            setShowPreviewWarning(true)
          }
          if (newTime <= 0) {
            setPreviewExpired(true)
            setIsPlaying(false)
            if (videoRef.current) {
              videoRef.current.pause()
            }
          }
          return Math.max(0, newTime)
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [hasFullCourseAccess, isPlaying, previewTimeRemaining])

  // Video event handlers
  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (previewExpired && !hasFullCourseAccess) {
      return
    }

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
    }
  }

  const handleMuteToggle = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    if (videoRef.current) {
      videoRef.current.muted = newMuted
    }
  }

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
      handleSeek(newTime)
    }
  }

  const toggleFullscreen = () => {
    // Note: Fullscreen API implementation would go here
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getPreviewVideoUrl = () => {
    if (hasFullCourseAccess && course?.preview_video_url) {
      // For purchased courses, show full preview
      return course.preview_video_url
    }
    return course?.preview_video_url || ''
  }

  if (!course) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            {course.preview_video_url ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={() => setError('Failed to load video')}
                  poster={course.thumbnail_url}
                  preload="metadata"
                >
                  <source src={getPreviewVideoUrl()} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white">Loading preview...</div>
                  </div>
                )}

                {/* Error Overlay */}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center text-white">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {/* Preview Expired Overlay */}
                {previewExpired && !hasFullCourseAccess && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/90">
                    <div className="text-center text-white p-8">
                      <Lock className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Preview Ended
                      </h3>
                      <p className="text-gray-300 mb-6">
                        You've reached the preview limit. Purchase the course to
                        continue watching.
                      </p>
                      <Button onClick={() => onPurchase?.(course)} size="lg">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Purchase Full Course
                      </Button>
                    </div>
                  </div>
                )}

                {/* Video Controls */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-16 w-16 rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={handlePlayPause}
                    disabled={previewExpired && !hasFullCourseAccess}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                </div>

                {/* Progress Bar and Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="space-y-2">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 text-white text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <div className="flex-1">
                        <Progress
                          value={(currentTime / duration) * 100 || 0}
                          className="h-1 bg-white/20"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const percent = (e.clientX - rect.left) / rect.width
                            handleSeek(percent * duration)
                          }}
                        />
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={() => handleSkip(-10)}
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={handlePlayPause}
                          disabled={previewExpired && !hasFullCourseAccess}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={() => handleSkip(10)}
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={handleMuteToggle}
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={toggleFullscreen}
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

                {/* Preview Time Warning */}
                {showPreviewWarning && !hasFullCourseAccess && (
                  <div className="absolute top-4 left-4 right-4">
                    <div className="bg-orange-500/90 text-white p-3 rounded-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        Preview ends in {formatTime(previewTimeRemaining)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto text-white hover:bg-white/20"
                        onClick={() => setShowPreviewWarning(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No preview available for this course</p>
                </div>
              </div>
            )}
          </div>

          {/* Course Info Header */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Preview
                  </Badge>
                  {!hasFullCourseAccess && (
                    <Badge variant="secondary">
                      {formatTime(previewTimeRemaining)} remaining
                    </Badge>
                  )}
                </div>
                <DialogHeader>
                  <DialogTitle className="text-left">
                    {course.title}
                  </DialogTitle>
                  {course.instructor_name && (
                    <p className="text-muted-foreground">
                      by {course.instructor_name}
                    </p>
                  )}
                </DialogHeader>
              </div>

              <div className="flex items-center gap-2">
                {!hasFullCourseAccess && (
                  <Button onClick={() => onPurchase?.(course)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Purchase Course
                  </Button>
                )}
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>

            {/* Course Description */}
            {course.description && (
              <p className="text-muted-foreground mt-4 line-clamp-2">
                {course.description}
              </p>
            )}

            {/* Preview Limitations Notice */}
            {!hasFullCourseAccess && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2 text-blue-700 dark:text-blue-300">
                  <Lock className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">This is a preview</p>
                    <p>
                      You can watch {formatTime(effectivePreviewLimit)} of this
                      course. Purchase the full course for unlimited access to
                      all content.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CoursePreview
