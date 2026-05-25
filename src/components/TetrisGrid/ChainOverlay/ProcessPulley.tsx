import { motion } from 'motion/react'
import styles from './ProcessPulley.module.css'

export interface ProcessPulleyProps {
  targetX: number
  targetY: number
}

/**
 * ProcessPulley — a bronze pulley wheel spins, pulling a weight up
 * on a string. Reads as "process — orderly, sequential, ratcheted."
 *
 * Sequence (1400ms):
 *   - 0-800ms: wheel rotates 0 to 720 degrees (two full spins);
 *              weight rises (translateY +30 to 0)
 *   - 800-1400ms: hold
 */
export function ProcessPulley({ targetX, targetY }: ProcessPulleyProps) {
  return (
    <div
      className={styles.pulleyWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <motion.div
        data-wheel
        className={styles.wheel}
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 720, 720] }}
        transition={{
          duration: 1.4,
          times: [0, 0.571, 1],
          ease: ['easeInOut', 'linear'],
        }}
      />
      <div data-string className={styles.string} />
      <motion.div
        data-weight
        className={styles.weight}
        initial={{ y: 30 }}
        animate={{ y: [30, 0, 0] }}
        transition={{
          duration: 1.4,
          times: [0, 0.571, 1],
          ease: ['easeOut', 'linear'],
        }}
      />
    </div>
  )
}
