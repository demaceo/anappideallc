import type { SceneSetup } from './index'
import { UNFOLD } from './unfold-paths'

// Cube → phone → browser → key. Scrubbed to scroll; see UnfoldScene.tsx for
// the finished-state markup this timeline animates toward.
const unfold: SceneSetup = ({ gsap, el, desktop }) => {
  const $ = (name: string) => el.querySelectorAll<SVGElement>(`[data-uf="${name}"]`)
  const shape = $('shape')
  const cubeInner = $('cube-inner')
  const content = $('content')

  // Opening state: a bare cube on the grid, nothing else.
  gsap.set(shape, { attr: { d: UNFOLD.cube } })
  gsap.set($('chrome'), { opacity: 0 })
  gsap.set(content, { drawSVG: '0%' })
  gsap.set($('block'), { scaleX: 0, transformOrigin: '0% 50%' })
  gsap.set($('key'), { opacity: 0, x: -140 })
  gsap.set($('grid'), { opacity: 0.25 })

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: desktop
      ? // Desktop: sticky beside the chapter; finish while still pinned (the
        // ~460px scene releases when the split's bottom nears 66% of the viewport).
        { trigger: el.closest('.split') ?? el, start: 'top 75%', end: 'bottom 72%', scrub: 0.8 }
      : // Compact: finish with the scene's bottom at 65% of the screen, so all
        // of it is still below the collapsed header when it ends.
        { trigger: el, start: 'top 85%', end: 'bottom 65%', scrub: 0.8 },
  })

  tl.fromTo(cubeInner, { opacity: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 1 })
    .to(cubeInner, { opacity: 0, duration: 0.5 }, '+=0.2')
    .to(shape, { morphSVG: UNFOLD.phone, duration: 1.2 }, '<')
    .to(shape, { morphSVG: UNFOLD.browser, duration: 1.2 }, '+=0.3')
    .to($('grid'), { opacity: 1, duration: 1 }, '<')
    .to($('chrome'), { opacity: 1, duration: 0.4 })
    .to(content, { drawSVG: '100%', duration: 0.8, stagger: 0.15 })
    .to($('block'), { scaleX: 1, duration: 0.6 }, '-=0.3')
    .to($('key'), { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' })
}

export default unfold
