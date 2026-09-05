'use client'

import { Switch as AriaSwitch, type SwitchProps } from 'react-aria-components'
import { cn } from '@/lib/utils'

function Toggle({ className, children, ...props }: SwitchProps) {
  return (
    <AriaSwitch
      className={cn('group inline-flex items-center gap-3 text-sm text-[var(--fg-secondary)]', className)}
      {...props}
    >
      <span
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full transition-colors',
          'bg-[var(--bg-quaternary)] shadow-[inset_0_0_0_1px_var(--border-secondary)]',
          'group-data-[selected]:bg-[var(--brand)] group-data-[selected]:shadow-none',
          'group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[var(--brand)]',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-4 rounded-full bg-white shadow-xs transition-transform',
            'start-0.5 group-data-[selected]:translate-x-4',
            'rtl:group-data-[selected]:-translate-x-4',
          )}
        />
      </span>
      {children}
    </AriaSwitch>
  )
}

export { Toggle }
