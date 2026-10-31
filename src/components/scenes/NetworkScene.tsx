import { Scene, SceneGrid } from '../Scene/Scene'
import { NETWORK_CENTER, NETWORK_NODES, networkSpoke } from '../../motion/scenes/geometry'

// Why not AI, chapter 6: AI as a tool, with a person in the loop.
// Finished state: seven machine nodes whose every connection now runs through
// one chartreuse human node at the center.
export function NetworkScene() {
  const [cx, cy] = NETWORK_CENTER
  return (
    <Scene name="network">
      <svg viewBox="0 0 400 400" fill="none" strokeLinejoin="miter">
        <SceneGrid data-p="grid" />
        {NETWORK_NODES.map((_, i) => (
          <path key={i} data-p="edge" className="scene-line" d={networkSpoke(i)} />
        ))}
        {NETWORK_NODES.map(([x, y], i) => (
          <rect key={i} data-p="node" className="scene-tile scene-tile--heavy" x={x - 14} y={y - 14} width="28" height="28" transform={`rotate(45 ${x} ${y})`} />
        ))}
        <g data-p="human">
          <circle className="scene-accent" cx={cx} cy={cy} r="34" />
          <circle className="scene-hole" cx={cx} cy={cy - 9} r="8" />
          <path className="scene-line" d={`M${cx - 14} ${cy + 18} A14 14 0 0 1 ${cx + 14} ${cy + 18}`} />
        </g>
      </svg>
    </Scene>
  )
}
