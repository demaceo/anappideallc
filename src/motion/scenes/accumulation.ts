import type { SceneSetup } from './index'
import { parts, sceneTimeline } from './helpers'

// Small triangles drift in from scattered, rotated positions and settle into
// one shape, base row first, apex last. Offsets are deterministic (no
// randomness) so every visit, and every screenshot, plays the same.
const accumulation: SceneSetup = (api) => {
  const { gsap, el } = api
  const $ = parts(el)
  const tris = $('tri').sort((a, b) => Number(b.dataset.row) - Number(a.dataset.row))

  gsap.set($('grid'), { opacity: 0.25 })
  tris.forEach((t, i) => {
    gsap.set(t, {
      x: ((i * 97) % 260) - 130,
      y: -160 - ((i * 53) % 140),
      rotation: ((i * 47) % 240) - 120,
      opacity: 0,
      transformOrigin: '50% 50%',
    })
  })

  sceneTimeline(api)
    .to($('grid'), { opacity: 1, duration: 1 })
    .to(tris, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: 'power3.out' }, 0)
}

export default accumulation
