import { useRef } from 'react'
import { THEMES, useTheme } from '../../lib/theme-context'
import type { ThemeId } from '../../lib/theme-context'
import styles from './ThemeSwitcher.module.css'

// 4 color swatches in a glassmorphic pill, top-right corner.
// Click any swatch to switch themes; the active swatch shows a ring.
// Keyboard: Tab into the group, arrow keys cycle through, Enter/Space
// activates. The whole UI lives outside the Tetris grid so it doesn't
// participate in the gravity drop or line-clear animations.
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (idx + dir + THEMES.length) % THEMES.length
    buttonsRef.current[next]?.focus()
    setTheme(THEMES[next].id as ThemeId)
  }

  return (
    <div
      className={styles.pill}
      role="group"
      aria-label="Color theme"
    >
      {THEMES.map((t, i) => {
        const active = t.id === theme
        return (
          <button
            key={t.id}
            ref={(el) => {
              buttonsRef.current[i] = el
            }}
            type="button"
            className={styles.swatch}
            style={{ background: t.swatch }}
            aria-label={t.label}
            aria-pressed={active}
            onClick={() => setTheme(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className={styles.label}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
