import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Untitled-style surface card — border + muted fill, no glass */
function Card({
  className,
  children,
  padding = true,
}: {
  className?: string
  children: ReactNode
  padding?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[var(--bg-secondary)] ring-1 ring-[var(--border-secondary)]',
        padding && 'p-5 md:p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

export { Card }
