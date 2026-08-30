import { useEffect, useMemo, useReducer } from 'react'
import { SEED_TASKS } from '../data/seed'
import {
  addTask,
  deleteTask,
  editTask,
  moveTask,
  reorderWithinColumn,
} from '../lib/board'
import { loadTasks, saveTasks } from '../lib/storage'
import type { ColumnId, Priority, Task } from '../types'

interface BoardState {
  tasks: Task[]
  /** snapshot taken before the last undoable action (a move or a delete) */
  previous: Task[] | null
}

export interface TaskDraft {
  id?: string
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
  | { type: 'undo' }

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
        previous: state.tasks,
      }
    case 'delete':
      return {
        tasks: deleteTask(state.tasks, action.taskId),
        previous: state.tasks,
      }
    case 'reorder':
      return {
        tasks: reorderWithinColumn(state.tasks, action.activeId, action.overId),
        previous: null,
      }
    case 'add':
      return { tasks: addTask(state.tasks, action.draft).tasks, previous: null }
    case 'edit':
      return {
        tasks: editTask(state.tasks, action.taskId, action.patch),
        previous: null,
      }
    case 'undo':
      return state.previous
        ? { tasks: state.previous, previous: null }
        : state
    default:
      return state
  }
}

export function useBoard() {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    tasks: loadTasks() ?? SEED_TASKS,
    previous: null,
  }))

  useEffect(() => {
    saveTasks(state.tasks)
  }, [state.tasks])

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
