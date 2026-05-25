import { motion } from 'motion/react'
import styles from './HeroBellFlash.module.css'

export interface HeroBellFlashProps {
  /** Container-local X coordinate of the bell's center. */
  targetX: number
  /** Container-local Y coordinate of the bell's center. */
  targetY: number
}

/**
 * Hero bell flash — a gold radial halo that emanates from the Hero
 * block at the marble's impact moment (1050ms after chain start).
 * Scales from 0 → 4× and fades to 0 opacity over 350ms via Motion.
 * Reads as "the marble landed on a bell; it rings outward."
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function HeroBellFlash({ targetX, targetY }: HeroBellFlashProps) {
  return (
    <div
      className={styles.bellWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <motion.div
        className={styles.halo}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 4], opacity: [0, 1, 0] }}
        transition={{
          delay: 1.05,
          duration: 0.35,
          scale: { ease: 'easeOut' },
          opacity: { times: [0, 0.15, 1], ease: 'easeOut' },
        }}
      />
    </div>
  )
}
