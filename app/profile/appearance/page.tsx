'use client'

import { useState } from 'react'
import { Palette, Moon, Sun, Type, Contrast, Eye } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { Toggle } from '@/components/dashboard/toggle'
import { SectionCard } from '@/components/dashboard/ui-bits'
import { cn } from '@/lib/utils'

const themes = [
  { id: 'dark', label: 'تاریک', bg: 'bg-gradient-to-br from-background to-card', ring: 'ring-primary' },
  { id: 'dim', label: 'تاریک مایل به خاکستری', bg: 'bg-gradient-to-br from-zinc-800 to-zinc-900', ring: 'ring-primary' },
  { id: 'midnight', label: 'نیمه‌شب', bg: 'bg-gradient-to-br from-blue-950 to-black', ring: 'ring-primary' },
]

const accents = [
  '#30d158',
  '#64d2ff',
  '#ffd60a',
  '#ff9f0a',
  '#ff453a',
  '#bf5af2',
]

export default function AppearancePage() {
  const [theme, setTheme] = useState('dark')
  const [accent, setAccent] = useState(accents[0])
  const [fontScale, setFontScale] = useState(100)

  return (
    <main className="min-h-screen">      <SiteNav />
      <DashboardShell>
        <PageHeader title="ظاهر" subtitle="رابط کاربری را به سلیقه خود تنظیم کنید" />

        {/* Theme picker */}
        <SectionCard title="تم رنگی">
          <p className="mb-4 text-sm text-muted-foreground">پس‌زمینه اصلی برنامه</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border-2 p-4 text-right transition-all duration-300',
                  theme === t.id ? 'border-primary' : 'border-border hover:border-primary/40',
                )}
              >
                <div className={cn('mb-3 h-20 rounded-lg', t.bg)} />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {t.id === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
                    {t.label}
                  </span>
                  {theme === t.id && (
                    <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                      <span className="text-[10px]">✓</span>
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Accent color */}
        <div className="mt-6">
          <SectionCard title="رنگ تأکیدی">
            <p className="mb-4 text-sm text-muted-foreground">رنگ اصلی دکمه‌ها و لینک‌ها</p>
            <div className="flex flex-wrap gap-3">
              {accents.map((c) => (
                <button
                  key={c}
                  onClick={() => setAccent(c)}
                  className={cn(
                    'grid size-12 place-items-center rounded-full transition-all duration-300 hover:scale-110',
                    accent === c && 'ring-2 ring-offset-2 ring-offset-background',
                  )}
                  style={{ background: c, boxShadow: accent === c ? `0 0 0 2px ${c}` : 'none' }}
                  aria-label={`رنگ ${c}`}
                >
                  {accent === c && <span className="text-xs font-bold text-white">✓</span>}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Font size */}
        <div className="mt-6">
          <SectionCard title="اندازه متن">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground"><Type className="size-4" />کوچک</span>
              <span className="font-bold">{fontScale}٪</span>
              <span className="flex items-center gap-2 text-muted-foreground"><Type className="size-6" />بزرگ</span>
            </div>
            <input
              type="range" min={85} max={130} value={fontScale}
              onChange={(e) => setFontScale(Number(e.target.value))}
              className="player-range h-2 w-full rounded-full bg-secondary"
              style={{ background: `linear-gradient(to left, var(--primary) ${((fontScale - 85) / 45) * 100}%, var(--secondary) ${((fontScale - 85) / 45) * 100}%)` }}
            />
          </SectionCard>
        </div>

        {/* Toggles */}
        <div className="mt-6 space-y-3">
          <ToggleRow icon={Contrast} title="کنتراست بالا" desc="افزایش وضوح متن و تصاویر" />
          <ToggleRow icon={Eye} title="کاهش پویایی‌ها" desc="غیرفعال کردن انیمیشن‌ها" defaultOn={false} />
          <ToggleRow icon={Moon} title="حالت شب خودکار" desc="تطبیق با نور محیط" defaultOn />
        </div>
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}

function ToggleRow({
  icon: Icon, title, desc, defaultOn,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  defaultOn?: boolean
}) {
  return (
    <div className="reveal flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Toggle defaultOn={defaultOn} />
    </div>
  )
}
