import { useDroppable } from '@dnd-kit/core'
import type { ReactNode } from 'react'
import type { Column as ColumnType } from '../types'
import { EmptyColumn } from './EmptyColumn'

interface ColumnProps {
  column: ColumnType
  isEmpty: boolean
  /** a drag is in progress somewhere on the board */
  isDragActive?: boolean
  /** the dragged card is currently over this column */
  isDropTarget?: boolean
  children?: ReactNode
  footer?: ReactNode
}

export function Column({
  column,
  isEmpty,
  isDragActive,
  isDropTarget,
  children,
  footer,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <section aria-label={column.title} className="flex min-h-0 flex-col px-4 pb-4">
      <div
        ref={setNodeRef}
        data-drop-active={isDragActive || undefined}
        data-drop-target={isDropTarget || undefined}
        className="scroll-thin min-h-0 flex-1 overflow-y-auto rounded-lg pt-1 pr-1 transition-colors data-[drop-active]:bg-sunk/50 data-[drop-target]:bg-accent-wash"
      >
        {isEmpty ? <EmptyColumn line={column.emptyLine} /> : children}
      </div>
      {footer ? <div className="pt-2">{footer}</div> : null}
    </section>
  )
}
