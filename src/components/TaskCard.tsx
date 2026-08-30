import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { adjacentColumn } from '../lib/board'
import type { ColumnId, Task } from '../types'
import { Avatar } from './Avatar'
import { PriorityPill } from './PriorityPill'

const TITLE: Record<ColumnId, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
}

interface TaskCardViewProps {
  task: Task
  onMove?: (taskId: string, toColumn: ColumnId) => void
  /** drag handle listeners spread onto the card body */
  handleProps?: Record<string, unknown>
  isDragging?: boolean
  /** the copy that floats under the cursor while dragging */
  isOverlay?: boolean
}

/** Pure presentation — used directly for the drag overlay. */
export function TaskCardView({
  task,
  onMove,
  handleProps,
  isDragging,
  isOverlay,
}: TaskCardViewProps) {
  const isDone = task.column === 'done'
  const forward = adjacentColumn(task.column, 'forward')
  const back = adjacentColumn(task.column, 'back')

  return (
    <article
      {...handleProps}
      data-done={isDone || undefined}
      data-dragging={isDragging || undefined}
      data-overlay={isOverlay || undefined}
      className="group touch-none rounded-[10px] border border-rule bg-surface p-3.5 transition-[border-color,box-shadow] hover:border-rule-strong data-[done]:bg-paper data-[dragging]:opacity-40 data-[overlay]:rotate-[1.5deg] data-[overlay]:border-rule-strong data-[overlay]:shadow-[0_12px_28px_-8px_rgba(26,26,23,0.22)]"
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
        {back && onMove ? (
          <MoveButton
            onClick={() => onMove(task.id, back)}
            ariaLabel={`Move “${task.title}” back to ${TITLE[back]}`}
            align="start"
          >
            <ChevronLeft size={13} strokeWidth={2.5} aria-hidden="true" />
            {TITLE[back]}
          </MoveButton>
        ) : (
          <span aria-hidden="true" />
        )}

        {forward && onMove ? (
          <MoveButton
            onClick={() => onMove(task.id, forward)}
            ariaLabel={`Move “${task.title}” to ${TITLE[forward]}`}
            align="end"
          >
            {TITLE[forward]}
            <ChevronRight size={13} strokeWidth={2.5} aria-hidden="true" />
          </MoveButton>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
    </article>
  )
}

interface MoveButtonProps {
  onClick: () => void
  ariaLabel: string
  align: 'start' | 'end'
  children: ReactNode
}

function MoveButton({ onClick, ariaLabel, align, children }: MoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
      aria-label={ariaLabel}
      className={`label-mono flex items-center gap-1 rounded p-1 text-[10px] transition-colors hover:text-accent ${
        align === 'start' ? '-ml-1 text-ink-faint' : '-mr-1 text-ink-soft'
      }`}
    >
      {children}
    </button>
  )
}

interface TaskCardProps {
  task: Task
  onMove: (taskId: string, toColumn: ColumnId) => void
}

/** Sortable wrapper — draggable by the card body, buttons still click through. */
export function TaskCard({ task, onMove }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    viewTransitionName: isDragging ? 'none' : `task-${task.id}`,
  }

  return (
    <li ref={setNodeRef} style={style}>
      <TaskCardView
        task={task}
        onMove={onMove}
        handleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </li>
  )
}
