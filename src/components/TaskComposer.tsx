import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { TEAM } from '../data/team'
import type { Priority } from '../types'

const PRIORITIES: { value: Priority; label: string; dot: string }[] = [
  { value: 'low', label: 'Low', dot: 'var(--color-priority-low)' },
  { value: 'medium', label: 'Medium', dot: 'var(--color-priority-medium)' },
  { value: 'high', label: 'High', dot: 'var(--color-priority-high)' },
]

export interface ComposerDraft {
  title: string
  priority: Priority
  assigneeId: string
}

interface TaskComposerProps {
  columnTitle: string
  onAdd: (draft: ComposerDraft) => void
}

export function TaskComposer({ columnTitle, onAdd }: TaskComposerProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [assigneeId, setAssigneeId] = useState(TEAM[0].id)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function submit() {
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd({ title: trimmed, priority, assigneeId })
    setTitle('')
    inputRef.current?.focus() // stay open for rapid entry
  }

  function close() {
    setOpen(false)
    setTitle('')
    setPriority('medium')
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-2 text-[12px] text-ink-faint transition-colors hover:border-rule hover:text-ink-soft"
      >
        <Plus size={14} strokeWidth={2.25} aria-hidden="true" />
        Add task
      </button>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close()
      }}
      className="rounded-[10px] border border-rule-strong bg-surface p-3"
    >
      <input
        ref={inputRef}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            submit()
          }
        }}
        placeholder="What needs doing?"
        aria-label={`New task in ${columnTitle}`}
        className="w-full bg-transparent text-[13.5px] font-medium text-ink placeholder:text-ink-faint focus:outline-none"
      />

      <div className="mt-3 flex items-center gap-2">
        <div className="flex rounded-md border border-rule p-0.5">
          {PRIORITIES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPriority(option.value)}
              aria-pressed={priority === option.value}
              className="label-mono flex items-center gap-1 rounded px-1.5 py-1 text-[9px] text-ink-soft transition-colors aria-pressed:bg-sunk aria-pressed:text-ink"
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

        <label className="sr-only" htmlFor="composer-assignee">
          Assignee
        </label>
        <select
          id="composer-assignee"
          value={assigneeId}
          onChange={(event) => setAssigneeId(event.target.value)}
          className="label-mono ml-auto rounded-md border border-rule bg-transparent px-2 py-1 text-[10px] text-ink-soft focus-visible:outline-2"
        >
          {TEAM.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={close}
          className="label-mono rounded px-2 py-1 text-[10px] text-ink-faint transition-colors hover:text-ink-soft"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="label-mono rounded bg-accent px-2.5 py-1 text-[10px] text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          Add task
        </button>
      </div>
    </form>
  )
}
