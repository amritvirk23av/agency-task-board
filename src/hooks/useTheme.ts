import { useCallback, useState } from 'react'

const THEME_KEY = 'meridian.theme'

function prefersDark(): boolean {
  return (
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
  )
}

/*
  The initial class is set by a tiny inline script in index.html (before paint,
  so there's no flash). This hook mirrors that state and toggles it, storing the
  explicit choice so it sticks for a returning visitor.
*/
export function useTheme() {
  const [dark, setDark] = useState(prefersDark)

  const toggle = useCallback(() => {
    setDark((current) => {
      const next = !current
      document.documentElement.classList.toggle('dark', next)
      try {
        localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
      } catch {
        // preference just won't persist
      }
      return next
    })
  }, [])

  return { dark, toggle }
}
