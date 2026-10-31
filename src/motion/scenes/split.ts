import type { SceneSetup } from './index'
import { parts, sceneTimeline } from './helpers'

// One square draws itself, then splits on its diagonal: the built half and
// the handed-over half slide apart, and their labels appear.
const split: SceneSetup = (api) => {
  const { gsap, el } = api
  const $ = parts(el)
  const halves = [...$('built'), ...$('handed')]
  const labels = halves.flatMap((h) => [...h.querySelectorAll('text')])

  gsap.set($('grid'), { opacity: 0.25 })
  gsap.set($('whole'), { opacity: 1, drawSVG: '0%' })
  gsap.set(halves, { x: 0, y: 0, opacity: 0 })
  gsap.set(labels, { opacity: 0 })

  sceneTimeline(api)
    .to($('grid'), { opacity: 1, duration: 0.8 })
    .to($('whole'), { drawSVG: '100%', duration: 1.2 }, 0)
    .to(halves, { opacity: 1, duration: 0.3 })
    .set($('whole'), { opacity: 0 })
    .to($('built'), { x: -22, y: -22, duration: 1 })
    .to($('handed'), { x: 22, y: 22, duration: 1 }, '<')
    .to(labels, { opacity: 1, duration: 0.5, stagger: 0.2 })
}

export default split
