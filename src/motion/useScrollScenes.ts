import { useEffect } from 'react'
import type { RefObject } from 'react'
import { SCENES } from './scenes'
import { headerCollapseEnd } from './header'

// Site-wide scroll motion (GSAP), scoped to the element in `scopeRef` and
// re-run whenever `key` changes (the route), so every page gets it from one
// place in the app shell.
//
// Everything here is progressive enhancement:
//   - The markup is always the FINISHED picture: numbers are real, scenes are
//     drawn, borders are there. Motion only animates *toward* that state, so
//     no-JS, prerender, and reduced-motion visitors lose nothing.
//   - Text is never hidden or split for an entrance animation. Only geometry,
//     borders, and numbers move.
//   - Reduced motion bails before GSAP is even imported.
//   - GSAP and its plugins are lazy-imported, so they never enter the
//     prerender or test module graph.
//   - All work runs inside gsap.matchMedia(), whose revert() restores every
//     inline style it set; a try/catch keeps any failure from breaking a page.
//
// Attribute hooks read from the markup:
//   [data-ghost]   giant watermark word → scroll-scrubbed parallax
//   [data-tilt]    card → 3D tilt toward the pointer (fine pointers only)
//   [data-count]   number → counts up from 0 to its rendered value, once
//   [data-frame]   SVG rect → draws itself around its card on enter
//   [data-marquee] marquee track → speed follows scroll velocity
//   [data-scene]   signature scene → timeline from src/motion/scenes

const DESKTOP = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
const COMPACT = '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)'

export function motionAllowed(win: Window | null = typeof window === 'undefined' ? null : window) {
  if (!win || typeof win.matchMedia !== 'function') return false
  if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return 'IntersectionObserver' in win
}

export function useScrollScenes(scopeRef: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    if (!motionAllowed()) return
    const scope = scopeRef.current
    if (!scope) return

    let revert: (() => void) | undefined
    let cancelled = false

    ;(async () => {
      try {
        const [{ gsap }, { ScrollTrigger }, { DrawSVGPlugin }, { MorphSVGPlugin }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
          import('gsap/DrawSVGPlugin'),
          import('gsap/MorphSVGPlugin'),
        ])
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin)

        // Load only the scene timelines this page actually renders.
        const sceneEls = [...scope.querySelectorAll<HTMLElement>('[data-scene]')]
        const setups = await Promise.all(
          sceneEls.map(async (el) => {
            const load = SCENES[el.dataset.scene ?? '']
            return load ? { el, setup: (await load()).default } : null
          }),
        )
        if (cancelled) return

        const mm = gsap.matchMedia(scope)
        mm.add({ desktop: DESKTOP, compact: COMPACT }, (ctx) => {
          const desktop = Boolean(ctx.conditions?.desktop)
          const cleanups: Array<() => void> = []
          const q = <T extends Element>(sel: string) => [...scope.querySelectorAll<T>(sel)]

          // Ghost-watermark parallax: each drifts at its own rate.
          q<HTMLElement>('[data-ghost]').forEach((el, i) => {
            gsap.to(el, {
              yPercent: i % 2 === 0 ? -18 : -10,
              xPercent: i % 3 === 0 ? -8 : 6,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
            })
          })

          // Counters: the DOM already holds the real figure; tick up to it.
          q<HTMLElement>('[data-count]').forEach((el) => {
            const target = Number(el.dataset.count)
            if (!Number.isFinite(target)) return
            const decimals = Number(el.dataset.decimals ?? 0)
            const suffix = el.dataset.suffix ?? ''
            const final = el.textContent
            const n = { v: 0 }
            gsap.to(n, {
              v: target,
              duration: 1.4,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
              onUpdate: () => { el.textContent = `${n.v.toFixed(decimals)}${suffix}` },
              onComplete: () => { el.textContent = final },
            })
            cleanups.push(() => { el.textContent = final })
          })

          // Card frames draw themselves around their card as it enters.
          q<SVGGeometryElement>('[data-frame]').forEach((el) => {
            gsap.fromTo(
              el,
              { drawSVG: '0%' },
              {
                drawSVG: '100%',
                duration: 1.1,
                ease: 'power2.inOut',
                scrollTrigger: { trigger: el.closest('section, li, article') ?? el, start: 'top 85%', once: true },
              },
            )
          })

          // Marquee: base speed from CSS; scrolling speeds it up, then it eases back.
          q<HTMLElement>('[data-marquee]').forEach((track) => {
            const anim = track.getAnimations?.()[0]
            if (!anim) return
            const rate = { v: 1 }
            const toRate = gsap.quickTo(rate, 'v', {
              duration: 0.6,
              ease: 'power2.out',
              onUpdate: () => { anim.playbackRate = rate.v },
            })
            const st = ScrollTrigger.create({
              onUpdate: (self) => toRate(1 + Math.min(Math.abs(self.getVelocity()) / 400, 5)),
            })
            const settle = () => toRate(1)
            ScrollTrigger.addEventListener('scrollEnd', settle)
            cleanups.push(() => {
              st.kill()
              ScrollTrigger.removeEventListener('scrollEnd', settle)
              anim.playbackRate = 1
            })
          })

          // Pointer tilt on cards (fine pointers only).
          if (window.matchMedia('(pointer: fine)').matches) {
            q<HTMLElement>('[data-tilt]').forEach((card) => {
              gsap.set(card, { transformPerspective: 700 })
              const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power1.out' })
              const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power1.out' })
              const onMove = (e: PointerEvent) => {
                const r = card.getBoundingClientRect()
                rotY(((e.clientX - r.left) / r.width - 0.5) * 10)
                rotX(-((e.clientY - r.top) / r.height - 0.5) * 10)
              }
              const onLeave = () => { rotX(0); rotY(0) }
              card.addEventListener('pointermove', onMove)
              card.addEventListener('pointerleave', onLeave)
              cleanups.push(() => {
                card.removeEventListener('pointermove', onMove)
                card.removeEventListener('pointerleave', onLeave)
              })
            })
          }

          // Signature scenes.
          for (const s of setups) {
            if (!s) continue
            const done = s.setup({ gsap, ScrollTrigger, el: s.el, desktop })
            if (typeof done === 'function') cleanups.push(done)
          }

          return () => cleanups.forEach((fn) => fn())
        })
        // The sticky masthead collapses over the first --collapse-range of
        // scroll (a CSS scroll-driven animation), which pulls everything below
        // it up by a few hundred px AFTER ScrollTrigger measured at load, so
        // every trigger fired that much late. Re-measure whenever scroll
        // crosses the end of that range, in either direction, so positions
        // always match the header state the visitor is actually seeing.
        const collapseEnd = headerCollapseEnd()
        let collapsed = window.scrollY > collapseEnd
        let frame = 0
        const onScroll = () => {
          const now = window.scrollY > collapseEnd
          if (now === collapsed) return
          collapsed = now
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(() => ScrollTrigger.refresh())
        }
        window.addEventListener('scroll', onScroll, { passive: true })

        revert = () => {
          window.removeEventListener('scroll', onScroll)
          cancelAnimationFrame(frame)
          mm.revert()
        }

        // Fonts change line heights after load; re-measure trigger positions.
        await (document.fonts?.ready ?? Promise.resolve())
        if (!cancelled) ScrollTrigger.refresh()
      } catch {
        // Progressive enhancement: motion must never break the page.
      }
    })()

    return () => {
      cancelled = true
      revert?.()
    }
  }, [scopeRef, key])
}
