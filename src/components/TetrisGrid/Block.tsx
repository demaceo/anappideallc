import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import styles from './Block.module.css'
import { useTheme } from '../../lib/theme-context'
import { useMaterial } from '../../lib/material'

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
  const { theme } = useTheme()
  const { openPanel, panelOpen } = useMaterial()
  const isMaterialsTrigger = id === 'brand' && theme === 'modern-vibrant'
  const className = `${styles.block} ${styles[`block-${id}`]}`
  // Pause the brand-pulse keyframe animation while the panel is open. The
  // hover-paused behavior in Block.module.css continues to apply via CSS;
  // this inline `animationPlayState` adds a second pause condition. Without
  // it, the running animation's box-shadow keyframes (which carry the
  // default Anodized halo colors) would keep cycling underneath whichever
  // material is currently being previewed, mismatching the active preset
  // and drawing attention to a block that already triggered the panel.
  const styleOverride: React.CSSProperties = { gridArea: id }
  if (isMaterialsTrigger && panelOpen) {
    styleOverride.animationPlayState = 'paused'
  }

  return (
    <MotionLink
      ref={ref}
      to={to}
      layoutId={`block-${id}`}
      data-block-id={id}
      className={className}
      style={styleOverride}
      aria-label={ariaLabel ?? title}
      aria-haspopup={isMaterialsTrigger ? 'dialog' : undefined}
      aria-expanded={isMaterialsTrigger ? panelOpen : undefined}
      onMouseMove={applyTilt}
      onMouseLeave={resetTilt}
      onClick={(e) => {
        if (isMaterialsTrigger) {
          e.preventDefault()
          openPanel()
          return
        }
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
