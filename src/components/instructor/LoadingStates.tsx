import React from 'react'
import { BarChart3, BookOpen, Loader2, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'

// Generic loading spinner
export function LoadingSpinner({
  size = 'default',
  className = '',
}: {
  size?: 'sm' | 'default' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  )
}

// Dashboard overview loading skeleton
export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Metrics Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="pl-2">
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Additional Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <Skeleton className="h-4 w-4 rounded mt-1" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Data table loading skeleton
export function DataTableSkeleton({
  rows = 10,
  columns = 6,
}: {
  rows?: number
  columns?: number
}) {
  return (
    <div className="space-y-4">
      {/* Filters Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        <div className="border-b p-4">
          <div className="flex items-center space-x-4">
            {[...Array(columns)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </div>
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="border-b p-4">
            <div className="flex items-center space-x-4">
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-6 w-20" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}

// Analytics dashboard loading skeleton
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Controls Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Key Metrics Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  )
}

// Video upload loading states
export function VideoUploadSkeleton() {
  return (
    <div className="space-y-6">
      {/* Storage Info Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-6 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}

// Upload progress component
export function UploadProgress({
  fileName,
  progress,
  speed,
  timeRemaining,
  status = 'uploading',
}: {
  fileName: string
  progress: number
  speed?: string
  timeRemaining?: string
  status?: 'uploading' | 'processing' | 'completed' | 'error'
}) {
  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-600" />
      case 'processing':
        return <LoadingSpinner size="sm" className="text-blue-600" />
      case 'completed':
        return <BookOpen className="h-4 w-4 text-green-600" />
      case 'error':
        return <Upload className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading...'
      case 'processing':
        return 'Processing...'
      case 'completed':
        return 'Completed'
      case 'error':
        return 'Error'
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div className="flex-1">
              <h4 className="font-medium">{fileName}</h4>
              <p className="text-sm text-muted-foreground">{getStatusText()}</p>
            </div>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {(speed || timeRemaining) && (
            <div className="flex justify-between text-sm text-muted-foreground">
              {speed && <span>Speed: {speed}</span>}
              {timeRemaining && <span>Time remaining: {timeRemaining}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Message loading skeleton
export function MessageLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 h-[600px]">
      {/* Thread List Skeleton */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversation Skeleton */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex-1 p-4 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[70%] ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}
                >
                  {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                  <div
                    className={`space-y-1 ${i % 2 === 0 ? 'items-start' : 'items-end'} flex flex-col`}
                  >
                    {i % 2 === 0 && <Skeleton className="h-3 w-20" />}
                    <Skeleton className="h-16 w-48 rounded-lg" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Notification loading skeleton
export function NotificationSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[160px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Notifications List Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border-l-4 border-l-gray-300">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-4 w-4 mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Full page loading component
export function FullPageLoading({
  message = 'Loading...',
}: {
  message?: string
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto text-primary" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Loading Dashboard</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  )
}

// Component loading placeholder
export function ComponentLoading({
  title,
  description,
  icon: Icon = BarChart3,
  className = '',
}: {
  title?: string
  description?: string
  icon?: React.ElementType
  className?: string
}) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {React.createElement(Icon, {
              className: 'h-6 w-6 text-muted-foreground',
            })}
          </div>
          <div className="space-y-2">
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
            <LoadingSpinner className="mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
