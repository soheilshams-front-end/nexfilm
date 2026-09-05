'use client'

import { useState } from 'react'
import { Pencil, Clock, Heart, PlayCircle, Sparkles, Film, Star } from 'lucide-react'
import { MovieCard } from '@/components/movie-card'
import { fa } from '@/lib/format-fa'
import { getMovie, type Movie } from '@/lib/movies'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'continue', label: 'ادامه تماشا', icon: PlayCircle },
  { id: 'favorites', label: 'علاقه‌مندی‌ها', icon: Heart },
  { id: 'history', label: 'تاریخچه', icon: Clock },
  { id: 'recommended', label: 'ویژه شما', icon: Sparkles },
] as const

type TabId = (typeof tabs)[number]['id']

const sets: Record<TabId, string[]> = {
  continue: ['echoes-of-tomorrow', 'neon-requiem', 'afterlight', 'midnight-archive', 'silent-horizon'],
  favorites: ['crimson-vale', 'paper-lanterns', 'afterlight', 'echoes-of-tomorrow'],
  history: ['ironclad', 'silent-horizon', 'neon-requiem', 'crimson-vale', 'paper-lanterns', 'midnight-archive'],
  recommended: ['paper-lanterns', 'echoes-of-tomorrow', 'afterlight', 'ironclad', 'crimson-vale', 'neon-requiem'],
}

export function ProfileDashboard() {
  const [tab, setTab] = useState<TabId>('continue')
  const list = sets[tab].map((id) => getMovie(id)).filter((m): m is Movie => Boolean(m))

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-24 sm:px-6 lg:px-10">
      {/* Profile header with banner glow */}
      <section className="relative anim-fade-up">
        <div className="pointer-events-none absolute -top-10 right-0 size-[28rem] rounded-full bg-primary/8 blur-[100px]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <img
              src="/avatars/user.webp"
              alt="آواتار شما"
              className="size-24 rounded-2xl border-2 border-border/60 object-cover shadow-xl sm:size-28"
            />
            <span className="absolute -bottom-1 -left-1 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
              <Sparkles className="size-4" />
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                آرشا مهرآیین
              </h1>
              <button
                className="grid size-9 place-items-center rounded-full glass border border-border transition-all hover:border-primary/40 hover:bg-surface"
                aria-label="ویرایش پروفایل"
              >
                <Pencil className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-muted-foreground">عضو ویژه از ۱۴۰۲ • arasha@lumina.tv</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Stat icon={Film} value={fa(248)} label="عنوان تماشاشده" />
              <Stat icon={Clock} value={`${fa(412)} ساعت`} label="کل زمان تماشا" />
              <Stat icon={Star} value={fa(87)} label="امتیاز داده‌شده" />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto border-b border-border/60 pb-px">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'group relative flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                isActive ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className={cn('size-4 transition-transform', isActive && 'scale-110')} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="mt-5 grid grid-cols-3 gap-1.5 pb-4 sm:mt-8 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {list.map((m, i) => (
          <div key={m.id} className="reveal" style={{ transitionDelay: `${i * 50}ms` }}>
            <MovieCard movie={m} showProgress={tab === 'continue'} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Stat({
  icon: Icon, value, label,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-surface">
      <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="font-display text-lg font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
