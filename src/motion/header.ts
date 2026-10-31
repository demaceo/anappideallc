// The sticky masthead collapses over the first --collapse-range of scroll (a
// CSS scroll-driven animation; see globals.css), pulling the page up by a few
// hundred px. Returns the scroll position where that collapse ends, so motion
// can re-measure past it and avoid starting inside it.
export function headerCollapseEnd(): number {
  const range = getComputedStyle(document.documentElement).getPropertyValue('--collapse-range')
  return parseFloat(range.trim().split(/\s+/).pop() ?? '') || 200
}
