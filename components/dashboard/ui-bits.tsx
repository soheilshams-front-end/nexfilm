'use client'

import { cn } from '@/lib/utils'

/** Circular SVG progress ring. */
export function ProgressRing({
  value,
  size = 80,
  stroke = 6,
  children,
}: {
  value: number
  size?: number
  stroke?: number
  children?: React.ReactNode
}) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (value / 100) * circ

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center">{children}</div>}
    </div>
  )
}

/** Achievement badge card. */
export function AchievementBadge({
  icon, title, description, earned, progress, date,
}: {
  icon: string
  title: string
  description: string
  earned: boolean
  progress?: number
  date?: string
}) {
  return (
    <div
      className={cn(
        'reveal-scale group relative flex flex-col items-center overflow-hidden rounded-2xl border p-5 text-center transition-all duration-300',
        earned
          ? 'border-primary/40 bg-gradient-to-b from-primary/10 to-transparent badge-earned hover:border-primary/60'
          : 'border-border/60 bg-card/40 opacity-70 hover:opacity-100',
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'grid size-16 place-items-center rounded-full text-3xl transition-transform duration-300 group-hover:scale-110',
          earned ? 'bg-primary/15' : 'bg-surface grayscale',
        )}
      >
        {icon}
      </div>

      <h4 className="mt-3 text-sm font-bold">{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>

      {/* Status */}
      {earned ? (
        <span className="mt-3 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold text-primary">
          ✓ کسب شده {date && `• ${date}`}
        </span>
      ) : (
        <div className="mt-3 w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-l from-primary to-primary/60"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">{progress ?? 0}٪ تکمیل</p>
        </div>
      )}
    </div>
  )
}

/** Empty state placeholder. */
export function EmptyState({
  icon: Icon, title, description, action,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] bg-[var(--bg-2)] px-6 py-16 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-white/8 text-[var(--label-2)]">
        <Icon className="size-8" />
      </div>
      <p className="mt-4 text-title-3 text-white">{title}</p>
      <p className="mt-1 max-w-xs text-[15px] text-[var(--label-2)]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/** Section card wrapper with title — Apple Settings grouped look. */
export function SectionCard({
  title, action, children, className,
}: {
  title?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-2', className)}>
      {title ? (
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--label-3)]">
            {title}
          </h3>
          {action}
        </div>
      ) : null}
      <div className="settings-group p-1 sm:p-2">{children}</div>
    </section>
  )
}
