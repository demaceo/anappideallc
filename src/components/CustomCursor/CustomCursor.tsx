import { useEffect, useRef } from 'react'

// Blend-mode cursor dot that trails the pointer and grows over interactive
// elements. Client-only and fine-pointer-only, disabled under reduced motion.
// The node always renders (so server and client markup match); the behavior
// attaches in the effect.
//
// This used to also toggle `.has-custom-cursor` on <html>, which drove a
// `cursor: none` rule across the document. That removed the system pointer —
// the affordance people with low vision or motor impairments rely on to track
// where they are — and `mix-blend-mode: difference` can render the replacement
// invisible against mid-greys, leaving no pointer at all. The dot is an accent
// on top of the real cursor now, so the class had no consumer left.
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const dot = dotRef.current
    if (!dot) return


    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let x = targetX
    let y = targetY
    let raf = 0
    let visible = false

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
      }
    }
    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
    }
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null
      dot.classList.toggle(
        'cursor-grow',
        !!t && !!t.closest('a, button, [role="button"]'),
      )
    }

    const tick = () => {
      x += (targetX - x) * 0.2
      y += (targetY - y) * 0.2
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
}
