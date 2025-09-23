import React, { useState } from 'react'
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  RefreshCw,
  Users,
  VideoIcon,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { IsolatedTooltip } from '@/components/ui/isolated-tooltip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  useBulkOperations,
  useConnectionStatus,
  useInstructorRealTime,
  useRealTimeNotifications,
  useStudentActivityFeed,
} from '@/lib/instructor-realtime-context'

interface ConnectionStatusProps {
  compact?: boolean
}

function ConnectionStatus({ compact = false }: ConnectionStatusProps) {
  const { isConnected, isConnecting, error, reconnectAttempts, reconnect } =
    useConnectionStatus()

  // Memoize status functions to prevent unnecessary re-renders
  const statusIcon = React.useMemo(() => {
    if (isConnected) return <Wifi className="h-4 w-4 text-green-600" />
    if (isConnecting)
      return <Activity className="h-4 w-4 text-yellow-600 animate-pulse" />
    return <WifiOff className="h-4 w-4 text-red-600" />
  }, [isConnected, isConnecting])

  const statusText = React.useMemo(() => {
    if (isConnected) return 'Connected'
    if (isConnecting) return 'Connecting...'
    if (error) return `Error: ${error}`
    return 'Disconnected'
  }, [isConnected, isConnecting, error])

  const statusColor = React.useMemo(() => {
    if (isConnected) return 'text-green-600'
    if (isConnecting) return 'text-yellow-600'
    return 'text-red-600'
  }, [isConnected, isConnecting])

  // Memoize tooltip content to prevent unnecessary updates
  const tooltipContent = React.useMemo(
    () => (
      <div className="text-sm">
        <div className="font-medium">{statusText}</div>
        {reconnectAttempts > 0 && (
          <div className="text-muted-foreground">
            Reconnect attempts: {reconnectAttempts}
          </div>
        )}
        {error && !isConnected && (
          <Button
            size="sm"
            variant="outline"
            onClick={reconnect}
            className="mt-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    ),
    [statusText, reconnectAttempts, error, isConnected, reconnect],
  )

  if (compact) {
    return (
      <IsolatedTooltip
        content={tooltipContent}
        enabled={true}
        side="top"
        delayDuration={300}
      >
        <div className="flex items-center gap-2 cursor-help">
          {statusIcon}
          <span className={`text-sm ${statusColor}`}>
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </IsolatedTooltip>
    )
  }

  // Non-compact version without tooltip to avoid nesting issues
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      {statusIcon}
      <div className="flex-1">
        <div className={`font-medium ${statusColor}`}>{statusText}</div>
        {reconnectAttempts > 0 && (
          <div className="text-sm text-muted-foreground">
            Reconnect attempts: {reconnectAttempts}
          </div>
        )}
      </div>
      {error && !isConnected && (
        <Button size="sm" variant="outline" onClick={reconnect}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reconnect
        </Button>
      )}
    </div>
  )
}

interface VideoProcessingStatusProps {
  compact?: boolean
}

function VideoProcessingStatus({
  compact = false,
}: VideoProcessingStatusProps) {
  const { videoProcessingUpdates, dismissVideoProcessingUpdate } =
    useInstructorRealTime()

  const processingVideos = React.useMemo(
    () =>
      Array.from(videoProcessingUpdates.values()).filter(
        (status) => status.status === 'processing',
      ),
    [videoProcessingUpdates],
  )

  if (processingVideos.length === 0) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <VideoIcon className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-blue-600">
          {processingVideos.length} processing
        </span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <VideoIcon className="h-4 w-4" />
          Video Processing ({processingVideos.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {processingVideos.map((status) => (
          <div key={status.lectureId} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Lecture {status.lectureId}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {status.progress}%
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissVideoProcessingUpdate(status.lectureId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Progress value={status.progress} className="h-2" />
            {status.estimatedCompletion && (
              <div className="text-xs text-muted-foreground">
                ETA: {new Date(status.estimatedCompletion).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface BulkOperationsStatusProps {
  compact?: boolean
}

function BulkOperationsStatus({ compact = false }: BulkOperationsStatusProps) {
  const { activeOperations, completedOperations, failedOperations } =
    useBulkOperations()

  const totalOperations = React.useMemo(
    () =>
      activeOperations.length +
      completedOperations.length +
      failedOperations.length,
    [
      activeOperations.length,
      completedOperations.length,
      failedOperations.length,
    ],
  )

  if (totalOperations === 0) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-blue-600">
          {activeOperations.length} operations
        </span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Bulk Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeOperations.map((operation) => (
          <div key={operation.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize">
                {operation.type.replace('_', ' ')}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-blue-600" />
                <span className="text-sm text-muted-foreground">
                  {operation.processedItems}/{operation.totalItems}
                </span>
              </div>
            </div>
            <Progress value={operation.progress} className="h-2" />
          </div>
        ))}

        {completedOperations.map((operation) => (
          <div
            key={operation.id}
            className="flex items-center justify-between p-2 bg-green-50 rounded"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium capitalize">
                {operation.type.replace('_', ' ')}
              </span>
            </div>
            <Badge variant="secondary">Completed</Badge>
          </div>
        ))}

        {failedOperations.map((operation) => (
          <div
            key={operation.id}
            className="flex items-center justify-between p-2 bg-red-50 rounded"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium capitalize">
                {operation.type.replace('_', ' ')}
              </span>
            </div>
            <Badge variant="destructive">Failed</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface StudentActivityFeedProps {
  compact?: boolean
}

function StudentActivityFeed({ compact = false }: StudentActivityFeedProps) {
  const { activities, clearFeed, activityCount } = useStudentActivityFeed()

  if (activityCount === 0) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-600">
          {activityCount} activities
        </span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Student Activity ({activityCount})
          </CardTitle>
          <Button size="sm" variant="outline" onClick={clearFeed}>
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-32">
          <div className="space-y-2">
            {(
              activities as Array<{
                type: string
                description: string
                timestamp: string
              }>
            )
              .slice(0, 10)
              .map((activity, index) => (
                <div key={index} className="text-sm p-2 border rounded">
                  <div className="font-medium">{activity.type}</div>
                  <div className="text-muted-foreground">
                    {activity.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

interface RealTimeStatusBarProps {
  position?: 'top' | 'bottom' | 'inline'
  compact?: boolean
  collapsible?: boolean
}

export default function RealTimeStatusBar({
  position = 'bottom',
  compact = false,
  collapsible = false,
}: RealTimeStatusBarProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible)

  const { videoProcessingUpdates, activeBulkOperations, studentActivityFeed } =
    useInstructorRealTime()
  const { unreadCount } = useRealTimeNotifications()

  const hasVideoProcessing = videoProcessingUpdates.size > 0
  const hasBulkOperations = activeBulkOperations.size > 0
  const hasStudentActivity = studentActivityFeed.length > 0
  const hasActivity =
    hasVideoProcessing ||
    hasBulkOperations ||
    hasStudentActivity ||
    unreadCount > 0

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      case 'bottom':
        return 'fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      default:
        return 'border rounded-lg bg-background'
    }
  }

  if (compact) {
    return (
      <div className={`${getPositionClasses()} p-2`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <ConnectionStatus compact />
            {hasVideoProcessing && <VideoProcessingStatus compact />}
            {hasBulkOperations && <BulkOperationsStatus compact />}
            {hasStudentActivity && <StudentActivityFeed compact />}
            {unreadCount > 0 && (
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600">
                  {unreadCount} notifications
                </span>
              </div>
            )}
          </div>
          {collapsible && hasActivity && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={getPositionClasses()}>
      <div className="max-w-7xl mx-auto p-4">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Status
            </h3>
            {collapsible && (
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Expand
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
          </div>

          <CollapsibleContent className="space-y-4">
            <ConnectionStatus />

            {hasActivity && (
              <>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {hasVideoProcessing && <VideoProcessingStatus />}
                  {hasBulkOperations && <BulkOperationsStatus />}
                  {hasStudentActivity && <StudentActivityFeed />}
                </div>
              </>
            )}

            {!hasActivity && (
              <div className="text-center text-muted-foreground py-8">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p>No active operations or recent activity</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
