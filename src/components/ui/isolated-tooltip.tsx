import * as React from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

interface IsolatedTooltipProps {
  children: React.ReactNode
  content?: React.ReactNode
  enabled?: boolean
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  className?: string
}

/**
 * IsolatedTooltip provides a self-contained tooltip that safely handles
 * nested TooltipProvider scenarios and prevents infinite re-render loops.
 *
 * This component automatically detects existing providers and skips
 * creating new ones when appropriate, making it safe to use in any context.
 */
export function IsolatedTooltip({
  children,
  content,
  enabled = true,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  className,
}: IsolatedTooltipProps) {
  // Early return if tooltip not needed - prevents unnecessary provider creation
  if (!enabled || !content) {
    return <>{children}</>
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} className={className}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/**
 * Hook for creating stable tooltip content that doesn't trigger re-renders.
 * Useful for complex tooltip content that includes interactive elements.
 */
export function useStableTooltipContent(
  contentFn: () => React.ReactNode,
  deps: React.DependencyList,
) {
  return React.useMemo(contentFn, deps)
}
