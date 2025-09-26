/**
 * Video Service Client
 *
 * Client for communicating with the backend video service that handles
 * video streaming, network monitoring, and quality adaptation through
 * WebSocket connections and REST API endpoints.
 */

import type {
  AnalyticsEventResponse,
  NetworkStatusMessage,
  PreloadInstructionResponse,
  ProgressUpdateMessage,
  QualityChangeMessage,
  QualityRecommendationResponse,
  VideoQuality,
  VideoQualityInfo,
  VideoSession,
} from '@/types/video-network'

// Configuration for video service
const VIDEO_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL || 'http://localhost:8085'
const VIDEO_SERVICE_WS_URL =
  process.env.NEXT_PUBLIC_VIDEO_SERVICE_WS_URL || 'ws://localhost:8085'

export interface VideoServiceConfig {
  baseUrl: string
  wsBaseUrl: string
  apiTimeout: number
  enableRetries: boolean
  maxRetries: number
}

const DEFAULT_CONFIG: VideoServiceConfig = {
  baseUrl: VIDEO_SERVICE_BASE_URL,
  wsBaseUrl: VIDEO_SERVICE_WS_URL,
  apiTimeout: 10000, // 10 seconds
  enableRetries: true,
  maxRetries: 3,
}

export class VideoServiceClient {
  private config: VideoServiceConfig
  private authToken: string | null = null

  constructor(config: Partial<VideoServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Set authentication token for API requests
   */
  setAuthToken(token: string): void {
    this.authToken = token
  }

  /**
   * Get authentication headers for API requests
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }

  /**
   * Make API request with error handling and retries
   */
  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.config.apiTimeout),
    }

    let lastError: Error | null = null
    const maxAttempts = this.config.enableRetries ? this.config.maxRetries : 1

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(url, requestOptions)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        return data as T
      } catch (error) {
        lastError = error as Error

        if (attempt < maxAttempts) {
          // Exponential backoff delay
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        throw lastError
      }
    }

    throw lastError || new Error('Request failed')
  }

  /**
   * Get video details and available qualities
   */
  async getVideoDetails(videoId: string): Promise<{
    id: string
    cloudflare_uid: string
    title: string
    description: string
    duration: number
    status: string
    visibility: string
    thumbnail_url: string
    qualities: Array<VideoQualityInfo>
    created_at: string
  }> {
    return this.apiRequest(`/api/videos/${videoId}`)
  }

  /**
   * Start a new viewing session for a video
   */
  async startViewingSession(
    videoId: string,
    deviceInfo: {
      user_agent: string
      screen_resolution: string
      connection_type: string
    },
  ): Promise<VideoSession> {
    return this.apiRequest(`/api/videos/${videoId}/sessions`, {
      method: 'POST',
      body: JSON.stringify({ device_info: deviceInfo }),
    })
  }

  /**
   * Update network status for a session
   */
  async updateNetworkStatus(
    sessionId: string,
    networkData: {
      bandwidth_mbps: number
      latency_ms: number
      packet_loss: number
      connection_type: string
      buffer_health: number
      current_time: number
      current_quality: VideoQuality
    },
  ): Promise<{
    recommended_quality: VideoQuality
    quality_score: number
    should_preload: boolean
    buffer_target: number
  }> {
    return this.apiRequest(`/api/videos/sessions/${sessionId}/network`, {
      method: 'POST',
      body: JSON.stringify(networkData),
    })
  }

  /**
   * Get video analytics for a specific video
   */
  async getVideoAnalytics(
    videoId: string,
    period: string = '7d',
  ): Promise<{
    video_id: string
    period: string
    total_views: number
    unique_viewers: number
    total_watch_time: number
    avg_watch_time: number
    completion_rate: number
    daily_stats: Array<{
      date: string
      views: number
      unique_viewers: number
      watch_time: number
    }>
    quality_distribution: Record<VideoQuality, number>
  }> {
    return this.apiRequest(`/api/videos/${videoId}/analytics?period=${period}`)
  }

  /**
   * Create WebSocket connection for real-time communication
   */
  createWebSocketConnection(
    sessionId: string,
    onMessage: (event: MessageEvent) => void,
    onError?: (error: Event) => void,
    onClose?: (event: CloseEvent) => void,
    onOpen?: (event: Event) => void,
  ): WebSocket | null {
    try {
      const wsUrl = `${this.config.wsBaseUrl}/ws/${sessionId}`
      const url = this.authToken
        ? `${wsUrl}?token=${encodeURIComponent(this.authToken)}`
        : wsUrl

      const ws = new WebSocket(url)

      ws.onopen = (event) => {
        console.log('Video service WebSocket connected:', event)
        onOpen?.(event)
      }

      ws.onmessage = onMessage

      ws.onerror = (error) => {
        console.error('Video service WebSocket error:', error)
        onError?.(error)
      }

      ws.onclose = (event) => {
        console.log('Video service WebSocket closed:', event)
        onClose?.(event)
      }

      return ws
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      return null
    }
  }

  /**
   * Send network status update via WebSocket
   */
  sendNetworkStatusUpdate(
    ws: WebSocket,
    sessionId: string,
    data: NetworkStatusMessage['data'],
  ): void {
    if (ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send network status update')
      return
    }

    const message: NetworkStatusMessage = {
      type: 'network_status',
      data,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
    }

    ws.send(JSON.stringify(message))
  }

  /**
   * Send progress update via WebSocket
   */
  sendProgressUpdate(
    ws: WebSocket,
    sessionId: string,
    data: ProgressUpdateMessage['data'],
  ): void {
    if (ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send progress update')
      return
    }

    const message: ProgressUpdateMessage = {
      type: 'progress_update',
      data,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
    }

    ws.send(JSON.stringify(message))
  }

  /**
   * Send quality change request via WebSocket
   */
  sendQualityChangeRequest(
    ws: WebSocket,
    sessionId: string,
    data: QualityChangeMessage['data'],
  ): void {
    if (ws.readyState !== WebSocket.OPEN) {
      console.warn(
        'WebSocket not connected, cannot send quality change request',
      )
      return
    }

    const message: QualityChangeMessage = {
      type: 'quality_change',
      data,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
    }

    ws.send(JSON.stringify(message))
  }

  /**
   * Send heartbeat to maintain connection
   */
  sendHeartbeat(
    ws: WebSocket,
    sessionId: string,
    videoId: string,
    currentTime: number,
    quality: VideoQuality,
    bufferLevel: number,
  ): void {
    if (ws.readyState !== WebSocket.OPEN) {
      return
    }

    const message = {
      type: 'heartbeat',
      session_id: sessionId,
      data: {
        user_id: null, // Will be filled by backend from token
        video_id: videoId,
        current_time: currentTime,
        quality,
        buffer_health: bufferLevel,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    }

    ws.send(JSON.stringify(message))
  }

  /**
   * Parse WebSocket message from server
   */
  parseServerMessage(
    event: MessageEvent,
  ):
    | QualityRecommendationResponse
    | PreloadInstructionResponse
    | AnalyticsEventResponse
    | null {
    try {
      const data = JSON.parse(event.data)

      if (data.type === 'quality_recommendation') {
        return data as QualityRecommendationResponse
      }

      if (data.type === 'preload') {
        return data as PreloadInstructionResponse
      }

      if (data.type === 'analytics_event') {
        return data as AnalyticsEventResponse
      }

      console.warn('Unknown WebSocket message type:', data.type)
      return null
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
      return null
    }
  }

  /**
   * Measure network latency by pinging the video service
   */
  async measureLatency(): Promise<number> {
    const start = performance.now()

    try {
      await fetch(`${this.config.baseUrl}/api/ping`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      })

      const end = performance.now()
      return Math.round(end - start)
    } catch (error) {
      console.warn('Failed to measure latency:', error)
      return 999 // High latency as fallback
    }
  }

  /**
   * Test network connectivity and bandwidth
   */
  async testNetworkConnectivity(): Promise<{
    latency: number
    bandwidth_estimate: number
    connection_stable: boolean
  }> {
    try {
      // Measure latency
      const latency = await this.measureLatency()

      // Simple bandwidth test - download small test file
      const testStart = performance.now()
      const testResponse = await fetch(
        `${this.config.baseUrl}/api/bandwidth-test`,
        {
          signal: AbortSignal.timeout(10000),
        },
      )

      if (!testResponse.ok) {
        throw new Error('Bandwidth test failed')
      }

      const testData = await testResponse.arrayBuffer()
      const testEnd = performance.now()

      const testDurationSeconds = (testEnd - testStart) / 1000
      const testSizeBytes = testData.byteLength
      const bandwidthBps = testSizeBytes / testDurationSeconds
      const bandwidthMbps = (bandwidthBps * 8) / (1024 * 1024) // Convert to Mbps

      return {
        latency,
        bandwidth_estimate: bandwidthMbps,
        connection_stable: latency < 300 && bandwidthMbps > 1.0,
      }
    } catch (error) {
      console.error('Network connectivity test failed:', error)
      return {
        latency: 999,
        bandwidth_estimate: 0.1,
        connection_stable: false,
      }
    }
  }
}

// Global instance
export const videoService = new VideoServiceClient()

// Helper to initialize with auth token
export function initializeVideoService(authToken?: string): VideoServiceClient {
  if (authToken) {
    videoService.setAuthToken(authToken)
  }
  return videoService
}
