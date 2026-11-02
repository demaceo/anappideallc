// Calendly's popup scheduler, loaded only when a visitor asks for it.
//
// Calendly's copy-paste badge snippet loads widget.js and widget.css on every
// page view for every visitor, including the ones who never book. On a site
// that sells "privacy-first", that third-party code (and anything it sets)
// waits until someone clicks. The popup itself is identical.
//
// API checked against the shipped widget.js: `Calendly.initPopupWidget({ url })`
// opens the popup (it defers itself until the DOM is ready).

const CSS_URL = 'https://assets.calendly.com/assets/external/widget.css'
const JS_URL = 'https://assets.calendly.com/assets/external/widget.js'

interface CalendlyGlobal {
  initPopupWidget(options: { url: string }): void
}

declare global {
  interface Window {
    Calendly?: CalendlyGlobal
  }
}

let loading: Promise<CalendlyGlobal> | null = null

function loadCalendly(): Promise<CalendlyGlobal> {
  if (window.Calendly) return Promise.resolve(window.Calendly)
  if (loading) return loading

  loading = new Promise<CalendlyGlobal>((resolve, reject) => {
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = CSS_URL
    document.head.appendChild(css)

    const js = document.createElement('script')
    js.src = JS_URL
    js.async = true
    js.onload = () =>
      window.Calendly ? resolve(window.Calendly) : reject(new Error('Calendly global missing'))
    js.onerror = () => reject(new Error('Calendly script failed to load'))
    document.head.appendChild(js)
  }).catch((err: unknown) => {
    // Let the next click try again rather than caching a failure forever.
    loading = null
    throw err
  })
  return loading
}

// Opens the scheduler in a popup. If Calendly can't load (offline, blocked by
// an extension), falls back to the booking page in a new tab, so the click
// never does nothing.
export async function openBookingPopup(url: string): Promise<void> {
  try {
    const calendly = await loadCalendly()
    calendly.initPopupWidget({ url })
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// Test-only: forget the cached load between tests.
export function resetCalendlyLoader(): void {
  loading = null
}
