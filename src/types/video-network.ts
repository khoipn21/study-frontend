/**
 * Video Network Monitoring Types
 *
 * Types and interfaces for network connectivity monitoring and adaptive
 * video streaming quality management that integrates with backend Redis
 * message queue system.
 */

// Network quality metrics
export interface NetworkMetrics {
  /** Measured bandwidth in Mbps */
  bandwidth_mbps: number
  /** Network latency in milliseconds */
  latency_ms: number
  /** Packet loss percentage (0-1) */
  packet_loss: number
  /** Connection type detected */
  connection_type: ConnectionType
  /** Quality score from 1-10 */
  quality_score: number
  /** Buffer health in seconds */
  buffer_health: number
  /** Timestamp of measurement */
  timestamp: string
}

// Connection types
export type ConnectionType =
  | 'wifi'
  | '4g'
  | '5g'
  | 'ethernet'
  | 'slow-2g'
  | '2g'
  | '3g'
  | 'unknown'

// Video quality levels
export type VideoQuality =
  | '240p'
  | '360p'
  | '480p'
  | '720p'
  | '1080p'
  | '1440p'
  | '2160p'
  | 'auto'

// Video quality info
export interface VideoQualityInfo {
  label: VideoQuality
  bitrate_kbps: number
  width: number
  height: number
  fps: number
  codec: string
  url: string
  file_size_bytes?: number
}

// Network condition states
export type NetworkCondition =
  | 'excellent' // Score 9-10
  | 'good' // Score 7-8
  | 'fair' // Score 5-6
  | 'poor' // Score 3-4
  | 'very_poor' // Score 1-2

// HLS.js network performance metrics
export interface HLSNetworkMetrics {
  /** Fragment loading time in ms */
  fragment_load_time: number
  /** Fragment size in bytes */
  fragment_size: number
  /** Calculated bandwidth from fragment loading */
  fragment_bandwidth: number
  /** Time to first byte in ms */
  ttfb: number
  /** Buffer level in seconds */
  buffer_level: number
  /** Dropped frames count */
  dropped_frames: number
  /** Loading errors count */
  loading_errors: number
}

// WebSocket message types for video service communication
export interface VideoNetworkMessage {
  type: 'network_status' | 'progress_update' | 'quality_change' | 'heartbeat'
  data: any
  session_id: string
  timestamp: string
}

// Network status update message
export interface NetworkStatusMessage extends VideoNetworkMessage {
  type: 'network_status'
  data: {
    bandwidth_mbps: number
    latency_ms: number
    packet_loss: number
    buffer_health: number
    current_time: number
    current_quality: VideoQuality
    hls_metrics: HLSNetworkMetrics
  }
}

// Progress update message
export interface ProgressUpdateMessage extends VideoNetworkMessage {
  type: 'progress_update'
  data: {
    current_time: number
    quality: VideoQuality
    paused: boolean
    buffer_level: number
  }
}

// Quality change request message
export interface QualityChangeMessage extends VideoNetworkMessage {
  type: 'quality_change'
  data: {
    requested_quality: VideoQuality
    reason:
      | 'user_preference'
      | 'network_condition'
      | 'buffer_health'
      | 'bandwidth_drop'
    current_quality: VideoQuality
  }
}

// Server responses from video service
export interface QualityRecommendationResponse {
  type: 'quality_recommendation'
  data: {
    recommended_quality: VideoQuality
    reason: string
    confidence: number
    should_switch_immediately: boolean
  }
}

export interface PreloadInstructionResponse {
  type: 'preload'
  data: {
    segments: Array<string>
    priority: 'high' | 'medium' | 'low'
    quality: VideoQuality
  }
}

export interface AnalyticsEventResponse {
  type: 'analytics_event'
  data: {
    event: string
    metadata: Record<string, any>
  }
}

// Video session data
export interface VideoSession {
  session_id: string
  video_id: string
  user_id: string
  stream_url: string
  thumbnail_url: string
  qualities: Array<VideoQualityInfo>
  recommended_quality: VideoQuality
  websocket_url: string
  expires_at: string
  created_at: string
}

// Network monitoring configuration
export interface NetworkMonitoringConfig {
  /** Enable bandwidth monitoring */
  enableBandwidthMonitoring: boolean
  /** Bandwidth check interval in ms */
  bandwidthCheckInterval: number
  /** Enable latency monitoring */
  enableLatencyMonitoring: boolean
  /** Latency check interval in ms */
  latencyCheckInterval: number
  /** Enable buffer health monitoring */
  enableBufferHealthMonitoring: boolean
  /** Buffer check interval in ms */
  bufferCheckInterval: number
  /** Enable automatic quality switching */
  enableAutoQualitySwitching: boolean
  /** Quality switching threshold (0-1) */
  qualitySwitchingThreshold: number
  /** Buffer target in seconds */
  bufferTargetSeconds: number
  /** Minimum buffer before quality downgrade */
  minBufferSeconds: number
  /** Enable WebSocket real-time updates */
  enableWebSocketUpdates: boolean
  /** WebSocket heartbeat interval in ms */
  websocketHeartbeatInterval: number
  /** Maximum reconnect attempts */
  maxReconnectAttempts: number
  /** Reconnect delay in ms */
  reconnectDelay: number
}

// Network monitoring hook return type
export interface VideoNetworkMonitoringReturn {
  // Connection state
  isConnected: boolean
  isConnecting: boolean
  connectionError: string | null

  // Network metrics
  networkMetrics: NetworkMetrics | null
  networkCondition: NetworkCondition
  hlsMetrics: HLSNetworkMetrics | null

  // Video quality
  currentQuality: VideoQuality
  recommendedQuality: VideoQuality | null
  availableQualities: Array<VideoQualityInfo>

  // Buffer management
  bufferHealth: number
  bufferLevel: number

  // Controls
  changeQuality: (quality: VideoQuality) => Promise<void>
  enableAutoQuality: () => void
  disableAutoQuality: () => void
  isAutoQualityEnabled: boolean

  // Manual network test
  runNetworkTest: () => Promise<NetworkMetrics>

  // Connection management
  connect: () => void
  disconnect: () => void

  // Event handlers
  onQualityChange?: (from: VideoQuality, to: VideoQuality) => void
  onNetworkConditionChange?: (condition: NetworkCondition) => void
  onBufferHealthChange?: (health: number) => void
}

// Default network monitoring configuration
export const DEFAULT_NETWORK_CONFIG: NetworkMonitoringConfig = {
  enableBandwidthMonitoring: true,
  bandwidthCheckInterval: 10000, // 10 seconds
  enableLatencyMonitoring: true,
  latencyCheckInterval: 5000, // 5 seconds
  enableBufferHealthMonitoring: true,
  bufferCheckInterval: 1000, // 1 second
  enableAutoQualitySwitching: true,
  qualitySwitchingThreshold: 0.8,
  bufferTargetSeconds: 10,
  minBufferSeconds: 5,
  enableWebSocketUpdates: true,
  websocketHeartbeatInterval: 30000, // 30 seconds
  maxReconnectAttempts: 5,
  reconnectDelay: 3000, // 3 seconds
}

// Utility function to get network condition from score
export function getNetworkCondition(score: number): NetworkCondition {
  if (score >= 9) return 'excellent'
  if (score >= 7) return 'good'
  if (score >= 5) return 'fair'
  if (score >= 3) return 'poor'
  return 'very_poor'
}

// Utility function to calculate quality score based on metrics
export function calculateQualityScore(
  metrics: Partial<NetworkMetrics>,
): number {
  let score = 10

  // Bandwidth factor (40% weight)
  if (metrics.bandwidth_mbps !== undefined) {
    if (metrics.bandwidth_mbps < 1.0) {
      score -= 4
    } else if (metrics.bandwidth_mbps < 3.0) {
      score -= 2
    } else if (metrics.bandwidth_mbps < 5.0) {
      score -= 1
    }
  }

  // Latency factor (30% weight)
  if (metrics.latency_ms !== undefined) {
    if (metrics.latency_ms > 500) {
      score -= 3
    } else if (metrics.latency_ms > 200) {
      score -= 2
    } else if (metrics.latency_ms > 100) {
      score -= 1
    }
  }

  // Packet loss factor (20% weight)
  if (metrics.packet_loss !== undefined) {
    if (metrics.packet_loss > 0.05) {
      score -= 2
    } else if (metrics.packet_loss > 0.01) {
      score -= 1
    }
  }

  // Buffer health factor (10% weight)
  if (metrics.buffer_health !== undefined) {
    if (metrics.buffer_health < 3) {
      score -= 1
    }
  }

  return Math.max(1, Math.min(10, score))
}

// Quality recommendation based on score
export function recommendQualityFromScore(
  score: number,
  availableQualities: Array<VideoQualityInfo>,
): VideoQuality {
  const qualityMap: Record<number, VideoQuality> = {
    1: '240p',
    2: '240p',
    3: '360p',
    4: '360p',
    5: '480p',
    6: '480p',
    7: '720p',
    8: '720p',
    9: '1080p',
    10: '1080p',
  }

  const recommended = qualityMap[score] || '360p'

  // Check if recommended quality is available
  const hasRecommended = availableQualities.some((q) => q.label === recommended)
  if (hasRecommended) {
    return recommended
  }

  // Fallback to highest available quality that's lower than recommended
  const heights: Record<string, number> = {
    '240p': 240,
    '360p': 360,
    '480p': 480,
    '720p': 720,
    '1080p': 1080,
    '1440p': 1440,
    '2160p': 2160,
  }

  const sortedQualities = availableQualities
    .map((q) => q.label)
    .filter((q) => q !== 'auto')
    .sort((a, b) => (heights[a] || 360) - (heights[b] || 360))

  return sortedQualities[0] || '360p'
}
