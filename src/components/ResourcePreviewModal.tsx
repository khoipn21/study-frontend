import {
  AlertCircle,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Suspense, lazy, useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { checkUrlExpiry, debugResourceUrl } from '@/lib/debug-resource'
import {
  formatFileSize,
  getFileTypeDisplay,
  useResourceService,
} from '@/lib/resource-service'
import { cn } from '@/lib/utils'

import type { ResourceData } from '@/lib/resource-service'

// Lazily load PDF preview component to avoid SSR issues
const PDFPreview = lazy(() => import('./PDFPreview'))

interface ResourcePreviewModalProps {
  resource: ResourceData | null
  isOpen: boolean
  onClose: () => void
  onDownload?: (resource: ResourceData) => void
  className?: string
}

// Image Preview Component
function ImagePreview({
  src,
  alt,
  onError,
}: {
  src: string
  alt: string
  onError: () => void
}) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', src)
    setIsLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    console.error('Image failed to load:', src)
    setIsLoading(false)
    setImageError(true)
    onError()
  }

  const handleZoomIn = () => setScale((prev) => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setScale((prev) => Math.max(prev / 1.2, 0.5))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)
  const handleReset = () => {
    setScale(1)
    setRotation(0)
    setIsFullscreen(false)
  }

  if (imageError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium mb-2">Unable to load image</p>
        <p className="text-sm">
          The image file may be corrupted or in an unsupported format.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Image Controls */}
      <div className="flex items-center justify-between mb-4 p-2 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-mono min-w-[4rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'Minimize' : 'Maximize'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
          <span className="ml-1 text-xs">{isFullscreen ? 'Min' : 'Max'}</span>
        </Button>
      </div>

      {/* Image Container */}
      <div
        className={cn(
          'relative overflow-auto border rounded-lg bg-background',
          isFullscreen ? 'h-[60vh]' : 'h-[50vh]',
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        <div className="flex items-center justify-center min-h-full p-4">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              opacity: isLoading ? 0 : 1,
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            crossOrigin="anonymous"
          />
        </div>
      </div>
    </div>
  )
}

// Text/Code Preview Component
function TextPreview({
  src,
  resource,
  onError,
}: {
  src: string
  resource: ResourceData
  onError: () => void
}) {
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [textError, setTextError] = useState(false)

  useEffect(() => {
    const loadTextContent = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(src)
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.statusText}`)
        }
        const text = await response.text()
        setContent(text)
        setTextError(false)
      } catch (error) {
        console.error('Text load error:', error)
        setTextError(true)
        onError()
      } finally {
        setIsLoading(false)
      }
    }

    loadTextContent()
  }, [src, onError])

  if (textError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <FileText className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium mb-2">Unable to load text file</p>
        <p className="text-sm text-center max-w-md">
          This file cannot be previewed as text. You can download it to view
          with your preferred application.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading text content...
          </p>
        </div>
      </div>
    )
  }

  const isCodeFile = [
    'js',
    'ts',
    'jsx',
    'tsx',
    'html',
    'css',
    'scss',
    'sass',
    'less',
    'py',
    'java',
    'cpp',
    'c',
    'cs',
    'php',
    'rb',
    'go',
    'rs',
    'vue',
    'svelte',
    'json',
    'xml',
  ].includes(resource.filename?.toLowerCase().split('.').pop() ?? '')

  return (
    <div className="relative">
      <div className="mb-4 p-2 bg-muted/50 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{isCodeFile ? 'Code' : 'Text'} File</Badge>
          <span className="text-sm text-muted-foreground">
            {content.split('\n').length} lines • {content.length} characters
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(content)
            // You could add a toast notification here
          }}
        >
          Copy to Clipboard
        </Button>
      </div>

      <div className="border rounded-lg bg-background max-h-[60vh] overflow-auto">
        <pre
          className={`p-4 text-sm ${isCodeFile ? 'font-mono' : ''} whitespace-pre-wrap break-words`}
        >
          <code>{content}</code>
        </pre>
      </div>
    </div>
  )
}

// Main Preview Modal Component
export function ResourcePreviewModal({
  resource,
  isOpen,
  onClose,
  onDownload,
  className,
}: ResourcePreviewModalProps) {
  const resourceService = useResourceService()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState<{
    loaded: number
    total: number
  } | null>(null)

  // Load preview URL when resource changes
  useEffect(() => {
    if (!resource || !isOpen) {
      setPreviewUrl(null)
      setError(null)
      return
    }

    if (!resourceService.canPreview(resource)) {
      setError('This file type cannot be previewed')
      return
    }

    setIsLoading(true)
    setError(null)

    console.log(
      'Fetching preview URL for resource:',
      resource.id,
      resource.original_name,
    )

    resourceService
      .getPreviewUrl(resource.id)
      .then(async ({ url }) => {
        console.log('Preview URL received:', url)

        // Check if URL is valid
        if (!url || url === undefined || url === null) {
          console.error('❌ Preview URL is undefined or null')
          setError('Preview URL not available from server')
          return
        }

        // Debug the URL
        const expiry = checkUrlExpiry(url)
        if (expiry.expired) {
          console.error('❌ Preview URL is expired:', expiry)
          setError(`Preview URL expired. Time left: ${expiry.timeLeft}ms`)
          return
        }

        // Test URL accessibility
        const debugResult = await debugResourceUrl(url, 'preview')
        if (!debugResult.success) {
          console.error('❌ Preview URL debug failed:', debugResult)
          setError(debugResult.error ?? 'Failed to access preview URL')
          return
        }

        console.log('✅ Preview URL is accessible:', debugResult)
        setPreviewUrl(url)
        setError(null)
      })
      .catch((err) => {
        console.error('Failed to get preview URL:', err)
        setError((err as Error).message || 'Failed to load preview')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [resource, isOpen, resourceService])

  // Handle download
  const handleDownload = async () => {
    if (!resource) return

    try {
      setDownloadProgress({ loaded: 0, total: 0 })

      if (onDownload) {
        onDownload(resource)
      } else {
        console.log('🚀 Starting download for:', resource.original_name)
        await resourceService.downloadResource(resource, (loaded, total) =>
          setDownloadProgress({ loaded, total }),
        )
        console.log('✅ Download completed for:', resource.original_name)
      }
    } catch (err) {
      console.error('❌ Download failed:', err)
      setError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setDownloadProgress(null)
    }
  }

  const handlePreviewError = () => {
    setError(
      'Failed to load preview. The file may be corrupted or in an unsupported format.',
    )
  }

  if (!resource) return null

  const canPreview = resourceService.canPreview(resource)
  const resourceType = resource.resource_type?.toLowerCase() ?? ''
  const mimeType = resource.file_type?.toLowerCase() ?? ''
  const extension = resource.filename?.toLowerCase().split('.').pop() ?? ''

  const isImage = resourceType === 'image' || mimeType.startsWith('image/')
  const isPDF =
    resourceType === 'pdf' ||
    mimeType === 'application/pdf' ||
    extension === 'pdf'
  const isText =
    resourceType === 'document' ||
    mimeType.startsWith('text/') ||
    [
      'txt',
      'md',
      'markdown',
      'json',
      'xml',
      'csv',
      'log',
      'js',
      'ts',
      'jsx',
      'tsx',
      'html',
      'css',
      'scss',
      'sass',
      'less',
      'py',
      'java',
      'cpp',
      'c',
      'cs',
      'php',
      'rb',
      'go',
      'rs',
      'vue',
      'svelte',
    ].includes(extension)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn('max-w-7xl max-h-[95vh] w-[95vw] p-0', className)}
      >
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold truncate mb-2">
                {resource.original_name}
              </DialogTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="secondary" className="gap-1">
                  {isImage ? (
                    <ImageIcon className="h-3 w-3" />
                  ) : (
                    <FileText className="h-3 w-3" />
                  )}
                  {getFileTypeDisplay(
                    resource.file_type,
                    resource.resource_type,
                  )}
                </Badge>
                <span>{formatFileSize(resource.file_size)}</span>
                <span>
                  Uploaded {new Date(resource.uploaded_at).toLocaleDateString()}
                </span>
                {!resource.is_public && (
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-600"
                  >
                    Premium
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!!downloadProgress}
                className="gap-2"
              >
                {downloadProgress ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {downloadProgress.total > 0
                      ? `${Math.round((downloadProgress.loaded / downloadProgress.total) * 100)}%`
                      : 'Downloading...'}
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
              {/* <DialogClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose> */}
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Content */}
        <div className="p-6">
          {!canPreview && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <FileText className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium mb-2">Preview not available</p>
              <p className="text-sm text-center max-w-md">
                This file type cannot be previewed in the browser. Click
                download to view it with your preferred application.
              </p>
            </div>
          )}

          {canPreview && isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Loading preview...
                </p>
              </div>
            </div>
          )}

          {canPreview && error && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-4 text-destructive" />
              <p className="text-lg font-medium mb-2">Preview Error</p>
              <p className="text-sm text-center max-w-md">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

          {canPreview && previewUrl && !isLoading && !error && (
            <div className="space-y-4">
              {isImage && (
                <ImagePreview
                  src={previewUrl}
                  alt={resource.original_name}
                  onError={handlePreviewError}
                />
              )}
              {isPDF && (
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-96">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="text-sm text-muted-foreground">
                          Loading PDF viewer...
                        </p>
                      </div>
                    </div>
                  }
                >
                  <PDFPreview src={previewUrl} onError={handlePreviewError} />
                </Suspense>
              )}
              {isText && (
                <TextPreview
                  src={previewUrl}
                  resource={resource}
                  onError={handlePreviewError}
                />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ResourcePreviewModal
