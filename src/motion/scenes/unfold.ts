import type { SceneSetup } from './index'
import { UNFOLD } from './unfold-paths'
import { sceneTimeline } from './helpers'

// Cube → phone → browser → key. Scrubbed to scroll; see UnfoldScene.tsx for
// the finished-state markup this timeline animates toward.
const unfold: SceneSetup = (api) => {
  const { gsap, el } = api
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

  const tl = sceneTimeline(api)

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
