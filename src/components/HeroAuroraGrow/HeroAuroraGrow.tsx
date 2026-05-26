import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useChain } from '../../lib/chain'
import styles from './HeroAuroraGrow.module.css'

interface Anchor {
  x: number
  y: number
}

/**
 * HeroAuroraGrow — fullscreen aurora overlay that grows from the
 * Hero block's viewport position to fill the screen during the
 * Hero chain reaction's tail (~1300ms after chain start).
 *
 * Reads chain state via useChain(). When activeBlock becomes 'hero',
 * looks up the hero block element in the DOM (via stable
 * data-block-id) and records its center as the scale-from anchor.
 * The overlay is position:fixed so it escapes the .playfield
 * parallax and grows to true viewport bounds.
 *
 * Once at full scale, navigation has fired and /contact's
 * AuroraChamber takes over for the inner page — the visual handoff
 * reads as a single continuous aurora envelopment.
 *
 * Decorative — aria-hidden. No interactive content.
 */
export function HeroAuroraGrow() {
  const { activeBlock } = useChain()
  const [anchor, setAnchor] = useState<Anchor | null>(null)

  useEffect(() => {
    if (activeBlock !== 'hero') {
      setAnchor(null)
      return
    }
    const heroEl = document.querySelector<HTMLElement>('[data-block-id="hero"]')
    if (!heroEl) return
    const rect = heroEl.getBoundingClientRect()
    setAnchor({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }, [activeBlock])

  if (activeBlock !== 'hero' || !anchor) return null

  // Scale large enough to cover any reasonable viewport. The wrapper is
  // 60px wide; scaling by 50 gives a 3000px diameter circle — covers
  // even ultrawide displays.
  return (
    <div
      className={styles.growWrapper}
      style={{ left: `${anchor.x}px`, top: `${anchor.y}px` }}
      aria-hidden="true"
    >
      <motion.div
        className={styles.aurora}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 50, opacity: [0, 0.6, 1] }}
        transition={{
          delay: 1.2,
          duration: 0.7,
          scale: { ease: [0.4, 0, 0.2, 1] },
          opacity: { times: [0, 0.3, 1], ease: 'easeOut' },
        }}
      />
    </div>
  )
}
