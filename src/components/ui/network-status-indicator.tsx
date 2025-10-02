/**
 * Network Status Indicator
 *
 * UI component that displays real-time network condition status,
 * connection quality metrics, and visual indicators for video
 * streaming performance.
 */

import {
  Activity,
  AlertCircle,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Wifi,
  WifiOff,
} from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import type {
  ConnectionType,
  NetworkCondition,
  NetworkMetrics,
} from '@/types/video-network'

export interface NetworkStatusIndicatorProps {
  /** Current network condition */
  condition: NetworkCondition
  /** Network metrics data */
  metrics?: NetworkMetrics | null
  /** Connection status */
  isConnected: boolean
  /** Connection error message */
  connectionError?: string | null
  /** Show detailed metrics */
  showDetails?: boolean
  /** Compact mode for smaller displays */
  compact?: boolean
  /** Callback for running network test */
  onRunNetworkTest?: () => Promise<void>
  /** Custom className */
  className?: string
}

// Network condition configurations
const CONDITION_CONFIG: Record<
  NetworkCondition,
  {
    label: string
    color: string
    bgColor: string
    icon: React.ComponentType<{ className?: string }>
    description: string
  }
> = {
  excellent: {
    label: 'Excellent',
    color: 'text-green-600',
    bgColor: 'bg-green-100 border-green-200',
    icon: SignalHigh,
    description: 'Optimal network conditions for high-quality streaming',
  },
  good: {
    label: 'Good',
    color: 'text-green-500',
    bgColor: 'bg-green-50 border-green-200',
    icon: SignalMedium,
    description: 'Good network conditions for quality streaming',
  },
  fair: {
    label: 'Fair',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 border-yellow-200',
    icon: Signal,
    description: 'Moderate network conditions, quality may be adjusted',
  },
  poor: {
    label: 'Poor',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 border-orange-200',
    icon: SignalLow,
    description: 'Poor network conditions, lower quality recommended',
  },
  very_poor: {
    label: 'Very Poor',
    color: 'text-red-600',
    bgColor: 'bg-red-100 border-red-200',
    icon: WifiOff,
    description: 'Very poor network conditions, streaming may be interrupted',
  },
}

// Connection type icons
const CONNECTION_TYPE_ICONS: Record<
  ConnectionType,
  React.ComponentType<{ className?: string }>
> = {
  wifi: Wifi,
  ethernet: Activity,
  '5g': SignalHigh,
  '4g': SignalMedium,
  '3g': Signal,
  '2g': SignalLow,
  'slow-2g': SignalLow,
  unknown: Signal,
}

export function NetworkStatusIndicator({
  condition,
  metrics,
  isConnected,
  connectionError,
  showDetails = false,
  compact = false,
  onRunNetworkTest,
  className,
}: NetworkStatusIndicatorProps) {
  const config = CONDITION_CONFIG[condition]
  const IconComponent = config.icon
  const ConnectionIcon = metrics?.connection_type
    ? CONNECTION_TYPE_ICONS[metrics.connection_type]
    : Signal

  const [isTestingNetwork, setIsTestingNetwork] = React.useState(false)

  const handleNetworkTest = async () => {
    if (!onRunNetworkTest) return

    setIsTestingNetwork(true)
    try {
      await onRunNetworkTest()
    } finally {
      setIsTestingNetwork(false)
    }
  }

  const formatBandwidth = (mbps: number): string => {
    if (mbps >= 1) {
      return `${mbps.toFixed(1)} Mbps`
    }
    return `${(mbps * 1000).toFixed(0)} Kbps`
  }

  const formatLatency = (ms: number): string => {
    return `${Math.round(ms)}ms`
  }

  const formatPacketLoss = (loss: number): string => {
    return `${(loss * 100).toFixed(1)}%`
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex items-center space-x-1 px-2 py-1 rounded-md border text-sm',
                config.bgColor,
                config.color,
                className,
              )}
            >
              {!isConnected ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <IconComponent className="h-4 w-4" />
              )}
              <span className="font-medium">{config.label}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-medium">
                {isConnected ? config.description : 'Connection Error'}
              </p>
              {connectionError && (
                <p className="text-red-400 text-sm">{connectionError}</p>
              )}
              {metrics && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    Bandwidth: {formatBandwidth(metrics.bandwidth_mbps)}
                  </div>
                  <div>Latency: {formatLatency(metrics.latency_ms)}</div>
                  <div>Buffer: {metrics.buffer_health.toFixed(1)}s</div>
                  <div>Score: {metrics.quality_score}/10</div>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border',
        config.bgColor,
        className,
      )}
    >
      <div className="flex items-center space-x-3">
        {/* Status Icon */}
        <div
          className={cn(
            'flex items-center justify-center p-2 rounded-full bg-white/70',
          )}
        >
          {!isConnected ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <IconComponent className={cn('h-5 w-5', config.color)} />
          )}
        </div>

        {/* Status Info */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className={cn('font-semibold text-sm', config.color)}>
              {isConnected ? config.label : 'Disconnected'}
            </span>
            {metrics?.connection_type && (
              <Badge variant="outline" className="text-xs">
                <ConnectionIcon className="h-3 w-3 mr-1" />
                {metrics.connection_type.toUpperCase()}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600">
            {connectionError || config.description}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {onRunNetworkTest && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleNetworkTest}
            disabled={isTestingNetwork}
            className="text-xs"
          >
            {isTestingNetwork ? (
              <>
                <Activity className="h-3 w-3 mr-1 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Network'
            )}
          </Button>
        )}
      </div>

      {/* Detailed Metrics */}
      {showDetails && metrics && (
        <div className="ml-4 grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Bandwidth:</span>
              <span className="font-medium">
                {formatBandwidth(metrics.bandwidth_mbps)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Latency:</span>
              <span className="font-medium">
                {formatLatency(metrics.latency_ms)}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Packet Loss:</span>
              <span className="font-medium">
                {formatPacketLoss(metrics.packet_loss)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Buffer Health:</span>
              <span className="font-medium">
                {metrics.buffer_health.toFixed(1)}s
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Connection Status Indicator
 *
 * Simple indicator for WebSocket connection status
 */
export interface ConnectionStatusProps {
  isConnected: boolean
  isConnecting: boolean
  connectionError?: string | null
  className?: string
}

export function ConnectionStatus({
  isConnected,
  isConnecting,
  connectionError,
  className,
}: ConnectionStatusProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center space-x-1', className)}>
            <div
              className={cn('w-2 h-2 rounded-full', {
                'bg-green-500': isConnected,
                'bg-yellow-500 animate-pulse': isConnecting,
                'bg-red-500': !isConnected && !isConnecting,
              })}
            />
            <span className="text-xs text-gray-600">
              {isConnecting
                ? 'Connecting...'
                : isConnected
                  ? 'Connected'
                  : 'Disconnected'}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {connectionError ||
              (isConnecting
                ? 'Establishing connection to video service...'
                : isConnected
                  ? 'Real-time network monitoring active'
                  : 'Connection to video service lost')}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/**
 * Network Quality Badge
 *
 * Compact badge showing network quality score
 */
export interface NetworkQualityBadgeProps {
  score: number
  className?: string
}

export function NetworkQualityBadge({
  score,
  className,
}: NetworkQualityBadgeProps) {
  const getQualityConfig = (score: number) => {
    if (score >= 9)
      return {
        label: 'Excellent',
        variant: 'default' as const,
        color: 'bg-green-500',
      }
    if (score >= 7)
      return {
        label: 'Good',
        variant: 'secondary' as const,
        color: 'bg-green-400',
      }
    if (score >= 5)
      return {
        label: 'Fair',
        variant: 'outline' as const,
        color: 'bg-yellow-400',
      }
    if (score >= 3)
      return {
        label: 'Poor',
        variant: 'destructive' as const,
        color: 'bg-orange-400',
      }
    return {
      label: 'Very Poor',
      variant: 'destructive' as const,
      color: 'bg-red-500',
    }
  }

  const config = getQualityConfig(score)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={config.variant} className={cn('text-xs', className)}>
            <div className={cn('w-2 h-2 rounded-full mr-1', config.color)} />
            {config.label} ({score}/10)
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Network Quality Score: {score}/10</p>
          <p className="text-xs text-gray-400">
            Based on bandwidth, latency, packet loss, and buffer health
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
