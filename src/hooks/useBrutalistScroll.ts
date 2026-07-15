import { useEffect } from 'react'
import type { RefObject } from 'react'

// Brutalist scroll choreography (GSAP), scoped to the element in `scopeRef`.
//
// Everything here is progressive enhancement:
//   - It runs only in a real browser with motion allowed; on the server (during
//     prerender) and in the test env it bails before touching GSAP.
//   - GSAP + its plugins are lazy-imported, so they never enter the SSR /
//     prerender or Vitest module graph and can't break the static build.
//   - All work happens inside a gsap.context whose revert() restores every
//     mutation (including the SplitText DOM rewrite) before React reconciles.
//   - The whole GSAP block is wrapped in try/catch so a failed dynamic import
//     (or any headless quirk) can never break the page.
//
// Attribute hooks read from the markup:
//   [data-ghost]  giant watermark word → scroll-scrubbed parallax
//   [data-reveal] block → fade/slide in as it enters the viewport
//   [data-split]  heading/intro → SplitText word reveal (gated on fonts.ready)
//   [data-tilt]   card → 3D tilt toward the pointer (fine pointers only)
export function useBrutalistScroll(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return // no real layout (SSR/tests)
    const scope = scopeRef.current
    if (!scope) return

    let ctx: { revert: () => void } | undefined
    let cancelled = false

    ;(async () => {
      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        const { SplitText } = await import('gsap/SplitText')
        const { CustomEase } = await import('gsap/CustomEase')
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
        CustomEase.create('brutalist', 'M0,0 C0.05,0 0.1,1 0.35,1 0.6,1 0.8,1 1,1')

        // Skip entrance animations on elements already visible at load, so
        // above-the-fold content never flashes (shown → hidden → fade).
        const belowFold = (el: Element) =>
          el.getBoundingClientRect().top > window.innerHeight * 0.9

        ctx = gsap.context(() => {
          const listenerCleanups: Array<() => void> = []
          const splits: Array<{ revert: () => void }> = []

          // Ghost-watermark parallax — each drifts at its own rate while its
          // section passes through the viewport.
          gsap.utils.toArray<HTMLElement>('[data-ghost]').forEach((el, i) => {
            gsap.to(el, {
              yPercent: i % 2 === 0 ? -18 : -10,
              xPercent: i % 3 === 0 ? -8 : 6,
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            })
          })

          // Block reveals. Trigger as soon as the block starts entering the
          // viewport (start near the bottom edge) and settle quickly, so the
          // reveal keeps pace with scroll instead of finishing after the
          // content has already scrolled past.
          gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
            if (!belowFold(el)) return
            gsap.from(el, {
              opacity: 0,
              y: 28,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 95%' },
            })
          })

          // SplitText word reveals on marked headings/intro (static copy only).
          gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
            if (!belowFold(el)) return
            const split = new SplitText(el, { type: 'words' })
            splits.push(split)
            gsap.from(split.words, {
              opacity: 0,
              y: 16,
              rotationX: -30,
              stagger: 0.03,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 95%' },
            })
          })

          // 3D pointer tilt on cards (fine pointers only).
          if (window.matchMedia('(pointer: fine)').matches) {
            gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach((card) => {
              gsap.set(card, { transformPerspective: 700 })
              const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power1.out' })
              const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power1.out' })
              const onMove = (e: PointerEvent) => {
                const r = card.getBoundingClientRect()
                rotY(((e.clientX - r.left) / r.width - 0.5) * 10)
                rotX(-((e.clientY - r.top) / r.height - 0.5) * 10)
              }
              const onLeave = () => {
                rotX(0)
                rotY(0)
              }
              card.addEventListener('pointermove', onMove)
              card.addEventListener('pointerleave', onLeave)
              listenerCleanups.push(() => {
                card.removeEventListener('pointermove', onMove)
                card.removeEventListener('pointerleave', onLeave)
              })
            })
          }

          // Returned to gsap.context → runs on revert(): remove manual
          // listeners and restore SplitText's original DOM.
          return () => {
            listenerCleanups.forEach((fn) => fn())
            splits.forEach((s) => s.revert())
          }
        }, scope)

        // Fonts can change glyph metrics after SplitText measured; refresh once
        // they're ready so trigger positions stay correct.
        await (document.fonts?.ready ?? Promise.resolve())
        if (cancelled) return
        ScrollTrigger.refresh()
      } catch {
        // Progressive enhancement — never let motion setup break the page.
      }
    })()

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [scopeRef])
}
