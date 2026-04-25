import { useMemo } from 'react'
import { Block } from './Block'
import type { BlockId } from './Block'
import { useGridParallax } from './useGridParallax'
import { useGravityDrop } from './useGravityDrop'
import { useLineClearController } from './useLineClear'
import type { BlockRef } from './useLineClear'
import { SITE } from '../../data/site'
import styles from './TetrisGrid.module.css'

const BLOCKS = [
  {
    id: 'hero' as const,
    to: '/contact',
    title: SITE.tagline,
    subtitle:
      'I design the interface, build the backend, and ship the operational systems that make ambitious products credible.',
    cta: 'Tell me about it',
  },
  {
    id: 'about' as const,
    to: '/about',
    title: 'About',
    subtitle: `Founder-led, ${SITE.founder.location.split(',')[0]}-based.`,
  },
  {
    id: 'work' as const,
    to: '/work',
    title: 'Work',
    subtitle: 'Pinpoint · Payback · RentHarbor · Feng Shui · Yap United',
  },
  {
    id: 'services' as const,
    to: '/services',
    title: 'Services',
    subtitle: 'Mobile · Web · MVP · Data viz',
  },
  {
    id: 'process' as const,
    to: '/process',
    title: 'Process',
    subtitle: 'Discovery → Design → Dev → Launch',
  },
  {
    id: 'contact' as const,
    to: '/contact',
    title: 'Contact',
    subtitle: SITE.email,
  },
  {
    id: 'brand' as const,
    to: '/about',
    title: SITE.initials,
    subtitle: 'LLC',
    ariaLabel: `${SITE.name} — about the studio`,
  },
]

export function TetrisGrid() {
  const gridRef = useGridParallax(4)

  // Stable ref pairs for the gravity-drop and line-clear hooks.
  const blockRefs = useMemo<BlockRef[]>(
    () =>
      BLOCKS.map((b) => ({
        id: b.id as BlockId,
        ref: { current: null as HTMLAnchorElement | null },
      })),
    [],
  )

  const gravityRefs = useMemo(() => blockRefs.map((b) => b.ref), [blockRefs])
  useGravityDrop(gravityRefs)
  const { playOutAndNavigate } = useLineClearController(blockRefs)

  return (
    <div className={styles.viewport}>
      <div ref={gridRef} className={styles.grid}>
        {BLOCKS.map((b, i) => (
          <Block
            key={b.id}
            ref={(el) => {
              blockRefs[i].ref.current = el
            }}
            onNavigate={playOutAndNavigate}
            {...b}
          />
        ))}
      </div>
    </div>
  )
}
