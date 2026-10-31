import type { SceneSetup } from './index'
import { parts, sceneTimeline } from './helpers'
import { TIMELINE_NODES, circlePath } from './geometry'

// The path walks through the five phases; each node starts as a plain circle
// and becomes its phase's shape as the path reaches it. The last becomes the
// key: the handoff.
const timeline: SceneSetup = (api) => {
  const { gsap, el } = api
  const $ = parts(el)
  const nodes = $('node')
  const finals = nodes.map((n) => n.getAttribute('d') ?? '')
  const step = 1

  gsap.set($('path'), { drawSVG: '0%' })
  nodes.forEach((n, i) => gsap.set(n, { attr: { d: circlePath(TIMELINE_NODES[i]) }, opacity: 0.35 }))
  gsap.set($('shaft'), { drawSVG: '0%' })

  const tl = sceneTimeline(api).to($('path'), { drawSVG: '100%', duration: step * (nodes.length - 1), ease: 'none' }, 0)
  nodes.forEach((n, i) => {
    tl.to(n, { morphSVG: finals[i], opacity: 1, duration: 0.6 }, i * step)
  })
  tl.to($('shaft'), { drawSVG: '100%', duration: 0.6 })
}

export default timeline
