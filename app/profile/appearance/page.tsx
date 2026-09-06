'use client'

import { useEffect, useState } from 'react'
import { Moon, Type } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { SectionCard } from '@/components/dashboard/ui-bits'
import { cn } from '@/lib/utils'
import {
  applyAppearance,
  defaultAppearance,
  loadAppearance,
  saveAppearance,
  type AppearancePrefs,
} from '@/lib/appearance-prefs'
import { useToast } from '@/components/toast-provider'

const themes: { id: AppearancePrefs['theme']; label: string; bg: string }[] = [
  { id: 'dark', label: 'تاریک', bg: 'bg-gradient-to-br from-background to-card' },
  { id: 'dim', label: 'تاریک مایل به خاکستری', bg: 'bg-gradient-to-br from-zinc-800 to-zinc-900' },
  { id: 'midnight', label: 'نیمه‌شب', bg: 'bg-gradient-to-br from-blue-950 to-black' },
]

const accents = ['#30d158', '#64d2ff', '#ffd60a', '#ff9f0a', '#ff453a', '#bf5af2']

export default function AppearancePage() {
  const toast = useToast()
  const [prefs, setPrefs] = useState<AppearancePrefs>(defaultAppearance)

  useEffect(() => {
    const loaded = loadAppearance()
    setPrefs(loaded)
    applyAppearance(loaded)
  }, [])

  const commit = (next: AppearancePrefs) => {
    setPrefs(next)
    saveAppearance(next)
    applyAppearance(next)
    toast('ظاهر ذخیره شد')
  }

  return (
    <main className="min-h-screen">
      <SiteNav />
      <DashboardShell>
        <PageHeader title="ظاهر" subtitle="تم و رنگ روی همین دستگاه ذخیره می‌شود" />

        <SectionCard title="تم رنگی">
          <p className="mb-4 text-sm text-muted-foreground">پس‌زمینه اصلی برنامه (حالت روشن پشتیبانی نمی‌شود)</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => commit({ ...prefs, theme: t.id })}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border-2 p-4 text-right transition-all duration-300',
                  prefs.theme === t.id ? 'border-primary' : 'border-border hover:border-primary/40',
                )}
              >
                <div className={cn('mb-3 h-20 rounded-lg', t.bg)} />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Moon className="size-4" />
                    {t.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="mt-6">
          <SectionCard title="رنگ تأکیدی">
            <p className="mb-4 text-sm text-muted-foreground">رنگ اصلی دکمه‌ها و لینک‌ها</p>
            <div className="flex flex-wrap gap-3">
              {accents.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => commit({ ...prefs, accent: c })}
                  className={cn(
                    'grid size-12 place-items-center rounded-full transition-all duration-300 hover:scale-110',
                    prefs.accent === c && 'ring-2 ring-offset-2 ring-offset-background',
                  )}
                  style={{ background: c, boxShadow: prefs.accent === c ? `0 0 0 2px ${c}` : 'none' }}
                  aria-label={`رنگ ${c}`}
                >
                  {prefs.accent === c && <span className="text-xs font-bold text-white">✓</span>}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="mt-6">
          <SectionCard title="اندازه متن">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Type className="size-4" />
                کوچک
              </span>
              <span className="font-bold">{prefs.fontScale}٪</span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <Type className="size-6" />
                بزرگ
              </span>
            </div>
            <input
              type="range"
              min={85}
              max={130}
              value={prefs.fontScale}
              onChange={(e) => commit({ ...prefs, fontScale: Number(e.target.value) })}
              className="player-range h-2 w-full rounded-full bg-secondary"
            />
          </SectionCard>
        </div>
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
