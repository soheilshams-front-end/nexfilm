'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlayCircle, Trash2, X } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { fa } from '@/lib/format-fa'
import { resolveTitle, type Movie } from '@/lib/movies'
import {
  clearContinueWatching,
  getContinueWatching,
  removeContinueWatching,
  type ContinueItem,
} from '@/lib/user-store'
import { movieToPosterTitle, PosterCard } from '@/components/saintstream/poster-card'
import { useToast } from '@/components/toast-provider'
import { Button } from '@/components/untitled/button'

type Row = { item: ContinueItem; movie: Movie }

export default function ContinueWatchingPage() {
  const toast = useToast()
  const [rows, setRows] = useState<Row[]>([])

  const refresh = () => {
    const items = getContinueWatching()
    const next: Row[] = []
    for (const item of items) {
      const movie = resolveTitle(item.movieId)
      if (movie) next.push({ item, movie: { ...movie, progress: item.progress } })
    }
    setRows(next)
  }

  useEffect(() => {
    refresh()
  }, [])

  const remaining = rows.reduce((s, r) => s + (100 - (r.item.progress ?? 0)), 0)

  return (
    <main className="min-h-screen">
      <SiteNav />
      <DashboardShell>
        <PageHeader
          title="ادامه تماشا"
          subtitle={
            rows.length
              ? `${fa(rows.length)} عنوان ناتمام • حدود ${fa(remaining)}٪ باقی‌مانده`
              : 'هنوز چیزی برای ادامه ندارید'
          }
          action={
            rows.length ? (
              <Button
                variant="secondary"
                onPress={() => {
                  clearContinueWatching()
                  refresh()
                  toast('لیست ادامه تماشا پاک شد')
                }}
              >
                <Trash2 className="size-4" />
                پاک کردن همه
              </Button>
            ) : undefined
          }
        />
        <div className="flex items-center gap-2 rounded-xl bg-[var(--brand)]/10 px-4 py-3 text-sm text-[var(--brand)]">
          <PlayCircle className="size-4" />
          از جایی که متوقف شدید، تماشا را ادامه دهید
        </div>

        {rows.length ? (
          <div className="mt-4 grid grid-cols-3 gap-x-1.5 gap-y-3 sm:mt-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 md:grid-cols-4 lg:grid-cols-5">
            {rows.map(({ item, movie }) => (
              <div key={item.movieId} className="relative">
                <PosterCard
                  title={movieToPosterTitle(movie)}
                  progress={item.progress}
                  href={`/watch/${item.movieId}`}
                  className="!w-full"
                  widthClass="w-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    removeContinueWatching(item.movieId)
                    refresh()
                    toast('از ادامه تماشا حذف شد')
                  }}
                  className="absolute left-2 top-2 z-[2] grid size-8 place-items-center rounded-full bg-black/70 text-white/80 ring-1 ring-white/15 hover:bg-black/85 hover:text-white"
                  aria-label={`حذف ${movie.title}`}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-lg font-medium text-white">لیست ادامه تماشا خالی است</p>
            <p className="mt-2 max-w-sm text-sm text-[var(--fg-tertiary)]">
              وقتی فیلمی را شروع کنید، اینجا نمایش داده می‌شود.
            </p>
            <Button asChild className="mt-6">
              <Link href="/browse">برو به دسته‌بندی</Link>
            </Button>
          </div>
        )}
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
