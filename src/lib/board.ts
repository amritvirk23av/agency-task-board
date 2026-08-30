import { COLUMN_ORDER } from '../data/seed'
import type { ColumnId, Filter, Priority, Task } from '../types'

/** The column one step forward / back, or null at the ends. */
export function adjacentColumn(
  column: ColumnId,
  direction: 'forward' | 'back',
): ColumnId | null {
  const index = COLUMN_ORDER.indexOf(column)
  const next = direction === 'forward' ? index + 1 : index - 1
  return COLUMN_ORDER[next] ?? null
}

export function tasksInColumn(tasks: Task[], column: ColumnId): Task[] {
  return tasks.filter((task) => task.column === column)
}

/**
 * Move a task to another column, dropping it at `beforeId` (or the end).
 * Returns a new array with the task list re-threaded so column order is stable.
 */
export function moveTask(
  tasks: Task[],
  taskId: string,
  toColumn: ColumnId,
  beforeId?: string | null,
): Task[] {
  const moving = tasks.find((task) => task.id === taskId)
  if (!moving) return tasks

  const without = tasks.filter((task) => task.id !== taskId)
  const updated: Task = { ...moving, column: toColumn }

  if (beforeId == null) {
    // Append after the last task currently in the target column.
    const lastIndex = findLastIndex(without, (task) => task.column === toColumn)
    if (lastIndex === -1) return [...without, updated]
    return [
      ...without.slice(0, lastIndex + 1),
      updated,
      ...without.slice(lastIndex + 1),
    ]
  }

  const beforeIndex = without.findIndex((task) => task.id === beforeId)
  if (beforeIndex === -1) return [...without, updated]
  return [
    ...without.slice(0, beforeIndex),
    updated,
    ...without.slice(beforeIndex),
  ]
}

/** Reorder within a single column (drag to a new slot). */
export function reorderWithinColumn(
  tasks: Task[],
  activeId: string,
  overId: string,
): Task[] {
  const activeIndex = tasks.findIndex((task) => task.id === activeId)
  const overIndex = tasks.findIndex((task) => task.id === overId)
  if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
    return tasks
  }
  const next = [...tasks]
  const [moved] = next.splice(activeIndex, 1)
  next.splice(overIndex, 0, moved)
  return next
}

export function addTask(
  tasks: Task[],
  draft: { title: string; priority: Priority; assigneeId: string; column: ColumnId },
): { tasks: Task[]; task: Task } {
  const task: Task = { id: `t-${crypto.randomUUID().slice(0, 8)}`, ...draft }
  const lastIndex = findLastIndex(tasks, (t) => t.column === draft.column)
  const next =
    lastIndex === -1
      ? [task, ...tasks]
      : [...tasks.slice(0, lastIndex + 1), task, ...tasks.slice(lastIndex + 1)]
  return { tasks: next, task }
}

export function editTask(
  tasks: Task[],
  taskId: string,
  patch: Partial<Pick<Task, 'title' | 'priority' | 'assigneeId'>>,
): Task[] {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, ...patch } : task,
  )
}

export function deleteTask(tasks: Task[], taskId: string): Task[] {
  return tasks.filter((task) => task.id !== taskId)
}

export function matchesFilter(task: Task, filter: Filter): boolean {
  if (filter.priority !== 'all' && task.priority !== filter.priority) return false
  if (filter.assigneeId !== 'all' && task.assigneeId !== filter.assigneeId) {
    return false
  }
  return true
}

export function isFilterActive(filter: Filter): boolean {
  return filter.priority !== 'all' || filter.assigneeId !== 'all'
}

// Array.prototype.findLastIndex isn't in the lib target; small local helper.
function findLastIndex<T>(arr: T[], predicate: (item: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    if (predicate(arr[i])) return i
  }
  return -1
}
