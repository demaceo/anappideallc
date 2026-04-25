import { useLocation, useNavigate } from 'react-router'
import styles from './HomeIcon.module.css'

// Tiny grid-shaped button that appears on every non-/ route. Lets a
// deep-link visitor (or anyone scrolling on /about, /work, etc.) jump
// back to the Tetris landing. Click triggers a regular navigate('/'),
// which the line-clear hook reads via the lastNonRootPath flag and plays
// the reverse fly-in animation.
export function HomeIcon() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  if (pathname === '/') return null

  return (
    <button
      type="button"
      className={styles.button}
      aria-label="Back to home grid"
      onClick={() => navigate('/')}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {/* 2×2 mini-grid of squares — visual shorthand for "Tetris home". */}
        <rect x="4" y="4" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.65" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.65" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" fill="currentColor" />
      </svg>
      <span className={styles.label}>Back to home grid</span>
    </button>
  )
}
