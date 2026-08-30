import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { adjacentColumn } from '../lib/board'
import type { ColumnId, Task } from '../types'
import { Avatar } from './Avatar'
import { PriorityPill } from './PriorityPill'

interface TaskCardProps {
  task: Task
  onMove: (taskId: string, toColumn: ColumnId) => void
}

const TITLE: Record<ColumnId, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
}

export function TaskCard({ task, onMove }: TaskCardProps) {
  const isDone = task.column === 'done'
  const forward = adjacentColumn(task.column, 'forward')
  const back = adjacentColumn(task.column, 'back')

  return (
    <article
      style={{ viewTransitionName: `task-${task.id}` }}
      data-done={isDone || undefined}
      className="group rounded-[10px] border border-rule bg-surface p-3.5 transition-colors hover:border-rule-strong data-[done]:bg-paper"
    >
      <p className="text-[13.5px] leading-snug font-medium text-ink group-data-[done]:text-ink-soft">
        {task.title}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isDone ? (
            <Check
              size={13}
              strokeWidth={2.5}
              className="text-ink-faint"
              aria-hidden="true"
            />
          ) : null}
          <PriorityPill priority={task.priority} />
        </div>
        <Avatar assigneeId={task.assigneeId} />
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-rule pt-2.5">
        {back ? (
          <button
            type="button"
            onClick={() => onMove(task.id, back)}
            aria-label={`Move “${task.title}” back to ${TITLE[back]}`}
            className="label-mono -ml-1 flex items-center gap-1 rounded p-1 text-[10px] text-ink-faint transition-colors hover:text-accent"
          >
            <ChevronLeft size={13} strokeWidth={2.5} aria-hidden="true" />
            {TITLE[back]}
          </button>
        ) : (
          <span aria-hidden="true" />
        )}

        {forward ? (
          <button
            type="button"
            onClick={() => onMove(task.id, forward)}
            aria-label={`Move “${task.title}” to ${TITLE[forward]}`}
            className="label-mono -mr-1 flex items-center gap-1 rounded p-1 text-[10px] text-ink-soft transition-colors hover:text-accent"
          >
            {TITLE[forward]}
            <ChevronRight size={13} strokeWidth={2.5} aria-hidden="true" />
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
    </article>
  )
}
