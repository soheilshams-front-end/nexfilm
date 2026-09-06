'use client'

import Link from 'next/link'
import { Play, Plus, Star } from 'lucide-react'
import type { SaintstreamTitle } from '@/lib/saintstream-home'
import { fa, displayRating } from '@/lib/format-fa'
import { Button } from '@/components/untitled/button'

export function FeaturedBanner({
  featured,
  sidePosters = [],
}: {
  featured: SaintstreamTitle
  sidePosters?: SaintstreamTitle[]
}) {
  const detailHref = featured.type === 'Series' ? `/series/${featured.id}` : `/movie/${featured.id}`
  const media = featured.backdrop || featured.poster || '/placeholder.svg'
  const posters = (sidePosters.length ? sidePosters : [featured]).slice(0, 2)

  return (
    <section className="reveal page-max page-pad py-[var(--section-py)]">
      <div className="relative overflow-hidden rounded-[24px] bg-[var(--bg-secondary)] shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
        <div className="absolute inset-0">
          <img src={media} alt="" className="size-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--bg)]/95 via-[var(--bg)]/70 to-[var(--bg)]/25" />
          <div className="absolute -left-20 top-0 size-72 rounded-full bg-[var(--glow-brand)] blur-3xl" />
        </div>

        <div className="relative z-10 grid min-h-[280px] items-center gap-6 p-4 sm:min-h-[320px] sm:gap-8 sm:p-6 md:min-h-[400px] md:grid-cols-[1.2fr_0.8fr] md:p-10 lg:p-12">
          <div className="min-w-0">
            <p className="inline-flex rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[12px] font-semibold text-[var(--brand)] ring-1 ring-[rgba(29,214,111,0.25)] sm:px-3 sm:text-sm">
              ویژه نکس‌فیلم
            </p>
            <h2
              className="font-en mt-2.5 max-w-xl text-end text-[clamp(1.35rem,4vw,36px)] font-bold leading-tight text-white sm:mt-3"
              dir="ltr"
            >
              {featured.titleEn || featured.titleFa}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-[var(--meta-muted)]">
              <span className="inline-flex items-center gap-1 text-white">
                <Star className="size-3.5 fill-[var(--star)] text-[var(--star)]" />
                {fa(displayRating(featured.rating).toFixed(1))}
              </span>
              <span aria-hidden>·</span>
              <span>{fa(featured.year)}</span>
              <span aria-hidden>·</span>
              <span>{featured.duration}</span>
              <span aria-hidden>·</span>
              <span>{featured.genres.slice(0, 2).join(' · ')}</span>
            </div>
            <p className="mt-4 max-w-lg line-clamp-3 text-[15px] leading-7 text-[var(--fg-secondary)]">
              {featured.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
              <Button asChild size="lg" className="rounded-xl shadow-[0_10px_28px_rgba(29,214,111,0.3)]">
                <Link href={`/watch/${featured.id}`}>
                  <Play className="size-4 fill-current" />
                  پخش الان
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="rounded-xl bg-white/10 text-white ring-white/15 backdrop-blur-md hover:bg-white/16"
              >
                <Link href={detailHref}>
                  <Plus className="size-4" />
                  لیست تماشا
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto hidden h-[300px] w-full max-w-sm items-center justify-center md:flex">
            {posters.map((item, i) => (
              <Link
                key={item.id + i}
                href={item.type === 'Series' ? `/series/${item.id}` : `/movie/${item.id}`}
                className="absolute overflow-hidden rounded-[14px] shadow-[0_20px_50px_rgba(0,0,0,0.55)] outline-none ring-1 ring-white/10"
                style={{
                  width: i === 0 ? 180 : 160,
                  aspectRatio: '2/3',
                  transform:
                    i === 0
                      ? 'rotate(-9deg) translateX(36px) translateY(10px)'
                      : 'rotate(8deg) translateX(-52px) translateY(-6px)',
                  zIndex: i === 0 ? 2 : 3,
                }}
                tabIndex={0}
              >
                <img
                  src={item.poster}
                  alt={item.titleEn || item.titleFa}
                  className="size-full object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
