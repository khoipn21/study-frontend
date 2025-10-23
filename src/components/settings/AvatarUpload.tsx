import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AvatarCropper } from './AvatarCropper'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  onAvatarUpdate?: (newAvatarUrl: string) => void
}

export function AvatarUpload({
  currentAvatarUrl,
  onAvatarUpdate,
}: AvatarUploadProps) {
  const { user, token } = useAuth()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        toast.error('Only JPG, PNG, and WebP images are allowed')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    multiple: false,
  })

  const handleCropComplete = (blob: Blob) => {
    setShowCropper(false)
    handleUpload(blob)
  }

  const handleUpload = async (imageBlob: Blob) => {
    if (!token) {
      toast.error('You must be logged in to upload an avatar')
      return
    }

    setIsUploading(true)

    try {
      // Convert blob to file
      const file = new File([imageBlob], 'avatar.jpg', {
        type: 'image/jpeg',
      })

      // Upload avatar
      const response = await api.uploadAvatar(token, file)

      if (response.data?.avatar_url) {
        toast.success('Avatar updated successfully!')
        onAvatarUpdate?.(response.data.avatar_url)
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast.error('Failed to upload avatar. Please try again.')
    } finally {
      setIsUploading(false)
      setSelectedImage(null)
    }
  }

  const handleCancelCrop = () => {
    setShowCropper(false)
    setSelectedImage(null)
  }

  const getUserInitials = () => {
    if (!user?.username) return '?'
    return user.username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Avatar Preview */}
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg dark:border-gray-800">
          <AvatarImage src={currentAvatarUrl || undefined} alt="Avatar" />
          <AvatarFallback className="text-2xl">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div className="w-full max-w-md">
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-3">
            {isDragActive ? (
              <>
                <Upload className="h-12 w-12 text-primary" />
                <p className="text-sm font-medium text-primary">
                  Drop your image here
                </p>
              </>
            ) : (
              <>
                <Camera className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WebP (max 5MB)
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm">
                  Choose File
                </Button>
              </>
            )}
          </div>
        </div>

        {currentAvatarUrl && (
          <p className="mt-2 text-center text-xs text-gray-500">
            Upload a new image to replace your current avatar
          </p>
        )}
      </div>

      {/* Cropper Modal */}
      {showCropper && selectedImage && (
        <AvatarCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}
    </div>
  )
}
