import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/untitled/button'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: {
  icon: LucideIcon
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-4 py-20 text-center anim-fade-up', className)}>
      <div className="grid size-[4.5rem] place-items-center rounded-full bg-white/[0.06] text-white/50 ring-1 ring-white/10">
        <Icon className="size-8" />
      </div>
      <p className="mt-5 text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 max-w-sm text-[14px] leading-6 text-white/50">{description}</p>
      {actionHref && actionLabel ? (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  )
}
