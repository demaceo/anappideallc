import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import styles from './Block.module.css'

export type BlockId =
  | 'hero'
  | 'brand'
  | 'about'
  | 'work'
  | 'services'
  | 'process'
  | 'contact'

interface BlockProps {
  id: BlockId
  to: string
  title: string
  subtitle?: string
  cta?: string
  ariaLabel?: string
  onNavigate?: (id: BlockId, to: string) => void
}

const MotionLink = motion.create(Link)

export const Block = forwardRef<HTMLAnchorElement, BlockProps>(function Block(
  { id, to, title, subtitle, cta, ariaLabel, onNavigate },
  ref,
) {
  const className = `${styles.block} ${styles[`block-${id}`]}`

  return (
    <MotionLink
      ref={ref}
      to={to}
      layoutId={`block-${id}`}
      data-block-id={id}
      className={className}
      style={{ gridArea: id }}
      aria-label={ariaLabel ?? title}
      onClick={(e) => {
        if (!onNavigate) return
        // Let modifier-clicks (cmd/ctrl/middle) keep their default
        // browser behavior — open in new tab, etc.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onNavigate(id, to)
      }}
    >
      <span className={styles.title}>{title}</span>
      {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
      {cta ? <span className={styles.cta}>{cta} →</span> : null}
    </MotionLink>
  )
})
