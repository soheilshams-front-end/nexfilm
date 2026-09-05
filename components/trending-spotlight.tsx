'use client'

import Link from 'next/link'
import { Play, Star, TrendingUp } from 'lucide-react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'

export function TrendingSpotlight({ items }: { items: Movie[] }) {
  if (items.length < 3) return null
  const [main, ...side] = items.slice(0, 3)

  return (
    <section className="reveal">
      <div className="mb-4 flex items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
          <TrendingUp className="size-4" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">داغ‌ترین‌های امروز</h2>
          <p className="text-xs text-muted-foreground">پرطرفدارترین آثار همین لحظه</p>
        </div>
      </div>

      <div className="grid gap-4 px-4 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
        <Link
          href={`/movie/${main.id}`}
          className="group relative h-72 overflow-hidden rounded-lg border border-white/[0.08] sm:h-96"
        >
          <img
            src={main.backdrop}
            alt={main.title}
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <span className="mb-2 inline-flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] font-bold text-white">
              <TrendingUp className="size-3" />
              رتبه ۱
            </span>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">{main.title}</h3>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="flex items-center gap-1 font-semibold text-primary">
                <Star className="size-3.5 fill-primary" />
                {fa(main.rating.toFixed(1))}
              </span>
              <span>{fa(main.year)}</span>
            </div>
            <span className="mt-4 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="size-4 fill-current" />
              تماشا
            </span>
          </div>
        </Link>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {side.map((m, i) => (
            <Link
              key={m.id}
              href={`/movie/${m.id}`}
              className="group relative h-44 overflow-hidden rounded-lg border border-white/[0.08] sm:h-auto"
            >
              <img
                src={m.backdrop}
                alt={m.title}
                className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <span className="text-xs font-bold text-primary">رتبه {fa(i + 2)}</span>
                <h3 className="mt-1 font-bold leading-tight text-white">{m.title}</h3>
                <span className="mt-1 flex items-center gap-1 text-xs text-white/70">
                  <Star className="size-3 fill-primary text-primary" />
                  {fa(m.rating.toFixed(1))}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
