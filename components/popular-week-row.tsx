'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { SaintstreamTitle } from '@/lib/saintstream-home'
import { fa } from '@/lib/format-fa'
import { ShelfSection, ShelfTrack, useShelfScroller } from '@/components/shelf-section'

const EASE = [0.25, 0.1, 0.25, 1] as const

export function PopularWeekRow({ items }: { items: SaintstreamTitle[] }) {
  const { scroller, onKeyDown, scrollByDir } = useShelfScroller()
  const reduceMotion = useReducedMotion()
  const row = items.slice(0, 6)
  if (!row.length) return null

  return (
    <ShelfSection title="محبوب این هفته" href="/movies">
      <ShelfTrack
        scrollerRef={scroller}
        label="محبوب این هفته"
        onKeyDown={onKeyDown}
        onScrollStart={() => scrollByDir('start')}
        onScrollEnd={() => scrollByDir('end')}
        className="[scroll-snap-type:x_proximity]"
      >
        {row.map((item, i) => {
          const detailHref = item.type === 'Series' ? `/series/${item.id}` : `/movie/${item.id}`
          const delay = reduceMotion ? 0 : 0.05 * i

          return (
            <motion.div
              key={`${item.id}-${i}`}
              role="listitem"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.4, delay, ease: EASE }}
              className="shrink-0 snap-start"
            >
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -3 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              >
                <Link
                  href={detailHref}
                  tabIndex={0}
                  className="group relative flex w-[min(11.5rem,78vw)] items-stretch gap-0 overflow-hidden rounded-[var(--radius-card)] bg-white/[0.03] outline-none ring-1 ring-white/10 transition-[box-shadow,ring-color] duration-300 hover:bg-white/[0.05] hover:ring-[rgba(29,214,111,0.28)] sm:w-[240px] md:w-[260px]"
                >
                  <div className="relative flex w-10 shrink-0 items-end justify-center pb-1.5 sm:w-12 sm:pb-2">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent to-[rgba(29,214,111,0.06)]"
                    />
                    <span className="select-none bg-gradient-to-b from-[var(--brand)] via-white/70 to-white/15 bg-clip-text text-[36px] font-black leading-none tracking-tight text-transparent sm:text-[44px]">
                      {fa(i + 1)}
                    </span>
                  </div>

                  <div className="relative my-1.5 h-[96px] w-[68px] shrink-0 overflow-hidden rounded-md ring-1 ring-white/12 sm:my-2 sm:h-[112px] sm:w-[78px]">
                    <img
                      src={item.poster}
                      alt={item.titleEn || item.titleFa}
                      className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-2.5 py-2.5 sm:px-3">
                    <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white sm:text-[14px]">
                      <span dir="ltr">{item.titleEn || item.titleFa}</span>
                    </h3>
                    <p className="flex flex-wrap items-center gap-1 text-[11px] text-white/55 sm:text-[12px]">
                      <Star className="size-3 fill-[var(--star)] text-[var(--star)]" />
                      <span className="text-white/85">{fa(item.rating.toFixed(1))}</span>
                      <span aria-hidden className="text-white/25">
                        ·
                      </span>
                      <span className="truncate">{item.genres[0]}</span>
                    </p>
                    <span className="w-fit rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/65 ring-1 ring-white/10">
                      {item.maturity}
                    </span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          )
        })}
      </ShelfTrack>
    </ShelfSection>
  )
}
