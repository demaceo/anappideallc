import { useEffect } from 'react'
import type { RefObject } from 'react'

const SESSION_KEY = 'introPlayed'
const RETURN_FLAG = 'app:lastNonRootPath'

const GRAVITY_EASING = 'cubic-bezier(0.55, 0.085, 0.68, 0.53)'
const HERO_EASING    = 'cubic-bezier(0.55, 0.02, 0.65, 0.40)'

// Small blocks scaffold the grid; hero lands last for maximum payoff.
const DROP_DELAY: Record<string, number> = {
  brand:    0,
  about:    110,
  services: 210,
  work:     310,
  process:  390,
  contact:  460,
  hero:     600,
}

// Each keyframe string includes ALL transform functions so the browser
// interpolates cleanly without converting to matrix form.
const NON_HERO_FRAMES: Keyframe[] = [
  { offset: 0.00, transform: 'translateY(-130%) scaleX(1) scaleY(1)',    opacity: 0, easing: GRAVITY_EASING },
  { offset: 0.75, transform: 'translateY(0) scaleX(1) scaleY(1)',        opacity: 1 },
  { offset: 0.83, transform: 'translateY(0) scaleX(1.06) scaleY(0.90)', opacity: 1 },
  { offset: 0.90, transform: 'translateY(-6px) scaleX(0.98) scaleY(1.02)', opacity: 1 },
  { offset: 0.96, transform: 'translateY(0) scaleX(1) scaleY(1)',        opacity: 1 },
  { offset: 1.00, transform: 'translateY(0) scaleX(1) scaleY(1)',        opacity: 1 },
]

const HERO_FRAMES: Keyframe[] = [
  { offset: 0.00, transform: 'translateY(-140%) scaleX(0.90) scaleY(1.10)', opacity: 0, easing: HERO_EASING },
  { offset: 0.74, transform: 'translateY(0) scaleX(0.90) scaleY(1.10)',     opacity: 1 },
  { offset: 0.80, transform: 'translateY(0) scaleX(1.10) scaleY(0.87)',     opacity: 1 },
  { offset: 0.88, transform: 'translateY(-13px) scaleX(0.96) scaleY(1.04)', opacity: 1 },
  { offset: 0.94, transform: 'translateY(0) scaleX(1) scaleY(1)',           opacity: 1 },
  { offset: 1.00, transform: 'translateY(0) scaleX(1) scaleY(1)',           opacity: 1 },
]

const CONTENT_FRAMES: Keyframe[] = [
  { opacity: 0, transform: 'translateY(6px)', filter: 'blur(2px)' },
  { opacity: 1, transform: 'translateY(0)',   filter: 'blur(0px)' },
]

function animateReveal(el: HTMLElement, settleMs: number): Animation[] {
  return Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]')).map((child, i) =>
    child.animate(CONTENT_FRAMES, {
      duration: 380,
      delay: settleMs + i * 80,
      fill: 'backwards',
      easing: 'ease-out',
    }),
  )
}

export function useGravityDrop(refs: RefObject<HTMLElement | null>[]) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let alreadyPlayed = false
    try { alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === '1' } catch { /* ignore */ }
    if (alreadyPlayed) return

    let returningFrom: string | null = null
    try { returningFrom = sessionStorage.getItem(RETURN_FLAG) } catch { /* ignore */ }
    if (returningFrom && returningFrom !== '/' && returningFrom !== '') return

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* ignore */ }
      return
    }

    const animations: Animation[] = []

    refs.forEach((ref) => {
      const el = ref.current
      if (!el) return
      const blockId = el.dataset.blockId ?? ''
      const isHero  = blockId === 'hero'
      const delay   = DROP_DELAY[blockId] ?? 0
      const duration = isHero ? 840 + Math.random() * 20 : 780 + Math.random() * 80

      const anim = el.animate(isHero ? HERO_FRAMES : NON_HERO_FRAMES, {
        duration,
        delay,
        fill: 'backwards',
      })
      animations.push(anim)

      const settleMs = delay + duration * (isHero ? 0.94 : 0.96)
      animations.push(...animateReveal(el, settleMs))
    })

    let cancelled = false
    Promise.allSettled(animations.map((a) => a.finished)).then(() => {
      if (cancelled) return
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* ignore */ }
    })

    return () => {
      cancelled = true
      animations.forEach((a) => { if (a.playState !== 'finished') a.cancel() })
    }
  }, [refs])
}
