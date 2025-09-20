import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Download, File, FileText, Image, Upload, Video, X } from 'lucide-react'

// UI Components
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Hooks
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import type {
  CourseCreationData,
  CourseResource,
  FileUploadProgress,
} from '@/lib/course-management-types'

// Types

interface ResourceManagementStepProps {
  formData: Partial<CourseCreationData>
  onUpdate: (data: Partial<CourseCreationData>) => void
  errors: Array<string>
  onNext?: () => void
}

const ALLOWED_FILE_TYPES = {
  documents: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
  audio: ['.mp3', '.wav', '.ogg'],
  archives: ['.zip', '.rar', '.7z'],
  text: ['.txt', '.md', '.csv'],
}

const ALL_ALLOWED_TYPES = Object.values(ALLOWED_FILE_TYPES).flat()
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

function getFileIcon(fileName: string) {
  const extension = fileName.toLowerCase().split('.').pop()

  if (
    extension !== null && extension !== undefined && extension !== '' &&
    ALLOWED_FILE_TYPES.documents.some((ext) => ext.includes(extension))
  ) {
    return <FileText className="w-5 h-5" />
  }
  if (
    extension !== null && extension !== undefined && extension !== '' &&
    ALLOWED_FILE_TYPES.images.some((ext) => ext.includes(extension))
  ) {
    return <Image className="w-5 h-5" />
  }
  if (
    extension !== null && extension !== undefined && extension !== '' &&
    ALLOWED_FILE_TYPES.audio.some((ext) => ext.includes(extension))
  ) {
    return <Video className="w-5 h-5" />
  }
  return <File className="w-5 h-5" />
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

interface ResourceCardProps {
  resource: CourseResource
  onDelete: () => void
  onTogglePublic: () => void
}

function ResourceCard({
  resource,
  onDelete,
  onTogglePublic,
}: ResourceCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-muted">
            {getFileIcon(resource.filename)}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{resource.original_name}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formatFileSize(resource.file_size)}</span>
              <span className="capitalize">{resource.file_type}</span>
              {resource.description !== null &&
                resource.description !== undefined &&
                resource.description !== '' && (
                  <span className="truncate max-w-xs">
                    {resource.description}
                  </span>
                )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={resource.is_public}
                onCheckedChange={onTogglePublic}
                size="sm"
              />
              <Label className="text-xs">
                {resource.is_public ? 'Public' : 'Private'}
              </Label>
            </div>

            <Button variant="ghost" size="sm" asChild>
              <a href={resource.download_url} download>
                <Download className="w-4 h-4" />
              </a>
            </Button>

            <Button variant="ghost" size="sm" onClick={onDelete}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList) => void
  isDragOver: boolean
  onDragOver: (isDragOver: boolean) => void
}

function FileUploadZone({
  onFilesSelected,
  isDragOver,
  onDragOver,
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFilesSelected(files)
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
      }`}
      onClick={() => fileInputRef.current?.click()}
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
            <h3 className="text-lg font-medium">Upload Course Resources</h3>
            <p className="text-muted-foreground">
              Drag and drop files here or click to browse
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, DOC, PPT, images, audio files
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALL_ALLOWED_TYPES.join(',')}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onFilesSelected(e.target.files)
            }
          }}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}

interface UploadProgressCardProps {
  upload: FileUploadProgress
  onCancel: () => void
}

function UploadProgressCard({ upload, onCancel }: UploadProgressCardProps) {
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

  const getStatusText = () => {
    switch (upload.status) {
      case 'uploading':
        return `Uploading... ${upload.progress}%`
      case 'completed':
        return 'Upload complete'
      case 'error':
        return upload.error ?? 'Upload failed'
      default:
        return 'Preparing...'
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-muted">
            {getFileIcon(upload.filename)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium truncate">{upload.filename}</h4>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className={`text-sm ${getStatusColor()}`}>
                {getStatusText()}
              </div>

              {upload.status === 'uploading' && (
                <Progress value={upload.progress} className="w-full h-2" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ResourceManagementStep({
  formData,
  onUpdate,
  errors,
  onNext,
}: ResourceManagementStepProps) {
  const { token } = useAuth()
  const { watch, setValue } = useFormContext<CourseCreationData>()

  const resources = watch('resources') ?? []
  const [uploads, setUploads] = useState<Map<string, FileUploadProgress>>(
    new Map(),
  )
  const [isDragOver, setIsDragOver] = useState(false)

  // File Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Debug logging with file content check
      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      })

      // Validate file
      if (file.size === 0) {
        throw new Error('File is empty. Please select a valid file.')
      }

      // Additional file validation - check if file can be read
      try {
        const reader = new FileReader()
        const fileContent = await new Promise<ArrayBuffer>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as ArrayBuffer)
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsArrayBuffer(file)
        })

        if (fileContent.byteLength === 0) {
          throw new Error('File appears to be empty or corrupted')
        }

        console.log('File content validated:', {
          actualSize: fileContent.byteLength,
          expectedSize: file.size
        })
      } catch (readError) {
        console.error('File reading error:', readError)
        throw new Error('Failed to read file. Please try selecting the file again.')
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`)
      }

      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
      if (!ALL_ALLOWED_TYPES.includes(extension)) {
        throw new Error(`File type ${extension} is not supported`)
      }

      if (token === null || token === undefined || token === '')
        throw new Error('Authentication required')

      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('type', 'course_resource')
      uploadFormData.append('is_public', 'false')

      return api.uploadFile(token, uploadFormData)
    },
    onSuccess: (response, file) => {
      const newResource: CourseResource = {
        id: response.file_id as string,
        filename: response.filename as string,
        original_name: file.name,
        file_type: file.type,
        file_size: file.size,
        download_url: response.url as string,
        is_public: false,
        uploaded_at: new Date().toISOString(),
      }

      const newResources = [...resources, newResource]
      setValue('resources', newResources)
      onUpdate({ resources: newResources })

      // Remove from uploads
      setUploads((prev) => {
        const newMap = new Map(prev)
        const uploadId = Array.from(newMap.entries()).find(
          ([_, upload]) => upload.filename === file.name,
        )?.[0]
        if (uploadId !== null && uploadId !== undefined && uploadId !== '')
          newMap.delete(uploadId)
        return newMap
      })

      toast.success(`${file.name} uploaded successfully`)
    },
    onError: (error: Error, file) => {
      toast.error(
        `Failed to upload ${file.name}: ${(error as any).message ?? 'Unknown error'}`,
      )

      // Update upload status
      setUploads((prev) => {
        const newMap = new Map(prev)
        const uploadId = Array.from(newMap.entries()).find(
          ([_, upload]) => upload.filename === file.name,
        )?.[0]
        if (uploadId !== null && uploadId !== undefined && uploadId !== '') {
          newMap.set(uploadId, {
            ...(newMap.get(uploadId) ?? {}),
            status: 'error',
            error: (error as any).message ?? 'Unknown error',
          })
        }
        return newMap
      })
    },
  })

  const handleFilesSelected = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          `${file.name} is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`,
        )
        continue
      }

      // Validate file type
      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
      if (!ALL_ALLOWED_TYPES.includes(extension)) {
        toast.error(`${file.name} is not a supported file type`)
        continue
      }

      // Add to uploads
      const uploadId = `${Date.now()}-${i}`
      setUploads(
        (prev) =>
          new Map(
            prev.set(uploadId, {
              fileId: uploadId,
              filename: file.name,
              progress: 0,
              status: 'uploading',
            }),
          ),
      )

      // Start upload with progress simulation
      const updateProgress = (progress: number) => {
        setUploads((prev) => {
          const newMap = new Map(prev)
          const upload = newMap.get(uploadId)
          if (upload) {
            newMap.set(uploadId, { ...upload, progress })
          }
          return newMap
        })
      }

      // Simulate progress for demo
      const progressInterval = setInterval(() => {
        updateProgress(Math.min(100, Math.random() * 20 + 60))
      }, 500)

      try {
        await uploadMutation.mutateAsync(file)
        clearInterval(progressInterval)
      } catch (error) {
        clearInterval(progressInterval)
      }
    }
  }

  const deleteResource = (resourceId: string) => {
    const newResources = resources.filter((r) => r.id !== resourceId)
    setValue('resources', newResources)
    onUpdate({ resources: newResources })
    toast.success('Resource deleted')
  }

  const toggleResourcePublic = (resourceId: string) => {
    const newResources = resources.map((r) =>
      r.id === resourceId ? { ...r, is_public: !r.is_public } : r,
    )
    setValue('resources', newResources)
    onUpdate({ resources: newResources })
  }

  const cancelUpload = (uploadId: string) => {
    setUploads((prev) => {
      const newMap = new Map(prev)
      newMap.delete(uploadId)
      return newMap
    })
  }

  const getTotalSize = () => {
    return resources.reduce((total, resource) => total + resource.file_size, 0)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Course Resources
        </h2>
        <p className="text-muted-foreground mt-2">
          Upload supplementary materials, documents, and resources for your
          students.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Zone */}
        <FileUploadZone
          onFilesSelected={handleFilesSelected}
          isDragOver={isDragOver}
          onDragOver={setIsDragOver}
        />

        {/* Upload Progress */}
        {uploads.size > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Upload Progress</h3>
            {Array.from(uploads.values()).map((upload) => (
              <UploadProgressCard
                key={upload.fileId}
                upload={upload}
                onCancel={() => cancelUpload(upload.fileId)}
              />
            ))}
          </div>
        )}

        {/* Resources Overview */}
        {resources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resources Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{resources.length}</p>
                  <p className="text-xs text-muted-foreground">Total Files</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    {formatFileSize(getTotalSize())}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Size</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    {resources.filter((r) => r.is_public).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Public Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uploaded Resources */}
        {resources.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">
                Uploaded Resources ({resources.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (
                    confirm('Are you sure you want to delete all resources?')
                  ) {
                    setValue('resources', [])
                    onUpdate({ resources: [] })
                  }
                }}
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-3">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onDelete={() => deleteResource(resource.id)}
                  onTogglePublic={() => toggleResourcePublic(resource.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">No resources uploaded</h3>
                  <p className="text-sm text-muted-foreground">
                    Add supplementary materials to enhance your course
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resource Guidelines */}
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            <strong>Resource Guidelines:</strong> Upload materials that
            complement your video content. Consider adding PDFs, slides,
            worksheets, code files, or reference materials. Public resources are
            accessible to all students, while private resources require
            enrollment.
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
