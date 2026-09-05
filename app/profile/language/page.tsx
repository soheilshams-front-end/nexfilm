'use client'

import { useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { Toggle } from '@/components/dashboard/toggle'
import { SectionCard } from '@/components/dashboard/ui-bits'
import { cn } from '@/lib/utils'

const languages = [
  { id: 'fa', label: 'فارسی', native: 'Persian', flag: '🇮🇷', dir: 'rtl' },
  { id: 'en', label: 'انگلیسی', native: 'English', flag: '🇬🇧', dir: 'ltr' },
  { id: 'ar', label: 'عربی', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { id: 'tr', label: 'ترکی', native: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { id: 'fr', label: 'فرانسوی', native: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { id: 'de', label: 'آلمانی', native: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
]

const subtitleLangs = ['فارسی', 'انگلیسی', 'عربی', 'اسپانیایی', 'فرانسوی', 'آلمانی', 'ژاپنی']

export default function LanguagePage() {
  const [lang, setLang] = useState('fa')
  const [subs, setSubs] = useState('فارسی')

  return (
    <main className="min-h-screen">      <SiteNav />
      <DashboardShell>
        <PageHeader title="زبان" subtitle="زبان رابط کاربری و زیرنویس" />

        {/* App language */}
        <SectionCard title="زبان برنامه">
          <p className="mb-4 text-sm text-muted-foreground">زبان نمایش منوها و متن‌ها</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={cn(
                  'reveal group flex items-center gap-3 rounded-2xl border p-4 text-right transition-all duration-300',
                  lang === l.id ? 'border-primary bg-primary/5' : 'border-border/60 bg-card/50 hover:border-primary/30',
                )}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-2xl">{l.flag}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{l.label}</p>
                  <p className="text-xs text-muted-foreground" dir={l.dir}>{l.native} • {l.dir === 'rtl' ? 'راست‌چین' : 'چپ‌چین'}</p>
                </div>
                {lang === l.id && (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Subtitle language */}
        <div className="mt-6">
          <SectionCard title="زبان پیش‌فرض زیرنویس">
            <p className="mb-4 text-sm text-muted-foreground">زیرنویسی که هنگام پخش به‌صورت خودکار انتخاب می‌شود</p>
            <div className="flex flex-wrap gap-2">
              {subtitleLangs.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubs(s)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300',
                    subs === s ? 'border-primary bg-primary text-primary-foreground shadow-[0_4px_20px_-6px_var(--primary)]' : 'border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Audio prefs */}
        <div className="mt-6 space-y-3">
          <div className="reveal flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Globe className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">دوباله فارسی پیش‌فرض</p>
              <p className="text-xs text-muted-foreground">استفاده از دوبله فارسی وقتی در دسترس است</p>
            </div>
            <Toggle defaultOn />
          </div>
          <div className="reveal flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Globe className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">نمایش محتوای بومی</p>
              <p className="text-xs text-muted-foreground">اولویت دادن به فیلم‌های ایرانی</p>
            </div>
            <Toggle defaultOn={false} />
          </div>
        </div>
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
