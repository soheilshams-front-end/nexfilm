import { Smartphone, Tv, Laptop, Tablet, Monitor, LogOut, Plus, MapPin, Clock } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { StatCard } from '@/components/dashboard/stat-card'
import { devices } from '@/lib/user-data'
import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'

const deviceIcon = {
  mobile: Smartphone, tablet: Tablet, tv: Tv, laptop: Laptop, desktop: Monitor,
}

export default function DevicesPage() {
  return (
    <main className="min-h-screen">      <SiteNav />
      <DashboardShell>
        <PageHeader
          title="دستگاه‌ها"
          subtitle="مدیریت دستگاه‌های متصل به حساب شما"
          action={
            <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:border-destructive/40 hover:text-destructive">
              <LogOut className="size-4" />
              خروج از همه
            </button>
          }
        />

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <StatCard icon={Smartphone} value={devices.length} label="دستگاه متصل" />
          <StatCard icon={Monitor} value="۲ از ۴" label="اتصال هم‌زمان مجاز" />
          <StatCard icon={Tv} value="۱" label="دستگاه TV" />
        </div>

        {/* Device list */}
        <div className="space-y-3">
          {devices.map((d) => {
            const Icon = deviceIcon[d.type]
            return (
              <div
                key={d.id}
                className={cn(
                  'reveal group flex items-center gap-4 rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300',
                  d.current ? 'border-primary/40 bg-primary/5' : 'border-border/60 bg-card/50 hover:border-primary/30',
                )}
              >
                <span className={cn(
                  'grid size-12 shrink-0 place-items-center rounded-2xl transition-transform group-hover:scale-105',
                  d.current ? 'bg-primary/15 text-primary ring-1 ring-primary/20' : 'bg-surface text-foreground/70',
                )}>
                  <Icon className="size-6" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{d.name}</p>
                    {d.current && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">این دستگاه</span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{d.location}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" />{d.lastActive}</span>
                  </div>
                </div>

                {!d.current && (
                  <button className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="خروج از این دستگاه">
                    <LogOut className="size-4" />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Add device */}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 py-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
          <Plus className="size-4" />
          افزودن دستگاه جدید
        </button>
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
