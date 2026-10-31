import { Scene, SceneGrid } from '../Scene/Scene'
import { ACCUMULATION } from '../../motion/scenes/geometry'

// About, chapter 2: "Not one moment. An accumulation."
// Finished state: one large triangle built from 36 small ones, the apex in
// chartreuse. The timeline scatters them and lets them settle in, base first.
export function AccumulationScene() {
  return (
    <Scene name="accumulation">
      <svg viewBox="0 0 400 400" fill="none" strokeLinejoin="miter">
        <SceneGrid data-p="grid" />
        {ACCUMULATION.map((t, i) => (
          <polygon
            key={i}
            data-p="tri"
            data-row={t.row}
            points={t.points}
            className={t.row === 0 ? 'scene-accent' : t.up ? 'scene-tile' : 'scene-tile scene-tile--ink'}
          />
        ))}
      </svg>
    </Scene>
  )
}
