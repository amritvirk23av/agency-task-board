import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { dark, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className="flex size-8 items-center justify-center rounded-md border border-transparent text-ink-soft transition-colors hover:border-rule hover:text-ink"
    >
      {dark ? (
        <Sun size={15} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Moon size={15} strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  )
}
