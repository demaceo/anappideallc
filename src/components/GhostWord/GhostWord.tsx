// Oversized Bebas Neue watermark word that sits behind a section's content and
// parallaxes as the page scrolls. Purely decorative, so it's hidden from the
// accessibility tree. `data-ghost` is the hook that useBrutalistScroll reads to
// attach the scroll-scrubbed parallax tween (GSAP); with JS off or reduced
// motion, it simply renders as a static watermark.
interface GhostWordProps {
  children: string
  className?: string
}

export function GhostWord({ children, className }: GhostWordProps) {
  return (
    <span
      className={`ghost-word${className ? ` ${className}` : ''}`}
      data-ghost
      aria-hidden="true"
    >
      {children}
    </span>
  )
}
