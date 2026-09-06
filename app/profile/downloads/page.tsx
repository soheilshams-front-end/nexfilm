import { Download, Trash2, HardDrive, Wifi, CheckCircle2, Pause, Clock } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { DemoModeBanner } from '@/components/demo-mode-banner'
import { downloads } from '@/lib/user-data'
import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'

const statusMeta: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  completed: { label: 'تکمیل‌شده', color: 'text-primary', icon: CheckCircle2 },
  downloading: { label: 'در حال دانلود', color: 'text-blue-400', icon: Download },
  paused: { label: 'متوقف‌شده', color: 'text-yellow-400', icon: Pause },
  queued: { label: 'در صف', color: 'text-muted-foreground', icon: Clock },
}

export default function DownloadsPage() {
  const completed = downloads.filter((d) => d.status === 'completed')
  const active = downloads.filter((d) => d.status === 'downloading' || d.status === 'queued')
  const usedGB = completed.reduce((s, d) => s + parseFloat(d.size), 0)

  return (
    <main className="min-h-screen">
      <SiteNav />
      <DashboardShell>
        <PageHeader title="دانلودها" subtitle="فیلم‌های دانلودشده برای تماشای آفلاین" />
        <DemoModeBanner detail="لیست دانلود نمونه است؛ دانلود واقعی آفلاین هنوز فعال نیست." />

        <div className="glass mb-6 rounded-[20px] p-5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-semibold">
              <HardDrive className="size-4 text-primary" />
              فضای دستگاه
            </span>
            <span className="text-[var(--label-2)]">
              {fa(usedGB.toFixed(1))} از ۲۵ GB · {fa(completed.length)} فایل
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${Math.min(100, (usedGB / 25) * 100)}%` }}
            />
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--label-3)]">
            <Wifi className="size-3.5" />
            دانلود فقط روی Wi-Fi فعال است
          </p>
        </div>

        <div className="settings-group overflow-hidden rounded-[20px]">
          {downloads.map((d, i) => {
            const meta = statusMeta[d.status]
            const Icon = meta.icon
            return (
              <div
                key={d.movieId}
                className={cn(
                  'flex items-center gap-4 px-4 py-3',
                  i > 0 && 'border-t border-[var(--separator)]',
                )}
              >
                <div className="relative h-[72px] w-12 shrink-0 overflow-hidden rounded-[10px] bg-[var(--bg-3)]">
                  <img src={d.poster} alt={d.title} className="size-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{d.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--label-2)]">
                    <span className={cn('flex items-center gap-1 font-medium', meta.color)}>
                      <Icon className={cn('size-3', d.status === 'downloading' && 'animate-bounce')} />
                      {meta.label}
                    </span>
                    <span>{d.size}</span>
                    <span className="rounded border border-white/15 px-1">{d.quality}</span>
                    {d.status === 'completed' && <span>انقضا: {d.expires}</span>}
                  </div>

                  {d.status === 'downloading' && (
                    <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${d.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {(d.status === 'downloading' || d.status === 'paused') && (
                    <button
                      type="button"
                      className="grid size-9 place-items-center rounded-full text-[var(--label-2)] transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="توقف"
                    >
                      <Pause className="size-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-full text-[var(--label-2)] transition-colors hover:bg-white/10 hover:text-destructive"
                    aria-label="حذف"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
