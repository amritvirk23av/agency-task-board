import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { TEAM } from '../data/team'
import type { Priority, Task } from '../types'

const PRIORITIES: { value: Priority; label: string; dot: string }[] = [
  { value: 'low', label: 'Low', dot: 'var(--color-priority-low)' },
  { value: 'medium', label: 'Med', dot: 'var(--color-priority-medium)' },
  { value: 'high', label: 'High', dot: 'var(--color-priority-high)' },
]

const MENU_WIDTH = 208

interface CardMenuProps {
  task: Task
  anchorRef: RefObject<HTMLElement | null>
  onSetPriority: (priority: Priority) => void
  onSetAssignee: (assigneeId: string) => void
  onDelete: () => void
  onClose: () => void
}

export function CardMenu({
  task,
  anchorRef,
  onSetPriority,
  onSetAssignee,
  onDelete,
  onClose,
}: CardMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    const rect = anchorRef.current?.getBoundingClientRect()
    if (!rect) return
    const left = Math.min(
      rect.right - MENU_WIDTH,
      window.innerWidth - MENU_WIDTH - 8,
    )
    setPos({ top: rect.bottom + 6, left: Math.max(8, left) })
  }, [anchorRef])

  // Move focus into the panel on open, and back to the trigger on close.
  useEffect(() => {
    const anchor = anchorRef.current
    ref.current?.querySelector<HTMLElement>('button, select')?.focus()
    return () => anchor?.focus()
  }, [anchorRef])

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (
        !ref.current?.contains(event.target as Node) &&
        !anchorRef.current?.contains(event.target as Node)
      ) {
        onClose()
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    // Any scroll dismisses — the anchor would drift otherwise.
    window.addEventListener('scroll', onClose, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onClose, true)
    }
  }, [onClose, anchorRef])

  if (!pos) return null

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label={`Edit “${task.title}”`}
      style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
      className="fixed z-50 rounded-[10px] border border-rule-strong bg-surface p-3 shadow-[var(--shadow-pop)]"
    >
      <p className="label-mono text-[9px] text-ink-faint">Priority</p>
      <div className="mt-1.5 flex rounded-md border border-rule p-0.5">
        {PRIORITIES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSetPriority(option.value)}
            aria-pressed={task.priority === option.value}
            className="label-mono flex flex-1 items-center justify-center gap-1 rounded px-1 py-1 text-[9px] text-ink-soft transition-colors aria-pressed:bg-sunk aria-pressed:text-ink"
          >
            <span
              aria-hidden="true"
              style={{ backgroundColor: option.dot }}
              className="size-[5px] rounded-full"
            />
            {option.label}
          </button>
        ))}
      </div>

      <p className="label-mono mt-3 text-[9px] text-ink-faint">Assignee</p>
      <select
        value={task.assigneeId}
        onChange={(event) => onSetAssignee(event.target.value)}
        aria-label="Assignee"
        className="mt-1.5 w-full rounded-md border border-rule bg-transparent px-2 py-1 text-[12px] text-ink-soft"
      >
        {TEAM.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>

      <div className="mt-3 border-t border-rule pt-2">
        {confirmDelete ? (
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-ink-soft">Delete this task?</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="label-mono rounded px-1.5 py-1 text-[9px] text-ink-faint hover:text-ink-soft"
              >
                No
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="label-mono rounded bg-danger px-2 py-1 text-[9px] text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="label-mono text-[10px] text-ink-soft transition-colors hover:text-danger"
          >
            Delete task
          </button>
        )}
      </div>
    </div>,
    document.body,
  )
}
