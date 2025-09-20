import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { instructorDashboardService } from '@/lib/instructor-dashboard'
import type {
  BulkOperation,
  InstructorMessage,
  InstructorNotification,
  VideoProcessingStatus,
} from '@/lib/instructor-dashboard'

interface WebSocketMessage {
  type:
    | 'video_processing_update'
    | 'new_notification'
    | 'new_message'
    | 'bulk_operation_update'
    | 'student_activity'
  payload: any
}

interface UseInstructorWebSocketOptions {
  enabled?: boolean
  onVideoProcessingUpdate?: (status: VideoProcessingStatus) => void
  onNewNotification?: (notification: InstructorNotification) => void
  onNewMessage?: (message: InstructorMessage) => void
  onBulkOperationUpdate?: (operation: BulkOperation) => void
  onStudentActivity?: (activity: any) => void
  autoReconnect?: boolean
  reconnectDelay?: number
  maxReconnectAttempts?: number
}

interface UseInstructorWebSocketReturn {
  isConnected: boolean
  isConnecting: boolean
  connectionError: string | null
  reconnectAttempts: number
  connect: () => void
  disconnect: () => void
  sendMessage: (message: any) => void
}

export function useInstructorWebSocket(
  options: UseInstructorWebSocketOptions = {},
): UseInstructorWebSocketReturn {
  const {
    enabled = true,
    onVideoProcessingUpdate,
    onNewNotification,
    onNewMessage,
    onBulkOperationUpdate,
    onStudentActivity,
    autoReconnect = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
  } = options

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data)

        switch (data.type) {
          case 'video_processing_update': {
            const videoStatus = data.payload as VideoProcessingStatus
            onVideoProcessingUpdate?.(videoStatus)

            // Update video processing status in cache
            queryClient.setQueryData(
              ['instructor', 'video', 'status', videoStatus.lectureId],
              videoStatus,
            )

            // Show toast notification for completion or failure
            if (videoStatus.status === 'completed') {
              toast({
                title: 'Video Processing Complete',
                description: `Video for lecture ${videoStatus.lectureId} has been processed successfully.`,
              })
            } else if (videoStatus.status === 'failed') {
              toast({
                title: 'Video Processing Failed',
                description: `Failed to process video for lecture ${videoStatus.lectureId}.`,
                variant: 'destructive',
              })
            }
            break
          }

          case 'new_notification': {
            const notification = data.payload as InstructorNotification
            onNewNotification?.(notification)

            // Update notifications cache
            queryClient.setQueryData(
              ['instructor', 'notifications'],
              (oldData: any) => {
                if (!oldData)
                  return { notifications: [notification], unreadCount: 1 }
                return {
                  notifications: [notification, ...oldData.notifications],
                  unreadCount: oldData.unreadCount + 1,
                }
              },
            )

            // Show toast notification
            toast({
              title: notification.title,
              description: notification.message,
            })
            break
          }

          case 'new_message': {
            const message = data.payload as InstructorMessage
            onNewMessage?.(message)

            // Update messages cache
            queryClient.invalidateQueries(['instructor', 'messages'])

            // Show toast notification
            toast({
              title: 'New Message',
              description: `New message from ${message.senderName}`,
            })
            break
          }

          case 'bulk_operation_update': {
            const operation = data.payload as BulkOperation
            onBulkOperationUpdate?.(operation)

            // Update bulk operation status in cache
            queryClient.setQueryData(
              ['instructor', 'bulk-operations', operation.id],
              operation,
            )

            // Show toast notification for completion
            if (operation.status === 'completed') {
              toast({
                title: 'Bulk Operation Complete',
                description: `${operation.type} operation completed successfully.`,
              })
            } else if (operation.status === 'failed') {
              toast({
                title: 'Bulk Operation Failed',
                description: `${operation.type} operation failed.`,
                variant: 'destructive',
              })
            }
            break
          }

          case 'student_activity': {
            const activity = data.payload
            onStudentActivity?.(activity)

            // Invalidate relevant queries
            queryClient.invalidateQueries(['instructor', 'dashboard'])
            queryClient.invalidateQueries(['instructor', 'analytics'])
            break
          }

          default:
            console.warn('Unknown WebSocket message type:', data.type)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    },
    [
      onVideoProcessingUpdate,
      onNewNotification,
      onNewMessage,
      onBulkOperationUpdate,
      onStudentActivity,
      queryClient,
      toast,
    ],
  )

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || isConnecting) {
      return
    }

    setIsConnecting(true)
    setConnectionError(null)

    try {
      const ws = instructorDashboardService.connectToRealTimeUpdates({
        onVideoProcessingUpdate,
        onNewNotification,
        onNewMessage,
        onBulkOperationUpdate,
        onStudentActivity,
      })

      if (!ws) {
        throw new Error('Failed to create WebSocket connection')
      }

      ws.onopen = () => {
        setIsConnected(true)
        setIsConnecting(false)
        setConnectionError(null)
        reconnectAttemptsRef.current = 0
        setReconnectAttempts(0)

        console.log('Instructor WebSocket connected')
      }

      ws.onmessage = handleMessage

      ws.onclose = (event) => {
        setIsConnected(false)
        setIsConnecting(false)
        wsRef.current = null

        if (
          event.code !== 1000 &&
          autoReconnect &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          const delay =
            reconnectDelay * Math.pow(2, reconnectAttemptsRef.current)

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1
            setReconnectAttempts(reconnectAttemptsRef.current)
            connect()
          }, delay)

          console.log(
            `Instructor WebSocket disconnected. Reconnecting in ${delay}ms... (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`,
          )
        } else {
          console.log('Instructor WebSocket disconnected')
        }
      }

      ws.onerror = (error) => {
        setConnectionError('WebSocket connection error')
        setIsConnecting(false)
        console.error('Instructor WebSocket error:', error)
      }

      wsRef.current = ws
    } catch (error) {
      setConnectionError('Failed to establish WebSocket connection')
      setIsConnecting(false)
      console.error('Error creating WebSocket connection:', error)
    }
  }, [
    isConnecting,
    onVideoProcessingUpdate,
    onNewNotification,
    onNewMessage,
    onBulkOperationUpdate,
    onStudentActivity,
    handleMessage,
    autoReconnect,
    reconnectDelay,
    maxReconnectAttempts,
  ])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect')
      wsRef.current = null
    }

    setIsConnected(false)
    setIsConnecting(false)
    setConnectionError(null)
    reconnectAttemptsRef.current = 0
    setReconnectAttempts(0)
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected. Message not sent:', message)
    }
  }, [])

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (enabled && typeof window !== 'undefined') {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    isConnecting,
    connectionError,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
  }
}
