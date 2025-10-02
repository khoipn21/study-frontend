/**
 * Quality Selector
 *
 * UI component for manual video quality selection with automatic
 * quality toggle, quality recommendations, and adaptive streaming
 * controls.
 */

import {
  Check,
  ChevronDown,
  Settings,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import type {
  NetworkCondition,
  VideoQuality,
  VideoQualityInfo,
} from '@/types/video-network'

export interface QualitySelectorProps {
  /** Current video quality */
  currentQuality: VideoQuality
  /** Available video qualities */
  availableQualities: Array<VideoQualityInfo>
  /** Recommended quality from network analysis */
  recommendedQuality?: VideoQuality | null
  /** Network condition for recommendations */
  networkCondition: NetworkCondition
  /** Auto quality enabled state */
  isAutoQualityEnabled: boolean
  /** Loading state */
  isLoading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Compact mode */
  compact?: boolean
  /** Callback for quality change */
  onQualityChange: (quality: VideoQuality) => Promise<void>
  /** Callback for auto quality toggle */
  onAutoQualityToggle: (enabled: boolean) => void
  /** Custom className */
  className?: string
}

// Quality level configurations
const QUALITY_CONFIG: Record<
  VideoQuality,
  {
    label: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    bandwidth: string
  }
> = {
  auto: {
    label: 'Auto',
    description: 'Automatically adjust based on network conditions',
    icon: Sparkles,
    bandwidth: 'Adaptive',
  },
  '240p': {
    label: '240p',
    description: 'Low quality, minimal bandwidth usage',
    icon: Target,
    bandwidth: '~0.5 Mbps',
  },
  '360p': {
    label: '360p',
    description: 'Standard quality for slow connections',
    icon: Target,
    bandwidth: '~1 Mbps',
  },
  '480p': {
    label: '480p',
    description: 'Good quality for moderate connections',
    icon: Target,
    bandwidth: '~2 Mbps',
  },
  '720p': {
    label: '720p',
    description: 'High definition quality',
    icon: Target,
    bandwidth: '~4 Mbps',
  },
  '1080p': {
    label: '1080p',
    description: 'Full high definition quality',
    icon: Target,
    bandwidth: '~8 Mbps',
  },
  '1440p': {
    label: '1440p',
    description: 'Quad HD quality',
    icon: Target,
    bandwidth: '~16 Mbps',
  },
  '2160p': {
    label: '2160p',
    description: '4K Ultra HD quality',
    icon: Target,
    bandwidth: '~32 Mbps',
  },
}

// Network condition colors
const NETWORK_CONDITION_COLORS: Record<NetworkCondition, string> = {
  excellent: 'text-green-600',
  good: 'text-green-500',
  fair: 'text-yellow-600',
  poor: 'text-orange-600',
  very_poor: 'text-red-600',
}

export function QualitySelector({
  currentQuality,
  availableQualities,
  recommendedQuality,
  networkCondition,
  isAutoQualityEnabled,
  isLoading = false,
  disabled = false,
  compact = false,
  onQualityChange,
  onAutoQualityToggle,
  className,
}: QualitySelectorProps) {
  const [isPending, setIsPending] = React.useState(false)

  const handleQualityChange = async (quality: VideoQuality) => {
    if (disabled || isPending) return

    setIsPending(true)
    try {
      await onQualityChange(quality)
    } finally {
      setIsPending(false)
    }
  }

  const getCurrentQualityInfo = () => {
    if (currentQuality === 'auto') {
      return QUALITY_CONFIG.auto
    }
    return QUALITY_CONFIG[currentQuality] || QUALITY_CONFIG['360p']
  }

  const getQualityDisplayName = (quality: VideoQuality) => {
    const config = QUALITY_CONFIG[quality] || QUALITY_CONFIG['360p']
    return config.label
  }

  // const isQualityAvailable = (quality: VideoQuality) => {
  //   if (quality === 'auto') return true
  //   return availableQualities.some(q => q.label === quality)
  // }

  const isQualityRecommended = (quality: VideoQuality) => {
    return quality === recommendedQuality
  }

  const sortedQualities = React.useMemo(() => {
    const heights: Record<string, number> = {
      '240p': 240,
      '360p': 360,
      '480p': 480,
      '720p': 720,
      '1080p': 1080,
      '1440p': 1440,
      '2160p': 2160,
    }

    return availableQualities
      .slice()
      .sort((a, b) => (heights[b.label] || 360) - (heights[a.label] || 360))
  }, [availableQualities])

  const currentConfig = getCurrentQualityInfo()
  const IconComponent = currentConfig.icon

  if (compact) {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled || isLoading}
              className="h-8 px-2 text-xs"
            >
              <IconComponent className="h-3 w-3 mr-1" />
              {getQualityDisplayName(currentQuality)}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {/* Auto Quality Option */}
            <DropdownMenuItem
              onClick={() => handleQualityChange('auto')}
              disabled={isPending}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Auto
              </div>
              {currentQuality === 'auto' && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* Quality Options */}
            {sortedQualities.map((quality) => (
              <DropdownMenuItem
                key={quality.label}
                onClick={() => handleQualityChange(quality.label)}
                disabled={isPending}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="w-12 text-sm font-medium">
                    {quality.label}
                  </span>
                  {isQualityRecommended(quality.label) && (
                    <Zap className="h-3 w-3 ml-1 text-yellow-500" />
                  )}
                </div>
                {currentQuality === quality.label && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Auto Quality Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Auto Quality</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn('text-xs px-2 py-1 rounded', {
                    'bg-blue-100 text-blue-700': isAutoQualityEnabled,
                    'bg-gray-100 text-gray-600': !isAutoQualityEnabled,
                  })}
                >
                  {isAutoQualityEnabled ? 'Enabled' : 'Manual'}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isAutoQualityEnabled
                    ? 'Quality automatically adjusts based on network conditions'
                    : 'Quality remains fixed at selected level'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch
          checked={isAutoQualityEnabled}
          onCheckedChange={onAutoQualityToggle}
          disabled={disabled}
        />
      </div>

      {/* Current Quality Display */}
      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
        <div className="flex items-center space-x-3">
          <IconComponent className="h-5 w-5 text-blue-500" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{currentConfig.label}</span>
              {currentQuality !== 'auto' && (
                <Badge variant="outline" className="text-xs">
                  {currentConfig.bandwidth}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-600">{currentConfig.description}</p>
          </div>
        </div>

        {/* Network Status */}
        <div className="text-right">
          <div
            className={cn(
              'text-xs font-medium',
              NETWORK_CONDITION_COLORS[networkCondition],
            )}
          >
            {networkCondition.replace('_', ' ').toUpperCase()}
          </div>
          {recommendedQuality && recommendedQuality !== currentQuality && (
            <div className="text-xs text-gray-500 flex items-center">
              <Zap className="h-3 w-3 mr-1 text-yellow-500" />
              Suggests {getQualityDisplayName(recommendedQuality)}
            </div>
          )}
        </div>
      </div>

      {/* Manual Quality Selection */}
      {!isAutoQualityEnabled && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Manual Selection
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Auto Option */}
            <Button
              variant={currentQuality === 'auto' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleQualityChange('auto')}
              disabled={disabled || isPending}
              className="justify-start"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Auto
              {currentQuality === 'auto' && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </Button>

            {/* Quality Options */}
            {sortedQualities.map((quality) => {
              const isSelected = currentQuality === quality.label
              const isRecommended = isQualityRecommended(quality.label)

              return (
                <TooltipProvider key={quality.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleQualityChange(quality.label)}
                        disabled={disabled || isPending}
                        className={cn('justify-start', {
                          'border-yellow-300 bg-yellow-50':
                            isRecommended && !isSelected,
                        })}
                      >
                        <span className="font-medium">{quality.label}</span>
                        {isRecommended && (
                          <Zap className="h-3 w-3 ml-1 text-yellow-500" />
                        )}
                        {isSelected && <Check className="h-4 w-4 ml-auto" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-medium">{quality.label}</p>
                        <p className="text-xs">
                          {quality.width}×{quality.height} •{' '}
                          {quality.bitrate_kbps} kbps
                        </p>
                        <p className="text-xs text-gray-400">
                          {QUALITY_CONFIG[quality.label]?.bandwidth ||
                            'Variable bitrate'}
                        </p>
                        {isRecommended && (
                          <p className="text-xs text-yellow-600 mt-1">
                            ⚡ Recommended for current network
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>
      )}

      {/* Loading State */}
      {(isLoading || isPending) && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
          <span className="ml-2 text-xs text-gray-600">
            Adjusting quality...
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Simple Quality Badge
 *
 * Compact display of current quality with recommendation indicator
 */
export interface QualityBadgeProps {
  currentQuality: VideoQuality
  recommendedQuality?: VideoQuality | null
  isAutoEnabled?: boolean
  className?: string
}

export function QualityBadge({
  currentQuality,
  recommendedQuality,
  isAutoEnabled = false,
  className,
}: QualityBadgeProps) {
  const config = QUALITY_CONFIG[currentQuality] || QUALITY_CONFIG['360p']
  const IconComponent = config.icon
  const isRecommendationDifferent =
    recommendedQuality && recommendedQuality !== currentQuality

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={isAutoEnabled ? 'default' : 'secondary'}
            className={cn('flex items-center space-x-1', className)}
          >
            <IconComponent className="h-3 w-3" />
            <span>{config.label}</span>
            {isAutoEnabled && <Sparkles className="h-3 w-3" />}
            {isRecommendationDifferent && (
              <Zap className="h-3 w-3 text-yellow-300" />
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">{config.label} Quality</p>
            <p className="text-xs">{config.description}</p>
            {isAutoEnabled && (
              <p className="text-xs text-blue-300 mt-1">
                Auto adjustment enabled
              </p>
            )}
            {isRecommendationDifferent && (
              <p className="text-xs text-yellow-300 mt-1">
                Recommends: {QUALITY_CONFIG[recommendedQuality].label}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
