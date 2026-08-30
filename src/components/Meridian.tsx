import type { Column, ColumnId } from '../types'

interface MeridianProps {
  columns: Column[]
  counts: Record<ColumnId, number>
  /** column that just received a card — its coordinate dot pulses once */
  pulsedColumn?: ColumnId | null
}

/*
  The signature element. A single hairline — the meridian — runs across the
  board, with a coordinate dot marking each column. Card moves pulse the
  destination dot. Column headers live here, not inside the columns, so the
  labels sit precisely on the line.
*/
export function Meridian({ columns, counts, pulsedColumn }: MeridianProps) {
  return (
    <div className="relative hidden shrink-0 px-5 pt-5 pb-3 md:block">
      <div
        aria-hidden="true"
        className="absolute left-5 right-5 top-[27px] h-px bg-rule-strong"
      />
      <div className="relative grid grid-cols-3">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col gap-2 pl-4">
            <span
              aria-hidden="true"
              data-pulse={pulsedColumn === column.id || undefined}
              className="size-[7px] rounded-full bg-ink data-[pulse]:animate-[dot-pulse_600ms_var(--ease-move)]"
            />
            <div className="flex items-baseline gap-2">
              <h2 className="label-mono text-ink">{column.title}</h2>
              <span className="font-mono text-[11px] text-ink-faint tabular-nums">
                · {String(counts[column.id]).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
