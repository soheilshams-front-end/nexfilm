'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown, ListFilter, Search, X } from 'lucide-react'
import { AnimatedFilterDropdown } from '@/components/animated-filter-dropdown'
import { cn } from '@/lib/utils'

export type ArchiveSort = 'newest' | 'oldest' | 'rating' | 'title'
export type ArchiveScope = 'all' | 'trending' | 'top'

export type ArchiveFilterState = {
  query: string
  genre: string | null
  sort: ArchiveSort
  scope: ArchiveScope
  decade: string | null
}

type OpenMenu = 'more' | 'scope' | 'sort' | 'genre' | 'decade' | null

const SCOPE_OPTIONS = [
  { value: 'all', label: 'همه' },
  { value: 'trending', label: 'پربازدید' },
  { value: 'top', label: 'برترین‌ها' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
  { value: 'rating', label: 'بالاترین امتیاز' },
  { value: 'title', label: 'نام (الفبا)' },
]

const DECADE_OPTIONS = [
  { value: '', label: 'همه سال‌ها' },
  { value: '2020', label: '۲۰۲۰ به بعد' },
  { value: '2010', label: '۲۰۱۰–۲۰۱۹' },
  { value: '2000', label: '۲۰۰۰–۲۰۰۹' },
  { value: 'older', label: 'قبل از ۲۰۰۰' },
]

/**
 * Archive filter chrome — same language as HomeFilterBar (green search + dark dropdowns),
 * tuned for /movies & /series with expandable local search + decade.
 */
export function ArchiveFilterBar({
  genres,
  value,
  onChange,
  searchPlaceholder = 'جستجوی عنوان…',
  sticky = true,
}: {
  genres: string[]
  value: ArchiveFilterState
  onChange: (next: ArchiveFilterState) => void
  searchPlaceholder?: string
  sticky?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const [searchOpen, setSearchOpen] = useState(Boolean(value.query))
  const moreRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (openMenu !== 'more') return
    const onDoc = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [openMenu])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  const genreOptions = [
    { value: '', label: 'انتخاب ژانر' },
    ...genres.map((g) => ({ value: g, label: g })),
  ]

  const setOnly = (menu: OpenMenu) => setOpenMenu((cur) => (cur === menu ? null : menu))

  const reset = () => {
    onChange({
      query: '',
      genre: null,
      sort: 'newest',
      scope: 'all',
      decade: null,
    })
    setSearchOpen(false)
    setOpenMenu(null)
  }

  const activeCount =
    (value.genre ? 1 : 0) +
    (value.decade ? 1 : 0) +
    (value.scope !== 'all' ? 1 : 0) +
    (value.query.trim() ? 1 : 0)

  return (
    <section
      className={cn(
        'relative z-30',
        sticky &&
          'sticky top-[3.75rem] bg-[rgba(var(--bg-rgb),0.82)] py-2.5 backdrop-blur-xl md:top-[5rem] md:py-5',
        !sticky && 'py-3 md:py-8',
      )}
    >
      <div className="page-max page-pad">
        {/* Primary row — mirrors home filter under hero */}
        <div
          dir="ltr"
          className={cn(
            'no-scrollbar mx-auto flex w-full max-w-[1100px] items-center gap-2',
            'overflow-x-auto overscroll-x-contain pb-0.5',
            'md:flex-wrap md:justify-center md:gap-3 md:overflow-visible md:pb-0',
            'md:flex-nowrap',
          )}
        >
          <button
            type="button"
            onClick={() => {
              setSearchOpen((o) => {
                const next = !o
                if (!next) onChange({ ...value, query: '' })
                return next
              })
              setOpenMenu(null)
            }}
            className={cn(
              'inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 md:h-11 md:gap-2 md:px-5',
              'bg-[var(--brand)] text-[13px] font-bold text-[#0b120e] md:text-sm',
              'shadow-[0_8px_22px_rgba(29,214,111,0.28)]',
              'transition-colors hover:bg-[var(--brand-600)] hover:text-white',
              searchOpen && 'bg-[var(--brand-600)] text-white',
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
              {activeCount > 0 ? (
                <span className="grid size-5 place-items-center rounded-full bg-[var(--brand)] text-[11px] font-bold text-[#0b120e]">
                  {activeCount}
                </span>
              ) : (
                <motion.span
                  animate={{ rotate: openMenu === 'more' ? 180 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                  className="grid size-4 place-items-center"
                >
                  <ChevronDown className="size-4 text-white/55" />
                </motion.span>
              )}
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
                  <p className="px-2.5 py-1.5 text-[11px] font-semibold text-white/40">
                    مرتب‌سازی سریع
                  </p>
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => {
                        onChange({ ...value, sort: o.value as ArchiveSort })
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
                    onClick={reset}
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
            onChange={(v) => onChange({ ...value, scope: v as ArchiveScope })}
            className="w-[min(100%,9.5rem)] shrink-0 basis-[9.5rem] sm:basis-auto sm:w-[9.5rem]"
          />
          <AnimatedFilterDropdown
            label="مرتب‌سازی"
            value={value.sort}
            options={SORT_OPTIONS}
            open={openMenu === 'sort'}
            onOpenChange={(o) => setOpenMenu(o ? 'sort' : null)}
            onChange={(v) => onChange({ ...value, sort: v as ArchiveSort })}
            className="w-[min(100%,9.5rem)] shrink-0 basis-[9.5rem] sm:basis-auto sm:w-[10.5rem]"
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
            label="دوره"
            value={value.decade ?? ''}
            options={DECADE_OPTIONS}
            open={openMenu === 'decade'}
            onOpenChange={(o) => setOpenMenu(o ? 'decade' : null)}
            onChange={(v) => onChange({ ...value, decade: v || null })}
            className="w-[min(100%,9.75rem)] shrink-0 basis-[9.75rem] sm:basis-auto sm:w-[10.25rem]"
          />
        </div>

        {/* Expandable local search — archive-only flourish */}
        <AnimatePresence initial={false}>
          {searchOpen ? (
            <motion.div
              initial={reduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-3 w-full max-w-[1100px] overflow-hidden"
            >
              <div className="relative">
                <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                <input
                  ref={searchInputRef}
                  dir="rtl"
                  value={value.query}
                  onChange={(e) => onChange({ ...value, query: e.target.value })}
                  placeholder={searchPlaceholder}
                  aria-label="جستجو در آرشیو"
                  className={cn(
                    'h-12 w-full rounded-xl bg-[#1a1f27] pe-11 ps-11 text-[15px] text-white',
                    'outline-none ring-1 ring-inset ring-white/12',
                    'placeholder:text-white/35',
                    'focus:ring-2 focus:ring-[rgba(29,214,111,0.45)]',
                  )}
                />
                {value.query ? (
                  <button
                    type="button"
                    onClick={() => onChange({ ...value, query: '' })}
                    className="absolute end-2.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-white/45 hover:bg-white/5 hover:text-white"
                    aria-label="پاک کردن جستجو"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {sticky ? (
        <div
          className="pointer-events-none absolute inset-x-0 -bottom-5 h-5 bg-gradient-to-b from-[rgba(var(--bg-rgb),0.7)] to-transparent"
          aria-hidden
        />
      ) : null}
    </section>
  )
}

export function matchesDecade(year: number, decade: string | null): boolean {
  if (!decade) return true
  if (decade === '2020') return year >= 2020
  if (decade === '2010') return year >= 2010 && year <= 2019
  if (decade === '2000') return year >= 2000 && year <= 2009
  if (decade === 'older') return year < 2000
  return true
}
