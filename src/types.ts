export type ColumnId = 'todo' | 'in-progress' | 'done'

export type Priority = 'low' | 'medium' | 'high'

export interface TeamMember {
  id: string
  name: string
  initials: string
  /** background tint for the avatar, keyed to the person */
  tint: string
}

export interface Task {
  id: string
  title: string
  priority: Priority
  assigneeId: string
  column: ColumnId
}

export interface Column {
  id: ColumnId
  title: string
  /** direction copy for an empty column — an invitation, not a dead end */
  emptyLine: string
}

export interface Filter {
  priority: Priority | 'all'
  assigneeId: string | 'all'
}
