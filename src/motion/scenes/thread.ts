import type { SceneSetup } from './index'
import { parts, sceneTimeline } from './helpers'

// The thread draws itself node to node; each node's frame draws as the thread
// reaches it, and its glyph pops in.
const thread: SceneSetup = (api) => {
  const { gsap, el } = api
  const $ = parts(el)
  const nodes = $('node')
  const frames = $('frame')
  const step = 1 // timeline seconds per segment

  gsap.set($('thread'), { drawSVG: '0%' })
  gsap.set(frames, { drawSVG: '0%' })
  gsap.set(nodes, { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' })

  const tl = sceneTimeline(api).to($('thread'), { drawSVG: '100%', duration: step * (nodes.length - 1), ease: 'none' }, 0)
  nodes.forEach((node, i) => {
    tl.to(node, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' }, i * step)
      .to(frames[i], { drawSVG: '100%', duration: 0.6 }, i * step)
  })
}

export default thread
