'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, X, TrendingUp, Clock, Film, ChevronLeft, Trash2, Loader2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch, type SearchHit } from '@/components/search-provider'
import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'

type Tab = 'all' | 'movies' | 'series' | 'actors'

export function SearchModal() {
  const {
    open, query, hits, loading, recents, trending, popularMovies, popularActors,
    closeSearch, setQuery, clearRecents, addRecent, submit,
  } = useSearch()

  const inputRef = useRef<HTMLInputElement>(null)
  const [active, setActive] = useState(0)
  const [tab, setTab] = useState<Tab>('all')

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      setActive(0)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  const term = query.trim()
  const filteredHits = useMemo(() => {
    if (tab === 'all') return hits
    if (tab === 'actors') return hits.filter((h) => h.kind === 'actor')
    if (tab === 'movies') return hits.filter((h) => h.kind === 'movie' && h.movie.type === 'Film')
    if (tab === 'series') return hits.filter((h) => h.kind === 'movie' && h.movie.type === 'Series')
    return hits
  }, [hits, tab])

  const hasResults = filteredHits.length > 0
  const showEmpty = term.length > 0 && !loading && !hasResults

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, Math.max(filteredHits.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (filteredHits[active]) {
        const hit = filteredHits[active]
        if (hit.kind === 'movie') {
          const href = hit.movie.type === 'Series' ? `/series/${hit.movie.id}` : `/movie/${hit.movie.id}`
          window.location.href = href
        }
      } else if (query.trim()) {
        submit()
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-3 pt-[6vh] sm:px-4 sm:pt-[10vh]">
          <motion.div
            className="absolute inset-0 bg-black/80"
            onClick={closeSearch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />

          <motion.div
            className="glass-strong relative w-full max-w-2xl overflow-hidden rounded-[22px] shadow-[var(--elevation-3)]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.28, 0.11, 0.32, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-[var(--separator)] px-4">
              <Search className="size-5 shrink-0 text-white/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="جستجوی فیلم، سریال یا بازیگر..."
                className="h-13 w-full bg-transparent py-3.5 text-base text-white outline-none placeholder:text-white/35"
                aria-label="جستجو"
              />
              {loading ? (
                <Loader2 className="size-5 shrink-0 animate-spin text-white/40" />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="grid size-7 place-items-center text-white/40 hover:text-white"
                  aria-label="پاک کردن"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>

            {term && (
              <div className="flex gap-1 border-b border-white/[0.06] px-4 py-2">
                {([
                  ['all', 'همه'],
                  ['movies', 'فیلم'],
                  ['series', 'سریال'],
                  ['actors', 'بازیگر'],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={cn(
                      'rounded px-3 py-1 text-xs font-medium transition-colors',
                      tab === key ? 'bg-white text-black' : 'text-white/50 hover:text-white',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {loading && (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <div className="skeleton size-12 shrink-0 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-3 w-2/5 rounded" />
                        <div className="skeleton h-2.5 w-3/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showEmpty && (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <p className="text-base font-medium text-white">نتیجه‌ای یافت نشد</p>
                  <p className="mt-1 max-w-xs text-sm text-white/45">
                    برای «{term}» چیزی پیدا نکردیم.
                  </p>
                </div>
              )}

              {!loading && hasResults && (
                <div className="space-y-0.5">
                  {filteredHits.map((hit, i) => (
                    <SearchResultRow
                      key={`${hit.kind}-${hit.kind === 'movie' ? hit.movie.id : hit.actor.id}`}
                      hit={hit}
                      active={active === i}
                      onHover={() => setActive(i)}
                      onSelect={() => addRecent(term)}
                    />
                  ))}
                </div>
              )}

              {!term && !loading && (
                <div className="space-y-7">
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <TrendingUp className="size-4 text-white/40" />
                      <h3 className="text-sm font-medium text-white">جستجوهای داغ</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setQuery(t)
                            addRecent(t)
                          }}
                          className="rounded bg-white/8 px-3 py-1.5 text-sm text-white/65 transition-colors hover:bg-white/12 hover:text-white"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </section>

                  {recents.length > 0 && (
                    <section>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-white/40" />
                          <h3 className="text-sm font-medium text-white">جستجوهای اخیر</h3>
                        </div>
                        <button
                          type="button"
                          onClick={clearRecents}
                          className="flex items-center gap-1 text-xs text-white/40 hover:text-white"
                        >
                          <Trash2 className="size-3.5" />
                          پاک کردن
                        </button>
                      </div>
                      <div className="space-y-0.5">
                        {recents.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => submit(r)}
                            className="group flex w-full items-center gap-3 rounded px-2 py-2 text-right transition-colors hover:bg-white/[0.04]"
                          >
                            <Clock className="size-4 text-white/35" />
                            <span className="flex-1 text-sm text-white/75 group-hover:text-white">{r}</span>
                            <ChevronLeft className="size-4 text-white/30 opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Film className="size-4 text-white/40" />
                        <h3 className="text-sm font-medium text-white">محبوب</h3>
                      </div>
                      <div className="space-y-0.5">
                        {popularMovies.map((m) => (
                          <Link
                            key={m.id}
                            href={m.type === 'Series' ? `/series/${m.id}` : `/movie/${m.id}`}
                            onClick={closeSearch}
                            className="group flex items-center gap-3 rounded p-1.5 transition-colors hover:bg-white/[0.04]"
                          >
                            <img src={m.poster} alt="" className="size-10 shrink-0 rounded object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-white/90">{m.title}</p>
                              <p className="text-xs text-white/40">{fa(m.year)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-sm font-medium text-white">بازیگران</h3>
                      <div className="space-y-0.5">
                        {popularActors.map((a) => (
                          <div key={a.id} className="flex items-center gap-3 rounded p-1.5">
                            <img src={a.photo} alt="" className="size-10 shrink-0 rounded-full object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-white/90">{a.name}</p>
                              <p className="text-xs text-white/40">{a.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function SearchResultRow({
  hit, active, onHover, onSelect,
}: {
  hit: SearchHit
  active: boolean
  onHover: () => void
  onSelect: () => void
}) {
  if (hit.kind === 'movie') {
    const m = hit.movie
    const href = m.type === 'Series' ? `/series/${m.id}` : `/movie/${m.id}`
    return (
      <Link
        href={href}
        onClick={onSelect}
        onMouseEnter={onHover}
        className={cn(
          'group flex items-center gap-3 rounded p-2 transition-colors',
          active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]',
        )}
      >
        <img src={m.poster} alt="" className="size-12 shrink-0 rounded object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{m.title}</p>
          <p className="truncate text-xs text-white/45">
            {m.type === 'Series' ? 'سریال' : 'فیلم'}
            {m.year ? ` • ${fa(m.year)}` : ''}
            {m.genres[0] ? ` • ${m.genres[0]}` : ''}
          </p>
        </div>
      </Link>
    )
  }

  const a = hit.actor
  return (
    <div
      onMouseEnter={onHover}
      className={cn(
        'flex items-center gap-3 rounded p-2 transition-colors',
        active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]',
      )}
    >
      <img src={a.photo} alt="" className="size-12 shrink-0 rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{a.name}</p>
        <p className="truncate text-xs text-white/45">بازیگر{a.films ? ` • ${fa(a.films)} اثر` : ''}</p>
      </div>
    </div>
  )
}
