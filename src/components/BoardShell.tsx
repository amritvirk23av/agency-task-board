import type { ReactNode } from 'react'

interface BoardShellProps {
  topBar: ReactNode
  meridian: ReactNode
  columns: ReactNode
}

/*
  Locks the whole tool to one screen: the shell is exactly viewport-tall and
  never scrolls. Only the card lists inside each column scroll. Content is
  held to a composed measure and centred — a worksheet on the paper — rather
  than stretched edge to edge. Below a usable minimum the board is allowed to
  scroll rather than crush its content.
*/
export function BoardShell({ topBar, meridian, columns }: BoardShellProps) {
  return (
    <div className="flex h-dvh min-h-[560px] flex-col overflow-hidden">
      <div className="shrink-0 border-b border-rule">
        <div className="mx-auto w-full max-w-[1280px]">{topBar}</div>
      </div>
      <main className="mx-auto flex w-full max-w-[1280px] min-h-0 flex-1 flex-col">
        {meridian}
        <div className="grid min-h-0 flex-1 grid-cols-3 divide-x divide-rule border-t border-rule">
          {columns}
        </div>
      </main>
    </div>
  )
}
