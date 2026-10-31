import type { ReactNode, SVGProps } from 'react'

interface SceneProps {
  // Key into SCENES (src/motion/scenes) for this scene's scroll timeline.
  name: string
  children: ReactNode
  className?: string
}

// Wrapper for a decorative signature scene. The SVG inside is drawn in its
// finished state, so prerender, no-JS, and reduced-motion visitors see the
// complete picture; useScrollScenes animates toward it. Scenes carry no
// content, so they're hidden from assistive tech. The box is sized by CSS
// aspect-ratio, so nothing shifts when motion starts.
export function Scene({ name, children, className }: SceneProps) {
  return (
    <div className={`scene${className ? ` ${className}` : ''}`} data-scene={name} aria-hidden="true">
      {children}
    </div>
  )
}

// The blueprint dot grid every scene sits on (9×9 dots in a 400×400 viewBox).
// Extra props (e.g. a data attribute for the timeline) go on the group.
export function SceneGrid(props: SVGProps<SVGGElement>) {
  return (
    <g className="scene-grid" {...props}>
      {Array.from({ length: 81 }, (_, i) => (
        <circle key={i} cx={40 + (i % 9) * 40} cy={40 + Math.floor(i / 9) * 40} r="1.6" />
      ))}
    </g>
  )
}
