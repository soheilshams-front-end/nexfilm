import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'

/** Compact statistic card with icon, value, and label. */
export function StatCard({
  icon: Icon,
  value,
  label,
  accent,
  suffix,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: number | string
  label: string
  accent?: string
  suffix?: string
}) {
  return (
    <div className="reveal-scale group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
        style={{ background: accent ?? 'var(--primary)' }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-display text-2xl font-extrabold sm:text-3xl">
            {typeof value === 'number' ? fa(value) : value}
            {suffix && <span className="ms-1 text-base font-bold text-muted-foreground">{suffix}</span>}
          </p>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
        </div>
        <span
          className={cn(
            'grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110',
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  )
}
