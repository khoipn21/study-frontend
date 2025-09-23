/**
 * Responsive Design System for Study Platform
 * Mobile-first approach with Vietnamese market considerations
 */

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large-desktop'

// Breakpoint definitions (mobile-first)
export const BREAKPOINTS = {
  xs: '375px', // Mobile small (iPhone SE)
  sm: '640px', // Mobile large (standard phones)
  md: '768px', // Tablet portrait
  lg: '1024px', // Tablet landscape / Small desktop
  xl: '1280px', // Desktop
  '2xl': '1536px', // Large desktop
} as const

// Device type mappings
export const DEVICE_BREAKPOINTS: Record<
  DeviceType,
  { min?: Breakpoint; max?: Breakpoint }
> = {
  mobile: { max: 'md' },
  tablet: { min: 'md', max: 'lg' },
  desktop: { min: 'lg', max: '2xl' },
  'large-desktop': { min: '2xl' },
}

// Vietnamese market specific considerations
export const VIETNAMESE_DEVICE_USAGE = {
  mobile: 0.78, // 78% mobile usage in Vietnam
  tablet: 0.12, // 12% tablet usage
  desktop: 0.1, // 10% desktop usage
} as const

/**
 * Responsive grid system
 */
export const GRID_COLUMNS = {
  xs: 1, // Single column on mobile
  sm: 2, // Two columns on large mobile
  md: 3, // Three columns on tablet
  lg: 4, // Four columns on desktop
  xl: 5, // Five columns on large desktop
  '2xl': 6, // Six columns on extra large
} as const

/**
 * Container max widths for different breakpoints
 */
export const CONTAINER_SIZES = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

/**
 * Spacing scale optimized for touch interfaces
 */
export const TOUCH_SPACING = {
  'touch-xs': '8px', // 8px - Minimal touch spacing
  'touch-sm': '12px', // 12px - Small touch spacing
  'touch-md': '16px', // 16px - Standard touch spacing
  'touch-lg': '24px', // 24px - Large touch spacing
  'touch-xl': '32px', // 32px - Extra large touch spacing
  'touch-2xl': '48px', // 48px - Maximum touch spacing
} as const

/**
 * Touch target sizes (following accessibility guidelines)
 */
export const TOUCH_TARGETS = {
  minimum: '44px', // Minimum touch target (iOS/WCAG)
  comfortable: '48px', // Comfortable touch target
  large: '56px', // Large touch target for primary actions
  extra: '64px', // Extra large for accessibility
} as const

/**
 * Typography scale for responsive design
 */
export const RESPONSIVE_TYPOGRAPHY = {
  xs: {
    'text-xs': '0.75rem', // 12px
    'text-sm': '0.875rem', // 14px
    'text-base': '1rem', // 16px
    'text-lg': '1.125rem', // 18px
    'text-xl': '1.25rem', // 20px
    'text-2xl': '1.5rem', // 24px
    'text-3xl': '1.875rem', // 30px
  },
  sm: {
    'text-xs': '0.75rem',
    'text-sm': '0.875rem',
    'text-base': '1rem',
    'text-lg': '1.125rem',
    'text-xl': '1.25rem',
    'text-2xl': '1.5rem',
    'text-3xl': '1.875rem',
  },
  md: {
    'text-xs': '0.75rem',
    'text-sm': '0.875rem',
    'text-base': '1rem',
    'text-lg': '1.125rem',
    'text-xl': '1.25rem',
    'text-2xl': '1.5rem',
    'text-3xl': '2.25rem', // Larger on tablet+
  },
  lg: {
    'text-xs': '0.75rem',
    'text-sm': '0.875rem',
    'text-base': '1rem',
    'text-lg': '1.125rem',
    'text-xl': '1.25rem',
    'text-2xl': '1.5rem',
    'text-3xl': '2.25rem',
  },
} as const

/**
 * Component-specific responsive configurations
 */

// Course Card responsive sizes
export const COURSE_CARD_CONFIG = {
  mobile: {
    aspectRatio: '16/9',
    padding: '12px',
    titleSize: 'text-base',
    descriptionLines: 2,
    showInstructor: false,
    showMetadata: 'minimal', // Only essential info
  },
  tablet: {
    aspectRatio: '16/9',
    padding: '16px',
    titleSize: 'text-lg',
    descriptionLines: 3,
    showInstructor: true,
    showMetadata: 'standard',
  },
  desktop: {
    aspectRatio: '16/9',
    padding: '20px',
    titleSize: 'text-lg',
    descriptionLines: 3,
    showInstructor: true,
    showMetadata: 'full',
  },
} as const

// Navigation responsive behavior
export const NAVIGATION_CONFIG = {
  mobile: {
    type: 'bottom-sheet', // Slide-up navigation on mobile
    showLabels: false,
    iconSize: '24px',
    collapsible: true,
  },
  tablet: {
    type: 'sidebar',
    showLabels: true,
    iconSize: '20px',
    collapsible: true,
  },
  desktop: {
    type: 'horizontal',
    showLabels: true,
    iconSize: '20px',
    collapsible: false,
  },
} as const

// Course Player responsive layouts
export const PLAYER_CONFIG = {
  mobile: {
    orientation: 'portrait',
    sidebarPosition: 'bottom',
    controlsSize: 'large',
    showSidebar: false, // Hidden by default
    autoHideControls: 3000, // 3 seconds
  },
  tablet: {
    orientation: 'landscape',
    sidebarPosition: 'right',
    controlsSize: 'medium',
    showSidebar: true,
    autoHideControls: 5000, // 5 seconds
  },
  desktop: {
    orientation: 'landscape',
    sidebarPosition: 'right',
    controlsSize: 'medium',
    showSidebar: true,
    autoHideControls: 5000,
  },
} as const

// Dashboard responsive layouts
export const DASHBOARD_CONFIG = {
  mobile: {
    layout: 'stacked', // Vertical stack layout
    cardsPerRow: 1,
    showSidebar: false,
    chartType: 'simple', // Simplified charts
    statsCards: 'carousel', // Horizontal scroll
  },
  tablet: {
    layout: 'grid',
    cardsPerRow: 2,
    showSidebar: true,
    chartType: 'standard',
    statsCards: 'grid',
  },
  desktop: {
    layout: 'dashboard', // Full dashboard layout
    cardsPerRow: 3,
    showSidebar: true,
    chartType: 'advanced',
    statsCards: 'grid',
  },
} as const

/**
 * Performance optimizations for mobile
 */
export const MOBILE_OPTIMIZATIONS = {
  // Image loading strategies
  images: {
    mobile: {
      loading: 'lazy',
      quality: 75,
      format: 'webp',
      sizes: '(max-width: 768px) 100vw, 50vw',
    },
    tablet: {
      loading: 'lazy',
      quality: 85,
      format: 'webp',
      sizes: '(max-width: 1024px) 50vw, 33vw',
    },
    desktop: {
      loading: 'lazy',
      quality: 90,
      format: 'webp',
      sizes: '(max-width: 1280px) 33vw, 25vw',
    },
    'large-desktop': {
      loading: 'lazy',
      quality: 95,
      format: 'webp',
      sizes: '25vw',
    },
  },

  // Video streaming optimization
  video: {
    mobile: {
      defaultQuality: '480p',
      preload: 'metadata',
      autoplay: false,
      controls: 'simple',
    },
    tablet: {
      defaultQuality: '720p',
      preload: 'metadata',
      autoplay: false,
      controls: 'standard',
    },
    desktop: {
      defaultQuality: '1080p',
      preload: 'auto',
      autoplay: false,
      controls: 'advanced',
    },
    'large-desktop': {
      defaultQuality: '4K',
      preload: 'auto',
      autoplay: false,
      controls: 'advanced',
    },
  },

  // Bundle splitting for better loading
  bundles: {
    critical: ['core', 'authentication', 'navigation'],
    deferred: ['dashboard', 'course-player', 'analytics'],
    lazy: ['admin', 'instructor-tools', 'advanced-features'],
  },
} as const

/**
 * Accessibility configurations for different devices
 */
export const ACCESSIBILITY_CONFIG = {
  mobile: {
    fontSize: {
      base: '16px', // Never smaller than 16px to prevent zoom
      minimum: '14px', // Minimum readable size
      maximum: '24px', // Maximum for headings
    },
    contrast: 'high', // Higher contrast for outdoor usage
    touchTargets: TOUCH_TARGETS.comfortable,
    focusVisible: 'enhanced', // More visible focus indicators
  },
  tablet: {
    fontSize: {
      base: '16px',
      minimum: '14px',
      maximum: '28px',
    },
    contrast: 'standard',
    touchTargets: TOUCH_TARGETS.minimum,
    focusVisible: 'standard',
  },
  desktop: {
    fontSize: {
      base: '16px',
      minimum: '14px',
      maximum: '32px',
    },
    contrast: 'standard',
    touchTargets: '40px', // Smaller for mouse interaction
    focusVisible: 'standard',
  },
} as const

/**
 * Utility functions for responsive behavior
 */

export function getDeviceType(width: number): DeviceType {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  if (width < 1536) return 'desktop'
  return 'large-desktop'
}

export function getGridColumns(device: DeviceType): number {
  switch (device) {
    case 'mobile':
      return 1
    case 'tablet':
      return 2
    case 'desktop':
      return 3
    case 'large-desktop':
      return 4
    default:
      return 1
  }
}

export function shouldShowSidebar(device: DeviceType): boolean {
  return device !== 'mobile'
}

export function getNavigationType(
  device: DeviceType,
): 'horizontal' | 'sidebar' | 'bottom-sheet' {
  switch (device) {
    case 'mobile':
      return 'bottom-sheet'
    case 'tablet':
      return 'sidebar'
    default:
      return 'horizontal'
  }
}

export function getOptimalImageSize(
  device: DeviceType,
  containerWidth: number,
): {
  width: number
  height: number
  quality: number
} {
  const config = MOBILE_OPTIMIZATIONS.images[device]
  const baseWidth = containerWidth
  const aspectRatio = 16 / 9

  return {
    width: Math.round(baseWidth),
    height: Math.round(baseWidth / aspectRatio),
    quality: config.quality,
  }
}

export function getVideoQuality(
  device: DeviceType,
  bandwidth?: 'slow' | 'fast',
): string {
  const config = MOBILE_OPTIMIZATIONS.video[device]
  let quality = config.defaultQuality

  // Adjust based on bandwidth if provided
  if (bandwidth === 'slow' && device === 'desktop') {
    quality = '720p'
  } else if (bandwidth === 'fast' && device === 'mobile') {
    quality = '720p'
  }

  return quality
}

/**
 * Responsive utilities for CSS-in-JS or styled components
 */
export const mediaQueries = {
  xs: `(min-width: ${BREAKPOINTS.xs})`,
  sm: `(min-width: ${BREAKPOINTS.sm})`,
  md: `(min-width: ${BREAKPOINTS.md})`,
  lg: `(min-width: ${BREAKPOINTS.lg})`,
  xl: `(min-width: ${BREAKPOINTS.xl})`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']})`,

  // Max-width queries for mobile-first approach
  'max-xs': `(max-width: calc(${BREAKPOINTS.xs} - 1px))`,
  'max-sm': `(max-width: calc(${BREAKPOINTS.sm} - 1px))`,
  'max-md': `(max-width: calc(${BREAKPOINTS.md} - 1px))`,
  'max-lg': `(max-width: calc(${BREAKPOINTS.lg} - 1px))`,
  'max-xl': `(max-width: calc(${BREAKPOINTS.xl} - 1px))`,

  // Device-specific queries
  mobile: `(max-width: calc(${BREAKPOINTS.md} - 1px))`,
  tablet: `(min-width: ${BREAKPOINTS.md}) and (max-width: calc(${BREAKPOINTS.lg} - 1px))`,
  desktop: `(min-width: ${BREAKPOINTS.lg})`,

  // Orientation queries
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',

  // High-DPI displays (common on mobile)
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',

  // Touch device detection
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',

  // Reduced motion preference
  reduceMotion: '(prefers-reduced-motion: reduce)',

  // Dark mode preference
  darkMode: '(prefers-color-scheme: dark)',

  // High contrast preference
  highContrast: '(prefers-contrast: high)',
} as const

/**
 * Performance monitoring for responsive features
 */
export const PERFORMANCE_BUDGETS = {
  mobile: {
    firstContentfulPaint: 1500, // 1.5s
    largestContentfulPaint: 2500, // 2.5s
    timeToInteractive: 3500, // 3.5s
    bundleSize: 200, // 200kb
  },
  tablet: {
    firstContentfulPaint: 1200,
    largestContentfulPaint: 2000,
    timeToInteractive: 3000,
    bundleSize: 300,
  },
  desktop: {
    firstContentfulPaint: 1000,
    largestContentfulPaint: 1800,
    timeToInteractive: 2500,
    bundleSize: 500,
  },
} as const

/**
 * Vietnamese-specific mobile considerations
 */
export const VIETNAMESE_MOBILE_PATTERNS = {
  // Popular screen sizes in Vietnam
  popularSizes: [
    { width: 375, height: 667, name: 'iPhone 6/7/8' },
    { width: 414, height: 896, name: 'iPhone 11/XR' },
    { width: 360, height: 640, name: 'Samsung Galaxy S8' },
    { width: 412, height: 915, name: 'Samsung Galaxy S20' },
  ],

  // Network conditions
  networkSpeeds: {
    '3G': { downloadSpeed: 1.6, uploadSpeed: 0.8 }, // Mbps
    '4G': { downloadSpeed: 20, uploadSpeed: 10 },
    WiFi: { downloadSpeed: 50, uploadSpeed: 25 },
  },

  // Usage patterns
  usagePatterns: {
    peakHours: ['19:00-22:00'], // Evening learning time
    commonGestures: ['swipe', 'pinch-zoom', 'long-press'],
    preferredOrientations: {
      video: 'landscape',
      reading: 'portrait',
      browsing: 'portrait',
    },
  },
} as const

export default {
  BREAKPOINTS,
  DEVICE_BREAKPOINTS,
  GRID_COLUMNS,
  CONTAINER_SIZES,
  TOUCH_SPACING,
  TOUCH_TARGETS,
  RESPONSIVE_TYPOGRAPHY,
  COURSE_CARD_CONFIG,
  NAVIGATION_CONFIG,
  PLAYER_CONFIG,
  DASHBOARD_CONFIG,
  MOBILE_OPTIMIZATIONS,
  ACCESSIBILITY_CONFIG,
  mediaQueries,
  PERFORMANCE_BUDGETS,
  VIETNAMESE_MOBILE_PATTERNS,
  getDeviceType,
  getGridColumns,
  shouldShowSidebar,
  getNavigationType,
  getOptimalImageSize,
  getVideoQuality,
}
