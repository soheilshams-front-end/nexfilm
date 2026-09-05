import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = {
  gray: 'bg-[var(--bg-secondary)] text-[var(--fg-secondary)] ring-[var(--border-secondary)]',
  brand: 'bg-[var(--brand-soft)] text-[var(--brand)] ring-[var(--brand)]/30',
  success: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
  error: 'bg-red-500/10 text-red-400 ring-red-500/30',
  warning: 'bg-amber-500/10 text-amber-400 ring-amber-500/30',
} as const

type BadgeProps = {
  children: ReactNode
  color?: keyof typeof badgeVariants
  size?: 'sm' | 'md'
  className?: string
}

function Badge({ children, color = 'gray', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium ring-1 ring-inset',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        badgeVariants[color],
        className,
      )}
    >
      {children}
    </span>
  )
}

export { Badge, type BadgeProps }
