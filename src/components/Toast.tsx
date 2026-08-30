import { useEffect } from 'react'

export interface ToastState {
  /** bumped each time so re-triggering the same message restarts the timer */
  key: number
  message: string
  onUndo: () => void
}

interface ToastProps {
  toast: ToastState | null
  onDismiss: () => void
}

const LIFESPAN_MS = 6000

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(onDismiss, LIFESPAN_MS)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center">
      <div
        role="status"
        className="pointer-events-auto flex items-center gap-3 rounded-full border border-ink/10 bg-ink py-2 pr-2 pl-4 text-[12px] text-paper shadow-[var(--shadow-pop)] motion-safe:animate-[toast-in_180ms_var(--ease-move)]"
      >
        <span>{toast.message}</span>
        <button
          type="button"
          onClick={() => {
            toast.onUndo()
            onDismiss()
          }}
          className="label-mono rounded-full bg-paper/10 px-2.5 py-1 text-[10px] text-paper transition-colors hover:bg-paper/20"
        >
          Undo
        </button>
      </div>
    </div>
  )
}
