/**
 * Adaptive Video Player Example
 *
 * This component demonstrates how to use the enhanced VideoPlayer
 * with network monitoring and adaptive streaming capabilities.
 *
 * Features demonstrated:
 * - Network connectivity monitoring
 * - Adaptive quality switching
 * - Real-time network condition display
 * - Manual quality selection
 * - WebSocket integration with backend Redis message queue
 */

import { useEffect, useState } from 'react'
import { videoService } from '@/lib/video-service'
import { useToast } from '@/hooks/use-toast'
import { VideoPlayer } from './VideoPlayer'
import type {
  NetworkCondition,
  NetworkMonitoringConfig,
  VideoQuality,
  VideoSession,
} from '@/types/video-network'

export interface AdaptiveVideoPlayerProps {
  /** Video ID for backend identification */
  videoId: string
  /** Video source URL (HLS stream) */
  src: string
  /** Video title */
  title?: string
  /** Video poster image */
  poster?: string
  /** Authentication token */
  authToken?: string
  /** Custom network monitoring configuration */
  networkConfig?: Partial<NetworkMonitoringConfig>
  /** Show advanced network controls */
  showAdvancedControls?: boolean
  /** Compact mode for mobile */
  compactMode?: boolean
  /** Custom className */
  className?: string
}

export function AdaptiveVideoPlayer({
  videoId,
  src,
  title,
  poster,
  authToken,
  networkConfig,
  showAdvancedControls = true,
  compactMode = false,
  className,
}: AdaptiveVideoPlayerProps) {
  const { toast } = useToast()
  const [session, setSession] = useState<VideoSession | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  /**
   * Initialize video session with backend
   */
  useEffect(() => {
    const initializeSession = async () => {
      if (!videoId) return

      setIsLoadingSession(true)
      setSessionError(null)

      try {
        // Set auth token if provided
        if (authToken) {
          videoService.setAuthToken(authToken)
        }

        // Get device info for session creation
        const deviceInfo = {
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          connection_type: getConnectionType(),
        }

        // Start viewing session with backend
        const sessionData = await videoService.startViewingSession(
          videoId,
          deviceInfo,
        )

        setSession(sessionData)

        toast({
          title: 'Video Session Started',
          description: 'Connected to adaptive streaming service',
        })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        setSessionError(errorMessage)
        console.error('Failed to initialize video session:', error)

        toast({
          title: 'Session Error',
          description:
            'Failed to connect to streaming service. Some features may be limited.',
          variant: 'destructive',
        })
      } finally {
        setIsLoadingSession(false)
      }
    }

    initializeSession()
  }, [videoId, authToken, toast])

  /**
   * Detect connection type using Network Information API
   */
  const getConnectionType = (): string => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      return connection?.effectiveType || 'unknown'
    }
    return 'unknown'
  }

  /**
   * Handle quality changes
   */
  const handleQualityChange = (from: VideoQuality, to: VideoQuality) => {
    console.log(`Video quality changed from ${from} to ${to}`)

    toast({
      title: 'Quality Updated',
      description: `Video quality changed from ${from} to ${to}`,
    })
  }

  /**
   * Handle network condition changes
   */
  const handleNetworkConditionChange = (condition: NetworkCondition) => {
    console.log(`Network condition changed to: ${condition}`)

    const conditionMessages = {
      excellent: 'Network conditions are excellent!',
      good: 'Network conditions are good',
      fair: 'Network conditions are fair',
      poor: 'Network conditions are poor - quality may be reduced',
      very_poor: 'Network conditions are very poor - expect interruptions',
    }

    // Show warning for poor conditions
    if (condition === 'poor' || condition === 'very_poor') {
      toast({
        title: 'Network Warning',
        description: conditionMessages[condition],
        variant: 'destructive',
      })
    }
  }

  /**
   * Handle buffer health changes
   */
  const handleBufferHealthChange = (health: number) => {
    // Show warning if buffer is getting low
    if (health < 3) {
      console.warn(`Low buffer health: ${health}s`)
    }
  }

  // Show loading state
  if (isLoadingSession) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
            <p>Initializing adaptive streaming...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (sessionError && !session) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <VideoPlayer
          src={src}
          title={title}
          poster={poster}
          className={className}
          // Network monitoring disabled due to session error
          enableNetworkMonitoring={false}
        />
        <div className="absolute top-4 right-4">
          <div className="bg-red-900/80 text-white p-3 rounded-lg text-sm max-w-xs">
            <p className="font-semibold">Adaptive Streaming Unavailable</p>
            <p>Fallback to basic playback. Error: {sessionError}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <VideoPlayer
      src={src}
      title={title}
      poster={poster}
      className={className}
      // Network monitoring configuration
      enableNetworkMonitoring={!!session}
      session={session}
      networkConfig={networkConfig}
      enableAutoQuality={true}
      // UI configuration
      showNetworkStatus={showAdvancedControls}
      showQualitySelector={showAdvancedControls}
      compactNetworkControls={compactMode}
      // Authentication
      authToken={authToken}
      // Event handlers
      onQualityChange={handleQualityChange}
      onNetworkConditionChange={handleNetworkConditionChange}
      onBufferHealthChange={handleBufferHealthChange}
    />
  )
}

/**
 * Example usage component showing different configurations
 */
export function AdaptiveVideoPlayerExamples() {
  const sampleVideoId = 'example-video-123'
  const sampleHlsUrl =
    'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Adaptive Video Player Examples</h2>

      {/* Full Featured Player */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Full Featured Player</h3>
        <p className="text-gray-600">
          Complete adaptive streaming with network monitoring, quality controls,
          and real-time analytics.
        </p>
        <AdaptiveVideoPlayer
          videoId={sampleVideoId}
          src={sampleHlsUrl}
          title="Tears of Steel - Full Featured"
          showAdvancedControls={true}
          networkConfig={{
            enableAutoQualitySwitching: true,
            bandwidthCheckInterval: 10000,
            bufferTargetSeconds: 15,
          }}
        />
      </div>

      {/* Compact Mobile Player */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Compact Mobile Player</h3>
        <p className="text-gray-600">
          Optimized for mobile with compact network controls and efficient
          monitoring.
        </p>
        <AdaptiveVideoPlayer
          videoId={`${sampleVideoId}-mobile`}
          src={sampleHlsUrl}
          title="Tears of Steel - Mobile"
          showAdvancedControls={true}
          compactMode={true}
          networkConfig={{
            enableAutoQualitySwitching: true,
            bandwidthCheckInterval: 15000,
            bufferTargetSeconds: 10,
          }}
        />
      </div>

      {/* Basic Player with Network Monitoring */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          Basic Player with Network Monitoring
        </h3>
        <p className="text-gray-600">
          Simple player with background network monitoring, no visible controls.
        </p>
        <AdaptiveVideoPlayer
          videoId={`${sampleVideoId}-basic`}
          src={sampleHlsUrl}
          title="Tears of Steel - Basic"
          showAdvancedControls={false}
          networkConfig={{
            enableAutoQualitySwitching: true,
            bandwidthCheckInterval: 20000,
          }}
        />
      </div>

      {/* Development Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">Integration Notes:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Requires backend video service running on port 8085</li>
          <li>
            • Redis message queue must be configured for WebSocket communication
          </li>
          <li>• Authentication token should be provided for production use</li>
          <li>
            • Network conditions adapt automatically based on HLS.js performance
          </li>
          <li>• Quality recommendations come from backend AI analysis</li>
        </ul>
      </div>
    </div>
  )
}

export default AdaptiveVideoPlayer
