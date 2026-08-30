import { useDroppable } from '@dnd-kit/core'
import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { Column as ColumnType } from '../types'
import { EmptyColumn } from './EmptyColumn'
import { TaskComposer, type ComposerDraft } from './TaskComposer'

interface ColumnProps {
  column: ColumnType
  /** position in the row — drives the one-time entrance stagger */
  index: number
  count: number
  isEmpty: boolean
  /** the column is empty only because of an active filter */
  isFiltered?: boolean
  /** a drag is in progress somewhere on the board */
  isDragActive?: boolean
  /** the dragged card is currently over this column */
  isDropTarget?: boolean
  /** changes when a task is added here — scroll the new card into view */
  scrollSignal?: number
  onAddTask: (draft: ComposerDraft) => void
  children?: ReactNode
}

export function Column({
  column,
  index,
  count,
  isEmpty,
  isFiltered,
  isDragActive,
  isDropTarget,
  scrollSignal,
  onAddTask,
  children,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id })
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      scrollRef.current = node
      setNodeRef(node)
    },
    [setNodeRef],
  )

  useEffect(() => {
    if (scrollSignal === undefined) return
    // Wait two frames so the new card is laid out (and any View Transition
    // snapshot has resolved) before measuring scrollHeight.
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = scrollRef.current
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [scrollSignal])

  return (
    <section
      aria-label={column.title}
      style={{ animationDelay: `${index * 55}ms` }}
      className="flex flex-col px-4 pb-4 motion-safe:animate-[column-enter_450ms_var(--ease-move)_both] md:min-h-0"
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
        ref={setRefs}
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
