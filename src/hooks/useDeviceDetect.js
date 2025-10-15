import { useState, useEffect } from 'react'

export const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

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

    checkDevice()
    window.addEventListener('resize', checkDevice)

    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet }
}
