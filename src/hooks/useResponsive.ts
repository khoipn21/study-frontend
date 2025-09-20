/**
 * Custom React hooks for responsive design and device detection
 * Optimized for Vietnamese market mobile-first approach
 */

import { useCallback, useEffect, useState } from 'react'
import {
  BREAKPOINTS,
  PERFORMANCE_BUDGETS,
  VIETNAMESE_DEVICE_USAGE,
  getDeviceType,
  getGridColumns,
  getNavigationType,
  shouldShowSidebar,
} from '@/lib/responsive-design'
import type { DeviceType } from '@/lib/responsive-design'

/**
 * Hook to detect current device type and screen size
 */
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile')
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const updateDeviceType = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setScreenSize({ width, height })
      setDeviceType(getDeviceType(width))
    }

    updateDeviceType()

    const handleResize = () => {
      updateDeviceType()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    deviceType,
    screenSize,
    isClient,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop' || deviceType === 'large-desktop',
    isSmallScreen: screenSize.width < 768,
    isLargeScreen: screenSize.width >= 1024,
  }
}

/**
 * Hook for responsive breakpoint detection
 */
export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('xs')
  const [breakpoints, setBreakpoints] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth

      const newBreakpoints = {
        xs: width >= parseInt(BREAKPOINTS.xs),
        sm: width >= parseInt(BREAKPOINTS.sm),
        md: width >= parseInt(BREAKPOINTS.md),
        lg: width >= parseInt(BREAKPOINTS.lg),
        xl: width >= parseInt(BREAKPOINTS.xl),
        '2xl': width >= parseInt(BREAKPOINTS['2xl']),
      }

      setBreakpoints(newBreakpoints)

      // Determine current breakpoint
      if (width >= parseInt(BREAKPOINTS['2xl'])) setCurrentBreakpoint('2xl')
      else if (width >= parseInt(BREAKPOINTS.xl)) setCurrentBreakpoint('xl')
      else if (width >= parseInt(BREAKPOINTS.lg)) setCurrentBreakpoint('lg')
      else if (width >= parseInt(BREAKPOINTS.md)) setCurrentBreakpoint('md')
      else if (width >= parseInt(BREAKPOINTS.sm)) setCurrentBreakpoint('sm')
      else setCurrentBreakpoint('xs')
    }

    updateBreakpoints()

    const handleResize = () => {
      updateBreakpoints()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    currentBreakpoint,
    breakpoints,
    isXs: currentBreakpoint === 'xs',
    isSm: currentBreakpoint === 'sm',
    isMd: currentBreakpoint === 'md',
    isLg: currentBreakpoint === 'lg',
    isXl: currentBreakpoint === 'xl',
    is2Xl: currentBreakpoint === '2xl',
  }
}

/**
 * Hook for touch device detection
 */
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [hasHover, setHasHover] = useState(true)
  const [hasFinePointer, setHasFinePointer] = useState(true)

  useEffect(() => {
    const checkTouchCapabilities = () => {
      // Check for touch support
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0

      // Check for hover capability
      const canHover = window.matchMedia('(hover: hover)').matches

      // Check for fine pointer (mouse)
      const hasFine = window.matchMedia('(pointer: fine)').matches

      setIsTouchDevice(hasTouch)
      setHasHover(canHover)
      setHasFinePointer(hasFine)
    }

    checkTouchCapabilities()

    // Listen for media query changes
    const hoverQuery = window.matchMedia('(hover: hover)')
    const pointerQuery = window.matchMedia('(pointer: fine)')

    const handleHoverChange = (e: MediaQueryListEvent) => setHasHover(e.matches)
    const handlePointerChange = (e: MediaQueryListEvent) =>
      setHasFinePointer(e.matches)

    hoverQuery.addEventListener('change', handleHoverChange)
    pointerQuery.addEventListener('change', handlePointerChange)

    return () => {
      hoverQuery.removeEventListener('change', handleHoverChange)
      pointerQuery.removeEventListener('change', handlePointerChange)
    }
  }, [])

  return {
    isTouchDevice,
    hasHover,
    hasFinePointer,
    isPrimaryTouch: isTouchDevice && !hasFinePointer,
    isHybridDevice: isTouchDevice && hasFinePointer,
  }
}

/**
 * Hook for responsive grid management
 */
export function useResponsiveGrid(
  customColumns?: Partial<Record<DeviceType, number>>,
) {
  const { deviceType } = useDeviceType()

  const getColumns = useCallback(() => {
    if (customColumns?.[deviceType]) {
      return customColumns[deviceType]
    }
    return getGridColumns(deviceType)
  }, [deviceType, customColumns])

  const [columns, setColumns] = useState(getColumns())

  useEffect(() => {
    setColumns(getColumns())
  }, [getColumns])

  return {
    columns,
    deviceType,
    gridClasses: `grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns}`,
  }
}

/**
 * Hook for responsive navigation management
 */
export function useResponsiveNavigation() {
  const { deviceType } = useDeviceType()
  const { isTouchDevice } = useTouchDevice()

  const [showSidebar, setShowSidebar] = useState(false)
  const [navigationStyle, setNavigationStyle] = useState<
    'horizontal' | 'sidebar' | 'bottom-sheet'
  >('horizontal')

  useEffect(() => {
    const shouldShow = shouldShowSidebar(deviceType)
    const navType = getNavigationType(deviceType)

    setShowSidebar(shouldShow)
    setNavigationStyle(navType)
  }, [deviceType])

  const toggleSidebar = useCallback(() => {
    setShowSidebar((prev) => !prev)
  }, [])

  return {
    showSidebar,
    navigationStyle,
    toggleSidebar,
    isMobileNavigation: navigationStyle === 'bottom-sheet',
    isSidebarNavigation: navigationStyle === 'sidebar',
    isHorizontalNavigation: navigationStyle === 'horizontal',
    shouldCollapseSidebar: deviceType === 'mobile' || deviceType === 'tablet',
  }
}

/**
 * Hook for responsive image sizing
 */
export function useResponsiveImage(containerWidth?: number) {
  const { deviceType, screenSize } = useDeviceType()

  const getImageSize = useCallback(
    (width?: number) => {
      const targetWidth = width || containerWidth || screenSize.width
      const aspectRatio = 16 / 9

      // Optimize image size based on device
      let imageWidth = targetWidth
      let quality = 85

      if (deviceType === 'mobile') {
        quality = 75
        imageWidth = Math.min(targetWidth, 800) // Max 800px on mobile
      } else if (deviceType === 'tablet') {
        quality = 80
        imageWidth = Math.min(targetWidth, 1200) // Max 1200px on tablet
      }

      return {
        width: Math.round(imageWidth),
        height: Math.round(imageWidth / aspectRatio),
        quality,
        sizes:
          deviceType === 'mobile'
            ? '100vw'
            : deviceType === 'tablet'
              ? '50vw'
              : '33vw',
      }
    },
    [deviceType, screenSize.width, containerWidth],
  )

  return {
    getImageSize,
    deviceType,
  }
}

/**
 * Hook for responsive video player settings
 */
export function useResponsiveVideo() {
  const { deviceType } = useDeviceType()
  const { isTouchDevice } = useTouchDevice()

  const getVideoSettings = useCallback(() => {
    const settings = {
      mobile: {
        autoplay: false,
        controls: true,
        preload: 'metadata' as const,
        defaultQuality: '480p',
        showSidebar: false,
        controlsTimeout: 3000,
      },
      tablet: {
        autoplay: false,
        controls: true,
        preload: 'metadata' as const,
        defaultQuality: '720p',
        showSidebar: true,
        controlsTimeout: 5000,
      },
      desktop: {
        autoplay: false,
        controls: true,
        preload: 'auto' as const,
        defaultQuality: '1080p',
        showSidebar: true,
        controlsTimeout: 5000,
      },
    }

    const deviceSettings = settings[deviceType] || settings.mobile

    return {
      ...deviceSettings,
      touchOptimized: isTouchDevice,
      keyboardShortcuts: !isTouchDevice,
    }
  }, [deviceType, isTouchDevice])

  return getVideoSettings()
}

/**
 * Hook for orientation detection and handling
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait',
  )
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    const updateOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth
      setOrientation(isPortrait ? 'portrait' : 'landscape')

      // Get screen orientation angle if available
      if (screen.orientation) {
        setAngle(screen.orientation.angle)
      } else if ((window as any).orientation !== undefined) {
        setAngle(Math.abs((window as any).orientation))
      }
    }

    updateOrientation()

    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(updateOrientation, 100)
    }

    window.addEventListener('resize', handleOrientationChange)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleOrientationChange)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return {
    orientation,
    angle,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  }
}

/**
 * Hook for performance monitoring based on device type
 */
export function usePerformanceMonitoring() {
  const { deviceType } = useDeviceType()
  const [metrics, setMetrics] = useState<{
    fcp?: number
    lcp?: number
    tti?: number
  }>({})

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    const budget = PERFORMANCE_BUDGETS[deviceType]

    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          setMetrics((prev) => ({ ...prev, fcp: entry.startTime }))
        }

        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics((prev) => ({ ...prev, lcp: entry.startTime }))
        }
      })
    })

    // Observe paint and LCP entries
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      console.warn('Performance monitoring not fully supported')
    }

    return () => {
      observer.disconnect()
    }
  }, [deviceType])

  return {
    metrics,
    budget: PERFORMANCE_BUDGETS[deviceType],
    isWithinBudget: {
      fcp: metrics.fcp
        ? metrics.fcp <= PERFORMANCE_BUDGETS[deviceType].firstContentfulPaint
        : null,
      lcp: metrics.lcp
        ? metrics.lcp <= PERFORMANCE_BUDGETS[deviceType].largestContentfulPaint
        : null,
    },
  }
}

/**
 * Hook for Vietnamese market specific adaptations
 */
export function useVietnameseMarket() {
  const { deviceType } = useDeviceType()

  return {
    prefersMobile: VIETNAMESE_DEVICE_USAGE.mobile > 0.7,
    recommendMobileFirst: true,
    commonScreenSizes: [
      { width: 375, height: 667, name: 'iPhone 6/7/8' },
      { width: 414, height: 896, name: 'iPhone 11/XR' },
      { width: 360, height: 640, name: 'Samsung Galaxy S8' },
      { width: 412, height: 915, name: 'Samsung Galaxy S20' },
    ],
    networkConsiderations: {
      optimizeFor3G: deviceType === 'mobile',
      preferCompression: true,
      lazyLoadImages: true,
    },
    culturalPreferences: {
      preferVerticalScrolling: true,
      expectTouchFirst: true,
      favorVisualContent: true,
    },
  }
}

/**
 * Hook for accessibility considerations on different devices
 */
export function useAccessibility() {
  const { deviceType } = useDeviceType()
  const { isTouchDevice } = useTouchDevice()

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [prefersHighContrast, setPrefersHighContrast] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')

    setPrefersReducedMotion(motionQuery.matches)
    setPrefersHighContrast(contrastQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches)
    const handleContrastChange = (e: MediaQueryListEvent) =>
      setPrefersHighContrast(e.matches)

    motionQuery.addEventListener('change', handleMotionChange)
    contrastQuery.addEventListener('change', handleContrastChange)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
    }
  }, [])

  return {
    prefersReducedMotion,
    prefersHighContrast,
    recommendedFontSize: deviceType === 'mobile' ? '16px' : '16px', // Never smaller than 16px
    recommendedTouchTarget: isTouchDevice ? '44px' : '40px',
    shouldUseLargerControls: deviceType === 'mobile',
    shouldReduceAnimations: prefersReducedMotion,
    shouldIncreaseContrast: prefersHighContrast,
  }
}

// Export all hooks as default
export default {
  useDeviceType,
  useBreakpoint,
  useTouchDevice,
  useResponsiveGrid,
  useResponsiveNavigation,
  useResponsiveImage,
  useResponsiveVideo,
  useOrientation,
  usePerformanceMonitoring,
  useVietnameseMarket,
  useAccessibility,
}
