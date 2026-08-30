/**
 * Run a state change inside a View Transition so cards animate from their old
 * position to their new one. Falls back to a plain call where the API is
 * missing or the viewer prefers reduced motion.
 */
export function withViewTransition(update: () => void): void {
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  type DocWithVT = Document & {
    startViewTransition?: (cb: () => void) => unknown
  }
  const doc = document as DocWithVT

  if (prefersReduced || typeof doc.startViewTransition !== 'function') {
    update()
    return
  }
  doc.startViewTransition(update)
}
