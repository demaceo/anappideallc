import { useMemo } from 'react'
import { Block } from './Block'
import type { BlockId } from './Block'
import { useGridParallax } from './useGridParallax'
import { useGravityDrop } from './useGravityDrop'
import { useLineClearController } from './useLineClear'
import type { BlockRef } from './useLineClear'
import { useTheme } from '../../lib/theme-context'
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
    subtitle: '5 solo builds · iOS · Android · Web · AI-integrated',
    tags: ['Civic Tech', 'Privacy', 'PropTech', 'Spatial AI', 'Translation'],
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
  const { theme } = useTheme()
  const playfieldRef = useGridParallax(4)

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
  // Pass theme as the replayKey — switching themes clears the once-per-session
  // intro flag and replays the drop animation in the new color palette.
  useGravityDrop(gravityRefs, theme)
  const { playOutAndNavigate } = useLineClearController(blockRefs)

  return (
    <div className={styles.viewport}>
      <div ref={playfieldRef} className={styles.playfield}>
        <div className={styles.backWall} data-back-wall aria-hidden="true" />
        <div className={styles.floor} data-floor aria-hidden="true" />
        <div className={styles.grid} data-grid>
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
    </div>
  )
}
