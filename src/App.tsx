import { useState } from 'react'
import { BoardShell } from './components/BoardShell'
import { Column } from './components/Column'
import { Meridian } from './components/Meridian'
import { TaskList } from './components/TaskList'
import { TopBar } from './components/TopBar'
import { COLUMNS } from './data/seed'
import { useAnnounce } from './hooks/useAnnounce'
import { useBoard } from './hooks/useBoard'
import { withViewTransition } from './lib/motion'
import type { ColumnId } from './types'

const TITLE: Record<ColumnId, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
}

export default function App() {
  const { tasks, byColumn, dispatch } = useBoard()
  const { message, announce } = useAnnounce()
  const [pulsedColumn, setPulsedColumn] = useState<ColumnId | null>(null)

  const counts = {
    todo: byColumn.todo.length,
    'in-progress': byColumn['in-progress'].length,
    done: byColumn.done.length,
  }

  function handleMove(taskId: string, toColumn: ColumnId) {
    const task = tasks.find((t) => t.id === taskId)
    withViewTransition(() => {
      dispatch({ type: 'move', taskId, toColumn })
    })
    setPulsedColumn(toColumn)
    window.setTimeout(() => setPulsedColumn(null), 650)
    if (task) announce(`“${task.title}” moved to ${TITLE[toColumn]}.`)
  }

  return (
    <>
      <BoardShell
        topBar={<TopBar />}
        meridian={
          <Meridian columns={COLUMNS} counts={counts} pulsedColumn={pulsedColumn} />
        }
        columns={COLUMNS.map((column) => {
          const columnTasks = byColumn[column.id]
          return (
            <Column
              key={column.id}
              column={column}
              isEmpty={columnTasks.length === 0}
            >
              <TaskList tasks={columnTasks} onMove={handleMove} />
            </Column>
          )
        })}
      />
      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </>
  )
}
