'use client'

import { useState } from 'react'
import { getScreenshots } from '@/lib/movies'
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Screenshots — gallery grid with lightbox modal.
 */
export function ScreenshotsGallery() {
  const shots = getScreenshots()
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="reveal">
      <div className="mb-4 flex items-center gap-3 px-4 sm:px-6 lg:px-10">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <Camera className="size-4" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">تصاویر فیلم</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">نماهای پشت صحنه و کادرها</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:px-10">
        {shots.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            style={{ animationDelay: `${i * 50}ms` }}
            className={cn(
              'reveal-scale group relative overflow-hidden rounded-2xl border border-border/60',
              i === 0 && 'col-span-2 sm:col-span-1',
            )}
          >
            <div className="relative aspect-video w-full">
              <img src={s.src} alt={s.caption} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
              <p className="absolute inset-x-0 bottom-0 p-3 text-right text-xs font-medium text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {s.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setActive(null)}
        >
          <button className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="بستن">
            <X className="size-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActive((a) => (a! - 1 + shots.length) % shots.length) }}
            className="absolute left-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="قبلی"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActive((a) => (a! + 1) % shots.length) }}
            className="absolute right-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="بعدی"
          >
            <ChevronRight className="size-6" />
          </button>
          <div className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={shots[active].src} alt={shots[active].caption} className="max-h-[78vh] rounded-xl object-contain" />
            <p className="mt-3 text-center text-sm text-white/80">{shots[active].caption}</p>
            <p className="mt-1 text-center text-xs text-white/50">{active + 1} از {shots.length}</p>
          </div>
        </div>
      )}
    </section>
  )
}
