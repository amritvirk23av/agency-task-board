import { AGENCY } from '../data/seed'

/** The studio wordmark, led by a small meridian glyph — a marked line through a circle. */
export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="11" cy="11" r="7.4" stroke="var(--color-ink)" strokeWidth="1.4" />
        <path
          d="M11 2.6V19.4"
          stroke="var(--color-accent)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="11" cy="11" r="1.7" fill="var(--color-accent)" />
      </svg>
      <div className="flex items-baseline gap-2">
        <span className="text-[15px] font-semibold tracking-tight text-ink">
          {AGENCY.name}
        </span>
        <span className="label-mono text-[10px] text-ink-faint">
          {AGENCY.boardName}
        </span>
      </div>
    </div>
  )
}
