import { useState, useEffect } from 'react'

export const useDeviceDetect = () => {
  // Initialize with SSR-safe detection
  const getInitialDevice = () => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false }

    const userAgent = navigator.userAgent.toLowerCase()
    const width = window.innerWidth
    const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i
    const tabletRegex = /ipad|android(?!.*mobile)|tablet/i

    const isMobileDevice = mobileRegex.test(userAgent) || width < 768
    const isTabletDevice = tabletRegex.test(userAgent) || (width >= 768 && width < 1024)

    return { isMobile: isMobileDevice, isTablet: isTabletDevice }
  }

  const initial = getInitialDevice()
  const [isMobile, setIsMobile] = useState(initial.isMobile)
  const [isTablet, setIsTablet] = useState(initial.isTablet)

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i
    const tabletRegex = /ipad|android(?!.*mobile)|tablet/i

    const checkDevice = () => {
      const width = window.innerWidth
      const isMobileDevice = mobileRegex.test(userAgent) || width < 768
      const isTabletDevice = tabletRegex.test(userAgent) || (width >= 768 && width < 1024)

      setIsMobile(isMobileDevice)
      setIsTablet(isTabletDevice)
    }

    // Check immediately
    checkDevice()

    // Add resize listener
    window.addEventListener('resize', checkDevice)

    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet }
}
