import { useMemo, useReducer } from 'react'
import { SEED_TASKS } from '../data/seed'
import {
  addTask,
  deleteTask,
  editTask,
  moveTask,
  reorderWithinColumn,
} from '../lib/board'
import type { ColumnId, Priority, Task } from '../types'

interface BoardState {
  tasks: Task[]
}

export interface TaskDraft {
  title: string
  priority: Priority
  assigneeId: string
  column: ColumnId
}

type TaskPatch = Partial<Pick<Task, 'title' | 'priority' | 'assigneeId'>>

type BoardAction =
  | { type: 'move'; taskId: string; toColumn: ColumnId; beforeId?: string | null }
  | { type: 'reorder'; activeId: string; overId: string }
  | { type: 'add'; draft: TaskDraft }
  | { type: 'edit'; taskId: string; patch: TaskPatch }
  | { type: 'delete'; taskId: string }

function reducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'move':
      return {
        tasks: moveTask(
          state.tasks,
          action.taskId,
          action.toColumn,
          action.beforeId,
        ),
      }
    case 'reorder':
      return {
        tasks: reorderWithinColumn(state.tasks, action.activeId, action.overId),
      }
    case 'add':
      return { tasks: addTask(state.tasks, action.draft).tasks }
    case 'edit':
      return { tasks: editTask(state.tasks, action.taskId, action.patch) }
    case 'delete':
      return { tasks: deleteTask(state.tasks, action.taskId) }
    default:
      return state
  }
}

export function useBoard() {
  const [state, dispatch] = useReducer(reducer, { tasks: SEED_TASKS })

  const byColumn = useMemo(() => {
    const groups: Record<ColumnId, Task[]> = {
      todo: [],
      'in-progress': [],
      done: [],
    }
    for (const task of state.tasks) groups[task.column].push(task)
    return groups
  }, [state.tasks])

  return { tasks: state.tasks, byColumn, dispatch }
}
