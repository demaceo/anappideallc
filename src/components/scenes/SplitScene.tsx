import { Scene, SceneGrid } from '../Scene/Scene'

// Services, chapter 4: "Built for you. Handed to you."
// Finished state: one square split on its diagonal, the halves slid apart.
// The ink half is the build; the chartreuse half is what's handed to you.
export function SplitScene() {
  return (
    <Scene name="split">
      <svg viewBox="0 0 400 400" fill="none" strokeLinejoin="miter">
        <SceneGrid data-p="grid" />
        <rect data-p="whole" className="scene-line scene-line--heavy" x="90" y="90" width="220" height="220" opacity="0" />
        <g data-p="built" transform="translate(-22 -22)">
          <path className="scene-tile scene-tile--heavy" d="M90 90 L310 90 L90 310 Z" />
          <text className="scene-label" x="112" y="160">BUILT</text>
        </g>
        <g data-p="handed" transform="translate(22 22)">
          <path className="scene-accent" d="M310 90 L310 310 L90 310 Z" />
          <text className="scene-label" x="182" y="286">HANDED</text>
        </g>
      </svg>
    </Scene>
  )
}
