import type { SceneSetup } from './index'
import { parts, sceneTimeline } from './helpers'
import { networkChord, networkSpoke } from './geometry'

// Machine nodes appear wired straight to each other; then a human node arrives
// at the center and every connection reroutes through it.
const network: SceneSetup = (api) => {
  const { gsap, el } = api
  const $ = parts(el)
  const edges = $('edge')

  gsap.set($('grid'), { opacity: 0.25 })
  gsap.set($('node'), { scale: 0, transformOrigin: '50% 50%' })
  edges.forEach((e, i) => gsap.set(e, { attr: { d: networkChord(i) }, drawSVG: '0%' }))
  gsap.set($('human'), { scale: 0, transformOrigin: '50% 50%' })

  const tl = sceneTimeline(api)
    .to($('grid'), { opacity: 1, duration: 1 })
    .to($('node'), { scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, 0)
    .to(edges, { drawSVG: '100%', duration: 0.8, stagger: 0.08 })
    .to($('human'), { scale: 1, duration: 0.7, ease: 'back.out(1.6)' })
  edges.forEach((e, i) => {
    tl.to(e, { attr: { d: networkSpoke(i) }, duration: 0.9 }, i === 0 ? '<0.2' : '<0.05')
  })
}

export default network
