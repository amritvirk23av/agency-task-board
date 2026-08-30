import { useCallback, useState } from 'react'

/**
 * A polite screen-reader announcement channel. Render `message` in an
 * aria-live region; call `announce` after a move, add, or delete.
 */
export function useAnnounce() {
  const [message, setMessage] = useState('')

  const announce = useCallback((text: string) => {
    // Clear first so repeated identical messages are still spoken.
    setMessage('')
    requestAnimationFrame(() => setMessage(text))
  }, [])

  return { message, announce }
}
