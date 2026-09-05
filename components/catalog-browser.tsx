'use client'

import { useMemo, useState } from 'react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'
import { getCatalogGenres } from '@/lib/movies'
import { CatalogGrid } from '@/components/catalog-grid'
import {
  ArchiveFilterBar,
  matchesDecade,
  type ArchiveFilterState,
} from '@/components/archive-filter-bar'
import { cn } from '@/lib/utils'

export function CatalogBrowser({
  items,
  kindLock,
  searchPlaceholder = 'جستجو در این فهرست…',
  title = 'عناوین',
  subtitle,
  compactTop = false,
  initialGenre = null,
}: {
  items: Movie[]
  kindLock?: 'Film' | 'Series'
  searchPlaceholder?: string
  title?: string
  subtitle?: string
  compactTop?: boolean
  initialGenre?: string | null
}) {
  const genres = useMemo(() => {
    const fromItems = new Set<string>()
    for (const m of items) for (const g of m.genres) fromItems.add(g)
    return (fromItems.size ? [...fromItems] : getCatalogGenres()).sort((a, b) =>
      a.localeCompare(b, 'fa'),
    )
  }, [items])

  const [filter, setFilter] = useState<ArchiveFilterState>({
    query: '',
    genre: initialGenre,
    sort: 'newest',
    scope: 'all',
    decade: null,
  })

  const filtered = useMemo(() => {
    let list = [...items]
    if (kindLock === 'Film') list = list.filter((m) => m.type === 'Film')
    if (kindLock === 'Series') list = list.filter((m) => m.type === 'Series')

    // Kids profile: only safe maturity
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('nextfilm-user-state')
        if (raw) {
          const s = JSON.parse(raw)
          const profile = s.profiles?.find((p: { id: string }) => p.id === s.activeProfileId)
          if (profile?.isKids) {
            list = list.filter((m) => m.maturity === 'همه' || m.maturity === '+۷')
          }
        }
      } catch {
        /* ignore */
      }
    }

    if (filter.genre) list = list.filter((m) => m.genres.includes(filter.genre!))
    list = list.filter((m) => matchesDecade(m.year, filter.decade))

    const q = filter.query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.titleEn.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)),
      )
    }

    if (filter.scope === 'trending') {
      list.sort((a, b) => b.match - a.match || b.rating - a.rating)
    } else if (filter.scope === 'top') {
      list.sort((a, b) => b.rating - a.rating)
    } else if (filter.sort === 'newest') {
      list.sort((a, b) => b.year - a.year)
    } else if (filter.sort === 'oldest') {
      list.sort((a, b) => a.year - b.year)
    } else if (filter.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating)
    } else {
      list.sort((a, b) => a.title.localeCompare(b.title, 'fa'))
    }

    return list
  }, [items, kindLock, filter])

  const hasActive =
    Boolean(filter.query.trim() || filter.genre || filter.decade) || filter.scope !== 'all'

  return (
    <div className={cn(compactTop ? 'pt-6 md:pt-8' : 'pt-20 md:pt-32')}>
      <div className="page-max page-pad">
        <header className="mb-4 md:mb-8">
          <div className="flex flex-wrap items-end justify-between gap-2 md:gap-3">
            <div>
              <h1 className="text-[1.25rem] font-bold tracking-tight text-white md:text-[2.5rem] md:leading-none">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1.5 max-w-md text-[13px] leading-5 text-[var(--fg-tertiary)] md:mt-2 md:text-[15px] md:leading-6">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <p className="text-[13px] tabular-nums text-[var(--fg-quaternary)] md:text-sm">
              {hasActive ? `${fa(filtered.length)} نتیجه` : `${fa(items.length)} عنوان`}
            </p>
          </div>
        </header>
      </div>

      <ArchiveFilterBar
        genres={genres}
        value={filter}
        onChange={setFilter}
        searchPlaceholder={searchPlaceholder}
        sticky
      />

      <div className="page-max page-pad pb-16 pt-1.5 md:pb-24 md:pt-4">
        <CatalogGrid
          items={filtered}
          emptyLabel="با این فیلتر چیزی پیدا نشد"
          emptyHref={kindLock === 'Series' ? '/series' : '/movies'}
          emptyCta="بازگشت به آرشیو"
        />
      </div>
    </div>
  )
}
