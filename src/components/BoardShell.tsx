import type { ReactNode } from 'react'

interface BoardShellProps {
  topBar: ReactNode
  meridian: ReactNode
  columns: ReactNode
}

/*
  Desktop: the shell is exactly viewport-tall and never scrolls — only the
  card lists inside each column scroll. Phone: the columns stack and the page
  scrolls normally. Content is held to a composed measure and centred.
*/
export function BoardShell({ topBar, meridian, columns }: BoardShellProps) {
  return (
    <div className="flex min-h-dvh flex-col md:h-dvh md:min-h-0 md:overflow-hidden">
      <div className="shrink-0 border-b border-rule">
        <div className="mx-auto w-full max-w-[1280px]">{topBar}</div>
      </div>
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col md:min-h-0">
        {meridian}
        <div className="grid flex-1 grid-cols-1 divide-y divide-rule border-t border-rule md:min-h-0 md:grid-cols-3 md:divide-x md:divide-y-0">
          {columns}
        </div>
      </main>
    </div>
  )
}
