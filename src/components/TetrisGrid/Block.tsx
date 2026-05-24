import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import styles from './Block.module.css'

function applyTilt(e: React.MouseEvent<HTMLAnchorElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
  e.currentTarget.style.setProperty('--hover-rx', `${(-relY * 12).toFixed(1)}deg`)
  e.currentTarget.style.setProperty('--hover-ry', `${(relX * 8).toFixed(1)}deg`)
}

function resetTilt(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.setProperty('--hover-rx', '0deg')
  e.currentTarget.style.setProperty('--hover-ry', '0deg')
}

export type BlockId =
  | 'hero'
  | 'brand'
  | 'about'
  | 'work'
  | 'services'
  | 'process'
  | 'contact'

export interface BlockProps {
  id: BlockId
  to: string
  title: string
  subtitle?: string
  cta?: string
  tags?: string[]
  ariaLabel?: string
  onNavigate?: (id: BlockId, to: string) => void
  /**
   * Optional decorative content rendered as a sibling element BEFORE the
   * block's title. Used by the Hero block to mount the aurora portal
   * window cutout. Should not contain interactive content.
   */
  portal?: ReactNode
}

const MotionLink = motion.create(Link)

export const Block = forwardRef<HTMLAnchorElement, BlockProps>(function Block(
  { id, to, title, subtitle, cta, tags, ariaLabel, onNavigate, portal },
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
      onMouseMove={applyTilt}
      onMouseLeave={resetTilt}
      onClick={(e) => {
        if (!onNavigate) return
        // Let modifier-clicks (cmd/ctrl/middle) keep their default
        // browser behavior — open in new tab, etc.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onNavigate(id, to)
      }}
    >
      {portal}
      <span data-reveal="title" className={styles.title}>{title}</span>
      {subtitle ? <span data-reveal="subtitle" className={styles.subtitle}>{subtitle}</span> : null}
      {tags && tags.length > 0
        ? (
          <span data-reveal="tags" className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </span>
        )
        : cta
          ? <span data-reveal="cta" className={styles.cta}>{cta} →</span>
          : null}
    </MotionLink>
  )
})
