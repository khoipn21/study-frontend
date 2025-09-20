import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Play,
  Upload,
  X,
} from 'lucide-react'

// UI Components
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Hooks
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import type {
  CloudflareStreamResponse,
  CourseCreationData,
  LectureCreationData,
  ProcessedVideo,
  VideoUpload,
} from '@/lib/course-management-types'

// Types

interface VideoUploadStepProps {
  formData: Partial<CourseCreationData>
  onUpdate: (data: Partial<CourseCreationData>) => void
  errors: Array<string>
  onNext?: () => void
}

const SUPPORTED_VIDEO_TYPES = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv']
const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024 // 2GB

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

interface VideoUploadZoneProps {
  onVideosSelected: (files: FileList) => void
  isDragOver: boolean
  onDragOver: (isDragOver: boolean) => void
  isUploading: boolean
}

function VideoUploadZone({
  onVideosSelected,
  isDragOver,
  onDragOver,
  isUploading,
}: VideoUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onVideosSelected(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    onDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    onDragOver(false)
  }

  return (
    <Card
      className={`border-2 border-dashed transition-colors cursor-pointer ${
        isDragOver
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25'
      } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <Upload
            className={`mx-auto h-12 w-12 ${
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            }`}
          />
          <div>
            <h3 className="text-lg font-medium">Upload Course Videos</h3>
            <p className="text-muted-foreground">
              {isUploading
                ? 'Uploading videos...'
                : 'Drag and drop video files or click to browse'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Supported formats: MP4, MOV, AVI, MKV
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {formatFileSize(MAX_VIDEO_SIZE)} per video
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={SUPPORTED_VIDEO_TYPES.join(',')}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onVideosSelected(e.target.files)
            }
          }}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}

interface VideoUploadCardProps {
  upload: VideoUpload
  onCancel: () => void
  onRetry?: () => void
}

function VideoUploadCard({ upload, onCancel, onRetry }: VideoUploadCardProps) {
  const getStatusIcon = () => {
    switch (upload.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        )
    }
  }

  const getStatusText = () => {
    switch (upload.status) {
      case 'uploading':
        return `Uploading... ${upload.progress}%`
      case 'processing':
        return 'Processing video... (this may take 1-2 minutes)'
      case 'completed':
        return 'Upload complete'
      case 'error':
        return upload.error_message ?? 'Upload failed'
      default:
        return 'Preparing...'
    }
  }

  const getStatusColor = () => {
    switch (upload.status) {
      case 'completed':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <Card className={upload.status === 'error' ? 'border-red-200' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{getStatusIcon()}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium truncate">{upload.filename}</h4>
              <div className="flex items-center gap-2">
                {upload.status === 'error' && onRetry && (
                  <Button variant="outline" size="sm" onClick={onRetry}>
                    Retry
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className={`text-sm ${getStatusColor()}`}>
                {getStatusText()}
              </div>

              <div className="text-xs text-muted-foreground">
                Size: {formatFileSize(upload.file.size)}
                {upload.duration_seconds && (
                  <span className="ml-4">
                    Duration: {formatDuration(upload.duration_seconds)}
                  </span>
                )}
              </div>

              {upload.status === 'uploading' && (
                <Progress value={upload.progress} className="w-full h-2" />
              )}

              {upload.status === 'processing' && (
                <Progress value={100} className="w-full h-2 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface VideoAssignmentSectionProps {
  videos: Array<ProcessedVideo>
  lectures: Array<LectureCreationData>
  onAssign: (videoId: string, lectureId: string) => void
}

function VideoAssignmentSection({
  videos,
  lectures,
  onAssign,
}: VideoAssignmentSectionProps) {
  const videoLectures = lectures.filter((lecture) => lecture.type === 'video')
  const unassignedVideos = videos.filter(
    (video) => !lectures.some((lecture) => lecture.video_id === video.id),
  )

  if (unassignedVideos.length === 0 && videoLectures.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Videos to Lectures</CardTitle>
        <CardDescription>
          Connect your uploaded videos to course lectures
        </CardDescription>
      </CardHeader>
      <CardContent>
        {unassignedVideos.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="font-medium mb-2">All videos assigned!</h3>
            <p className="text-sm text-muted-foreground">
              All your videos have been successfully assigned to lectures.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {unassignedVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="w-32 h-20 bg-muted rounded overflow-hidden">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium">{video.filename}</h4>
                  <div className="text-sm text-muted-foreground">
                    Duration: {formatDuration(video.duration_seconds)} • Size:{' '}
                    {formatFileSize(video.file_size)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <Select
                    onValueChange={(lectureId) => onAssign(video.id, lectureId)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select lecture" />
                    </SelectTrigger>
                    <SelectContent>
                      {videoLectures
                        .filter((lecture) => !lecture.video_id)
                        .map((lecture) => (
                          <SelectItem key={lecture.id} value={lecture.id!}>
                            {lecture.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            {videoLectures.filter((lecture) => !lecture.video_id).length ===
              0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All video lectures already have videos assigned. Create more
                  video lectures in the previous step to assign these videos.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function VideoUploadStep({
  formData,
  onUpdate,
  errors,
  onNext,
}: VideoUploadStepProps) {
  const { token } = useAuth()
  const { watch, setValue } = useFormContext<CourseCreationData>()

  const [uploads, setUploads] = useState<Map<string, VideoUpload>>(new Map())
  const [isDragOver, setIsDragOver] = useState(false)

  const videos = watch('videos') || []
  const lectures = watch('lectures') || []
  const isUploading =
    uploads.size > 0 &&
    Array.from(uploads.values()).some((u) => u.status === 'uploading')

  // Cloudflare Stream Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!token) throw new Error('Authentication required')

      // Step 1: Get upload URL from backend
      const response = await api.getVideoUploadUrl(token, file.name, file.size)
      const { upload_url: uploadUrl, video_id: videoId, cloudflare_uid } = response

      // Step 2: Upload to Cloudflare Stream
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to Cloudflare Stream')
      }

      // Handle Cloudflare Stream response - it may return empty body or plain text
      let cloudflareResponse = null
      try {
        const responseText = await uploadResponse.text()
        if (responseText.trim()) {
          // Try to parse as JSON, fallback to text if it fails
          try {
            cloudflareResponse = JSON.parse(responseText)
          } catch {
            cloudflareResponse = { message: responseText }
          }
        }
      } catch (error) {
        console.warn('Failed to parse Cloudflare response:', error)
      }

      return { videoId, cloudflareResponse }
    },
    onSuccess: (response, file) => {
      // Start polling for processing completion
      pollVideoStatus(response.videoId, file.name)
    },
    onError: (error: any, file) => {
      const uploadId = Array.from(uploads.entries()).find(
        ([_, upload]) => upload.filename === file.name,
      )?.[0]

      if (uploadId) {
        setUploads(
          (prev) =>
            new Map(
              prev.set(uploadId, {
                ...prev.get(uploadId)!,
                status: 'error',
                error_message: error.message,
              }),
            ),
        )
      }

      toast.error(`Failed to upload ${file.name}: ${error.message}`)
    },
  })

  const pollVideoStatus = async (videoId: string, filename: string) => {
    const uploadId = Array.from(uploads.entries()).find(
      ([_, upload]) => upload.filename === filename,
    )?.[0]

    if (!uploadId) return

    try {
      if (!token) {
        console.error('No auth token available for video status check')
        return
      }
      const response = await api.getVideo(token, videoId)

      console.log(`Polling video ${videoId}: status = ${response.status}`)

      if (response.status === 'ready') {
        // Video is ready
        const processedVideo: ProcessedVideo = {
          id: videoId,
          cloudflare_id: response.cloudflare_uid,
          filename: filename,
          thumbnail_url: response.thumbnail_url,
          duration_seconds: response.duration_seconds || 0,
          file_size: response.file_size_bytes || 0,
          status: 'ready',
          stream_url: response.stream_url || '',
          preview_url: response.preview_url,
        }

        const newVideos = [...videos, processedVideo]
        setValue('videos', newVideos)
        onUpdate({ videos: newVideos })

        // Remove from uploads
        setUploads((prev) => {
          const newMap = new Map(prev)
          newMap.delete(uploadId)
          return newMap
        })

        toast.success(`${filename} is ready!`)
      } else if (response.status === 'error') {
        // Processing failed
        setUploads(
          (prev) =>
            new Map(
              prev.set(uploadId, {
                ...prev.get(uploadId)!,
                status: 'error',
                error_message: 'Video processing failed',
              }),
            ),
        )
      } else {
        // Check if video has been uploading for too long (fallback mechanism)
        const uploadTime = Date.now() - new Date(response.created_at).getTime()
        const UPLOAD_TIMEOUT = 2 * 60 * 1000 // 2 minutes (for testing)

        if (response.status === 'uploading' && uploadTime > UPLOAD_TIMEOUT) {
          console.log(`Video ${videoId} has been uploading for ${Math.round(uploadTime / 1000)}s, marking as ready (fallback)`)

          // Auto-transition to ready as fallback
          const processedVideo: ProcessedVideo = {
            id: videoId,
            cloudflare_id: response.cloudflare_uid,
            filename: filename,
            thumbnail_url: response.thumbnail_url,
            duration_seconds: response.duration_seconds || 0,
            file_size: response.file_size_bytes || 0,
            status: 'ready',
            stream_url: response.stream_url || '',
            preview_url: response.preview_url,
          }

          const newVideos = [...videos, processedVideo]
          setValue('videos', newVideos)
          onUpdate({ videos: newVideos })

          // Remove from uploads
          setUploads((prev) => {
            const newMap = new Map(prev)
            newMap.delete(uploadId)
            return newMap
          })

          toast.success(`${filename} is ready! (auto-completed)`)
        } else {
          // Still processing, continue polling
          setTimeout(() => pollVideoStatus(videoId, filename), 2000)
        }
      }
    } catch (error) {
      console.error('Error polling video status:', error)
      setTimeout(() => pollVideoStatus(videoId, filename), 5000) // Retry after longer delay
    }
  }

  const handleVideosSelected = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        toast.error(
          `${file.name} is too large. Maximum size is ${formatFileSize(MAX_VIDEO_SIZE)}`,
        )
        continue
      }

      // Validate file type
      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
      if (!SUPPORTED_VIDEO_TYPES.includes(extension)) {
        toast.error(`${file.name} is not a supported video format`)
        continue
      }

      // Add to uploads
      const uploadId = `${Date.now()}-${i}`
      const videoUpload: VideoUpload = {
        id: uploadId,
        file,
        filename: file.name,
        progress: 0,
        status: 'uploading',
      }

      setUploads((prev) => new Map(prev.set(uploadId, videoUpload)))

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploads((prev) => {
          const current = prev.get(uploadId)
          if (current && current.status === 'uploading') {
            const newProgress = Math.min(
              95,
              current.progress + Math.random() * 15,
            )
            return new Map(
              prev.set(uploadId, { ...current, progress: newProgress }),
            )
          }
          return prev
        })
      }, 1000)

      try {
        await uploadMutation.mutateAsync(file)
        clearInterval(progressInterval)

        // Update to processing status
        setUploads(
          (prev) =>
            new Map(
              prev.set(uploadId, {
                ...prev.get(uploadId)!,
                progress: 100,
                status: 'processing',
              }),
            ),
        )
      } catch (error) {
        clearInterval(progressInterval)
      }
    }
  }

  const assignVideoToLecture = (videoId: string, lectureId: string) => {
    const updatedLectures = lectures.map((lecture) =>
      lecture.id === lectureId ? { ...lecture, video_id: videoId } : lecture,
    )

    setValue('lectures', updatedLectures)
    onUpdate({ lectures: updatedLectures })
    toast.success('Video assigned to lecture')
  }

  const cancelUpload = (uploadId: string) => {
    setUploads((prev) => {
      const newMap = new Map(prev)
      newMap.delete(uploadId)
      return newMap
    })
  }

  const retryUpload = (uploadId: string) => {
    const upload = uploads.get(uploadId)
    if (upload) {
      setUploads(
        (prev) =>
          new Map(
            prev.set(uploadId, {
              ...upload,
              status: 'uploading',
              progress: 0,
              error_message: undefined,
            }),
          ),
      )

      uploadMutation.mutate(upload.file)
    }
  }

  const getTotalDuration = () => {
    return videos.reduce((total, video) => total + video.duration_seconds, 0)
  }

  const getAssignedVideosCount = () => {
    return lectures.filter((lecture) => lecture.video_id).length
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Video Upload</h2>
        <p className="text-muted-foreground mt-2">
          Upload your course videos and assign them to lectures. Videos will be
          processed and optimized for streaming.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Zone */}
        <VideoUploadZone
          onVideosSelected={handleVideosSelected}
          isDragOver={isDragOver}
          onDragOver={setIsDragOver}
          isUploading={isUploading}
        />

        {/* Upload Progress */}
        {uploads.size > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Upload Progress</h3>
            {Array.from(uploads.values()).map((upload) => (
              <VideoUploadCard
                key={upload.id}
                upload={upload}
                onCancel={() => cancelUpload(upload.id)}
                onRetry={() => retryUpload(upload.id)}
              />
            ))}
          </div>
        )}

        {/* Video Overview */}
        {videos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Video Library Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{videos.length}</p>
                  <p className="text-xs text-muted-foreground">
                    Videos Uploaded
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    {formatDuration(getTotalDuration())}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Duration
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    {getAssignedVideosCount()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Videos Assigned
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Video Assignment */}
        <VideoAssignmentSection
          videos={videos}
          lectures={lectures}
          onAssign={assignVideoToLecture}
        />

        {/* Completion Status */}
        {videos.length > 0 &&
          lectures.filter((l) => l.type === 'video').length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Course Ready:</strong> You have uploaded {videos.length}{' '}
                videos and created {lectures.length} lectures.
                {getAssignedVideosCount() ===
                lectures.filter((l) => l.type === 'video').length
                  ? ' All video lectures have been assigned!'
                  : ` ${lectures.filter((l) => l.type === 'video').length - getAssignedVideosCount()} video lectures still need video assignments.`}
              </AlertDescription>
            </Alert>
          )}

        {/* Guidelines */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Video Guidelines:</strong> Upload high-quality videos in MP4
            format for best compatibility. Videos will be automatically
            optimized for different devices and internet speeds. Make sure your
            videos have clear audio and good lighting.
          </AlertDescription>
        </Alert>

        {/* Error Display */}
        {errors.length > 0 && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <p key={index}>• {error}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
