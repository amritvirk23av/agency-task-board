import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { adjacentColumn } from '../lib/board'
import type { ColumnId, Priority, Task } from '../types'
import { Avatar } from './Avatar'
import { CardMenu } from './CardMenu'
import { PriorityPill } from './PriorityPill'

const TITLE: Record<ColumnId, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
}

export interface TaskPatch {
  title?: string
  priority?: Priority
  assigneeId?: string
}

interface TaskCardViewProps {
  task: Task
  onMove?: (taskId: string, toColumn: ColumnId) => void
  onEdit?: (taskId: string, patch: TaskPatch) => void
  onDelete?: (taskId: string) => void
  handleProps?: Record<string, unknown>
  isDragging?: boolean
  isOverlay?: boolean
}

export function TaskCardView({
  task,
  onMove,
  onEdit,
  onDelete,
  handleProps,
  isDragging,
  isOverlay,
}: TaskCardViewProps) {
  const isDone = task.column === 'done'
  const forward = adjacentColumn(task.column, 'forward')
  const back = adjacentColumn(task.column, 'back')
  const editable = Boolean(onEdit) && !isOverlay

  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function startEditing() {
    setDraft(task.title)
    setEditing(true)
  }

  function commitTitle() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== task.title) onEdit?.(task.id, { title: trimmed })
    setEditing(false)
  }

  return (
    <article
      {...handleProps}
      data-done={isDone || undefined}
      data-dragging={isDragging || undefined}
      data-overlay={isOverlay || undefined}
      className="group relative rounded-[10px] border border-rule bg-surface p-3.5 transition-[border-color,box-shadow] hover:border-rule-strong data-[done]:bg-paper data-[dragging]:opacity-40 data-[overlay]:rotate-[1.5deg] data-[overlay]:border-rule-strong data-[overlay]:shadow-[0_12px_28px_-8px_rgba(26,26,23,0.22)] md:touch-none"
    >
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onPointerDown={(event) => event.stopPropagation()}
          onBlur={commitTitle}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commitTitle()
            }
            if (event.key === 'Escape') setEditing(false)
          }}
          aria-label="Task title"
          className="w-full rounded bg-transparent text-[13.5px] leading-snug font-medium text-ink focus:outline-none"
        />
      ) : (
        <p
          onClick={() => {
            if (editable) startEditing()
          }}
          className={`text-[13.5px] leading-snug font-medium text-ink group-data-[done]:text-ink-soft ${
            editable ? 'cursor-text pr-6' : ''
          }`}
        >
          {task.title}
        </p>
      )}

      {editable ? (
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          onPointerDown={(event) => event.stopPropagation()}
          aria-label={`Edit “${task.title}”`}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          className="absolute right-2 top-2.5 rounded p-1 text-ink-faint opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 hover:text-ink-soft focus-visible:opacity-100 data-[open]:opacity-100"
          data-open={menuOpen || undefined}
        >
          <MoreHorizontal size={15} strokeWidth={2} aria-hidden="true" />
        </button>
      ) : null}

      {menuOpen && onEdit && onDelete ? (
        <CardMenu
          task={task}
          anchorRef={menuButtonRef}
          onSetPriority={(priority) => onEdit(task.id, { priority })}
          onSetAssignee={(assigneeId) => onEdit(task.id, { assigneeId })}
          onDelete={() => {
            setMenuOpen(false)
            onDelete(task.id)
          }}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}

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
  onEdit: (taskId: string, patch: TaskPatch) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onMove, onEdit, onDelete }: TaskCardProps) {
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
        onEdit={onEdit}
        onDelete={onDelete}
        handleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </li>
  )
}
