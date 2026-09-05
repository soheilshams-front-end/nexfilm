'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Sparkles } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { CatalogGrid } from '@/components/catalog-grid'
import { Button } from '@/components/untitled/button'
import { fa } from '@/lib/format-fa'
import { resolveTitle, type Movie } from '@/lib/movies'
import { getLikedIds } from '@/lib/user-store'

export default function FavoritesPage() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    setMovies(
      getLikedIds()
        .map((id) => resolveTitle(id))
        .filter((m): m is Movie => Boolean(m)),
    )
  }, [])

  return (
    <main className="min-h-screen">
      <SiteNav />
      <DashboardShell>
        <PageHeader
          title="علاقه‌مندی‌ها"
          subtitle={
            movies.length ? `${fa(movies.length)} عنوان که پسندیده‌اید` : 'هنوز پسندی ثبت نشده'
          }
          action={
            <Button asChild size="sm">
              <Link href="/browse">
                <Sparkles className="size-4" />
                کشف بیشتر
              </Link>
            </Button>
          }
        />

        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <Heart className="size-4 fill-current" />
          آثار مورد علاقه شما، همیشه در دسترس هستند
        </div>

        <CatalogGrid
          items={movies}
          emptyLabel="علاقه‌مندی‌ها خالی است"
          emptyHref="/browse"
          emptyCta="برو به دسته‌بندی"
        />
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
