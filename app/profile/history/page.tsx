'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, Play, Trash2 } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { Button } from '@/components/untitled/button'
import { fa } from '@/lib/format-fa'
import { resolveTitle, type Movie } from '@/lib/movies'
import {
  clearWatchHistory,
  getWatchHistory,
  type HistoryItem,
} from '@/lib/user-store'
import { useToast } from '@/components/toast-provider'

type Row = { item: HistoryItem; movie: Movie }

export default function HistoryPage() {
  const toast = useToast()
  const [rows, setRows] = useState<Row[]>([])

  const refresh = () => {
    const items = getWatchHistory()
    const next: Row[] = []
    for (const item of items) {
      const movie = resolveTitle(item.movieId)
      if (movie) next.push({ item, movie })
    }
    setRows(next)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <main className="min-h-screen">
      <SiteNav />
      <DashboardShell>
        <PageHeader
          title="تاریخچه تماشا"
          subtitle={
            rows.length ? `${fa(rows.length)} عنوان تماشا‌شده` : 'هنوز تاریخی ثبت نشده'
          }
          action={
            rows.length ? (
              <Button
                variant="secondary"
                onPress={() => {
                  clearWatchHistory()
                  refresh()
                  toast('تاریخچه پاک شد')
                }}
              >
                <Trash2 className="size-4" />
                پاک کردن تاریخچه
              </Button>
            ) : undefined
          }
        />

        {rows.length ? (
          <div className="space-y-3">
            {rows.map(({ item, movie }) => {
              const watchHref =
                movie.type === 'Series' && item.seasonId != null && item.episodeId != null
                  ? `/watch/${movie.id}?s=${item.seasonId}&e=${item.episodeId}`
                  : `/watch/${movie.id}`
              const detailHref =
                movie.type === 'Series' ? `/series/${movie.id}` : `/movie/${movie.id}`
              return (
                <div
                  key={`${item.movieId}-${item.seasonId ?? 0}-${item.episodeId ?? 0}-${item.watchedAt}`}
                  className="group flex items-center gap-4 rounded-2xl bg-[var(--bg-secondary)] p-3 ring-1 ring-white/10 transition-colors hover:ring-[var(--border-brand)]"
                >
                  <Link href={detailHref} className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={watchHref}
                      className="block truncate font-semibold text-white transition-colors hover:text-[var(--brand)]"
                    >
                      {movie.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--fg-quaternary)]">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {movie.duration || '—'}
                      </span>
                      <span>{movie.type === 'Series' ? 'سریال' : 'فیلم'}</span>
                      {item.seasonId != null && item.episodeId != null ? (
                        <span>
                          S{fa(item.seasonId)}E{fa(item.episodeId)}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[var(--brand)]"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[var(--fg-quaternary)]">{fa(item.progress)}٪</span>
                    </div>
                  </div>

                  <Link
                    href={watchHref}
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-white"
                    aria-label="ادامه تماشا"
                  >
                    <Play className="size-4 fill-current" />
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl bg-[var(--bg-secondary)] px-4 py-16 text-center ring-1 ring-white/10">
            <p className="text-sm text-[var(--fg-tertiary)]">تاریخچه خالی است. چیزی پخش کنید تا اینجا ثبت شود.</p>
            <Button asChild variant="secondary" className="mt-4">
              <Link href="/browse">برو به دسته‌بندی</Link>
            </Button>
          </div>
        )}
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
