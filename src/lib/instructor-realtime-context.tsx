import React, { createContext, useContext, useState } from 'react'

import { useInstructorWebSocket } from '@/hooks/useInstructorWebSocket'

import type {
  BulkOperation,
  InstructorNotification,
  VideoProcessingStatus,
} from './instructor-dashboard'

interface RealTimeState {
  videoProcessingUpdates: Map<string, VideoProcessingStatus>
  activeNotifications: Array<InstructorNotification>
  unreadMessageCount: number
  activeBulkOperations: Map<string, BulkOperation>
  studentActivityFeed: Array<any>
  connectionStatus: {
    isConnected: boolean
    isConnecting: boolean
    error: string | null
    reconnectAttempts: number
  }
}

interface RealTimeActions {
  markNotificationAsRead: (notificationId: string) => void
  markAllNotificationsAsRead: () => void
  dismissVideoProcessingUpdate: (lectureId: string) => void
  clearStudentActivityFeed: () => void
  reconnect: () => void
  disconnect: () => void
}

interface InstructorRealTimeContextValue
  extends RealTimeState,
    RealTimeActions {}

const InstructorRealTimeContext =
  createContext<InstructorRealTimeContextValue | null>(null)

interface InstructorRealTimeProviderProps {
  children: React.ReactNode
  enabled?: boolean
}

export function InstructorRealTimeProvider({
  children,
  enabled = true,
}: InstructorRealTimeProviderProps) {
  // Real-time state
  const [videoProcessingUpdates, setVideoProcessingUpdates] = useState<
    Map<string, VideoProcessingStatus>
  >(new Map())
  const [activeNotifications, setActiveNotifications] = useState<
    Array<InstructorNotification>
  >([])
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [activeBulkOperations, setActiveBulkOperations] = useState<
    Map<string, BulkOperation>
  >(new Map())
  const [studentActivityFeed, setStudentActivityFeed] = useState<Array<any>>([])

  // WebSocket connection
  const {
    isConnected,
    isConnecting,
    connectionError,
    reconnectAttempts,
    connect,
    disconnect,
  } = useInstructorWebSocket({
    enabled,
    onVideoProcessingUpdate: (status) => {
      setVideoProcessingUpdates((prev) => {
        const updated = new Map(prev)
        updated.set(status.lectureId, status)
        return updated
      })

      // Auto-dismiss completed or failed processing updates after 30 seconds
      if (status.status === 'completed' || status.status === 'failed') {
        setTimeout(() => {
          setVideoProcessingUpdates((prev) => {
            const updated = new Map(prev)
            updated.delete(status.lectureId)
            return updated
          })
        }, 30000)
      }
    },
    onNewNotification: (notification) => {
      setActiveNotifications((prev) => {
        // Remove duplicate notifications and add new one to the top
        const filtered = prev.filter((n) => n.id !== notification.id)
        return [notification, ...filtered].slice(0, 10) // Keep only latest 10
      })
    },
    onNewMessage: () => {
      setUnreadMessageCount((prev) => prev + 1)
    },
    onBulkOperationUpdate: (operation) => {
      setActiveBulkOperations((prev) => {
        const updated = new Map(prev)
        if (operation.status === 'completed' || operation.status === 'failed') {
          // Auto-remove completed/failed operations after 60 seconds
          setTimeout(() => {
            setActiveBulkOperations((current) => {
              const newMap = new Map(current)
              newMap.delete(operation.id)
              return newMap
            })
          }, 60000)
        }
        updated.set(operation.id, operation)
        return updated
      })
    },
    onStudentActivity: (activity) => {
      setStudentActivityFeed((prev) => {
        const updated = [activity, ...prev].slice(0, 50) // Keep only latest 50 activities
        return updated
      })
    },
    autoReconnect: true,
    reconnectDelay: 3000,
    maxReconnectAttempts: 5,
  })

  // Actions
  const markNotificationAsRead = (notificationId: string) => {
    setActiveNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    )
  }

  const markAllNotificationsAsRead = () => {
    setActiveNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    )
  }

  const dismissVideoProcessingUpdate = (lectureId: string) => {
    setVideoProcessingUpdates((prev) => {
      const updated = new Map(prev)
      updated.delete(lectureId)
      return updated
    })
  }

  const clearStudentActivityFeed = () => {
    setStudentActivityFeed([])
  }

  const reconnect = () => {
    connect()
  }

  // Context value
  const contextValue: InstructorRealTimeContextValue = {
    // State
    videoProcessingUpdates,
    activeNotifications,
    unreadMessageCount,
    activeBulkOperations,
    studentActivityFeed,
    connectionStatus: {
      isConnected,
      isConnecting,
      error: connectionError,
      reconnectAttempts,
    },
    // Actions
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissVideoProcessingUpdate,
    clearStudentActivityFeed,
    reconnect,
    disconnect,
  }

  return (
    <InstructorRealTimeContext.Provider value={contextValue}>
      {children}
    </InstructorRealTimeContext.Provider>
  )
}

export function useInstructorRealTime() {
  const context = useContext(InstructorRealTimeContext)

  if (!context) {
    throw new Error(
      'useInstructorRealTime must be used within an InstructorRealTimeProvider',
    )
  }

  return context
}

// Hook for video processing status
export function useVideoProcessingStatus(lectureId?: string) {
  const { videoProcessingUpdates, dismissVideoProcessingUpdate } =
    useInstructorRealTime()

  const status = lectureId ? videoProcessingUpdates.get(lectureId) : null
  const dismiss = () => {
    if (lectureId) {
      dismissVideoProcessingUpdate(lectureId)
    }
  }

  return { status, dismiss }
}

// Hook for bulk operations
export function useBulkOperations() {
  const { activeBulkOperations } = useInstructorRealTime()

  const operations = Array.from(activeBulkOperations.values())
  const activeOperations = operations.filter((op) => op.status === 'processing')
  const completedOperations = operations.filter(
    (op) => op.status === 'completed',
  )
  const failedOperations = operations.filter((op) => op.status === 'failed')

  return {
    operations,
    activeOperations,
    completedOperations,
    failedOperations,
    hasActiveOperations: activeOperations.length > 0,
  }
}

// Hook for real-time notifications
export function useRealTimeNotifications() {
  const {
    activeNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useInstructorRealTime()

  const unreadNotifications = activeNotifications.filter((n) => !n.isRead)
  const readNotifications = activeNotifications.filter((n) => n.isRead)

  return {
    notifications: activeNotifications,
    unreadNotifications,
    readNotifications,
    unreadCount: unreadNotifications.length,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
  }
}

// Hook for student activity feed
export function useStudentActivityFeed() {
  const { studentActivityFeed, clearStudentActivityFeed } =
    useInstructorRealTime()

  return {
    activities: studentActivityFeed,
    clearFeed: clearStudentActivityFeed,
    latestActivity: studentActivityFeed[0],
    activityCount: studentActivityFeed.length,
  }
}

// Hook for connection status
export function useConnectionStatus() {
  const { connectionStatus, reconnect, disconnect } = useInstructorRealTime()

  return {
    ...connectionStatus,
    reconnect,
    disconnect,
  }
}
