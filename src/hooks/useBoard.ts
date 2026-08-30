import { useMemo, useReducer } from 'react'
import { SEED_TASKS } from '../data/seed'
import { moveTask, reorderWithinColumn } from '../lib/board'
import type { ColumnId, Task } from '../types'

interface BoardState {
  tasks: Task[]
}

type BoardAction =
  | { type: 'move'; taskId: string; toColumn: ColumnId; beforeId?: string | null }
  | { type: 'reorder'; activeId: string; overId: string }

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
