import { useEffect } from 'react'
import type { RefObject } from 'react'

const SESSION_KEY = 'introPlayed'
const RETURN_FLAG = 'app:lastNonRootPath'

// Plays a once-per-session gravity drop on each block. Uses WAAPI directly
// (no Motion springs) so the easing curve is a true quadratic-in
// approximation of gravity rather than a damped harmonic oscillator.
// A small bounce + settle is appended via a 4-keyframe animation.
//
// Honors prefers-reduced-motion by skipping the animation entirely and
// flagging the session so subsequent visits within the tab are also calm.
//
// Coordinates with useLineClearController: if the user is returning from
// a content page (RETURN_FLAG present), the gravity drop is skipped so
// the reverse line-clear can play instead.
export function useGravityDrop(refs: RefObject<HTMLElement | null>[]) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let alreadyPlayed = false
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      /* sessionStorage unavailable */
    }
    if (alreadyPlayed) return

    // Defer to line-clear's reverse animation if user is returning from /about etc.
    let returningFrom: string | null = null
    try {
      returningFrom = sessionStorage.getItem(RETURN_FLAG)
    } catch {
      /* ignore */
    }
    if (returningFrom && returningFrom !== '/' && returningFrom !== '') return

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* ignore */
      }
      return
    }

    const animations: Animation[] = []

    refs.forEach((ref, i) => {
      const el = ref.current
      if (!el) return

      const duration = 720 + Math.random() * 280
      const delay = i * 90 + Math.random() * 30

      const anim = el.animate(
        [
          {
            transform: 'translateY(-120vh)',
            offset: 0,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
          },
          { transform: 'translateY(0)', offset: 0.78 },
          {
            transform: 'translateY(-28px)',
            offset: 0.87,
            easing: 'cubic-bezier(0, 0, 0.2, 1)',
          },
          {
            transform: 'translateY(0)',
            offset: 1,
            easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
          },
        ],
        { duration, delay, fill: 'backwards' },
      )
      animations.push(anim)
    })

    let cancelled = false
    Promise.allSettled(animations.map((a) => a.finished)).then(() => {
      if (cancelled) return
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* ignore */
      }
    })

    return () => {
      cancelled = true
      animations.forEach((a) => {
        if (a.playState !== 'finished') a.cancel()
      })
    }
  }, [refs])
}
