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

/*
  Per-visit persistence: the board is kept in sessionStorage, so a reviewer's
  edits survive refreshes and in-tab navigation but every fresh visit starts
  from the clean sample set. That removes the need for a reset control and
  keeps the shared demo link honest.
*/
export function loadTasks(): Task[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
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
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // storage unavailable (private mode, quota) — the board still works for
    // this session, it just won't survive a reload
  }
}
