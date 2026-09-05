'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark, Plus } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { CatalogGrid } from '@/components/catalog-grid'
import { Button } from '@/components/untitled/button'
import { fa } from '@/lib/format-fa'
import { resolveTitle, type Movie } from '@/lib/movies'
import { getMyListIds } from '@/lib/user-store'

export default function WatchlistPage() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    setMovies(
      getMyListIds()
        .map((id) => resolveTitle(id))
        .filter((m): m is Movie => Boolean(m)),
    )
  }, [])

  return (
    <main className="min-h-screen">
      <SiteNav />
      <DashboardShell>
        <PageHeader
          title="لیست تماشا"
          subtitle={movies.length ? `${fa(movies.length)} عنوان برای بعد` : 'لیست شما خالی است'}
          action={
            <Button asChild size="sm">
              <Link href="/browse">
                <Plus className="size-4" />
                افزودن
              </Link>
            </Button>
          }
        />

        <div className="mb-6 flex items-center gap-2 rounded-xl bg-[var(--brand)]/10 px-4 py-3 text-sm text-[var(--brand)]">
          <Bookmark className="size-4" />
          فیلم‌هایی که می‌خواهید بعداً تماشا کنید
        </div>

        <CatalogGrid
          items={movies}
          emptyLabel="لیست تماشا خالی است"
          emptyHref="/browse"
          emptyCta="برو به دسته‌بندی"
        />
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
