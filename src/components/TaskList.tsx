import type { ColumnId, Task } from '../types'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  onMove: (taskId: string, toColumn: ColumnId) => void
}

export function TaskList({ tasks, onMove }: TaskListProps) {
  return (
    <ul className="flex flex-col gap-2.5">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard task={task} onMove={onMove} />
        </li>
      ))}
    </ul>
  )
}
