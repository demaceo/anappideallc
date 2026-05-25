import { motion } from 'motion/react'
import styles from './ServicesLever.module.css'

export interface ServicesLeverProps {
  targetX: number
  targetY: number
}

/**
 * ServicesLever — a teal horizontal bar pivots at its center,
 * raising the right end by 25 degrees. A small flag unfurls on the
 * raised end. Reads as "operational systems — clear, mechanical."
 *
 * Sequence (1300ms total):
 *   - 0-700ms: lever rotates 0 to -25 degrees (right end lifts)
 *   - 700-1100ms: flag scales 0 to 1 (unfurls)
 *   - 1100-1300ms: hold
 */
export function ServicesLever({ targetX, targetY }: ServicesLeverProps) {
  return (
    <div
      className={styles.leverWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <motion.div
        data-lever
        className={styles.lever}
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -25, -25] }}
        transition={{
          duration: 1.3,
          times: [0, 0.538, 1],
          ease: ['easeOut', 'linear'],
        }}
      />
      <div data-pivot className={styles.pivot} />
      <motion.div
        data-flag
        className={styles.flag}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 0, 1, 1] }}
        transition={{
          duration: 1.3,
          times: [0, 0.538, 0.846, 1],
          ease: ['linear', 'backOut', 'linear'],
        }}
      />
    </div>
  )
}
