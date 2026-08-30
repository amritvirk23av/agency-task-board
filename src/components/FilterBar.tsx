import { X } from 'lucide-react'
import { TEAM } from '../data/team'
import { isFilterActive } from '../lib/board'
import type { Filter, Priority } from '../types'

interface FilterBarProps {
  filter: Filter
  onChange: (filter: Filter) => void
}

const PRIORITY_OPTIONS: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'All priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const selectClass =
  'rounded-md border border-rule bg-transparent py-1 pl-2 pr-6 text-[12px] text-ink-soft transition-colors hover:border-rule-strong focus-visible:border-accent'

export function FilterBar({ filter, onChange }: FilterBarProps) {
  const active = isFilterActive(filter)

  return (
    <div className="flex items-center gap-1.5">
      <label className="sr-only" htmlFor="filter-priority">
        Filter by priority
      </label>
      <select
        id="filter-priority"
        value={filter.priority}
        onChange={(event) =>
          onChange({ ...filter, priority: event.target.value as Priority | 'all' })
        }
        className={selectClass}
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="filter-assignee">
        Filter by assignee
      </label>
      <select
        id="filter-assignee"
        value={filter.assigneeId}
        onChange={(event) =>
          onChange({ ...filter, assigneeId: event.target.value })
        }
        className={selectClass}
      >
        <option value="all">All people</option>
        {TEAM.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>

      {active ? (
        <button
          type="button"
          onClick={() => onChange({ priority: 'all', assigneeId: 'all' })}
          className="label-mono flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-ink-faint transition-colors hover:text-ink-soft"
        >
          <X size={12} strokeWidth={2.5} aria-hidden="true" />
          Clear
        </button>
      ) : null}
    </div>
  )
}
