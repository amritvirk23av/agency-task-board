import type { Task } from '../types'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <ul className="flex flex-col gap-2.5">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  )
}
