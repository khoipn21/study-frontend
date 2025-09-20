/**
 * Currency utilities for Vietnamese Dong (VND) support
 * Handles formatting, parsing, and conversion for the Vietnamese market
 */

export type Currency = 'VND' | 'USD' | 'EUR'
export type ExchangeRates = Record<Currency, number>

// Default exchange rates (should be fetched from API in production)
const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  VND: 1, // Base currency
  USD: 0.000041, // 1 VND = 0.000041 USD (approximate)
  EUR: 0.000038, // 1 VND = 0.000038 EUR (approximate)
}

/**
 * Format amount in Vietnamese Dong
 * Examples: 1000000 -> "1.000.000 ₫", 500000 -> "500.000 ₫"
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount < 0) {
    return '0 ₫'
  }

  // Round to nearest dong (no decimal places for VND)
  const roundedAmount = Math.round(amount)

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedAmount)
}

/**
 * Format amount in any supported currency
 */
export function formatCurrency(
  amount: number,
  currency: Currency = 'VND',
): string {
  if (isNaN(amount) || amount < 0) {
    return currency === 'VND' ? '0 ₫' : `0 ${currency}`
  }

  const locale = currency === 'VND' ? 'vi-VN' : 'en-US'
  const fractionDigits = currency === 'VND' ? 0 : 2

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount)
}

/**
 * Parse VND string back to number
 * Examples: "1.000.000 ₫" -> 1000000, "500K ₫" -> 500000
 */
export function parseVND(vndString: string): number {
  if (!vndString || typeof vndString !== 'string') {
    return 0
  }

  // Remove currency symbol and spaces
  let cleaned = vndString.replace(/[₫\s]/g, '')

  // Handle K/M suffixes (Vietnamese common usage)
  if (cleaned.endsWith('K') || cleaned.endsWith('k')) {
    const number = parseFloat(cleaned.slice(0, -1))
    return Math.round(number * 1000)
  }

  if (cleaned.endsWith('M') || cleaned.endsWith('m')) {
    const number = parseFloat(cleaned.slice(0, -1))
    return Math.round(number * 1000000)
  }

  // Remove dots (thousands separators) and convert
  cleaned = cleaned.replace(/\./g, '')
  const parsed = parseInt(cleaned, 10)

  return isNaN(parsed) ? 0 : parsed
}

/**
 * Convert between currencies using exchange rates
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRates: ExchangeRates = DEFAULT_EXCHANGE_RATES,
): number {
  if (fromCurrency === toCurrency) {
    return amount
  }

  // Convert to VND first (base currency)
  const vndAmount =
    fromCurrency === 'VND' ? amount : amount / exchangeRates[fromCurrency]

  // Convert from VND to target currency
  const convertedAmount =
    toCurrency === 'VND' ? vndAmount : vndAmount * exchangeRates[toCurrency]

  return Math.round(convertedAmount)
}

/**
 * Convert USD to VND (most common conversion for international courses)
 */
export function usdToVND(usdAmount: number, exchangeRate?: number): number {
  const rate = exchangeRate || 24000 // Default USD to VND rate
  return Math.round(usdAmount * rate)
}

/**
 * Convert VND to USD
 */
export function vndToUSD(vndAmount: number, exchangeRate?: number): number {
  const rate = exchangeRate || 24000 // Default USD to VND rate
  return Math.round((vndAmount / rate) * 100) / 100 // Round to 2 decimal places
}

/**
 * Format price with discount calculation
 */
export function formatPriceWithDiscount(
  originalPrice: number,
  discountPercentage: number,
  currency: Currency = 'VND',
): {
  originalPrice: string
  discountedPrice: string
  discountAmount: string
  discountPercentage: number
} {
  const discountAmount = Math.round(originalPrice * (discountPercentage / 100))
  const discountedPrice = originalPrice - discountAmount

  return {
    originalPrice: formatCurrency(originalPrice, currency),
    discountedPrice: formatCurrency(discountedPrice, currency),
    discountAmount: formatCurrency(discountAmount, currency),
    discountPercentage,
  }
}

/**
 * Format course price with free course handling
 */
export function formatCoursePrice(
  price: number | null | undefined,
  currency: Currency = 'VND',
  isFree?: boolean,
): {
  display: string
  isFree: boolean
  numericValue: number
} {
  // Handle free courses
  if (isFree || price === 0 || price === null || price === undefined) {
    return {
      display: 'Miễn phí',
      isFree: true,
      numericValue: 0,
    }
  }

  return {
    display: formatCurrency(price, currency),
    isFree: false,
    numericValue: price,
  }
}

/**
 * Create a price range formatter for filters
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  currency: Currency = 'VND',
): string {
  if (minPrice === 0 && maxPrice === Infinity) {
    return 'Tất cả giá'
  }

  if (minPrice === 0) {
    return `Dưới ${formatCurrency(maxPrice, currency)}`
  }

  if (maxPrice === Infinity) {
    return `Trên ${formatCurrency(minPrice, currency)}`
  }

  return `${formatCurrency(minPrice, currency)} - ${formatCurrency(maxPrice, currency)}`
}

/**
 * Vietnamese number formatting for large numbers
 */
export function formatVietnameseNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }

  return num.toString()
}

/**
 * Currency conversion utilities for API integration
 */
export class CurrencyConverter {
  private static exchangeRates: ExchangeRates = DEFAULT_EXCHANGE_RATES
  private static lastUpdated: Date | null = null

  /**
   * Update exchange rates from API
   */
  static async updateExchangeRates(): Promise<void> {
    try {
      // In production, fetch from a real exchange rate API
      // For now, using mock data
      const response = await fetch('/api/v1/exchange-rates')
      if (response.ok) {
        const rates = await response.json()
        this.exchangeRates = rates
        this.lastUpdated = new Date()
      }
    } catch (error) {
      console.warn('Failed to update exchange rates:', error)
      // Continue with default rates
    }
  }

  /**
   * Get current exchange rates
   */
  static getExchangeRates(): ExchangeRates {
    return { ...this.exchangeRates }
  }

  /**
   * Check if rates need updating (older than 1 hour)
   */
  static needsUpdate(): boolean {
    if (!this.lastUpdated) return true

    const oneHour = 60 * 60 * 1000
    return Date.now() - this.lastUpdated.getTime() > oneHour
  }

  /**
   * Convert with automatic rate updates
   */
  static async convert(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
  ): Promise<number> {
    if (this.needsUpdate()) {
      await this.updateExchangeRates()
    }

    return convertCurrency(amount, fromCurrency, toCurrency, this.exchangeRates)
  }
}

/**
 * Price validation utilities
 */
export function validatePrice(price: string | number): {
  isValid: boolean
  numericValue: number
  error?: string
} {
  if (typeof price === 'string') {
    const parsed = parseVND(price)

    if (isNaN(parsed) || parsed < 0) {
      return {
        isValid: false,
        numericValue: 0,
        error: 'Giá không hợp lệ',
      }
    }

    return {
      isValid: true,
      numericValue: parsed,
    }
  }

  if (typeof price === 'number') {
    if (isNaN(price) || price < 0) {
      return {
        isValid: false,
        numericValue: 0,
        error: 'Giá không hợp lệ',
      }
    }

    return {
      isValid: true,
      numericValue: price,
    }
  }

  return {
    isValid: false,
    numericValue: 0,
    error: 'Định dạng giá không hợp lệ',
  }
}

// Export commonly used constants
export const CURRENCY_SYMBOLS = {
  VND: '₫',
  USD: '$',
  EUR: '€',
} as const

export const PRICE_RANGES = {
  FREE: { min: 0, max: 0, label: 'Miễn phí' },
  UNDER_500K: { min: 0, max: 500000, label: 'Dưới 500K ₫' },
  UNDER_1M: { min: 0, max: 1000000, label: 'Dưới 1M ₫' },
  FROM_500K_TO_1M: { min: 500000, max: 1000000, label: '500K - 1M ₫' },
  FROM_1M_TO_2M: { min: 1000000, max: 2000000, label: '1M - 2M ₫' },
  ABOVE_2M: { min: 2000000, max: Infinity, label: 'Trên 2M ₫' },
} as const

/**
 * Format duration in Vietnamese format
 */
export function formatVietnameseDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} phút`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} giờ`
  }

  return `${hours} giờ ${remainingMinutes} phút`
}

export default {
  formatVND,
  formatCurrency,
  parseVND,
  convertCurrency,
  usdToVND,
  vndToUSD,
  formatPriceWithDiscount,
  formatCoursePrice,
  formatPriceRange,
  formatVietnameseNumber,
  formatVietnameseDuration,
  validatePrice,
  CurrencyConverter,
  CURRENCY_SYMBOLS,
  PRICE_RANGES,
}
