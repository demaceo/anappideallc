import type { SceneApi } from './index'
import { headerCollapseEnd } from '../header'

// Selects a scene's animated parts by their data-p="name" attribute.
export const parts = (el: HTMLElement) => (name: string) =>
  [...el.querySelectorAll<SVGElement>(`[data-p="${name}"]`)]

// How scenes play.
//
// Below the fold, a scene scrubs to scroll. Desktop: it's sticky beside its
// chapter (.split), plays across the chapter's run, and must FINISH while
// still pinned: a ~460px scene stuck at --sticky-offset releases when the
// split's bottom nears 66% of the viewport, so the timeline ends at 72%.
// Compact: it plays as the scene itself crosses the viewport, finishing with
// its bottom at 65% of the screen so the whole scene (~360px on a phone) is
// still below the collapsed header (up to ~170px on Home) when it ends.
//
// Near the top (on screen, or nearly, when the page opens), there's no stable
// scroll run to scrub across: the sticky header's own collapse moves the
// layout for the first ~200px. Those scenes build themselves once, at a fixed
// speed, as soon as the whole scene is in view.
const AUTOPLAY_SPEED = 2.4 // timeline "scroll seconds" → ~2.5s of real time

export function sceneTimeline({ gsap, ScrollTrigger, el, desktop }: SceneApi) {
  const defaults = { ease: 'power2.inOut' }
  const trigger = desktop ? (el.closest<HTMLElement>('.split') ?? el) : el
  const startAt = desktop ? 0.75 : 0.85
  const pageTop = trigger.getBoundingClientRect().top + window.scrollY
  if (pageTop < window.innerHeight * startAt) {
    // Play once, the moment the whole scene is in view: right away if it
    // already is (a trigger at scroll 0 wouldn't fire until the page moved),
    // otherwise when the small scroll brings it fully up. The trigger point is
    // a function so it's re-read when the collapsing header moves the layout.
    const tl = gsap.timeline({ defaults, paused: true }).timeScale(AUTOPLAY_SPEED)
    const sceneBottom = () => el.getBoundingClientRect().bottom
    if (sceneBottom() <= window.innerHeight) {
      gsap.delayedCall(0.3, () => void tl.play())
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: () => sceneBottom() + window.scrollY - window.innerHeight,
        once: true,
        onEnter: () => void tl.play(),
      })
    }
    return tl
  }
  // Positions are functions so every ScrollTrigger.refresh() re-reads the
  // live layout. A scrubbed scene never starts before the header has finished
  // collapsing: otherwise, once the layout settles, it's already part-played.
  //
  // It gets at least `minRun` px of scroll, but never past the last position
  // where the whole scene is still below the header (--sticky-offset): a scene
  // must be seen finishing.
  const endAt = desktop ? 0.72 : 0.65
  const minRun = 240
  const pageY = (r: DOMRect, edge: 'top' | 'bottom') => r[edge] + window.scrollY
  const naturalStart = () => pageY(trigger.getBoundingClientRect(), 'top') - window.innerHeight * startAt
  const start = () => Math.max(naturalStart(), headerCollapseEnd() + 1)
  const lastVisible = () => {
    const scene = el.getBoundingClientRect()
    return desktop
      ? // Sticky: pinned at the offset until the split's bottom pushes it up.
        pageY(trigger.getBoundingClientRect(), 'bottom') - (stickyOffset() + scene.height)
      : pageY(scene, 'top') - stickyOffset()
  }
  const end = () => {
    const natural = pageY(trigger.getBoundingClientRect(), 'bottom') - window.innerHeight * endAt
    const s = start()
    return Math.max(natural, Math.min(s + minRun, lastVisible()), s + 1)
  }
  return gsap.timeline({ defaults, scrollTrigger: { trigger, start, end, scrub: 0.8 } })
}

// --sticky-offset (a rem value) in px: the clearance under the collapsed header.
function stickyOffset() {
  const root = getComputedStyle(document.documentElement)
  return parseFloat(root.getPropertyValue('--sticky-offset')) * parseFloat(root.fontSize) || 144
}
