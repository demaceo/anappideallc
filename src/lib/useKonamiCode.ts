import { useEffect, useRef, useState } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

// Letter slots in KONAMI ('b', 'a') need case-insensitive matching so the
// unlock isn't fragile to Caps Lock or held Shift (which yield 'B'/'A'
// from KeyboardEvent.key). Arrow keys are always Pascal-case strings
// regardless of modifier state, so they only need exact match.
function keyMatches(input: string, expected: string): boolean {
  if (expected.length === 1) {
    return input.toLowerCase() === expected.toLowerCase()
  }
  return input === expected
}

export function useKonamiCode(): boolean {
  const [unlocked, setUnlocked] = useState(false)
  // Progress lives in a ref so the keydown effect doesn't re-attach the
  // listener every keypress (it would if progress were in useState and
  // listed as a dependency). The effect only re-runs when `unlocked`
  // flips false → true, at which point we early-return and don't attach
  // a listener at all.
  const progressRef = useRef(0)

  useEffect(() => {
    // Once unlocked, no listener is needed — sequence completion is final.
    if (unlocked) return

    function onKeyDown(e: KeyboardEvent) {
      const expected = KONAMI[progressRef.current]
      if (keyMatches(e.key, expected)) {
        const next = progressRef.current + 1
        if (next === KONAMI.length) {
          setUnlocked(true)
          progressRef.current = 0
        } else {
          progressRef.current = next
        }
      } else {
        // Wrong key — restart, but check if this key starts a new sequence
        progressRef.current = keyMatches(e.key, KONAMI[0]) ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [unlocked])

  return unlocked
}
