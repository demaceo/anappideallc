interface CounterProps {
  value: number
  decimals?: number
  suffix?: string
  className?: string
}

// A number that counts up from 0 when it scrolls into view. The markup holds
// the real figure (crawlable, no-JS and reduced-motion safe); useScrollScenes
// reads the data attributes to animate toward it and restores it after.
export function Counter({ value, decimals = 0, suffix = '', className }: CounterProps) {
  return (
    <span className={className} data-count={value} data-decimals={decimals} data-suffix={suffix}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}
