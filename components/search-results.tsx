'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { CatalogGrid } from '@/components/catalog-grid'
import { SearchQueryForm } from '@/components/search-query-form'
import { EmptyState } from '@/components/empty-state'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'
import { getCatalogGenres } from '@/lib/movies'
import { cn } from '@/lib/utils'

type SortKey = 'relevance' | 'rating' | 'newest' | 'title'
type KindFilter = 'all' | 'Film' | 'Series'

export function SearchResults({
  term,
  results,
  suggestions = [],
}: {
  term: string
  results: Movie[]
  suggestions?: Movie[]
}) {
  const genres = useMemo(() => getCatalogGenres(), [])
  const [kind, setKind] = useState<KindFilter>('all')
  const [genre, setGenre] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('relevance')
  const [showFilters, setShowFilters] = useState(Boolean(term))

  const filtered = useMemo(() => {
    let list = [...results]
    if (kind !== 'all') list = list.filter((m) => m.type === kind)
    if (genre) list = list.filter((m) => m.genres.includes(genre))
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest') list.sort((a, b) => b.year - a.year)
    else if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title, 'fa'))
    return list
  }, [results, kind, genre, sort])

  return (
    <main className="min-h-screen bg-black">
      <SiteNav />
      <PageHero
        title={term ? `نتایج «${term}»` : 'جستجو'}
        subtitle={term ? `${fa(filtered.length)} نتیجه` : 'فیلم، سریال یا ژانر را جستجو کنید'}
      />

      <div className="page-max page-pad mt-4 flex min-w-0 flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <SearchQueryForm initialQuery={term} />
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--border-secondary)]',
              showFilters ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--fg-primary)]',
            )}
          >
            <SlidersHorizontal className="size-4" />
            فیلتر
          </button>
          <label className="inline-flex min-w-0 items-center gap-2 rounded-lg bg-[var(--bg-secondary)] px-3.5 py-2.5 text-sm font-semibold text-[var(--fg-primary)] shadow-[inset_0_0_0_1px_var(--border-secondary)]">
            <ArrowUpDown className="size-4 shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="max-w-[9rem] bg-transparent outline-none sm:max-w-none"
              aria-label="مرتب‌سازی"
            >
              <option value="relevance">مرتبط‌ترین</option>
              <option value="rating">امتیاز</option>
              <option value="newest">جدیدترین</option>
              <option value="title">نام</option>
            </select>
          </label>
        </div>
      </div>

      {showFilters ? (
        <div className="page-max page-pad mt-4 flex flex-wrap gap-2">
          {(['all', 'Film', 'Series'] as KindFilter[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                'rounded-full px-3 py-1.5 text-[13px] font-semibold',
                kind === k ? 'bg-primary text-white' : 'bg-white/10 text-white/70',
              )}
            >
              {k === 'all' ? 'همه' : k === 'Film' ? 'فیلم' : 'سریال'}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setGenre(null)}
            className={cn(
              'rounded-full px-3 py-1.5 text-[13px] font-semibold',
              !genre ? 'bg-primary text-white' : 'bg-white/10 text-white/70',
            )}
          >
            همه ژانرها
          </button>
          {genres.slice(0, 12).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              className={cn(
                'rounded-full px-3 py-1.5 text-[13px] font-semibold',
                genre === g ? 'bg-primary text-white' : 'bg-white/10 text-white/70',
              )}
            >
              {g}
            </button>
          ))}
        </div>
      ) : null}

      <div className="page-max page-pad mt-8 pb-12">
        {filtered.length > 0 ? (
          <CatalogGrid items={filtered} />
        ) : term ? (
          <EmptyState
            icon={Search}
            title="نتیجه‌ای یافت نشد"
            description={`برای «${term}» چیزی پیدا نکردیم. عبارت دیگری را امتحان کنید.`}
            actionHref="/"
            actionLabel="بازگشت به خانه"
          />
        ) : (
          <div>
            <EmptyState
              icon={Search}
              title="چه می‌خواهید ببینید؟"
              description="نام فیلم، سریال یا ژانر را بنویسید. از میانبر ⌘K هم می‌توانید جستجو کنید."
              actionHref="/browse"
              actionLabel="مرور دسته‌ها"
              className="py-12"
            />
            {suggestions.length ? (
              <div className="mt-2">
                <p className="mb-3 text-sm font-semibold text-white/70">پیشنهادهای امروز</p>
                <CatalogGrid items={suggestions} />
              </div>
            ) : null}
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  )
}
