import { motion } from 'motion/react'
import { useId } from 'react'
import styles from './HeroMarbleDrop.module.css'

export interface HeroMarbleDropProps {
  /** Container-local X coordinate of the marble's landing center, in pixels. */
  targetX: number
  /** Container-local Y coordinate of the marble's landing center, in pixels. */
  targetY: number
}

/**
 * Hero marble — the visual gadget for Hero's chain sequence. A golden
 * orb drops from above the viewport onto the Hero block center over
 * 900ms with an accelerating curve (ease-in quadratic — gravity feel),
 * then squashes vertically for 150ms on impact (scaleY 0.6 → 1.0,
 * 50ms compress + 100ms recover).
 *
 * Positioning: the wrapper sits at (targetX, targetY) in container-local
 * coordinates with -50% offsets so the marble's center matches the
 * target. The drop is driven by a translateY animation from the marble
 * starting position (well above the wrapper) down to 0.
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function HeroMarbleDrop({ targetX, targetY }: HeroMarbleDropProps) {
  const gradientId = useId()
  return (
    <div
      className={styles.marbleWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <motion.svg
        className={styles.marble}
        viewBox="0 0 28 28"
        // Drop animation: start above (translateY -800), end at 0.
        // ease-in quadratic curve simulates gravity.
        initial={{ translateY: -800, scaleY: 1 }}
        animate={{
          translateY: [-800, 0, 0],
          scaleY: [1, 0.6, 1],
        }}
        transition={{
          translateY: { duration: 0.9, ease: [0.55, 0, 0.68, 0.67] },
          scaleY: {
            duration: 1.05,
            times: [0, 0.857, 1],   // 0 → 0.9s drop, 0.9-1.05s squash
            ease: 'easeOut',
          },
        }}
      >
        <defs>
          <radialGradient id={gradientId} cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#ffe066" />
            <stop offset="70%" stopColor="#ffb800" />
            <stop offset="100%" stopColor="#b07700" />
          </radialGradient>
        </defs>
        <circle cx="14" cy="14" r="13" fill={`url(#${gradientId})`} />
        <circle cx="10" cy="9" r="2.5" fill="rgba(255,255,255,0.7)" />
      </motion.svg>
    </div>
  )
}
