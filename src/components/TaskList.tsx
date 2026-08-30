import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { ColumnId, Task } from '../types'
import { TaskCard, type TaskPatch } from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  onMove: (taskId: string, toColumn: ColumnId) => void
  onEdit: (taskId: string, patch: TaskPatch) => void
  onDelete: (taskId: string) => void
}

export function TaskList({ tasks, onMove, onEdit, onDelete }: TaskListProps) {
  return (
    <SortableContext
      items={tasks.map((task) => task.id)}
      strategy={verticalListSortingStrategy}
    >
      <ul className="flex flex-col gap-2.5">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={onMove}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </SortableContext>
  )
}
