import { useDroppable } from '@dnd-kit/core'
import type { ReactNode } from 'react'
import type { Column as ColumnType } from '../types'
import { EmptyColumn } from './EmptyColumn'
import { TaskComposer, type ComposerDraft } from './TaskComposer'

interface ColumnProps {
  column: ColumnType
  count: number
  isEmpty: boolean
  /** the column is empty only because of an active filter */
  isFiltered?: boolean
  /** a drag is in progress somewhere on the board */
  isDragActive?: boolean
  /** the dragged card is currently over this column */
  isDropTarget?: boolean
  onAddTask: (draft: ComposerDraft) => void
  children?: ReactNode
}

export function Column({
  column,
  count,
  isEmpty,
  isFiltered,
  isDragActive,
  isDropTarget,
  onAddTask,
  children,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <section
      aria-label={column.title}
      className="flex flex-col px-4 pb-4 md:min-h-0"
    >
      {/* Phone-only header — the meridian takes over on desktop */}
      <div className="flex items-baseline gap-2 pt-4 pb-1 md:hidden">
        <span aria-hidden="true" className="size-[6px] rounded-full bg-ink" />
        <h2 className="label-mono text-ink">{column.title}</h2>
        <span className="font-mono text-[11px] text-ink-faint tabular-nums">
          · {String(count).padStart(2, '0')}
        </span>
      </div>

      <div
        ref={setNodeRef}
        data-drop-active={isDragActive || undefined}
        data-drop-target={isDropTarget || undefined}
        className="scroll-thin rounded-lg pt-1 pr-1 transition-colors data-[drop-active]:bg-sunk/50 data-[drop-target]:bg-accent-wash md:min-h-0 md:flex-1 md:overflow-y-auto"
      >
        {isEmpty ? (
          <EmptyColumn line={column.emptyLine} filtered={isFiltered} />
        ) : (
          children
        )}
      </div>
      <div className="pt-2">
        <TaskComposer columnTitle={column.title} onAdd={onAddTask} />
      </div>
    </section>
  )
}
