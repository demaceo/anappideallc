import type { SceneSetup } from './index'
import { parts, sceneTimeline } from './helpers'
import { DOOR } from './geometry'

// A closed door swings open onto chartreuse light that fills the doorway and
// spills across the floor.
const door: SceneSetup = (api) => {
  const { gsap, el } = api
  const $ = parts(el)
  const [kx, ky] = DOOR.knobClosed
  const [ox, oy] = DOOR.knobOpen

  gsap.set($('grid'), { opacity: 0.25 })
  gsap.set($('panel'), { attr: { d: DOOR.closed } })
  gsap.set($('knob'), { attr: { cx: kx, cy: ky } })
  gsap.set($('light'), { opacity: 0 })
  gsap.set($('spill'), { scaleY: 0, transformOrigin: '50% 0%' })

  sceneTimeline(api)
    .to($('grid'), { opacity: 1, duration: 0.8 })
    .to($('panel'), { attr: { d: DOOR.open }, duration: 1.4 }, 0.3)
    .to($('knob'), { attr: { cx: ox, cy: oy }, duration: 1.4 }, '<')
    .to($('light'), { opacity: 1, duration: 1.1 }, '<0.2')
    .to($('spill'), { scaleY: 1, duration: 0.9 }, '<0.4')
}

export default door
