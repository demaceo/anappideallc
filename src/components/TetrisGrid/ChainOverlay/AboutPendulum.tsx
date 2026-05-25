import { motion } from 'motion/react'
import { useId } from 'react'
import styles from './AboutPendulum.module.css'

export interface AboutPendulumProps {
  /** Container-local X coordinate of the pendulum's pivot (above the About block center). */
  targetX: number
  /** Container-local Y coordinate of the About block's center; pivot is 120px above this. */
  targetY: number
}

/**
 * About pendulum — a stately gold pendulum on a string that swings
 * down from above the About block, sweeps across it, and returns
 * partway. Reads as "founder presence" — slower and more deliberate
 * than Hero's energetic marble drop.
 *
 * Pivot is 120px above the About block center; the SVG (16px × 140px)
 * hangs from the pivot and rotates around its top-center. Total
 * sequence (matching ABOUT_CHAIN_DURATION_MS = 1400ms):
 *   - 0–500ms:   swing -50° → +50° (sweep across the block face)
 *   - 500–900ms: return +50° → -15° (settle near rest)
 *   - 900–1400ms: hold (navigation fires at the end)
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function AboutPendulum({ targetX, targetY }: AboutPendulumProps) {
  const gradientId = useId()
  return (
    <div
      className={styles.pendulumWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <motion.svg
        className={styles.pendulum}
        viewBox="0 0 16 140"
        initial={{ rotate: -50 }}
        animate={{ rotate: [-50, 50, -15, -15] }}
        transition={{
          duration: 1.4,
          times: [0, 0.357, 0.643, 1],   // 0 → 500ms → 900ms → 1400ms
          ease: ['easeInOut', 'easeInOut', 'linear'],
        }}
      >
        <defs>
          <radialGradient id={gradientId} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#ffe066" />
            <stop offset="75%" stopColor="#ffb800" />
            <stop offset="100%" stopColor="#b07700" />
          </radialGradient>
        </defs>
        {/* Rod hangs from the pivot (top of SVG, y=0) down to the bob center (y=124). */}
        <line
          className={styles.rod}
          x1="8" y1="0"
          x2="8" y2="124"
        />
        {/* Bob at the bottom of the rod. */}
        <circle
          className={styles.bob}
          cx="8" cy="124" r="12"
          fill={`url(#${gradientId})`}
        />
        {/* Small white specular highlight on the bob. */}
        <circle cx="5" cy="121" r="2.5" fill="rgba(255,255,255,0.7)" />
      </motion.svg>
    </div>
  )
}
