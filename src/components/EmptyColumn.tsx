interface EmptyColumnProps {
  line: string
  filtered?: boolean
}

export function EmptyColumn({ line, filtered }: EmptyColumnProps) {
  return (
    <div className="flex h-full items-start pt-2">
      <p className="max-w-[22ch] text-[13px] leading-relaxed text-ink-faint">
        {filtered ? 'Nothing here matches the filter.' : line}
      </p>
    </div>
  )
}
