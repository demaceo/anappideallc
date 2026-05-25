import { motion } from 'motion/react'
import styles from './WorkDominoCascade.module.css'

export interface WorkDominoCascadeProps {
  targetX: number
  targetY: number
}

const DOMINO_INDICES = [0, 1, 2, 3, 4]

/**
 * WorkDominoCascade — a small gold marble rolls in from the left,
 * hits the first of 5 polished-steel dominos, and triggers a chain
 * cascade. Reads as "shipped iteration — visible cause and effect."
 *
 * Marble: enters from x=0, rolls to x=60 (where the first domino sits)
 * over 600ms.
 * Cascade: each domino tips from 0° to 90° (clockwise) starting at
 * 600ms, with 90ms stagger between dominos. Last domino completes at
 * 600 + 4*90 + 200 = 1160ms. Hold to 1500ms.
 *
 * Decorative — aria-hidden.
 */
export function WorkDominoCascade({ targetX, targetY }: WorkDominoCascadeProps) {
  return (
    <div
      className={styles.cascadeWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <div className={styles.dominosLane}>
        {DOMINO_INDICES.map((i) => (
          <motion.div
            key={i}
            data-domino
            className={styles.domino}
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 0, 90] }}
            transition={{
              duration: 1.5,
              times: [0, (0.6 + i * 0.09) / 1.5, (0.8 + i * 0.09) / 1.5],
              ease: ['linear', 'easeIn'],
            }}
          />
        ))}
      </div>
      <motion.div
        data-marble
        className={styles.marble}
        initial={{ x: 0 }}
        animate={{ x: [0, 60, 60] }}
        transition={{
          duration: 1.5,
          times: [0, 0.4, 1],
          ease: ['easeOut', 'linear'],
        }}
      />
    </div>
  )
}
