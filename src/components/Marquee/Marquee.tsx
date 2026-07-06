// Infinite marquee band — black bar, giant display type, acid dot separators.
// The track is duplicated content scrolling right-to-left; it's decorative,
// so the whole band is hidden from assistive tech and (via CSS) frozen under
// prefers-reduced-motion.
interface MarqueeProps {
  items: readonly string[]
}

export function Marquee({ items }: MarqueeProps) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`}>
            {item}
            <span className="dot"> ●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
