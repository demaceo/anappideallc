import { useEffect } from 'react'
import type { RefObject } from 'react'

const MAX_DEG = 3

export function useGyroParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const isMobile = matchMedia('(max-width: 1023px)').matches
    if (!isMobile) return

    const el = ref.current
    if (!el) return

    let unmounted = false
    let frame = 0
    let pendingX = 0
    let pendingY = 0

    const apply = () => {
      // pendingX (horizontal tilt) drives rotateY; pendingY (vertical) drives rotateX
      el.style.setProperty('--parallax-y', `${pendingX}deg`)
      el.style.setProperty('--parallax-x', `${pendingY}deg`)
      frame = 0
    }

    const onOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0  // left-right tilt: [-90, 90]
      const beta  = e.beta  ?? 45 // front-back tilt: [-180, 180]; ~45 is natural hold angle

      // Normalize around resting hold angle (~45deg forward tilt)
      const nx = Math.max(-1, Math.min(1, gamma / 45))
      const ny = Math.max(-1, Math.min(1, (beta - 45) / 45))
      pendingX = nx * MAX_DEG
      pendingY = ny * MAX_DEG

      if (!frame) frame = requestAnimationFrame(apply)
    }

    let listening = false

    const startListening = () => {
      if (listening) return
      window.addEventListener('deviceorientation', onOrientation)
      listening = true
    }

    const requestGyroPermission = async () => {
      // iOS 13+ requires explicit permission for DeviceOrientationEvent.
      // Request lazily on first touchstart — never on page load.
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>
      }
      if (typeof DOE.requestPermission === 'function') {
        try {
          const result = await DOE.requestPermission()
          if (!unmounted && result === 'granted') startListening()
          // Denied or error — silent fallback, no parallax
        } catch {
          // Unsupported — silent fallback
        }
      } else {
        // Android Chrome and other non-iOS — no permission needed
        startListening()
      }
    }

    document.addEventListener('touchstart', requestGyroPermission, { once: true })

    return () => {
      unmounted = true
      document.removeEventListener('touchstart', requestGyroPermission)
      window.removeEventListener('deviceorientation', onOrientation)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref])
}
