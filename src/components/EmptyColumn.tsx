interface EmptyColumnProps {
  line: string
}

export function EmptyColumn({ line }: EmptyColumnProps) {
  return (
    <div className="flex h-full items-start pt-2">
      <p className="max-w-[22ch] text-[13px] leading-relaxed text-ink-faint">
        {line}
      </p>
    </div>
  )
}
