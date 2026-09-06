'use client'

import { useEffect, useState } from 'react'
import { Check, Globe } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { SectionCard } from '@/components/dashboard/ui-bits'
import { cn } from '@/lib/utils'
import { loadPlayerPrefs, savePlayerPrefs } from '@/lib/player-prefs'
import { playerSettings } from '@/lib/movies'
import { useToast } from '@/components/toast-provider'

const languages = [
  { id: 'fa', label: 'فارسی', native: 'Persian', available: true },
  { id: 'en', label: 'انگلیسی', native: 'English', available: false },
  { id: 'ar', label: 'عربی', native: 'العربية', available: false },
]

export default function LanguagePage() {
  const toast = useToast()
  const [subs, setSubs] = useState('فارسی')

  useEffect(() => {
    setSubs(loadPlayerPrefs().subtitle)
  }, [])

  return (
    <main className="min-h-screen">
      <SiteNav />
      <DashboardShell>
        <PageHeader title="زبان" subtitle="زبان رابط و زیرنویس پیش‌فرض" />

        <SectionCard title="زبان برنامه">
          <p className="mb-4 text-sm text-muted-foreground">فعلاً فقط فارسی فعال است</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {languages.map((l) => (
              <button
                key={l.id}
                type="button"
                disabled={!l.available}
                onClick={() => {
                  if (!l.available) toast('این زبان به‌زودی')
                }}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border p-4 text-right transition-all',
                  l.id === 'fa'
                    ? 'border-primary bg-primary/5'
                    : 'border-border/60 bg-card/40 opacity-60',
                )}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface">
                  <Globe className="size-5 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{l.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.native}
                    {!l.available ? ' · به‌زودی' : ''}
                  </p>
                </div>
                {l.id === 'fa' ? (
                  <span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" />
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="mt-6">
          <SectionCard title="زبان پیش‌فرض زیرنویس">
            <p className="mb-4 text-sm text-muted-foreground">در prefs پلیر ذخیره می‌شود</p>
            <div className="flex flex-wrap gap-2">
              {playerSettings.subtitles.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    const prefs = loadPlayerPrefs()
                    savePlayerPrefs({ ...prefs, subtitle: s })
                    setSubs(s)
                    toast('زیرنویس پیش‌فرض ذخیره شد')
                  }}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                    subs === s
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card/50 text-muted-foreground hover:border-primary/40',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
