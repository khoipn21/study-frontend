/**
 * Network Detection Utilities
 *
 * Utilities for detecting network conditions, measuring performance,
 * and integrating with HLS.js for bandwidth estimation and adaptive
 * streaming quality recommendations.
 */

import Hls from 'hls.js'
import {
  calculateQualityScore,
  getNetworkCondition,
  recommendQualityFromScore,
} from '@/types/video-network'
import type {
  ConnectionType,
  HLSNetworkMetrics,
  NetworkCondition,
  NetworkMetrics,
  VideoQuality,
  VideoQualityInfo,
} from '@/types/video-network'

/**
 * Network Performance Monitor
 *
 * Handles detection of network conditions, bandwidth measurement,
 * and integration with HLS.js for adaptive streaming.
 */
export class NetworkPerformanceMonitor {
  private hls: Hls | null = null
  private video: HTMLVideoElement | null = null
  private performanceData: {
    fragmentLoadTimes: Array<number>
    fragmentSizes: Array<number>
    bandwidthEstimates: Array<number>
    latencyMeasurements: Array<number>
    errorCounts: number
    droppedFrames: number
  } = {
    fragmentLoadTimes: [],
    fragmentSizes: [],
    bandwidthEstimates: [],
    latencyMeasurements: [],
    errorCounts: 0,
    droppedFrames: 0,
  }

  constructor(hls?: Hls, video?: HTMLVideoElement) {
    if (hls) this.attachHLS(hls)
    if (video) this.attachVideo(video)
  }

  /**
   * Attach HLS.js instance for monitoring
   */
  attachHLS(hls: Hls): void {
    this.hls = hls
    this.setupHLSEventListeners()
  }

  /**
   * Attach video element for monitoring
   */
  attachVideo(video: HTMLVideoElement): void {
    this.video = video
  }

  /**
   * Setup HLS.js event listeners for performance monitoring
   */
  private setupHLSEventListeners(): void {
    if (!this.hls) return

    // Monitor fragment loading performance
    this.hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
      const stats = (data as any).stats
      if (stats?.loading) {
        const loadTime = stats.loading.end - stats.loading.start
        const fragmentSize = stats.total || 0

        this.performanceData.fragmentLoadTimes.push(loadTime)
        this.performanceData.fragmentSizes.push(fragmentSize)

        // Calculate bandwidth estimate from this fragment
        if (loadTime > 0) {
          const bandwidthBps = (fragmentSize * 8) / (loadTime / 1000) // bits per second
          const bandwidthMbps = bandwidthBps / (1024 * 1024) // Mbps
          this.performanceData.bandwidthEstimates.push(bandwidthMbps)
        }

        // Keep rolling window of recent data
        const maxSamples = 20
        if (this.performanceData.fragmentLoadTimes.length > maxSamples) {
          this.performanceData.fragmentLoadTimes.shift()
          this.performanceData.fragmentSizes.shift()
        }
        if (this.performanceData.bandwidthEstimates.length > maxSamples) {
          this.performanceData.bandwidthEstimates.shift()
        }
      }
    })

    // Monitor errors
    this.hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        this.performanceData.errorCounts++
      }
    })

    // Monitor level switching
    this.hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
      console.log('HLS quality level switched:', data.level)
    })

    // Monitor buffer events
    this.hls.on(Hls.Events.BUFFER_APPENDED, () => {
      // Track buffer health
    })
  }

  /**
   * Detect connection type using Network Information API
   */
  detectConnectionType(): ConnectionType {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        const effectiveType = connection.effectiveType
        switch (effectiveType) {
          case 'slow-2g':
            return 'slow-2g'
          case '2g':
            return '2g'
          case '3g':
            return '3g'
          case '4g':
            return '4g'
          case '5g':
            return '5g'
          default:
            return 'unknown'
        }
      }
    }

    // Fallback detection based on bandwidth
    const bandwidth = this.getBandwidthEstimate()
    if (bandwidth < 0.5) return '2g'
    if (bandwidth < 1.5) return '3g'
    if (bandwidth < 10) return '4g'
    return 'wifi' // Assume wifi for high bandwidth
  }

  /**
   * Get current bandwidth estimate from recent measurements
   */
  getBandwidthEstimate(): number {
    if (this.performanceData.bandwidthEstimates.length === 0) {
      return 1.0 // Default fallback
    }

    // Use median of recent measurements for stability
    const sorted = [...this.performanceData.bandwidthEstimates].sort(
      (a, b) => a - b,
    )
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid]
  }

  /**
   * Get average latency from recent measurements
   */
  getLatencyEstimate(): number {
    if (this.performanceData.latencyMeasurements.length === 0) {
      return 100 // Default fallback
    }

    const sum = this.performanceData.latencyMeasurements.reduce(
      (a, b) => a + b,
      0,
    )
    return sum / this.performanceData.latencyMeasurements.length
  }

  /**
   * Calculate packet loss estimate from loading errors
   */
  getPacketLossEstimate(): number {
    const totalRequests =
      this.performanceData.fragmentLoadTimes.length +
      this.performanceData.errorCounts
    if (totalRequests === 0) return 0

    return this.performanceData.errorCounts / totalRequests
  }

  /**
   * Get current buffer health
   */
  getBufferHealth(): number {
    if (!this.video) return 5 // Default fallback

    const buffered = this.video.buffered
    const currentTime = this.video.currentTime

    if (buffered.length === 0) return 0

    // Find the buffer range containing current time
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i)
      const end = buffered.end(i)

      if (currentTime >= start && currentTime <= end) {
        return Math.max(0, end - currentTime)
      }
    }

    return 0
  }

  /**
   * Get HLS-specific network metrics
   */
  getHLSMetrics(): HLSNetworkMetrics {
    const recentLoadTimes = this.performanceData.fragmentLoadTimes.slice(-5)
    const recentSizes = this.performanceData.fragmentSizes.slice(-5)
    const recentLatency = this.performanceData.latencyMeasurements.slice(-5)

    const avgLoadTime =
      recentLoadTimes.length > 0
        ? recentLoadTimes.reduce((a, b) => a + b, 0) / recentLoadTimes.length
        : 1000

    const avgSize =
      recentSizes.length > 0
        ? recentSizes.reduce((a, b) => a + b, 0) / recentSizes.length
        : 500000

    const avgLatency =
      recentLatency.length > 0
        ? recentLatency.reduce((a, b) => a + b, 0) / recentLatency.length
        : 100

    return {
      fragment_load_time: avgLoadTime,
      fragment_size: avgSize,
      fragment_bandwidth: this.getBandwidthEstimate(),
      ttfb: avgLatency,
      buffer_level: this.getBufferHealth(),
      dropped_frames: this.getDroppedFrames(),
      loading_errors: this.performanceData.errorCounts,
    }
  }

  /**
   * Get dropped frames count (if available)
   */
  private getDroppedFrames(): number {
    if (!this.video) return 0

    // Try to get dropped frames from video element (if supported)
    const videoElement = this.video as any
    if (videoElement.getVideoPlaybackQuality) {
      const quality = videoElement.getVideoPlaybackQuality()
      return quality.droppedVideoFrames || 0
    }

    return 0
  }

  /**
   * Generate comprehensive network metrics
   */
  getNetworkMetrics(): NetworkMetrics {
    const bandwidth_mbps = this.getBandwidthEstimate()
    const latency_ms = this.getLatencyEstimate()
    const packet_loss = this.getPacketLossEstimate()
    const connection_type = this.detectConnectionType()
    const buffer_health = this.getBufferHealth()

    const quality_score = calculateQualityScore({
      bandwidth_mbps,
      latency_ms,
      packet_loss,
      buffer_health,
    })

    return {
      bandwidth_mbps,
      latency_ms,
      packet_loss,
      connection_type,
      quality_score,
      buffer_health,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Get network condition based on current metrics
   */
  getNetworkCondition(): NetworkCondition {
    const metrics = this.getNetworkMetrics()
    return getNetworkCondition(metrics.quality_score)
  }

  /**
   * Recommend optimal quality based on current network conditions
   */
  recommendQuality(availableQualities: Array<VideoQualityInfo>): VideoQuality {
    const metrics = this.getNetworkMetrics()
    return recommendQualityFromScore(metrics.quality_score, availableQualities)
  }

  /**
   * Check if quality should be switched based on network conditions
   */
  shouldSwitchQuality(
    currentQuality: VideoQuality,
    recommendedQuality: VideoQuality,
    threshold: number = 0.8,
  ): boolean {
    if (currentQuality === recommendedQuality) return false

    const metrics = this.getNetworkMetrics()

    // Always switch if network condition is very poor
    if (metrics.quality_score <= 2) return true

    // Switch if confidence in recommendation is high
    if (metrics.quality_score >= 8) return true

    // Check if buffer health is concerning
    if (metrics.buffer_health < 3) return true

    // Check recent bandwidth stability
    const recentBandwidth = this.performanceData.bandwidthEstimates.slice(-5)
    if (recentBandwidth.length >= 3) {
      const variance = this.calculateVariance(recentBandwidth)
      const mean =
        recentBandwidth.reduce((a, b) => a + b, 0) / recentBandwidth.length

      // If bandwidth is unstable, be conservative
      if (variance / mean > 0.3) {
        return false
      }
    }

    return Math.random() > threshold // Add some randomness to prevent oscillation
  }

  /**
   * Calculate variance for bandwidth stability check
   */
  private calculateVariance(values: Array<number>): number {
    if (values.length < 2) return 0

    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const squaredDiffs = values.map((value) => Math.pow(value - mean, 2))
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  }

  /**
   * Reset performance data
   */
  reset(): void {
    this.performanceData = {
      fragmentLoadTimes: [],
      fragmentSizes: [],
      bandwidthEstimates: [],
      latencyMeasurements: [],
      errorCounts: 0,
      droppedFrames: 0,
    }
  }

  /**
   * Cleanup event listeners
   */
  cleanup(): void {
    if (this.hls) {
      this.hls.off(Hls.Events.FRAG_LOADED)
      this.hls.off(Hls.Events.ERROR)
      this.hls.off(Hls.Events.LEVEL_SWITCHED)
      this.hls.off(Hls.Events.BUFFER_APPENDED)
    }
  }
}

/**
 * Utility function to measure network latency to a specific endpoint
 */
export async function measureNetworkLatency(
  url: string,
  timeout: number = 5000,
): Promise<number> {
  const start = performance.now()

  try {
    await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: AbortSignal.timeout(timeout),
    })

    const end = performance.now()
    return Math.round(end - start)
  } catch (error) {
    console.warn('Failed to measure network latency:', error)
    return 999 // High latency as fallback
  }
}

/**
 * Utility function to detect if the connection supports a specific quality
 */
export function canSupportQuality(
  quality: VideoQuality,
  metrics: NetworkMetrics,
): boolean {
  const qualityRequirements: Record<
    VideoQuality,
    { minBandwidth: number; maxLatency: number }
  > = {
    '240p': { minBandwidth: 0.5, maxLatency: 1000 },
    '360p': { minBandwidth: 1.0, maxLatency: 800 },
    '480p': { minBandwidth: 2.0, maxLatency: 600 },
    '720p': { minBandwidth: 4.0, maxLatency: 400 },
    '1080p': { minBandwidth: 8.0, maxLatency: 300 },
    '1440p': { minBandwidth: 16.0, maxLatency: 200 },
    '2160p': { minBandwidth: 32.0, maxLatency: 150 },
    auto: { minBandwidth: 0, maxLatency: Infinity },
  }

  const requirements = qualityRequirements[quality]
  if (!requirements) return false

  return (
    metrics.bandwidth_mbps >= requirements.minBandwidth &&
    metrics.latency_ms <= requirements.maxLatency &&
    metrics.packet_loss < 0.05 // 5% max packet loss
  )
}

/**
 * Get optimal preload strategy based on network conditions
 */
export function getPreloadStrategy(metrics: NetworkMetrics): {
  enabled: boolean
  segmentCount: number
  quality: VideoQuality
  priority: 'high' | 'medium' | 'low'
} {
  if (metrics.quality_score >= 8) {
    return {
      enabled: true,
      segmentCount: 10,
      quality: '1080p',
      priority: 'high',
    }
  }

  if (metrics.quality_score >= 6) {
    return {
      enabled: true,
      segmentCount: 5,
      quality: '720p',
      priority: 'medium',
    }
  }

  if (metrics.quality_score >= 4) {
    return {
      enabled: true,
      segmentCount: 3,
      quality: '480p',
      priority: 'low',
    }
  }

  return {
    enabled: false,
    segmentCount: 0,
    quality: '240p',
    priority: 'low',
  }
}
