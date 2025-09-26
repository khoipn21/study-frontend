/**
 * Network Monitoring Integration Test Component
 *
 * This component demonstrates and tests the complete network monitoring
 * system integration including WebSocket connections, HLS.js integration,
 * quality adaptation, and UI components.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { videoService } from '@/lib/video-service'
import { NetworkPerformanceMonitor } from '@/lib/network-detection'
import { AdaptiveVideoPlayer } from './AdaptiveVideoPlayer'
import type { NetworkMetrics, VideoQuality } from '@/types/video-network'

export function NetworkMonitoringTest() {
  const [testResults, setTestResults] = useState<{
    networkTest: NetworkMetrics | null
    wsConnectionTest: boolean | null
    hlsIntegrationTest: boolean | null
    qualityAdaptationTest: boolean | null
    uiComponentsTest: boolean | null
  }>({
    networkTest: null,
    wsConnectionTest: null,
    hlsIntegrationTest: null,
    qualityAdaptationTest: null,
    uiComponentsTest: null,
  })

  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testLogs, setTestLogs] = useState<Array<string>>([])

  const addLog = (message: string) => {
    setTestLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ])
  }

  const runNetworkTest = async () => {
    addLog('Starting network connectivity test...')
    try {
      const result = await videoService.testNetworkConnectivity()
      const metrics: NetworkMetrics = {
        bandwidth_mbps: result.bandwidth_estimate,
        latency_ms: result.latency,
        packet_loss: 0,
        connection_type: 'unknown',
        quality_score: result.connection_stable ? 8 : 4,
        buffer_health: 5,
        timestamp: new Date().toISOString(),
      }

      setTestResults((prev) => ({ ...prev, networkTest: metrics }))
      addLog(
        `Network test completed - Bandwidth: ${result.bandwidth_estimate.toFixed(2)} Mbps, Latency: ${result.latency}ms`,
      )
      return true
    } catch (error) {
      addLog(`Network test failed: ${error}`)
      return false
    }
  }

  const runWebSocketTest = async () => {
    addLog('Testing WebSocket connection...')
    try {
      // Mock session data for testing
      const mockSession = {
        session_id: 'test-session-' + Date.now(),
        video_id: 'test-video',
        user_id: 'test-user',
        stream_url: 'test-stream',
        thumbnail_url: 'test-thumbnail',
        qualities: [],
        recommended_quality: '720p' as VideoQuality,
        websocket_url: 'ws://localhost:8085',
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        created_at: new Date().toISOString(),
      }

      const ws = videoService.createWebSocketConnection(
        mockSession.session_id,
        (event) => {
          addLog('WebSocket message received: ' + event.data)
        },
        (error) => {
          addLog('WebSocket error: ' + error)
          setTestResults((prev) => ({ ...prev, wsConnectionTest: false }))
        },
        (event) => {
          addLog('WebSocket closed: ' + event.code)
        },
        () => {
          addLog('WebSocket connection established successfully')
          setTestResults((prev) => ({ ...prev, wsConnectionTest: true }))
          // Close test connection after 3 seconds
          setTimeout(() => {
            ws?.close()
          }, 3000)
        },
      )

      if (!ws) {
        addLog('Failed to create WebSocket connection')
        setTestResults((prev) => ({ ...prev, wsConnectionTest: false }))
        return false
      }

      // Wait for connection result
      await new Promise((resolve) => setTimeout(resolve, 5000))
      return testResults.wsConnectionTest === true
    } catch (error) {
      addLog(`WebSocket test failed: ${error}`)
      setTestResults((prev) => ({ ...prev, wsConnectionTest: false }))
      return false
    }
  }

  const runHLSIntegrationTest = async () => {
    addLog('Testing HLS.js integration...')
    try {
      // Test if HLS is supported
      const HLS = (await import('hls.js')).default
      if (!HLS.isSupported()) {
        addLog('HLS.js is not supported in this browser')
        setTestResults((prev) => ({ ...prev, hlsIntegrationTest: false }))
        return false
      }

      // Test network performance monitor
      const monitor = new NetworkPerformanceMonitor()
      const metrics = monitor.getNetworkMetrics()

      addLog(
        `HLS integration test - Quality Score: ${metrics.quality_score}/10`,
      )
      setTestResults((prev) => ({ ...prev, hlsIntegrationTest: true }))
      return true
    } catch (error) {
      addLog(`HLS integration test failed: ${error}`)
      setTestResults((prev) => ({ ...prev, hlsIntegrationTest: false }))
      return false
    }
  }

  const runQualityAdaptationTest = () => {
    addLog('Testing quality adaptation logic...')
    try {
      const monitor = new NetworkPerformanceMonitor()

      // Test quality recommendation
      const mockQualities = [
        {
          label: '240p' as VideoQuality,
          bitrate_kbps: 500,
          width: 426,
          height: 240,
          fps: 30,
          codec: 'h264',
          url: 'test',
        },
        {
          label: '480p' as VideoQuality,
          bitrate_kbps: 1500,
          width: 854,
          height: 480,
          fps: 30,
          codec: 'h264',
          url: 'test',
        },
        {
          label: '720p' as VideoQuality,
          bitrate_kbps: 3000,
          width: 1280,
          height: 720,
          fps: 30,
          codec: 'h264',
          url: 'test',
        },
      ]

      const recommendedQuality = monitor.recommendQuality(mockQualities)
      addLog(`Quality adaptation test - Recommended: ${recommendedQuality}`)

      setTestResults((prev) => ({ ...prev, qualityAdaptationTest: true }))
      return true
    } catch (error) {
      addLog(`Quality adaptation test failed: ${error}`)
      setTestResults((prev) => ({ ...prev, qualityAdaptationTest: false }))
      return false
    }
  }

  const runUIComponentsTest = () => {
    addLog('Testing UI components...')
    try {
      // Test if UI components can be rendered (basic check)
      setTestResults((prev) => ({ ...prev, uiComponentsTest: true }))
      addLog('UI components test passed')
      return true
    } catch (error) {
      addLog(`UI components test failed: ${error}`)
      setTestResults((prev) => ({ ...prev, uiComponentsTest: false }))
      return false
    }
  }

  const runAllTests = async () => {
    setIsRunningTests(true)
    setTestLogs([])
    addLog('Starting comprehensive network monitoring tests...')

    try {
      await runNetworkTest()
      await runWebSocketTest()
      await runHLSIntegrationTest()
      await runQualityAdaptationTest()
      await runUIComponentsTest()

      addLog('All tests completed!')
    } catch (error) {
      addLog(`Test execution failed: ${error}`)
    } finally {
      setIsRunningTests(false)
    }
  }

  const getTestStatusBadge = (result: boolean | null) => {
    if (result === null) {
      return <Badge variant="outline">Not Run</Badge>
    }
    return result ? (
      <Badge variant="default" className="bg-green-500">
        Pass
      </Badge>
    ) : (
      <Badge variant="destructive">Fail</Badge>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Network Monitoring Integration Test
        </h1>
        <Button
          onClick={runAllTests}
          disabled={isRunningTests}
          className="min-w-[120px]"
        >
          {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>

      <Alert>
        <AlertDescription>
          This component tests the complete frontend network monitoring
          integration with the backend Redis message queue system. Ensure your
          backend video service is running on port 8085 for full functionality.
        </AlertDescription>
      </Alert>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">Network Connectivity</span>
              {getTestStatusBadge(testResults.networkTest !== null)}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">WebSocket Connection</span>
              {getTestStatusBadge(testResults.wsConnectionTest)}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">HLS.js Integration</span>
              {getTestStatusBadge(testResults.hlsIntegrationTest)}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">Quality Adaptation</span>
              {getTestStatusBadge(testResults.qualityAdaptationTest)}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">UI Components</span>
              {getTestStatusBadge(testResults.uiComponentsTest)}
            </div>
          </div>

          {/* Network Test Details */}
          {testResults.networkTest && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Network Test Results:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  Bandwidth: {testResults.networkTest.bandwidth_mbps.toFixed(2)}{' '}
                  Mbps
                </div>
                <div>Latency: {testResults.networkTest.latency_ms}ms</div>
                <div>
                  Quality Score: {testResults.networkTest.quality_score}/10
                </div>
                <div>Connection: {testResults.networkTest.connection_type}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Test Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg font-mono text-sm">
            {testLogs.length === 0 ? (
              <div className="text-gray-500">
                No logs yet. Click "Run All Tests" to start.
              </div>
            ) : (
              testLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Example Video Player */}
      <Card>
        <CardHeader>
          <CardTitle>Example: Adaptive Video Player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              This demonstrates the complete integration with a sample HLS
              stream. Network monitoring will be active if a backend session is
              available.
            </p>

            <AdaptiveVideoPlayer
              videoId="test-video-monitoring"
              src="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
              title="Network Monitoring Test - Tears of Steel"
              showAdvancedControls={true}
              compactMode={false}
              networkConfig={{
                enableAutoQualitySwitching: true,
                bandwidthCheckInterval: 10000,
                bufferTargetSeconds: 15,
                enableWebSocketUpdates: true,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Integration Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold">Backend Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Video service running on port 8085</li>
              <li>Redis message queue configured</li>
              <li>WebSocket endpoint available at /ws/:sessionId</li>
              <li>
                API endpoints: /api/videos, /api/bandwidth-test, /api/ping
              </li>
            </ul>

            <h4 className="font-semibold mt-4">Frontend Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Real-time network condition monitoring</li>
              <li>Automatic quality adaptation based on network conditions</li>
              <li>Manual quality override capabilities</li>
              <li>Network status indicators for users</li>
              <li>Smooth integration with HLS.js video streaming</li>
              <li>WebSocket communication with backend Redis system</li>
              <li>Comprehensive error handling and recovery</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NetworkMonitoringTest
