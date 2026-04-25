import { useEffect, useRef, useState } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export function useKonamiCode(): boolean {
  const [unlocked, setUnlocked] = useState(false)
  // Progress lives in a ref so the keydown effect doesn't re-attach the
  // listener every keypress (it would if progress were in useState and
  // listed as a dependency). The effect only re-runs when `unlocked`
  // flips false → true, after which the early return makes the listener
  // a no-op anyway.
  const progressRef = useRef(0)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (unlocked) return
      const expected = KONAMI[progressRef.current]
      if (e.key === expected) {
        const next = progressRef.current + 1
        if (next === KONAMI.length) {
          setUnlocked(true)
          progressRef.current = 0
        } else {
          progressRef.current = next
        }
      } else {
        // Wrong key — restart, but check if this key starts a new sequence
        progressRef.current = e.key === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [unlocked])

  return unlocked
}
