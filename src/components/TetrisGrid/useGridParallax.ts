import { useEffect, useRef } from 'react'

// Tracks mousemove on the grid container and writes two CSS custom
// properties (--parallax-x, --parallax-y) that the grid's transform reads.
// rAF-throttled so it never runs more than once per frame. Touch devices
// and reduced-motion users skip the listener entirely.
export function useGridParallax(maxDeg = 4) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const isHover = matchMedia('(hover: hover)').matches
    if (reduced || !isHover) return

    let frame = 0
    let pendingX = 0
    let pendingY = 0

    const apply = () => {
      el.style.setProperty('--parallax-y', `${pendingX}deg`)
      el.style.setProperty('--parallax-x', `${pendingY}deg`)
      frame = 0
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      // Normalize to [-1, 1] within element bounds.
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      pendingX = nx * maxDeg * 2
      pendingY = -ny * maxDeg * 2
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onLeave = () => {
      pendingX = 0
      pendingY = 0
      if (!frame) frame = requestAnimationFrame(apply)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [maxDeg])

  return ref
}
