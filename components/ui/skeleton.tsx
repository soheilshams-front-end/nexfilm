import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('skeleton rounded-lg bg-surface', className)}
      aria-hidden
    />
  )
}
