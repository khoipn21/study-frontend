/**
 * useVideoNetworkMonitoring Hook
 *
 * A comprehensive React hook for monitoring video network performance,
 * integrating with HLS.js for adaptive streaming quality, and communicating
 * with the backend Redis message queue system via WebSocket.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { videoService } from '@/lib/video-service'
import { NetworkPerformanceMonitor } from '@/lib/network-detection'
import { DEFAULT_NETWORK_CONFIG } from '@/types/video-network'
import type Hls from 'hls.js'
import type {
  HLSNetworkMetrics,
  NetworkCondition,
  NetworkMetrics,
  NetworkMonitoringConfig,
  VideoNetworkMonitoringReturn,
  VideoQuality,
  VideoQualityInfo,
  VideoSession,
} from '@/types/video-network'

export interface UseVideoNetworkMonitoringOptions {
  /** Video session data from backend */
  session: VideoSession | null
  /** HLS.js instance for monitoring */
  hlsInstance?: Hls | null
  /** Video element for buffer monitoring */
  videoElement?: HTMLVideoElement | null
  /** Network monitoring configuration */
  config?: Partial<NetworkMonitoringConfig>
  /** Enable automatic quality switching */
  enableAutoQuality?: boolean
  /** Callback when quality changes */
  onQualityChange?: (from: VideoQuality, to: VideoQuality) => void
  /** Callback when network condition changes */
  onNetworkConditionChange?: (condition: NetworkCondition) => void
  /** Callback when buffer health changes */
  onBufferHealthChange?: (health: number) => void
  /** Callback for preload instructions */
  onPreloadInstruction?: (segments: Array<string>, priority: string) => void
  /** Enable hook functionality */
  enabled?: boolean
}

export function useVideoNetworkMonitoring(
  options: UseVideoNetworkMonitoringOptions,
): VideoNetworkMonitoringReturn {
  const {
    session,
    hlsInstance,
    videoElement,
    config: userConfig,
    enableAutoQuality = true,
    onQualityChange,
    onNetworkConditionChange,
    onBufferHealthChange,
    onPreloadInstruction,
    enabled = true,
  } = options

  const config = { ...DEFAULT_NETWORK_CONFIG, ...userConfig }
  const { toast } = useToast()

  // Refs for monitoring and WebSocket
  const wsRef = useRef<WebSocket | null>(null)
  const performanceMonitorRef = useRef<NetworkPerformanceMonitor | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const networkCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  // State management
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(
    null,
  )
  const [hlsMetrics, setHlsMetrics] = useState<HLSNetworkMetrics | null>(null)
  const [currentQuality, setCurrentQuality] = useState<VideoQuality>('auto')
  const [recommendedQuality, setRecommendedQuality] =
    useState<VideoQuality | null>(null)
  const [availableQualities, setAvailableQualities] = useState<
    Array<VideoQualityInfo>
  >([])
  const [bufferHealth, setBufferHealth] = useState(0)
  const [bufferLevel, setBufferLevel] = useState(0)
  const [isAutoQualityEnabled, setIsAutoQualityEnabled] =
    useState(enableAutoQuality)
  const [networkCondition, setNetworkCondition] =
    useState<NetworkCondition>('good')

  /**
   * Initialize performance monitor with HLS instance
   */
  useEffect(() => {
    if (!enabled || !hlsInstance || !videoElement) return

    const monitor = new NetworkPerformanceMonitor(hlsInstance, videoElement)
    performanceMonitorRef.current = monitor

    return () => {
      monitor.cleanup()
      performanceMonitorRef.current = null
    }
  }, [enabled, hlsInstance, videoElement])

  /**
   * Update available qualities when session changes
   */
  useEffect(() => {
    if (session?.qualities) {
      setAvailableQualities(session.qualities)
      if (session.recommended_quality) {
        setRecommendedQuality(session.recommended_quality)
      }
    }
  }, [session])

  /**
   * Handle WebSocket messages from video service
   */
  const handleWebSocketMessage = useCallback(
    (event: MessageEvent) => {
      const message = videoService.parseServerMessage(event)
      if (!message) return

      switch (message.type) {
        case 'quality_recommendation': {
          const response = message
          const { recommended_quality, reason, should_switch_immediately } =
            response.data

          setRecommendedQuality(recommended_quality)

          if (isAutoQualityEnabled && should_switch_immediately) {
            const oldQuality = currentQuality
            setCurrentQuality(recommended_quality)
            onQualityChange?.(oldQuality, recommended_quality)

            // Apply quality change to HLS
            if (hlsInstance && recommended_quality !== 'auto') {
              const levelIndex = hlsInstance.levels.findIndex(
                (level) => `${level.height}p` === recommended_quality,
              )
              if (levelIndex >= 0) {
                hlsInstance.currentLevel = levelIndex
              }
            }

            toast({
              title: 'Quality Adjusted',
              description: `Video quality changed to ${recommended_quality} (${reason})`,
            })
          }

          break
        }

        case 'preload': {
          const response = message
          const { segments, priority, quality } = response.data

          onPreloadInstruction?.(segments, priority)

          // Implement preloading logic if needed
          console.log(
            `Preload instruction: ${segments.length} segments at ${quality} quality (${priority} priority)`,
          )
          break
        }

        case 'analytics_event': {
          // Handle analytics events from backend
          console.log('Analytics event received:', message.data)
          break
        }
      }
    },
    [
      currentQuality,
      hlsInstance,
      isAutoQualityEnabled,
      onQualityChange,
      onPreloadInstruction,
      toast,
    ],
  )

  /**
   * Establish WebSocket connection
   */
  const connect = useCallback(() => {
    if (
      !enabled ||
      !session ||
      wsRef.current?.readyState === WebSocket.OPEN ||
      isConnecting
    ) {
      return
    }

    setIsConnecting(true)
    setConnectionError(null)

    try {
      const ws = videoService.createWebSocketConnection(
        session.session_id,
        handleWebSocketMessage,
        (error) => {
          setConnectionError('WebSocket connection error')
          setIsConnecting(false)
          console.error('Video network monitoring WebSocket error:', error)
        },
        (event) => {
          setIsConnected(false)
          setIsConnecting(false)
          wsRef.current = null

          // Auto-reconnect logic
          if (
            event.code !== 1000 &&
            reconnectAttemptsRef.current < config.maxReconnectAttempts
          ) {
            const delay =
              config.reconnectDelay * Math.pow(2, reconnectAttemptsRef.current)

            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current += 1
              connect()
            }, delay)

            console.log(
              `Video network monitoring WebSocket disconnected. Reconnecting in ${delay}ms... (attempt ${reconnectAttemptsRef.current + 1}/${config.maxReconnectAttempts})`,
            )
          }
        },
        () => {
          setIsConnected(true)
          setIsConnecting(false)
          setConnectionError(null)
          reconnectAttemptsRef.current = 0
          console.log('Video network monitoring WebSocket connected')
        },
      )

      wsRef.current = ws
    } catch (error) {
      setConnectionError('Failed to establish WebSocket connection')
      setIsConnecting(false)
      console.error('Error creating WebSocket connection:', error)
    }
  }, [
    enabled,
    session,
    isConnecting,
    handleWebSocketMessage,
    config.maxReconnectAttempts,
    config.reconnectDelay,
  ])

  /**
   * Disconnect WebSocket
   */
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
  }, [])

  /**
   * Send network status update to backend
   */
  const sendNetworkStatusUpdate = useCallback(() => {
    const monitor = performanceMonitorRef.current
    const ws = wsRef.current

    if (!monitor || !ws || !session || !videoElement) return

    const metrics = monitor.getNetworkMetrics()
    const hlsMetrics = monitor.getHLSMetrics()

    videoService.sendNetworkStatusUpdate(ws, session.session_id, {
      bandwidth_mbps: metrics.bandwidth_mbps,
      latency_ms: metrics.latency_ms,
      packet_loss: metrics.packet_loss,
      buffer_health: metrics.buffer_health,
      current_time: videoElement.currentTime,
      current_quality: currentQuality,
      hls_metrics: hlsMetrics,
    })

    // Update local state
    setNetworkMetrics(metrics)
    setHlsMetrics(hlsMetrics)
    setBufferHealth(metrics.buffer_health)
    setBufferLevel(hlsMetrics.buffer_level)

    // Check for network condition changes
    const newCondition = monitor.getNetworkCondition()
    if (newCondition !== networkCondition) {
      setNetworkCondition(newCondition)
      onNetworkConditionChange?.(newCondition)
    }

    // Update buffer health callback
    onBufferHealthChange?.(metrics.buffer_health)
  }, [
    session,
    currentQuality,
    videoElement,
    networkCondition,
    onNetworkConditionChange,
    onBufferHealthChange,
  ])

  /**
   * Manual quality change
   */
  const changeQuality = useCallback(
    async (quality: VideoQuality) => {
      if (!hlsInstance || quality === currentQuality) return

      try {
        const oldQuality = currentQuality
        setCurrentQuality(quality)

        if (quality === 'auto') {
          hlsInstance.currentLevel = -1 // Auto quality
        } else {
          const levelIndex = hlsInstance.levels.findIndex(
            (level) => `${level.height}p` === quality,
          )
          if (levelIndex >= 0) {
            hlsInstance.currentLevel = levelIndex
          }
        }

        // Send quality change to backend
        if (wsRef.current && session) {
          videoService.sendQualityChangeRequest(
            wsRef.current,
            session.session_id,
            {
              requested_quality: quality,
              reason: 'user_preference',
              current_quality: oldQuality,
            },
          )
        }

        onQualityChange?.(oldQuality, quality)

        toast({
          title: 'Quality Changed',
          description: `Video quality set to ${quality}`,
        })
      } catch (error) {
        console.error('Failed to change video quality:', error)
        toast({
          title: 'Quality Change Failed',
          description: 'Failed to change video quality. Please try again.',
          variant: 'destructive',
        })
      }
    },
    [hlsInstance, currentQuality, session, onQualityChange, toast],
  )

  /**
   * Enable automatic quality switching
   */
  const enableAutoQualityControl = useCallback(() => {
    setIsAutoQualityEnabled(true)
    toast({
      title: 'Auto Quality Enabled',
      description:
        'Video quality will automatically adjust based on network conditions.',
    })
  }, [toast])

  /**
   * Disable automatic quality switching
   */
  const disableAutoQualityControl = useCallback(() => {
    setIsAutoQualityEnabled(false)
    toast({
      title: 'Auto Quality Disabled',
      description: 'Video quality will remain fixed at current setting.',
    })
  }, [toast])

  /**
   * Run manual network test
   */
  const runNetworkTest = useCallback(async (): Promise<NetworkMetrics> => {
    try {
      const testResult = await videoService.testNetworkConnectivity()

      const metrics: NetworkMetrics = {
        bandwidth_mbps: testResult.bandwidth_estimate,
        latency_ms: testResult.latency,
        packet_loss: 0, // Not available from simple test
        connection_type: 'unknown',
        quality_score: testResult.connection_stable ? 8 : 4,
        buffer_health: bufferHealth,
        timestamp: new Date().toISOString(),
      }

      setNetworkMetrics(metrics)

      toast({
        title: 'Network Test Complete',
        description: `Bandwidth: ${testResult.bandwidth_estimate.toFixed(1)} Mbps, Latency: ${testResult.latency}ms`,
      })

      return metrics
    } catch (error) {
      console.error('Network test failed:', error)
      toast({
        title: 'Network Test Failed',
        description: 'Unable to complete network test. Please try again.',
        variant: 'destructive',
      })
      throw error
    }
  }, [bufferHealth, toast])

  /**
   * Setup periodic network monitoring
   */
  useEffect(() => {
    if (!enabled || !config.enableWebSocketUpdates) return

    const interval = setInterval(() => {
      sendNetworkStatusUpdate()
    }, config.bandwidthCheckInterval)

    networkCheckIntervalRef.current = interval

    return () => {
      if (networkCheckIntervalRef.current) {
        clearInterval(networkCheckIntervalRef.current)
        networkCheckIntervalRef.current = null
      }
    }
  }, [
    enabled,
    config.enableWebSocketUpdates,
    config.bandwidthCheckInterval,
    sendNetworkStatusUpdate,
  ])

  /**
   * Setup heartbeat for WebSocket connection
   */
  useEffect(() => {
    if (!isConnected || !session || !videoElement) return

    const interval = setInterval(() => {
      if (wsRef.current) {
        videoService.sendHeartbeat(
          wsRef.current,
          session.session_id,
          session.video_id,
          videoElement.currentTime,
          currentQuality,
          bufferLevel,
        )
      }
    }, config.websocketHeartbeatInterval)

    heartbeatIntervalRef.current = interval

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
        heartbeatIntervalRef.current = null
      }
    }
  }, [
    isConnected,
    session,
    videoElement,
    currentQuality,
    bufferLevel,
    config.websocketHeartbeatInterval,
  ])

  /**
   * Auto-connect on mount and session change
   */
  useEffect(() => {
    if (enabled && session) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, session, connect, disconnect])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      disconnect()

      if (networkCheckIntervalRef.current) {
        clearInterval(networkCheckIntervalRef.current)
      }

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }

      if (performanceMonitorRef.current) {
        performanceMonitorRef.current.cleanup()
      }
    }
  }, [disconnect])

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionError,

    // Network metrics
    networkMetrics,
    networkCondition,
    hlsMetrics,

    // Video quality
    currentQuality,
    recommendedQuality,
    availableQualities,

    // Buffer management
    bufferHealth,
    bufferLevel,

    // Controls
    changeQuality,
    enableAutoQuality: enableAutoQualityControl,
    disableAutoQuality: disableAutoQualityControl,
    isAutoQualityEnabled,

    // Manual network test
    runNetworkTest,

    // Connection management
    connect,
    disconnect,
  }
}
