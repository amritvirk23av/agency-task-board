import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BoardShell } from './components/BoardShell'
import { Column } from './components/Column'
import { FilterBar } from './components/FilterBar'
import { Meridian } from './components/Meridian'
import { TaskCardView, type TaskPatch } from './components/TaskCard'
import { TaskList } from './components/TaskList'
import type { ComposerDraft } from './components/TaskComposer'
import { Toast, type ToastState } from './components/Toast'
import { TopBar } from './components/TopBar'
import { COLUMNS } from './data/seed'
import { useAnnounce } from './hooks/useAnnounce'
import { useBoard } from './hooks/useBoard'
import { isColumnId, isFilterActive, matchesFilter } from './lib/board'
import { withViewTransition } from './lib/motion'
import type { ColumnId, Filter } from './types'

const TITLE: Record<ColumnId, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
}

export default function App() {
  const { tasks, byColumn, dispatch } = useBoard()
  const { message, announce } = useAnnounce()
  const [pulsedColumn, setPulsedColumn] = useState<ColumnId | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<ColumnId | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [filter, setFilter] = useState<Filter>({
    priority: 'all',
    assigneeId: 'all',
  })
  const toastKey = useRef(0)

  const filtered = isFilterActive(filter)
  const visibleByColumn = {
    todo: byColumn.todo.filter((task) => matchesFilter(task, filter)),
    'in-progress': byColumn['in-progress'].filter((task) =>
      matchesFilter(task, filter),
    ),
    done: byColumn.done.filter((task) => matchesFilter(task, filter)),
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const counts = {
    todo: visibleByColumn.todo.length,
    'in-progress': visibleByColumn['in-progress'].length,
    done: visibleByColumn.done.length,
  }

  const activeTask = tasks.find((task) => task.id === activeId) ?? null

  const dismissToast = useCallback(() => setToast(null), [])

  const undo = useCallback(() => {
    withViewTransition(() => dispatch({ type: 'undo' }))
    announce('Change reverted.')
  }, [dispatch, announce])

  const offerUndo = useCallback(
    (message: string) => {
      toastKey.current += 1
      setToast({ key: toastKey.current, message, onUndo: undo })
    },
    [undo],
  )

  // Ctrl/Cmd+Z reverts the last move or delete while its toast is up.
  useEffect(() => {
    if (!toast) return
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        undo()
        dismissToast()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toast, undo, dismissToast])

  function pulse(column: ColumnId) {
    setPulsedColumn(column)
    window.setTimeout(() => setPulsedColumn(null), 650)
  }

  function handleMove(taskId: string, toColumn: ColumnId) {
    const task = tasks.find((t) => t.id === taskId)
    withViewTransition(() => dispatch({ type: 'move', taskId, toColumn }))
    pulse(toColumn)
    if (task) offerUndo(`“${task.title}” moved to ${TITLE[toColumn]}.`)
  }

  function handleAdd(column: ColumnId, draft: ComposerDraft) {
    dismissToast()
    withViewTransition(() => dispatch({ type: 'add', draft: { ...draft, column } }))
    announce(`“${draft.title}” added to ${TITLE[column]}.`)
  }

  function handleEdit(taskId: string, patch: TaskPatch) {
    dispatch({ type: 'edit', taskId, patch })
  }

  function handleDelete(taskId: string) {
    const task = tasks.find((t) => t.id === taskId)
    withViewTransition(() => dispatch({ type: 'delete', taskId }))
    if (task) offerUndo(`“${task.title}” deleted.`)
  }

  function columnOf(id: string): ColumnId | null {
    if (isColumnId(id)) return id
    return tasks.find((task) => task.id === id)?.column ?? null
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragOver(event: DragOverEvent) {
    const overId = event.over ? String(event.over.id) : null
    setOverColumn(overId ? columnOf(overId) : null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    setOverColumn(null)
    if (!over) return

    const activeIdStr = String(active.id)
    const overId = String(over.id)
    const task = tasks.find((t) => t.id === activeIdStr)
    if (!task) return

    const target = columnOf(overId)
    if (!target) return

    if (target === task.column) {
      if (!isColumnId(overId) && overId !== activeIdStr) {
        dispatch({ type: 'reorder', activeId: activeIdStr, overId })
      }
      return
    }

    withViewTransition(() =>
      dispatch({ type: 'move', taskId: activeIdStr, toColumn: target }),
    )
    pulse(target)
    offerUndo(`“${task.title}” moved to ${TITLE[target]}.`)
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActiveId(null)
          setOverColumn(null)
        }}
      >
        <BoardShell
          topBar={
            <TopBar
              actions={<FilterBar filter={filter} onChange={setFilter} />}
            />
          }
          meridian={
            <Meridian
              columns={COLUMNS}
              counts={counts}
              pulsedColumn={pulsedColumn}
            />
          }
          columns={COLUMNS.map((column) => {
            const columnTasks = visibleByColumn[column.id]
            return (
              <Column
                key={column.id}
                column={column}
                isEmpty={columnTasks.length === 0}
                isFiltered={filtered && byColumn[column.id].length > 0}
                isDragActive={activeId !== null}
                isDropTarget={overColumn === column.id}
                onAddTask={(draft) => handleAdd(column.id, draft)}
              >
                <TaskList
                  tasks={columnTasks}
                  onMove={handleMove}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Column>
            )
          })}
        />
        <DragOverlay
          dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2,0,0,1)' }}
        >
          {activeTask ? <TaskCardView task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <Toast toast={toast} onDismiss={dismissToast} />

      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </>
  )
}
