import { Scene, SceneGrid } from '../Scene/Scene'
import { TIMELINE_NODES, TIMELINE_PATH, TIMELINE_SHAPES } from '../../motion/scenes/geometry'

// Process, chapter 5: "You leave knowing how it works."
// Finished state: a path through the five phases, each node its own shape:
// circle, square, hexagon, triangle, and a chartreuse key for the handoff.
export function TimelineScene() {
  const [kx, ky] = TIMELINE_NODES[4]
  return (
    <Scene name="timeline">
      <svg viewBox="0 0 400 400" fill="none" strokeLinejoin="miter" strokeLinecap="square">
        <SceneGrid data-p="grid" />
        <path data-p="path" className="scene-line scene-line--heavy" d={TIMELINE_PATH} />
        {TIMELINE_SHAPES.map((d, i) => (
          <path key={i} data-p="node" className={i === 4 ? 'scene-accent' : 'scene-tile scene-tile--heavy'} d={d} />
        ))}
        <circle className="scene-hole" cx={kx} cy={ky} r="6" />
        <path
          data-p="shaft"
          className="scene-line scene-line--heavy"
          d={`M${kx} ${ky + 18} L${kx} ${ky + 62} M${kx} ${ky + 44} L${kx + 14} ${ky + 44} M${kx} ${ky + 56} L${kx + 10} ${ky + 56}`}
        />
      </svg>
    </Scene>
  )
}
