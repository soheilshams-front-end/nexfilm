'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown, ListFilter, Search } from 'lucide-react'
import { useSearch } from '@/components/search-provider'
import { AnimatedFilterDropdown } from '@/components/animated-filter-dropdown'
import { cn } from '@/lib/utils'

export type HomeFilterKind = 'all' | 'film' | 'series'
export type HomeFilterSort = 'newest' | 'oldest' | 'rating'

export type HomeFilterState = {
  kind: HomeFilterKind
  genre: string | null
  sort: HomeFilterSort
  scope: 'all' | 'trending' | 'featured'
}

type OpenMenu = 'more' | 'scope' | 'sort' | 'genre' | 'kind' | null

const SCOPE_OPTIONS = [
  { value: 'all', label: 'همه' },
  { value: 'trending', label: 'پربازدید' },
  { value: 'featured', label: 'ویژه' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
  { value: 'rating', label: 'بالاترین امتیاز' },
]

const KIND_OPTIONS = [
  { value: 'all', label: 'فیلم/سریال' },
  { value: 'film', label: 'فیلم' },
  { value: 'series', label: 'سریال' },
]

export function HomeFilterBar({
  genres,
  value,
  onChange,
}: {
  genres: string[]
  value: HomeFilterState
  onChange: (next: HomeFilterState) => void
}) {
  const { openSearch } = useSearch()
  const reduceMotion = useReducedMotion()
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (openMenu !== 'more') return
    const onDoc = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [openMenu])

  const genreOptions = [
    { value: '', label: 'انتخاب ژانر' },
    ...genres.map((g) => ({ value: g, label: g })),
  ]

  const setOnly = (menu: OpenMenu) => setOpenMenu((cur) => (cur === menu ? null : menu))

  return (
    <section className="reveal relative z-20 bg-transparent py-5 md:py-8">
      <div className="page-max page-pad">
        <div
          dir="ltr"
          className={cn(
            'no-scrollbar mx-auto flex w-full max-w-[1100px] items-center gap-2',
            'overflow-x-auto overscroll-x-contain pb-0.5',
            'md:flex-wrap md:justify-center md:gap-3 md:overflow-visible md:pb-0 md:flex-nowrap',
          )}
        >
          <button
            type="button"
            onClick={() => openSearch()}
            className={cn(
              'inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 md:h-11 md:gap-2 md:px-5',
              'bg-[var(--brand)] text-[13px] font-bold text-[#0b120e] md:text-sm',
              'shadow-[0_8px_22px_rgba(29,214,111,0.28)]',
              'transition-colors hover:bg-[var(--brand-600)] hover:text-white',
            )}
          >
            <Search className="size-4" strokeWidth={2.25} />
            جستجو
          </button>

          <div className="relative shrink-0" ref={moreRef}>
            <button
              type="button"
              aria-expanded={openMenu === 'more'}
              onClick={() => setOnly('more')}
              className={cn(
                'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 md:h-11 md:gap-2 md:px-3.5',
                'bg-transparent text-[13px] font-medium text-white md:text-sm',
                'ring-1 ring-inset ring-white/25',
                'transition-colors hover:bg-white/[0.04]',
                openMenu === 'more' && 'bg-white/[0.06] ring-white/40',
              )}
            >
              <ListFilter className="size-4 text-white/80" strokeWidth={2} />
              <span className="md:hidden">فیلتر</span>
              <span className="hidden md:inline">فیلتر های بیشتر</span>
              <motion.span
                animate={{ rotate: openMenu === 'more' ? 180 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="grid size-4 place-items-center"
              >
                <ChevronDown className="size-4 text-white/55" />
              </motion.span>
            </button>

            <AnimatePresence>
              {openMenu === 'more' ? (
                <motion.div
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute start-0 top-[calc(100%+8px)] z-40 w-56 origin-top overflow-hidden rounded-xl bg-[#1c222c] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.65)] ring-1 ring-white/14"
                >
                  <p className="px-2.5 py-1.5 text-[11px] font-semibold text-white/40">مرتب‌سازی سریع</p>
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => {
                        onChange({ ...value, sort: o.value as HomeFilterSort })
                        setOpenMenu(null)
                      }}
                      className={cn(
                        'flex w-full rounded-lg px-2.5 py-2.5 text-start text-sm transition-colors',
                        value.sort === o.value
                          ? 'bg-[rgba(29,214,111,0.15)] text-[var(--brand)]'
                          : 'text-white/75 hover:bg-white/[0.06] hover:text-white',
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                  <div className="my-1 h-px bg-white/10" />
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ kind: 'all', genre: null, sort: 'newest', scope: 'all' })
                      setOpenMenu(null)
                    }}
                    className="flex w-full rounded-lg px-2.5 py-2.5 text-start text-sm text-white/60 hover:bg-white/[0.06] hover:text-white"
                  >
                    پاک کردن فیلترها
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <AnimatedFilterDropdown
            label="محدوده"
            value={value.scope}
            options={SCOPE_OPTIONS}
            open={openMenu === 'scope'}
            onOpenChange={(o) => setOpenMenu(o ? 'scope' : null)}
            onChange={(v) => onChange({ ...value, scope: v as HomeFilterState['scope'] })}
            className="w-[min(100%,9.5rem)] shrink-0 basis-[9.5rem] sm:basis-auto sm:w-[9.5rem]"
          />
          <AnimatedFilterDropdown
            label="مرتب‌سازی"
            value={value.sort}
            options={SORT_OPTIONS}
            open={openMenu === 'sort'}
            onOpenChange={(o) => setOpenMenu(o ? 'sort' : null)}
            onChange={(v) => onChange({ ...value, sort: v as HomeFilterSort })}
            className="w-[min(100%,9.5rem)] shrink-0 basis-[9.5rem] sm:basis-auto sm:w-[10rem]"
          />
          <AnimatedFilterDropdown
            label="ژانر"
            value={value.genre ?? ''}
            options={genreOptions}
            open={openMenu === 'genre'}
            onOpenChange={(o) => setOpenMenu(o ? 'genre' : null)}
            onChange={(v) => onChange({ ...value, genre: v || null })}
            className="w-[min(100%,10.5rem)] shrink-0 basis-[10.5rem] sm:basis-auto sm:w-[11rem]"
            menuClassName="min-w-[12rem]"
          />
          <AnimatedFilterDropdown
            label="نوع"
            value={value.kind}
            options={KIND_OPTIONS}
            open={openMenu === 'kind'}
            onOpenChange={(o) => setOpenMenu(o ? 'kind' : null)}
            onChange={(v) => onChange({ ...value, kind: v as HomeFilterKind })}
            className="w-[min(100%,9.5rem)] shrink-0 basis-[9.5rem] sm:basis-auto sm:w-[9.75rem]"
          />
        </div>
      </div>
    </section>
  )
}
