'use client'

import {
  useCallback,
  useRef,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeader } from '@/components/section-header'
import { cn } from '@/lib/utils'

export function useShelfScroller() {
  const scroller = useRef<HTMLDivElement>(null)

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const el = scroller.current
    if (!el) return
    const step = Math.round(el.clientWidth * 0.7)
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      el.scrollBy({ left: -step, behavior: 'smooth' })
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      el.scrollBy({ left: step, behavior: 'smooth' })
    }
  }, [])

  const scrollByDir = useCallback((dir: 'start' | 'end') => {
    const el = scroller.current
    if (!el) return
    const step = Math.round(el.clientWidth * 0.72)
    const rtl = getComputedStyle(el).direction === 'rtl'
    const sign = rtl ? -1 : 1
    el.scrollBy({
      left: dir === 'end' ? sign * step : -sign * step,
      behavior: 'smooth',
    })
  }, [])

  return { scroller, onKeyDown, scrollByDir }
}

export function ShelfTrack({
  scrollerRef,
  label,
  onKeyDown,
  children,
  className,
  showArrows = true,
  onScrollStart,
  onScrollEnd,
}: {
  scrollerRef: RefObject<HTMLDivElement | null>
  label: string
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
  children: ReactNode
  className?: string
  showArrows?: boolean
  onScrollStart?: () => void
  onScrollEnd?: () => void
}) {
  return (
    <div className="shelf-hover-zone relative">
      <div
        ref={scrollerRef}
        role="list"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={label}
        className={cn(
          'shelf-track no-scrollbar flex gap-[var(--poster-gap)] px-[var(--space-page-x)]',
          '[scroll-snap-type:x_mandatory]',
          className,
        )}
      >
        {children}
        {/* end spacer so last card can scale without clipping */}
        <div className="w-[var(--shelf-hover-pad)] shrink-0" aria-hidden />
      </div>

      {showArrows ? (
        <>
          <button
            type="button"
            aria-label="قبلی"
            onClick={onScrollStart}
            className={cn(
              'absolute top-1/2 z-[70] hidden size-9 -translate-y-1/2 place-items-center lg:grid',
              'rounded-full bg-black/55 text-white/90 ring-1 ring-white/15 backdrop-blur-sm',
              'transition-colors hover:bg-black/75 hover:text-white',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
              'start-[max(0.25rem,calc(var(--space-page-x)-0.5rem))]',
            )}
          >
            <ChevronRight className="size-4 rtl:hidden" strokeWidth={2.25} />
            <ChevronLeft className="hidden size-4 rtl:block" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            aria-label="بعدی"
            onClick={onScrollEnd}
            className={cn(
              'absolute top-1/2 z-[70] hidden size-9 -translate-y-1/2 place-items-center lg:grid',
              'rounded-full bg-black/55 text-white/90 ring-1 ring-white/15 backdrop-blur-sm',
              'transition-colors hover:bg-black/75 hover:text-white',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
              'end-[max(0.25rem,calc(var(--space-page-x)-0.5rem))]',
            )}
          >
            <ChevronLeft className="size-4 rtl:hidden" strokeWidth={2.25} />
            <ChevronRight className="hidden size-4 rtl:block" strokeWidth={2.25} />
          </button>
        </>
      ) : null}
    </div>
  )
}

export function ShelfSection({
  title,
  href,
  seeAllLabel,
  children,
  className,
}: {
  title: string
  href?: string
  seeAllLabel?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('shelf-section reveal py-[var(--section-py)]', className)}>
      <SectionHeader title={title} href={href} seeAllLabel={seeAllLabel} />
      {children}
    </section>
  )
}
