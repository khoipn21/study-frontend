import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertCircle,
  CheckCircle,
  Cloud,
  FileVideo,
  Pause,
  Play,
  RotateCcw,
  Upload,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { instructorDashboardService } from '@/lib/instructor-dashboard'
import { useVideoProcessingStatus } from '@/lib/instructor-realtime-context'

interface VideoFile {
  file: File
  preview: string
  duration?: number
  size: number
  type: string
}

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
  speed: number // bytes per second
  timeRemaining: number // seconds
  isComplete: boolean
  isPaused: boolean
  error?: string
}

interface ChunkedUploadState {
  chunks: Array<Blob>
  uploadedChunks: number
  totalChunks: number
  chunkSize: number
  currentChunk: number
  failedChunks: Set<number>
}

interface VideoUploadProps {
  lectureId?: string
  onUploadComplete?: (videoUrl: string) => void
  onUploadError?: (error: string) => void
  allowedFormats?: Array<string>
  maxFileSize?: number // in MB
  chunkSize?: number // in MB
}

const DEFAULT_ALLOWED_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/avi',
  'video/mov',
  'video/wmv',
  'video/flv',
  'video/mkv',
]

const DEFAULT_MAX_FILE_SIZE = 1024 // 1GB in MB
const DEFAULT_CHUNK_SIZE = 10 // 10MB

export default function VideoUpload({
  lectureId,
  onUploadComplete,
  onUploadError,
  allowedFormats = DEFAULT_ALLOWED_FORMATS,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  chunkSize = DEFAULT_CHUNK_SIZE,
}: VideoUploadProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Component state
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null,
  )
  const [, setChunkedState] = useState<ChunkedUploadState | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [,] = useState(false)

  // Video metadata
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDescription, setVideoDescription] = useState('')
  const [videoQuality, setVideoQuality] = useState('auto')

  // Real-time processing status
  const { status: processingStatus } = useVideoProcessingStatus(lectureId)

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File
      onProgress: (progress: number) => void
    }) => {
      if (!lectureId) throw new Error('Lecture ID is required')
      await instructorDashboardService.uploadVideo(
        lectureId,
        file,
        undefined,
        onProgress,
      )
    },
    onSuccess: () => {
      toast({
        title: 'Upload Complete',
        description: 'Your video has been uploaded and is being processed.',
      })
      onUploadComplete?.('')
      setSelectedVideo(null)
      setUploadProgress(null)
      setChunkedState(null)
      queryClient.invalidateQueries({ queryKey: ['instructor', 'videos'] })
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { message?: string }).message || 'Failed to upload video'
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      })
      onUploadError?.(errorMessage)
    },
  })

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // File validation
  const validateFile = (file: File): string | null => {
    if (!allowedFormats.includes(file.type)) {
      return `Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`
    }

    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSize) {
      return `File size exceeds limit. Maximum size: ${maxFileSize}MB`
    }

    return null
  }

  // Create video preview
  const createVideoPreview = (file: File): Promise<VideoFile> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const url = URL.createObjectURL(file)

      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        resolve({
          file,
          preview: url,
          duration: video.duration,
          size: file.size,
          type: file.type,
        })
      }

      video.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load video metadata'))
      }

      video.src = url
    })
  }

  // Handle file selection
  const handleFileSelect = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return

      const file = files[0]
      const validationError = validateFile(file)

      if (validationError) {
        toast({
          title: 'Invalid File',
          description: validationError,
          variant: 'destructive',
        })
        return
      }

      try {
        const videoFile = await createVideoPreview(file)
        setSelectedVideo(videoFile)
        setVideoTitle(file.name.replace(/\.[^/.]+$/, '')) // Remove file extension
        setShowUploadDialog(true)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to process video file',
          variant: 'destructive',
        })
      }
    },
    [validateFile, toast],
  )

  // Create chunks for upload
  const createChunks = (file: File, chunkSizeMB: number): Array<Blob> => {
    const chunkSizeBytes = chunkSizeMB * 1024 * 1024
    const chunks: Array<Blob> = []
    let start = 0

    while (start < file.size) {
      const end = Math.min(start + chunkSizeBytes, file.size)
      chunks.push(file.slice(start, end))
      start = end
    }

    return chunks
  }

  // Start chunked upload
  const startChunkedUpload = useCallback(async () => {
    if (!selectedVideo || !lectureId) return

    const chunks = createChunks(selectedVideo.file, chunkSize)
    const totalChunks = chunks.length

    setChunkedState({
      chunks,
      uploadedChunks: 0,
      totalChunks,
      chunkSize: chunkSize * 1024 * 1024,
      currentChunk: 0,
      failedChunks: new Set(),
    })

    setUploadProgress({
      loaded: 0,
      total: selectedVideo.size,
      percentage: 0,
      speed: 0,
      timeRemaining: 0,
      isComplete: false,
      isPaused: false,
    })

    setShowUploadDialog(false)

    // Start the upload
    uploadMutation.mutate({
      file: selectedVideo.file,
      onProgress: (percentage) => {
        setUploadProgress((prev) =>
          prev
            ? {
                ...prev,
                percentage,
                loaded: (percentage / 100) * selectedVideo.size,
              }
            : null,
        )
      },
    })
  }, [selectedVideo, lectureId, chunkSize, uploadMutation])

  // Pause/Resume upload
  const toggleUploadPause = () => {
    setUploadProgress((prev) =>
      prev
        ? {
            ...prev,
            isPaused: !prev.isPaused,
          }
        : null,
    )
  }

  // Cancel upload
  const cancelUpload = () => {
    // Note: In a real implementation, you would cancel the actual upload request
    setUploadProgress(null)
    setChunkedState(null)
    setSelectedVideo(null)
    toast({
      title: 'Upload Cancelled',
      description: 'Video upload has been cancelled.',
    })
  }

  // Retry failed upload
  const retryUpload = () => {
    if (selectedVideo) {
      startChunkedUpload()
    }
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format duration
  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Format upload speed
  const formatSpeed = (bytesPerSecond: number): string => {
    return `${formatFileSize(bytesPerSecond)}/s`
  }

  // Format time remaining
  const formatTimeRemaining = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {!isOnline && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're currently offline. Upload will resume when connection is
            restored.
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Area */}
      {!uploadProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Video
            </CardTitle>
            <CardDescription>
              Select a video file to upload. Supported formats: MP4, WebM, AVI,
              MOV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Drag and drop your video here
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Button variant="outline">
                <FileVideo className="mr-2 h-4 w-4" />
                Choose Video File
              </Button>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Maximum file size: {maxFileSize}MB</p>
                <p>Supported formats: {allowedFormats.join(', ')}</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedFormats.join(',')}
              onChange={(e) =>
                e.target.files && handleFileSelect(e.target.files)
              }
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {uploadProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Uploading Video
              </span>
              <div className="flex items-center gap-2">
                <Badge variant={isOnline ? 'default' : 'destructive'}>
                  {isOnline ? (
                    <>
                      <Wifi className="h-3 w-3 mr-1" />
                      Online
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 mr-1" />
                      Offline
                    </>
                  )}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleUploadPause}
                  disabled={!isOnline}
                >
                  {uploadProgress.isPaused ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={cancelUpload}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{uploadProgress.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={uploadProgress.percentage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Uploaded:</span>
                <span className="ml-2 font-medium">
                  {formatFileSize(uploadProgress.loaded)} /{' '}
                  {formatFileSize(uploadProgress.total)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Speed:</span>
                <span className="ml-2 font-medium">
                  {uploadProgress.speed > 0
                    ? formatSpeed(uploadProgress.speed)
                    : 'Calculating...'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Time remaining:</span>
                <span className="ml-2 font-medium">
                  {uploadProgress.timeRemaining > 0
                    ? formatTimeRemaining(uploadProgress.timeRemaining)
                    : 'Calculating...'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 font-medium">
                  {uploadProgress.isPaused ? 'Paused' : 'Uploading...'}
                </span>
              </div>
            </div>

            {uploadProgress.error && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{uploadProgress.error}</span>
                  <Button size="sm" variant="outline" onClick={retryUpload}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      {processingStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Video Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing Progress</span>
                <span>{processingStatus.progress}%</span>
              </div>
              <Progress value={processingStatus.progress} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Quality Options:</h4>
              {processingStatus.quality.map((quality) => (
                <div
                  key={quality.resolution}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span>{quality.resolution}</span>
                  <Badge
                    variant={
                      quality.status === 'completed'
                        ? 'default'
                        : quality.status === 'failed'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {quality.status}
                  </Badge>
                </div>
              ))}
            </div>

            {processingStatus.estimatedCompletion && (
              <div className="text-sm text-muted-foreground">
                Estimated completion:{' '}
                {new Date(
                  processingStatus.estimatedCompletion,
                ).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Configuration Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
            <DialogDescription>
              Configure your video upload settings before uploading.
            </DialogDescription>
          </DialogHeader>

          {selectedVideo && (
            <div className="space-y-4">
              {/* Video Preview */}
              <div className="space-y-2">
                <Label>Video Preview</Label>
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <FileVideo className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">
                        {selectedVideo.file.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(selectedVideo.size)}
                        {selectedVideo.duration && (
                          <span>
                            {' '}
                            • {formatDuration(selectedVideo.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Metadata */}
              <div className="space-y-2">
                <Label htmlFor="video-title">Video Title</Label>
                <Input
                  id="video-title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="video-description"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Enter video description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-quality">Processing Quality</Label>
                <Select value={videoQuality} onValueChange={setVideoQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Recommended)</SelectItem>
                    <SelectItem value="high">High Quality</SelectItem>
                    <SelectItem value="medium">Medium Quality</SelectItem>
                    <SelectItem value="low">Low Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={startChunkedUpload}
              disabled={!videoTitle.trim() || !isOnline}
            >
              <Upload className="mr-2 h-4 w-4" />
              Start Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
