import type { ReactNode } from 'react'
import type { Column as ColumnType } from '../types'
import { EmptyColumn } from './EmptyColumn'

interface ColumnProps {
  column: ColumnType
  isEmpty: boolean
  children?: ReactNode
  /** composer trigger / form — wired in later */
  footer?: ReactNode
}

export function Column({ column, isEmpty, children, footer }: ColumnProps) {
  return (
    <section
      aria-label={column.title}
      className="flex min-h-0 flex-col px-4 pb-4"
    >
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto pt-1 pr-1">
        {isEmpty ? <EmptyColumn line={column.emptyLine} /> : children}
      </div>
      {footer ? <div className="pt-2">{footer}</div> : null}
    </section>
  )
}
