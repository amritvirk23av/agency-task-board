import { STORAGE_KEY } from '../data/seed'
import type { ColumnId, Priority, Task } from '../types'

const PRIORITIES: Priority[] = ['low', 'medium', 'high']
const COLUMNS: ColumnId[] = ['todo', 'in-progress', 'done']

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.assigneeId === 'string' &&
    PRIORITIES.includes(task.priority as Priority) &&
    COLUMNS.includes(task.column as ColumnId)
  )
}

/** Returns the saved board, or null if nothing valid is stored. */
export function loadTasks(): Task[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isTask)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // storage full or unavailable (private mode) — the board still works
    // for this session, it just won't survive a reload
  }
}

export function clearTasks(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nothing to do
  }
}
