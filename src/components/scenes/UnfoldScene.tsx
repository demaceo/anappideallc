import { Scene } from '../Scene/Scene'
import { UNFOLD } from '../../motion/scenes/unfold-paths'

// Home, chapter 1: "Built for you. Handed to you."
// Finished state (what's drawn here): a browser window with a key in front of
// it. The timeline in src/motion/scenes/unfold.ts starts from a line-drawn
// isometric cube, morphs it into a phone, then into the browser, draws the
// browser's chrome and content, and finally slides the key in.
export function UnfoldScene() {
  return (
    <Scene name="unfold" className="scene--unfold">
      <svg viewBox="0 0 400 400" fill="none" strokeLinecap="square" strokeLinejoin="miter">
        {/* Blueprint dot grid behind everything. */}
        <g className="scene-grid" data-uf="grid">
          {Array.from({ length: 9 }, (_, r) =>
            Array.from({ length: 9 }, (_, c) => (
              <circle key={`${r}-${c}`} cx={40 + c * 40} cy={40 + r * 40} r="1.6" />
            )),
          )}
        </g>
        {/* Cube's inner edges: only visible during the opening of the timeline. */}
        <path data-uf="cube-inner" className="scene-line" d="M90 130 L200 190 L310 130 M200 190 L200 320" opacity="0" />
        {/* The one shape that morphs cube → phone → browser. */}
        <path data-uf="shape" className="scene-line scene-line--heavy" d={UNFOLD.browser} />
        {/* Browser chrome and content. */}
        <g data-uf="chrome">
          <path className="scene-line" d="M60 130 L340 130" />
          <circle className="scene-dot" cx="78" cy="115" r="4.5" />
          <circle className="scene-dot" cx="94" cy="115" r="4.5" />
          <circle className="scene-dot" cx="110" cy="115" r="4.5" />
          <path data-uf="content" className="scene-line" d="M85 165 L255 165" />
          <path data-uf="content" className="scene-line" d="M85 190 L300 190" />
          <path data-uf="content" className="scene-line" d="M85 215 L215 215" />
          <rect data-uf="block" className="scene-fill" x="85" y="240" width="96" height="36" />
        </g>
        {/* The key: handed to you. */}
        <g data-uf="key">
          <path className="scene-line scene-line--heavy" d="M276 280 L364 280 M336 280 L336 304 M352 280 L352 298" />
          <circle className="scene-accent" cx="250" cy="280" r="26" />
          <circle className="scene-hole" cx="250" cy="280" r="8" />
        </g>
      </svg>
    </Scene>
  )
}
