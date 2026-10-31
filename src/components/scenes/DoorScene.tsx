import { Scene, SceneGrid } from '../Scene/Scene'
import { DOOR } from '../../motion/scenes/geometry'

// Contact, chapter 7: "The door."
// Finished state: the door swung open, chartreuse light filling the doorway
// and spilling across the floor.
export function DoorScene() {
  const [kx, ky] = DOOR.knobOpen
  return (
    <Scene name="door">
      <svg viewBox="0 0 400 400" fill="none" strokeLinejoin="miter">
        <SceneGrid data-p="grid" />
        <path data-p="spill" className="scene-light" d="M132 346 L268 346 L336 386 L64 386 Z" />
        <rect data-p="light" className="scene-light" x="132" y="64" width="136" height="282" />
        <rect className="scene-line scene-line--heavy" x="132" y="64" width="136" height="282" />
        <path data-p="panel" className="scene-tile scene-tile--heavy" d={DOOR.open} />
        <circle data-p="knob" className="scene-dot" cx={kx} cy={ky} r="5" />
        <path className="scene-line scene-line--heavy" d="M40 346 L360 346" />
      </svg>
    </Scene>
  )
}
