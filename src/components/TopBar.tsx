import type { ReactNode } from 'react'
import { BrandMark } from './BrandMark'

interface TopBarProps {
  /** filter controls, add-task action — wired in later */
  actions?: ReactNode
}

export function TopBar({ actions }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-rule px-5">
      <BrandMark />
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  )
}
