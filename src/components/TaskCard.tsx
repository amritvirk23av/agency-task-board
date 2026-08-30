import { Check } from 'lucide-react'
import type { Task } from '../types'
import { Avatar } from './Avatar'
import { PriorityPill } from './PriorityPill'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const isDone = task.column === 'done'

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
    </article>
  )
}
