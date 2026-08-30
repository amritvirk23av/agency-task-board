import { RotateCcw } from 'lucide-react'

interface ResetButtonProps {
  onReset: () => void
}

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onReset}
      title="Restore the sample tasks"
      className="label-mono flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1.5 text-[10px] text-ink-faint transition-colors hover:border-rule hover:text-ink-soft"
    >
      <RotateCcw size={12} strokeWidth={2.25} aria-hidden="true" />
      Reset
    </button>
  )
}
