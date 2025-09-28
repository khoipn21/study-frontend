// Debug utility for resource download/preview issues
export async function debugResourceUrl(url: string, type: 'download' | 'preview') {
  console.log(`🔍 Debugging ${type} URL:`, url)

  // Check if URL is properly formatted
  try {
    const urlObj = new URL(url)
    console.log('✅ URL is valid:', {
      hostname: urlObj.hostname,
      pathname: urlObj.pathname,
      searchParams: Object.fromEntries(urlObj.searchParams.entries())
    })
  } catch (error) {
    console.error('❌ Invalid URL:', error)
    return { success: false, error: 'Invalid URL' }
  }

  // Test basic fetch
  try {
    console.log('🚀 Testing basic fetch...')
    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD to test without downloading full content
      mode: 'cors',
      credentials: 'omit'
    })

    console.log('📡 Response status:', response.status, response.statusText)
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        headers: Object.fromEntries(response.headers.entries())
      }
    }

    return {
      success: true,
      headers: Object.fromEntries(response.headers.entries()),
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    }
  } catch (error) {
    console.error('❌ Fetch failed:', error)

    if (error instanceof TypeError && error.message.includes('CORS')) {
      return {
        success: false,
        error: 'CORS error - S3 bucket CORS configuration issue',
        suggestion: 'Check S3 bucket CORS policy'
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown fetch error'
    }
  }
}

// Test download functionality with detailed logging
export async function testResourceDownload(url: string, filename: string) {
  console.log('📥 Testing download for:', filename)

  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit'
    })

    if (!response.ok) {
      throw new Error(`Download failed: HTTP ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    const contentLength = response.headers.get('content-length')

    console.log('📦 Content info:', {
      type: contentType,
      size: contentLength ? `${contentLength} bytes` : 'unknown'
    })

    const blob = await response.blob()
    console.log('✅ Blob created:', {
      size: blob.size,
      type: blob.type
    })

    // Verify blob is not empty or corrupted
    if (blob.size === 0) {
      throw new Error('Downloaded file is empty')
    }

    // For images, try to create object URL and test if it's valid
    if (contentType?.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(blob)

      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          console.log('✅ Image is valid:', {
            width: img.width,
            height: img.height
          })
          URL.revokeObjectURL(objectUrl)
          resolve({ success: true, blob, isValid: true })
        }
        img.onerror = () => {
          console.error('❌ Image is corrupted')
          URL.revokeObjectURL(objectUrl)
          resolve({ success: true, blob, isValid: false, error: 'Image corrupted' })
        }
        img.src = objectUrl
      })
    }

    return { success: true, blob, isValid: true }
  } catch (error) {
    console.error('❌ Download test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Check if signed URL is expired
export function checkUrlExpiry(url: string) {
  try {
    const urlObj = new URL(url)
    const expiresParam = urlObj.searchParams.get('X-Amz-Expires')
    const dateParam = urlObj.searchParams.get('X-Amz-Date')

    if (!dateParam || !expiresParam) {
      return { expired: false, reason: 'Not a signed URL or missing expiry info' }
    }

    // Parse the date from X-Amz-Date (format: YYYYMMDDTHHMMSSZ)
    const year = parseInt(dateParam.substring(0, 4))
    const month = parseInt(dateParam.substring(4, 6)) - 1 // JS months are 0-based
    const day = parseInt(dateParam.substring(6, 8))
    const hour = parseInt(dateParam.substring(9, 11))
    const minute = parseInt(dateParam.substring(11, 13))
    const second = parseInt(dateParam.substring(13, 15))

    const signedTime = new Date(Date.UTC(year, month, day, hour, minute, second))
    const expiryTime = new Date(signedTime.getTime() + parseInt(expiresParam) * 1000)
    const now = new Date()

    console.log('⏰ URL timing:', {
      signedAt: signedTime.toISOString(),
      expiresAt: expiryTime.toISOString(),
      currentTime: now.toISOString(),
      expired: now > expiryTime
    })

    return {
      expired: now > expiryTime,
      signedAt: signedTime,
      expiresAt: expiryTime,
      timeLeft: expiryTime.getTime() - now.getTime()
    }
  } catch (error) {
    console.error('❌ Error checking URL expiry:', error)
    return { expired: false, error: 'Could not parse expiry info' }
  }
}