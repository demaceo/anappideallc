import type { ReactNode } from 'react'

// Full-bleed section band for Home. It escapes the 880px content column (its
// inner .container keeps the measure) so the band's background reads
// edge-to-edge. Bands alternate white and warm off-white; one ink band holds
// the pull quote.
type SectionColor = 'white' | 'page' | 'ink'

interface SectionProps {
  color: SectionColor
  children: ReactNode
  className?: string
}

export function Section({ color, children, className }: SectionProps) {
  return (
    <section
      className={`section section--${color} section-band${className ? ` ${className}` : ''}`}
    >
      <div className="container">{children}</div>
    </section>
  )
}
