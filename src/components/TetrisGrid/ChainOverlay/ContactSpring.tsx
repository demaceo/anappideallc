import { motion } from 'motion/react'
import styles from './ContactSpring.module.css'

export interface ContactSpringProps {
  targetX: number
  targetY: number
}

/**
 * ContactSpring — a coiled spring uncoils, releasing a small magenta
 * envelope that slides along the spring's extension direction.
 * Reads as "contact — the deliverable."
 *
 * Sequence (1200ms):
 *   - 0-500ms: spring path animates from coiled to extended (pathLength 0 to 1);
 *              envelope slides translateX -25 to 55
 *   - 500-1000ms: spring + envelope hold
 *   - 1000-1200ms: brief final hold before navigation
 */
export function ContactSpring({ targetX, targetY }: ContactSpringProps) {
  return (
    <div
      className={styles.springWrapper}
      style={{ left: `${targetX}px`, top: `${targetY}px` }}
      aria-hidden="true"
    >
      <svg className={styles.springSvg} viewBox="0 0 50 30">
        <motion.path
          data-spring
          className={styles.springPath}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{
            duration: 1.2,
            times: [0, 0.417, 1],
            ease: ['easeOut', 'linear'],
          }}
          d="M2,15 Q6,5 10,15 T18,15 T26,15 T34,15 T42,15 L48,15"
        />
      </svg>
      <motion.div
        data-envelope
        className={styles.envelope}
        initial={{ x: -25 }}
        animate={{ x: [-25, 55, 55] }}
        transition={{
          duration: 1.2,
          times: [0, 0.417, 1],
          ease: ['easeOut', 'linear'],
        }}
      />
    </div>
  )
}
