import { BoardShell } from './components/BoardShell'
import { Column } from './components/Column'
import { Meridian } from './components/Meridian'
import { TopBar } from './components/TopBar'
import { COLUMNS } from './data/seed'
import { SEED_TASKS } from './data/seed'
import type { ColumnId } from './types'

export default function App() {
  const tasks = SEED_TASKS

  const counts = COLUMNS.reduce(
    (acc, column) => {
      acc[column.id] = tasks.filter((task) => task.column === column.id).length
      return acc
    },
    {} as Record<ColumnId, number>,
  )

  return (
    <BoardShell
      topBar={<TopBar />}
      meridian={<Meridian columns={COLUMNS} counts={counts} />}
      columns={COLUMNS.map((column) => (
        <Column
          key={column.id}
          column={column}
          isEmpty={counts[column.id] === 0}
        />
      ))}
    />
  )
}
