import type { Priority } from '../types'

const DOT: Record<Priority, string> = {
  low: 'var(--color-priority-low)',
  medium: 'var(--color-priority-medium)',
  high: 'var(--color-priority-high)',
}

const LABEL: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

interface PriorityPillProps {
  priority: Priority
}

/*
  The dot carries the colour; the label stays ink for contrast. Conventional
  slate / amber / red so it is parsed at a glance, not decoded.
*/
export function PriorityPill({ priority }: PriorityPillProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        style={{ backgroundColor: DOT[priority] }}
        className="size-[6px] rounded-full"
      />
      <span className="label-mono text-[10px] text-ink-soft">
        {LABEL[priority]}
      </span>
    </span>
  )
}
