import { createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Cloud,
  FileVideo,
  Folder,
  HelpCircle,
  Settings,
} from 'lucide-react'

import InstructorDashboardLayout from '@/components/instructor/InstructorDashboardLayout'
import VideoUpload from '@/components/instructor/VideoUpload'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export const Route = createFileRoute('/dashboard/instructor/upload/')({
  component: RouteComponent,
})

function RouteComponent() {
  // Mock data for recent uploads and processing status
  const recentUploads = [
    {
      id: '1',
      filename: 'react-hooks-tutorial.mp4',
      status: 'completed',
      uploadedAt: '2024-01-15T10:30:00Z',
      size: '245.7 MB',
      duration: '45:30',
      processingProgress: 100,
    },
    {
      id: '2',
      filename: 'typescript-basics.mp4',
      status: 'processing',
      uploadedAt: '2024-01-15T11:45:00Z',
      size: '189.2 MB',
      duration: '32:15',
      processingProgress: 65,
    },
    {
      id: '3',
      filename: 'advanced-patterns.mp4',
      status: 'failed',
      uploadedAt: '2024-01-15T09:15:00Z',
      size: '356.8 MB',
      duration: '58:42',
      processingProgress: 0,
      error: 'Processing timeout - file may be corrupted',
    },
  ]

  const storageInfo = {
    used: 15.7, // GB
    total: 100, // GB
    percentage: 15.7,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <FileVideo className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default' as const,
      processing: 'secondary' as const,
      failed: 'destructive' as const,
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  return (
    <InstructorDashboardLayout
      title="Video Upload Center"
      description="Upload and manage your course videos with advanced processing options"
      headerContent={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Folder className="mr-2 h-4 w-4" />
            Video Library
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Upload Settings
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Storage Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Storage Usage
            </CardTitle>
            <CardDescription>
              Monitor your video storage and processing quota
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {storageInfo.used} GB / {storageInfo.total} GB used
                </span>
                <span className="text-sm text-muted-foreground">
                  {storageInfo.percentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={storageInfo.percentage} className="h-2" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">
                    {storageInfo.total - storageInfo.used} GB
                  </div>
                  <div className="text-muted-foreground">Available</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">Unlimited</div>
                  <div className="text-muted-foreground">Bandwidth</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">Auto</div>
                  <div className="text-muted-foreground">Backup</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Guidelines */}
        <Alert>
          <HelpCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Upload Tips:</strong> For best quality, upload videos in
            1080p MP4 format. Videos are automatically processed into multiple
            resolutions for optimal streaming. Processing typically takes 5-10
            minutes per hour of video content.
          </AlertDescription>
        </Alert>

        {/* Main Upload Component */}
        <VideoUpload
          onUploadComplete={(videoUrl) => {
            console.log('Upload completed:', videoUrl)
          }}
          onUploadError={(error) => {
            console.error('Upload error:', error)
          }}
          maxFileSize={1024} // 1GB
          chunkSize={10} // 10MB chunks
        />

        {/* Recent Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>
              Track the status of your recent video uploads and processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(upload.status)}
                    <div>
                      <div className="font-medium">{upload.filename}</div>
                      <div className="text-sm text-muted-foreground">
                        {upload.size} • {upload.duration} •{' '}
                        {new Date(upload.uploadedAt).toLocaleDateString()}
                      </div>
                      {upload.error && (
                        <div className="text-sm text-red-600 mt-1">
                          {upload.error}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {upload.status === 'processing' && (
                      <div className="flex items-center gap-2">
                        <Progress
                          value={upload.processingProgress}
                          className="w-24 h-2"
                        />
                        <span className="text-sm text-muted-foreground">
                          {upload.processingProgress}%
                        </span>
                      </div>
                    )}
                    {getStatusBadge(upload.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upload Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Best Practices</CardTitle>
            <CardDescription>
              Follow these guidelines for optimal video quality and processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">Recommended</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Use MP4 format with H.264 codec
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    1920x1080 resolution (1080p) for HD quality
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    30 fps frame rate for smooth playback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    AAC audio codec at 128 kbps
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Stable internet connection during upload
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-red-600">Avoid</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Very large files (over 1GB) without chunking
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Unsupported formats (FLV, WMV)
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Variable frame rates
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Corrupted or incomplete files
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Uploading during poor connectivity
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </InstructorDashboardLayout>
  )
}
