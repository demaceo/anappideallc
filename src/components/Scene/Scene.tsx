import type { ReactNode } from 'react'

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
