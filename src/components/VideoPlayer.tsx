import Hls from 'hls.js'
import {
  Activity,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  ConnectionStatus,
  NetworkStatusIndicator,
} from '@/components/ui/network-status-indicator'
import { QualityBadge, QualitySelector } from '@/components/ui/quality-selector'
import { Slider } from '@/components/ui/slider'
import { useVideoNetworkMonitoring } from '@/hooks/useVideoNetworkMonitoring'
import { cn } from '@/lib/utils'
import { videoService } from '@/lib/video-service'

import type {
  NetworkCondition,
  NetworkMonitoringConfig,
  VideoQuality,
  VideoSession,
} from '@/types/video-network'

export interface VideoPlayerProps {
  src?: string
  title?: string
  poster?: string
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onProgress?: (percentage: number) => void
  className?: string

  // Network monitoring props
  /** Video ID for backend session management */
  videoId?: string
  /** Video session data from backend */
  session?: VideoSession | null
  /** Enable network monitoring and adaptive streaming */
  enableNetworkMonitoring?: boolean
  /** Network monitoring configuration */
  networkConfig?: Partial<NetworkMonitoringConfig>
  /** Enable automatic quality switching */
  enableAutoQuality?: boolean
  /** Show network status indicator */
  showNetworkStatus?: boolean
  /** Show quality selector */
  showQualitySelector?: boolean
  /** Compact network controls */
  compactNetworkControls?: boolean
  /** Authentication token for video service */
  authToken?: string

  // Network event callbacks
  onQualityChange?: (from: VideoQuality, to: VideoQuality) => void
  onNetworkConditionChange?: (condition: NetworkCondition) => void
  onBufferHealthChange?: (health: number) => void
}

export function VideoPlayer({
  src,
  title,
  poster,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  onProgress,
  className,

  // Network monitoring props
  // videoId, // Used for session identification (reserved for future use)
  session,
  enableNetworkMonitoring = false,
  networkConfig,
  enableAutoQuality = true,
  showNetworkStatus = false,
  showQualitySelector = false,
  compactNetworkControls = false,
  authToken,

  // Network event callbacks
  onQualityChange,
  onNetworkConditionChange,
  onBufferHealthChange,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  // Player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHlsStream, setIsHlsStream] = useState(false)
  const [showNetworkPanel, setShowNetworkPanel] = useState(false)

  // Auto-hide controls timer
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Initialize video service with auth token
  useEffect(() => {
    if (authToken) {
      videoService.setAuthToken(authToken)
    }
  }, [authToken])

  // Network monitoring integration
  const networkMonitoring = useVideoNetworkMonitoring({
    session: session || null,
    hlsInstance: hlsRef.current,
    videoElement: videoRef.current,
    config: networkConfig,
    enableAutoQuality,
    onQualityChange: (from, to) => {
      console.log(`Video quality changed from ${from} to ${to}`)
      onQualityChange?.(from, to)
    },
    onNetworkConditionChange: (condition) => {
      console.log(`Network condition changed to ${condition}`)
      onNetworkConditionChange?.(condition)
    },
    onBufferHealthChange: (health) => {
      console.log(`Buffer health: ${health}s`)
      onBufferHealthChange?.(health)
    },
    enabled: enableNetworkMonitoring && !!session,
  })

  // Helper function to check if URL is M3U8
  const isM3U8 = useCallback((url?: string) => {
    if (!url) return false
    return url.includes('.m3u8') || url.includes('manifest')
  }, [])

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }, [isPlaying])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return

    setIsMuted(!isMuted)
    videoRef.current.muted = !isMuted
  }, [isMuted])

  // Update volume
  const handleVolumeChange = useCallback((value: Array<number>) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    setIsMuted(newVolume === 0)

    if (videoRef.current) {
      videoRef.current.volume = newVolume
      videoRef.current.muted = newVolume === 0
    }
  }, [])

  // Seek to time
  const handleSeek = useCallback(
    (value: Array<number>) => {
      const seekTime = (value[0] / 100) * duration
      setCurrentTime(seekTime)

      if (videoRef.current) {
        videoRef.current.currentTime = seekTime
      }
    },
    [duration],
  )

  // Skip backward/forward
  const skipBackward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, currentTime - 10)
    }
  }, [currentTime])

  const skipForward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, currentTime + 10)
    }
  }, [currentTime, duration])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }, [isFullscreen])

  // Change playback rate
  const changePlaybackRate = useCallback((rate: number) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }, [])

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Show controls temporarily
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true)

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }

    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying])

  // Initialize HLS when src changes
  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) {
      setError(null)
      setIsHlsStream(false)
      return
    }

    // Cleanup existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    const isHls = isM3U8(src)
    setIsHlsStream(isHls)
    setError(null)

    if (isHls && Hls.isSupported()) {
      // Use HLS.js for M3U8 streams
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90,
      })

      hlsRef.current = hls

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed, video ready to play')
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error('HLS Error:', data)
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error: Failed to load video stream')
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error: Video format not supported')
              hls.recoverMediaError()
              break
            default:
              setError('Fatal error: Unable to play video')
              hls.destroy()
              break
          }
        }
      })
    } else if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = src
    } else if (!isHls) {
      // Regular video files
      video.src = src
    } else {
      setError('HLS streaming is not supported in this browser')
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [src, isM3U8])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      const current = video.currentTime
      const total = video.duration

      setCurrentTime(current)

      if (onTimeUpdate) {
        onTimeUpdate(current, total)
      }

      if (onProgress && total > 0) {
        const progressPercent = (current / total) * 100
        onProgress(progressPercent)
      }
    }

    const handlePlay = () => {
      setIsPlaying(true)
      setIsBuffering(false)
      onPlay?.()
    }

    const handlePause = () => {
      setIsPlaying(false)
      setIsBuffering(false)
      onPause?.()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handleCanPlay = () => {
      setIsBuffering(false)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [onTimeUpdate, onPlay, onPause, onEnded, onProgress])

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'ArrowLeft':
          e.preventDefault()
          skipBackward()
          break
        case 'ArrowRight':
          e.preventDefault()
          skipForward()
          break
        case 'ArrowUp':
          e.preventDefault()
          handleVolumeChange([Math.min(100, volume * 100 + 10)])
          break
        case 'ArrowDown':
          e.preventDefault()
          handleVolumeChange([Math.max(0, volume * 100 - 10)])
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    togglePlay,
    toggleMute,
    toggleFullscreen,
    skipBackward,
    skipForward,
    volume,
    handleVolumeChange,
  ])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-lg overflow-hidden group',
        'focus-within:ring-2 focus-within:ring-primary',
        className,
      )}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        preload="metadata"
      />

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center space-y-4 text-white max-w-md text-center p-6">
            <div className="text-red-400 text-xl">⚠️</div>
            <p className="text-lg font-semibold">Video Load Error</p>
            <p className="text-sm text-gray-300">{error}</p>
            <Button
              onClick={() => {
                setError(null)
                if (src) {
                  // Force re-initialization by reloading the page
                  setTimeout(() => {
                    window.location.reload()
                  }, 100)
                }
              }}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Loading/Buffering State */}
      {(isBuffering || !src) && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center space-y-4 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            <p className="text-sm">
              {!src ? 'Video đang được chuẩn bị...' : 'Đang tải...'}
              {isHlsStream && (
                <span className="block text-xs text-gray-300">HLS Stream</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && !isBuffering && src && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Button
            onClick={togglePlay}
            size="lg"
            className="h-16 w-16 rounded-full bg-white/90 hover:bg-white text-black hover:text-black"
          >
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4',
          'transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="cursor-pointer"
            />
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Play/Pause */}
              <Button
                onClick={togglePlay}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              {/* Skip Controls */}
              <Button
                onClick={skipBackward}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                title="Lùi 10s"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button
                onClick={skipForward}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                title="Tới 10s"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleMute}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="w-20 hidden sm:block">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              {/* Time */}
              <div className="text-white text-sm font-mono hidden sm:block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(Number(e.target.value))}
                className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-white/20 hidden sm:block"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              {/* Network Status (compact) */}
              {enableNetworkMonitoring &&
                showNetworkStatus &&
                compactNetworkControls && (
                  <ConnectionStatus
                    isConnected={networkMonitoring.isConnected}
                    isConnecting={networkMonitoring.isConnecting}
                    connectionError={networkMonitoring.connectionError}
                    className="hidden sm:flex"
                  />
                )}

              {/* Quality Badge (compact) */}
              {enableNetworkMonitoring &&
                showQualitySelector &&
                compactNetworkControls && (
                  <QualityBadge
                    currentQuality={networkMonitoring.currentQuality}
                    recommendedQuality={networkMonitoring.recommendedQuality}
                    isAutoEnabled={networkMonitoring.isAutoQualityEnabled}
                    className="hidden sm:flex"
                  />
                )}

              {/* Network Panel Toggle */}
              {enableNetworkMonitoring &&
                (showNetworkStatus || showQualitySelector) &&
                !compactNetworkControls && (
                  <Button
                    onClick={() => setShowNetworkPanel(!showNetworkPanel)}
                    size="sm"
                    variant="ghost"
                    className={cn(
                      'text-white hover:bg-white/20 hidden sm:flex',
                      showNetworkPanel && 'bg-white/20',
                    )}
                    title="Network monitoring"
                  >
                    <Activity
                      className={cn('h-4 w-4', {
                        'text-green-400': networkMonitoring.isConnected,
                        'text-yellow-400': networkMonitoring.isConnecting,
                        'text-red-400':
                          !networkMonitoring.isConnected &&
                          !networkMonitoring.isConnecting,
                      })}
                    />
                  </Button>
                )}

              {/* Settings */}
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 hidden sm:flex"
              >
                <Settings className="h-4 w-4" />
              </Button>

              {/* Fullscreen */}
              <Button
                onClick={toggleFullscreen}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Title */}
      {title && (
        <div className="absolute top-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold line-clamp-2 bg-black/50 p-2 rounded">
            {title}
          </h3>
        </div>
      )}

      {/* Network Monitoring Panel */}
      {enableNetworkMonitoring &&
        showNetworkPanel &&
        !compactNetworkControls && (
          <div className="absolute top-4 right-4 max-w-sm">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 space-y-4">
              {/* Network Status */}
              {showNetworkStatus && (
                <NetworkStatusIndicator
                  condition={networkMonitoring.networkCondition}
                  metrics={networkMonitoring.networkMetrics}
                  isConnected={networkMonitoring.isConnected}
                  connectionError={networkMonitoring.connectionError}
                  showDetails={false}
                  onRunNetworkTest={async () => {
                    await networkMonitoring.runNetworkTest()
                  }}
                  className="bg-white/10"
                />
              )}

              {/* Quality Selector */}
              {showQualitySelector && (
                <QualitySelector
                  currentQuality={networkMonitoring.currentQuality}
                  availableQualities={networkMonitoring.availableQualities}
                  recommendedQuality={networkMonitoring.recommendedQuality}
                  networkCondition={networkMonitoring.networkCondition}
                  isAutoQualityEnabled={networkMonitoring.isAutoQualityEnabled}
                  onQualityChange={networkMonitoring.changeQuality}
                  onAutoQualityToggle={(enabled) => {
                    if (enabled) {
                      networkMonitoring.enableAutoQuality()
                    } else {
                      networkMonitoring.disableAutoQuality()
                    }
                  }}
                  className="text-white"
                />
              )}
            </div>
          </div>
        )}

      {/* Mobile Network Controls */}
      {enableNetworkMonitoring &&
        (showNetworkStatus || showQualitySelector) && (
          <div className="sm:hidden absolute bottom-20 left-4 right-4">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center justify-between">
                {/* Mobile Network Status */}
                {showNetworkStatus && (
                  <NetworkStatusIndicator
                    condition={networkMonitoring.networkCondition}
                    metrics={networkMonitoring.networkMetrics}
                    isConnected={networkMonitoring.isConnected}
                    connectionError={networkMonitoring.connectionError}
                    compact={true}
                    className="bg-white/10"
                  />
                )}

                {/* Mobile Quality Control */}
                {showQualitySelector && (
                  <QualitySelector
                    currentQuality={networkMonitoring.currentQuality}
                    availableQualities={networkMonitoring.availableQualities}
                    recommendedQuality={networkMonitoring.recommendedQuality}
                    networkCondition={networkMonitoring.networkCondition}
                    isAutoQualityEnabled={
                      networkMonitoring.isAutoQualityEnabled
                    }
                    onQualityChange={networkMonitoring.changeQuality}
                    onAutoQualityToggle={(enabled) => {
                      if (enabled) {
                        networkMonitoring.enableAutoQuality()
                      } else {
                        networkMonitoring.disableAutoQuality()
                      }
                    }}
                    compact={true}
                    className="text-white"
                  />
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
