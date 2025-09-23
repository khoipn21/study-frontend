import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AlertCircle, Image, Upload, X } from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Hooks and utils
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'

// Types
interface ThumbnailUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  className?: string
}

const SUPPORTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function validateImageFile(file: File): string | null {
  // Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    return `Image is too large. Maximum size is ${formatFileSize(MAX_IMAGE_SIZE)}`
  }

  // Check file type
  const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
  if (!SUPPORTED_IMAGE_TYPES.includes(extension)) {
    return `Unsupported image format. Please use: ${SUPPORTED_IMAGE_TYPES.join(', ')}`
  }

  return null
}

export function ThumbnailUpload({
  value,
  onChange,
  onError,
  className = '',
}: ThumbnailUploadProps) {
  const { token } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!token) {
        throw new Error('Authentication required')
      }

      // Create FormData for upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'course-thumbnails')
      formData.append('is_public', 'true')

      // Upload to API
      const response = await api.uploadFile(token, formData)
      return response
    },
    onSuccess: (response) => {
      setIsUploading(false)
      setUploadProgress(0)

      // Extract URL from response
      const imageUrl = response.url
      if (imageUrl) {
        onChange(imageUrl)
        toast.success('Thumbnail uploaded successfully!')
      } else {
        const error = 'Upload completed but no URL returned'
        onError?.(error)
        toast.error(error)
      }
    },
    onError: (error: Error) => {
      setIsUploading(false)
      setUploadProgress(0)
      const errorMessage = error.message ?? 'Failed to upload thumbnail'
      onError?.(errorMessage)
      toast.error(errorMessage)
    },
  })

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validationError = validateImageFile(file)
    if (validationError) {
      onError?.(validationError)
      toast.error(validationError)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.random() * 20
      })
    }, 200)

    try {
      await uploadMutation.mutateAsync(file)
      clearInterval(progressInterval)
      setUploadProgress(100)
    } catch (error) {
      clearInterval(progressInterval)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveThumbnail = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Course Thumbnail
        </CardTitle>
        <CardDescription>
          Upload a cover image for your course. Recommended size: 1280x720px
          (16:9 ratio)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {value ? (
          /* Preview existing thumbnail */
          <div className="relative group">
            <div className="aspect-video w-full max-w-sm rounded-lg overflow-hidden border bg-muted">
              <img
                src={value}
                alt="Course thumbnail"
                className="w-full h-full object-cover"
                onError={() => {
                  onError?.('Failed to load thumbnail image')
                  onChange('')
                }}
              />
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveThumbnail}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Thumbnail uploaded
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                Replace
              </Button>
            </div>
          </div>
        ) : (
          /* Upload zone */
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
            onClick={handleUploadClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <Upload
                className={`mx-auto h-12 w-12 ${
                  isDragOver ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <div>
                <h3 className="text-lg font-medium">
                  {isUploading ? 'Uploading...' : 'Upload Course Thumbnail'}
                </h3>
                <p className="text-muted-foreground">
                  {isUploading
                    ? 'Please wait while we upload your image'
                    : 'Drag and drop an image or click to browse'}
                </p>
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(uploadProgress)}% complete
                  </p>
                </div>
              )}
              {!isUploading && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPG, PNG, WebP
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: {formatFileSize(MAX_IMAGE_SIZE)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guidelines */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Image Guidelines:</strong> Use a high-quality image with a
            16:9 aspect ratio. The thumbnail will be displayed in course
            listings and should clearly represent your course content. Avoid
            text-heavy images as they may not be readable at smaller sizes.
          </AlertDescription>
        </Alert>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_IMAGE_TYPES.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
