import type { ReactNode } from 'react'
import { GhostWord } from '../GhostWord/GhostWord'

// Full-bleed loud color block for the Home redesign. It escapes the 880px
// content column (its inner .container keeps the measure) so the saturated
// background and thick ink borders read edge-to-edge. Film grain is applied by
// CSS (.section::after). Optionally renders a stamped chapter number and a
// giant parallaxing ghost-watermark word behind the content.
type SectionColor =
  | 'yellow'
  | 'lime'
  | 'lavender'
  | 'orange'
  | 'pink'
  | 'ink'
  | 'bone'

interface SectionProps {
  color: SectionColor
  // Decorative chapter number, e.g. "01" — rendered as a rotated stamp badge.
  num?: string
  // Giant background watermark word, e.g. "SHIP".
  ghost?: string
  children: ReactNode
  className?: string
}

export function Section({ color, num, ghost, children, className }: SectionProps) {
  return (
    <section
      className={`section section--${color} section-band${className ? ` ${className}` : ''}`}
    >
      {ghost && <GhostWord>{ghost}</GhostWord>}
      {num && (
        <span className="stamp section-stamp" aria-hidden="true">
          {num}
        </span>
      )}
      <div className="container">{children}</div>
    </section>
  )
}
