'use client'

import { useState } from 'react'
import { Switch, SwitchThumb } from '@/components/animate-ui/primitives/headless/switch'
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
    <Switch
      checked={on}
      onChange={(value) => {
        setOn(value)
        onChange?.(value)
      }}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-white/10 transition-colors',
        on ? 'bg-primary' : 'bg-[var(--bg-3)]',
      )}
    >
      <SwitchThumb
        className={cn(
          'pointer-events-none absolute size-5 rounded-full bg-white shadow-md',
          on ? 'start-1' : 'start-6',
        )}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </Switch>
  )
}
