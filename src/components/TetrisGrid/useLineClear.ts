import { useCallback, useEffect } from 'react'
import type { RefObject } from 'react'
import { useNavigate } from 'react-router'
import type { BlockId } from './Block'

const RETURN_FLAG = 'app:lastNonRootPath'

// Per-block flight vectors. Values are in vw / vh / deg so the same
// constants drive both forward (out) and reverse (in) animations.
// Picked so blocks scatter in a believable Tetris "line clear" shower.
const FLY: Record<BlockId, { tx: number; ty: number; rot: number }> = {
  hero:     { tx: -120, ty: 60,  rot: -22 },
  brand:    { tx: 80,   ty: -110, rot: 28 },
  about:    { tx: 130,  ty: -50, rot: 18 },
  work:     { tx: 110,  ty: 70,  rot: -16 },
  services: { tx: 140,  ty: 40,  rot: 24 },
  process:  { tx: -110, ty: 120, rot: -20 },
  contact:  { tx: 70,   ty: 130, rot: 32 },
}

const reduced = () =>
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches

export type BlockRef = {
  id: BlockId
  ref: RefObject<HTMLAnchorElement | null>
}

interface Controller {
  playOutAndNavigate: (clickedId: BlockId, to: string) => Promise<void>
}

// Drives both the forward "siblings fly off → navigate" sequence and
// the reverse "fly-in" replay when the user pops back to /.
//
// Key architectural choice: animations run BEFORE navigate(), not via
// route-exit transitions. This sidesteps the well-known fight between
// AnimatePresence and React Router's <Outlet> over key identity.
export function useLineClearController(blockRefs: BlockRef[]): Controller {
  const navigate = useNavigate()

  const playOutAndNavigate = useCallback(
    async (clickedId: BlockId, to: string) => {
      if (reduced()) {
        navigate(to)
        return
      }

      const finished: Promise<unknown>[] = []
      for (const { id, ref } of blockRefs) {
        if (id === clickedId) continue // clicked block stays put for the layoutId morph
        const el = ref.current
        if (!el) continue
        const v = FLY[id]
        const anim = el.animate(
          [
            { transform: 'translate(0, 0) rotate(0)', opacity: 1, offset: 0 },
            {
              transform: `translate(${v.tx}vw, ${v.ty}vh) rotate(${v.rot}deg)`,
              opacity: 0,
              offset: 1,
            },
          ],
          {
            duration: 420,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            fill: 'forwards',
          },
        )
        finished.push(anim.finished.catch(() => undefined))
      }

      await Promise.allSettled(finished)
      navigate(to)
    },
    [blockRefs, navigate],
  )

  // Reverse fly-in when user lands on / from any non-root path in this tab
  // session. Triggers on browser back, on programmatic navigate('/'), AND
  // on hard-reload of / when there's a tracked prior route — all three feel
  // like "coming back to home" from the user's perspective.
  // Guarded by the lastNonRootPath flag (set by RouteTracker in App.tsx)
  // so a fresh visit to / doesn't trigger a phantom fly-in.
  useEffect(() => {
    if (reduced()) return
    let returnedFrom: string | null = null
    try {
      returnedFrom = sessionStorage.getItem(RETURN_FLAG)
    } catch {
      /* ignore */
    }
    if (!returnedFrom || returnedFrom === '/' || returnedFrom === '') return
    try {
      sessionStorage.removeItem(RETURN_FLAG)
    } catch {
      /* ignore */
    }

    const animations: Animation[] = []
    for (const { id, ref } of blockRefs) {
      const el = ref.current
      if (!el) continue
      const v = FLY[id]
      const anim = el.animate(
        [
          {
            transform: `translate(${v.tx}vw, ${v.ty}vh) rotate(${v.rot}deg)`,
            opacity: 0,
            offset: 0,
          },
          { transform: 'translate(0, 0) rotate(0)', opacity: 1, offset: 1 },
        ],
        {
          duration: 460,
          easing: 'cubic-bezier(0, 0, 0.2, 1)',
          fill: 'backwards',
        },
      )
      animations.push(anim)
    }

    return () => {
      animations.forEach((a) => {
        if (a.playState !== 'finished') a.cancel()
      })
    }
  }, [blockRefs])

  return { playOutAndNavigate }
}
