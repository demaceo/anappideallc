import { Scene, SceneGrid } from '../Scene/Scene'
import { THREAD_NODES, THREAD_PATH } from '../../motion/scenes/geometry'

// Work, chapter 3: "the same thread runs through it."
// Finished state: one line through five framed nodes (one per mission app:
// a receipt, a pin, a phone, a house, a door), the last in chartreuse.
const GLYPHS = [
  'M-10 -14 L10 -14 L10 14 L-10 14 Z M-5 -6 L5 -6 M-5 0 L5 0 M-5 6 L2 6', // STLMNT: a receipt
  'M0 14 L-10 -2 A11 11 0 1 1 10 -2 Z', // Pinpoint: a map pin
  'M-8 -15 L8 -15 L8 15 L-8 15 Z M-3 10 L3 10', // Payback: a phone
  'M-12 0 L0 -12 L12 0 L12 13 L-12 13 Z M-4 13 L-4 4 L4 4 L4 13', // RentHarbor: a house
  'M-9 14 L-9 -14 L9 -14 L9 14 M4 1 L4 3', // Unmasked: an open door
] as const

export function ThreadScene() {
  return (
    <Scene name="thread">
      <svg viewBox="0 0 400 400" fill="none" strokeLinejoin="miter">
        <SceneGrid data-p="grid" />
        <path data-p="thread" className="scene-line scene-line--heavy" d={THREAD_PATH} />
        {THREAD_NODES.map(([x, y], i) => (
          <g key={i} data-p="node" transform={`translate(${x} ${y})`}>
            <rect
              data-p="frame"
              x="-28"
              y="-28"
              width="56"
              height="56"
              className={i === THREAD_NODES.length - 1 ? 'scene-accent' : 'scene-tile'}
            />
            <path className="scene-line" d={GLYPHS[i]} />
          </g>
        ))}
      </svg>
    </Scene>
  )
}
