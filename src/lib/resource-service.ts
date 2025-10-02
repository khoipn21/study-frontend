import { useMemo } from 'react'

import { api } from './api-client'
import { useAuth } from './auth-context'

export type ResourceType =
  | 'image'
  | 'pdf'
  | 'document'
  | 'video'
  | 'audio'
  | 'archive'
  | 'presentation'
  | 'spreadsheet'

export interface ResourceData {
  id: string
  filename: string
  original_name: string
  file_type: string
  file_size: number
  download_url: string
  is_public: boolean
  resource_type: string
  uploaded_at: string
}

export interface SignedUrlResponse {
  download_url?: string
  preview_url?: string
  expires_at: string
  resource_id: string
  resource_type?: string
}

export class ResourceError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = 'ResourceError'
  }
}

// URL cache to avoid excessive API calls for the same resource
const urlCache = new Map<string, { url: string; expires: Date }>()

export class ResourceService {
  private token: string | null = null

  constructor(token?: string) {
    this.token = token || null
  }

  setToken(token: string | null) {
    this.token = token
  }

  private ensureAuthenticated() {
    if (!this.token) {
      throw new ResourceError(
        'Authentication required for resource access',
        'AUTH_REQUIRED',
      )
    }
  }

  private getCacheKey(resourceId: string, type: 'download' | 'preview') {
    return `${resourceId}:${type}`
  }

  private isUrlCached(
    resourceId: string,
    type: 'download' | 'preview',
  ): string | null {
    const key = this.getCacheKey(resourceId, type)
    const cached = urlCache.get(key)

    if (cached && cached.expires > new Date()) {
      return cached.url
    }

    // Remove expired cache entry
    if (cached) {
      urlCache.delete(key)
    }

    return null
  }

  private cacheUrl(
    resourceId: string,
    type: 'download' | 'preview',
    url: string,
    expiresAt: string,
  ) {
    const key = this.getCacheKey(resourceId, type)
    const expires = new Date(expiresAt)

    // Cache for 5 minutes before expiry to be safe
    expires.setMinutes(expires.getMinutes() - 5)

    urlCache.set(key, { url, expires })
  }

  async getDownloadUrl(resourceId: string): Promise<string> {
    this.ensureAuthenticated()

    // Check cache first
    const cachedUrl = this.isUrlCached(resourceId, 'download')
    if (cachedUrl) {
      return cachedUrl
    }

    try {
      const response = await api.getResourceDownloadUrl(this.token!, resourceId)

      console.log('🔍 API response for download URL:', response)

      // Check if response has download_url
      if (!response.download_url) {
        console.error('❌ No download_url in API response:', response)
        throw new ResourceError(
          'Download URL not provided by server',
          'NO_DOWNLOAD_URL',
        )
      }

      // Cache the URL
      this.cacheUrl(
        resourceId,
        'download',
        response.download_url,
        response.expires_at,
      )

      return response.download_url
    } catch (error) {
      if (error instanceof Error) {
        throw new ResourceError(
          `Failed to get download URL: ${error.message}`,
          'DOWNLOAD_URL_FAILED',
        )
      }
      throw new ResourceError(
        'Failed to get download URL',
        'DOWNLOAD_URL_FAILED',
      )
    }
  }

  async getPreviewUrl(
    resourceId: string,
  ): Promise<{ url: string; type: string }> {
    this.ensureAuthenticated()

    // Check cache first
    const cachedUrl = this.isUrlCached(resourceId, 'preview')
    if (cachedUrl) {
      // We need to return type as well, but for cached URLs we'll assume it's compatible
      return { url: cachedUrl, type: 'unknown' }
    }

    try {
      const response = await api.getResourcePreviewUrl(this.token!, resourceId)

      console.log('🔍 API response for preview URL:', response)

      // Check if response has preview_url
      if (!response.preview_url) {
        console.error('❌ No preview_url in API response:', response)
        throw new ResourceError(
          'Preview URL not provided by server',
          'NO_PREVIEW_URL',
        )
      }

      // Cache the URL
      this.cacheUrl(
        resourceId,
        'preview',
        response.preview_url,
        response.expires_at,
      )

      return {
        url: response.preview_url,
        type: response.resource_type || 'unknown',
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new ResourceError(
          `Failed to get preview URL: ${error.message}`,
          'PREVIEW_URL_FAILED',
        )
      }
      throw new ResourceError('Failed to get preview URL', 'PREVIEW_URL_FAILED')
    }
  }

  async downloadResource(
    resource: ResourceData,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    try {
      const downloadUrl = await this.getDownloadUrl(resource.id)

      // Use fetch for binary download - simplified for S3 signed URLs
      const response = await fetch(downloadUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        // Remove custom headers that might cause CORS issues with S3
      })

      if (!response.ok) {
        throw new ResourceError(
          `Download failed: ${response.statusText}`,
          'DOWNLOAD_FAILED',
        )
      }

      // For progress tracking, we'll use the simpler approach with blob()
      // Manual chunk reading can cause corruption with binary data
      const contentLength = response.headers.get('content-length')
      const total = contentLength ? parseInt(contentLength, 10) : 0

      if (onProgress && total > 0) {
        // Simple progress indication - we can't track exact progress with blob()
        onProgress(0, total)
      }

      // Use response.blob() which properly handles binary data
      const blob = await response.blob()

      if (onProgress && total > 0) {
        onProgress(total, total) // Complete
      }

      // Use the blob directly without re-wrapping to avoid corruption
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = resource.original_name

      // For better compatibility, set additional attributes
      link.style.display = 'none'
      link.setAttribute('download', resource.original_name)

      document.body.appendChild(link)
      link.click()

      // Cleanup with slight delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      if (error instanceof ResourceError) {
        throw error
      }
      throw new ResourceError(
        `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DOWNLOAD_FAILED',
      )
    }
  }

  // Helper method to determine if a resource can be previewed
  canPreview(resource: ResourceData): boolean {
    const type = resource.resource_type?.toLowerCase() || ''
    const mimeType = resource.file_type?.toLowerCase() || ''
    const extension = resource.filename?.toLowerCase().split('.').pop() || ''

    // Images
    if (type === 'image' || mimeType.startsWith('image/')) {
      return (
        [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'svg',
          'webp',
          'bmp',
          'ico',
          'tiff',
          'tif',
        ].includes(extension) ||
        [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/svg+xml',
          'image/webp',
          'image/bmp',
          'image/x-icon',
          'image/tiff',
        ].includes(mimeType)
      )
    }

    // PDFs
    if (
      type === 'pdf' ||
      mimeType === 'application/pdf' ||
      extension === 'pdf'
    ) {
      return true
    }

    // Text files
    if (
      type === 'document' ||
      mimeType.startsWith('text/') ||
      ['txt', 'md', 'markdown', 'json', 'xml', 'csv', 'log'].includes(extension)
    ) {
      return true
    }

    // Code files
    if (
      [
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
    ) {
      return true
    }

    return false
  }

  // Get appropriate icon for resource type
  getResourceIcon(resource: ResourceData): string {
    const type = resource.resource_type?.toLowerCase() || ''
    const mimeType = resource.file_type?.toLowerCase() || ''
    const extension = resource.filename?.toLowerCase().split('.').pop() || ''

    if (type === 'image' || mimeType.startsWith('image/')) return 'image'
    if (type === 'pdf' || mimeType === 'application/pdf') return 'file-text'
    if (type === 'video' || mimeType.startsWith('video/')) return 'video'
    if (type === 'audio' || mimeType.startsWith('audio/')) return 'play'
    if (
      type === 'document' ||
      mimeType.includes('document') ||
      mimeType.includes('word')
    )
      return 'file-text'
    if (
      type === 'spreadsheet' ||
      mimeType.includes('spreadsheet') ||
      mimeType.includes('excel')
    )
      return 'file-text'
    if (
      type === 'presentation' ||
      mimeType.includes('presentation') ||
      mimeType.includes('powerpoint')
    )
      return 'file-text'
    if (
      type === 'archive' ||
      ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)
    )
      return 'download'

    return 'file'
  }

  // Clear cache for a specific resource or all resources
  clearCache(resourceId?: string) {
    if (resourceId) {
      urlCache.delete(this.getCacheKey(resourceId, 'download'))
      urlCache.delete(this.getCacheKey(resourceId, 'preview'))
    } else {
      urlCache.clear()
    }
  }
}

// Hook for using resource service with authentication
export function useResourceService() {
  const { token } = useAuth()

  const service = useMemo(() => {
    const resourceService = new ResourceService(token || undefined)
    return resourceService
  }, [token])

  return service
}

// Utility functions for resource handling
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileTypeDisplay(
  fileType: string,
  resourceType?: string,
): string {
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
