import { useEffect, useState } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export function useKonamiCode(): boolean {
  const [unlocked, setUnlocked] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (unlocked) return
      const expected = KONAMI[progress]
      if (e.key === expected) {
        const next = progress + 1
        if (next === KONAMI.length) {
          setUnlocked(true)
          setProgress(0)
        } else {
          setProgress(next)
        }
      } else {
        // Wrong key — restart, but check if this key starts a new sequence
        setProgress(e.key === KONAMI[0] ? 1 : 0)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [progress, unlocked])

  return unlocked
}
