import type { gsap as GSAP } from 'gsap'
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'

export interface SceneApi {
  gsap: typeof GSAP
  ScrollTrigger: typeof ST
  // The [data-scene] element. Its markup is the scene's finished state.
  el: HTMLElement
  // Desktop (>= 1024px): the scene sits sticky beside its chapter and plays
  // across the chapter's scroll. Compact: it plays as it scrolls past.
  desktop: boolean
}

// Builds the scene's scroll timeline. Runs inside gsap.matchMedia(), which
// reverts every tween and set() on breakpoint change or unmount, restoring the
// finished-state markup. Return a function for any extra cleanup.
export type SceneSetup = (api: SceneApi) => void | (() => void)

// Scene timelines are code-split: a page only downloads the ones it renders.
export const SCENES: Record<string, () => Promise<{ default: SceneSetup }>> = {
  unfold: () => import('./unfold'),
  accumulation: () => import('./accumulation'),
  thread: () => import('./thread'),
  split: () => import('./split'),
  timeline: () => import('./timeline'),
  network: () => import('./network'),
  door: () => import('./door'),
}
