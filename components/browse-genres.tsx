'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'

export type GenreCardData = {
  name: string
  count: number
  titleFa: string
  titleEn: string
  poster: string
  movieId: string
}

export function BrowseGenres({ genres }: { genres: GenreCardData[] }) {
  const reduceMotion = useReducedMotion()

  if (!genres.length) {
    return <p className="py-20 text-center text-[var(--fg-tertiary)]">ژانری برای نمایش نیست.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
      {genres.map((g, i) => (
        <motion.article
          key={g.name}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{
            delay: reduceMotion ? 0 : Math.min(i * 0.03, 0.28),
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="group relative"
        >
          <Link
            href={`/movies?genre=${encodeURIComponent(g.name)}`}
            className={cn(
              'relative block overflow-hidden rounded-[var(--radius-card)] bg-[#141820]',
              'aspect-[2/3] ring-1 ring-white/[0.08]',
              'transition-[box-shadow,ring-color] duration-300',
              'hover:ring-[rgba(29,214,111,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
            )}
            aria-label={`ژانر ${g.name} — ${g.titleFa}`}
          >
            <img
              src={g.poster}
              alt={g.titleEn}
              className="absolute inset-0 size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-3 md:p-3.5">
              <p className="text-[11px] font-bold leading-tight tracking-tight text-white sm:text-[15px] md:text-[17px]">
                {g.name}
              </p>
              <p className="font-en mt-0.5 line-clamp-1 text-center text-[10px] text-white/55 sm:mt-1 sm:text-[12px]" dir="ltr">
                {g.titleEn || g.titleFa}
              </p>
              <p className="mt-0.5 hidden text-[11px] tabular-nums text-white/40 sm:block">
                {fa(g.count)} عنوان
              </p>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  )
}
