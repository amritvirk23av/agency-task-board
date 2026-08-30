import type { ReactNode } from 'react'
import { BrandMark } from './BrandMark'

interface TopBarProps {
  /** filter controls, add-task action — wired in later */
  actions?: ReactNode
}

export function TopBar({ actions }: TopBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-5 md:h-14 md:flex-nowrap md:py-0">
      <BrandMark />
      {actions ? (
        <div className="flex w-full flex-wrap items-center gap-1.5 md:w-auto md:flex-nowrap md:justify-end">
          {actions}
        </div>
      ) : null}
    </header>
  )
}
