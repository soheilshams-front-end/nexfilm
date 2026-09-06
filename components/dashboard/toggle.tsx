'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Toggle({
  defaultOn = false,
  onChange,
}: {
  defaultOn?: boolean
  onChange?: (on: boolean) => void
}) {
  const [on, setOn] = useState(defaultOn)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => {
        const next = !on
        setOn(next)
        onChange?.(next)
      }}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-white/10 transition-colors',
        on ? 'bg-primary' : 'bg-[var(--bg-3)]',
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute size-5 rounded-full bg-white shadow-md transition-[inset-inline-start]',
          on ? 'start-1' : 'start-6',
        )}
      />
    </button>
  )
}
