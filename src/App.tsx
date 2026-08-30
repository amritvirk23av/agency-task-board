import { BoardShell } from './components/BoardShell'
import { Column } from './components/Column'
import { Meridian } from './components/Meridian'
import { TaskList } from './components/TaskList'
import { TopBar } from './components/TopBar'
import { COLUMNS, SEED_TASKS } from './data/seed'
import type { ColumnId } from './types'

export default function App() {
  const tasks = SEED_TASKS

  const byColumn = (id: ColumnId) => tasks.filter((task) => task.column === id)

  const counts = COLUMNS.reduce(
    (acc, column) => {
      acc[column.id] = byColumn(column.id).length
      return acc
    },
    {} as Record<ColumnId, number>,
  )

  return (
    <BoardShell
      topBar={<TopBar />}
      meridian={<Meridian columns={COLUMNS} counts={counts} />}
      columns={COLUMNS.map((column) => {
        const columnTasks = byColumn(column.id)
        return (
          <Column
            key={column.id}
            column={column}
            isEmpty={columnTasks.length === 0}
          >
            <TaskList tasks={columnTasks} />
          </Column>
        )
      })}
    />
  )
}
