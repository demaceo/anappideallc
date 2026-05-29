import { useEffect } from 'react'
import { useLocation } from 'react-router'

// On every route change, move keyboard focus to the page's main heading.
// React Router doesn't do this automatically. Without it, screen-reader
// users have no signal that navigation occurred and Tab order continues
// from wherever it was on the previous route.
//
// Targets <main> first (most semantic), falls back to the first <h1>.
// Uses tabIndex=-1 so the element can receive programmatic focus without
// becoming a Tab stop.
export function RouteFocusReset() {
  const { pathname } = useLocation()

  useEffect(() => {
    const target =
      (document.querySelector('main') as HTMLElement | null) ??
      (document.querySelector('h1') as HTMLElement | null)
    if (!target) return

    const prevTabIndex = target.getAttribute('tabindex')
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })

    // Restore the original tabindex (or remove if there was none) so we
    // don't leave the element as a focus target after handing off.
    return () => {
      if (prevTabIndex === null) target.removeAttribute('tabindex')
      else target.setAttribute('tabindex', prevTabIndex)
    }
  }, [pathname])

  return null
}
