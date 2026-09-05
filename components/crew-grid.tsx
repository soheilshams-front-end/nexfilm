'use client'

import { getCrew } from '@/lib/movies'

/**
 * Crew — compact grid of behind-the-camera talent.
 */
export function CrewGrid({ titleId }: { titleId?: string }) {
  const crew = getCrew(titleId)
  if (!crew.length) return null

  return (
    <section className="reveal">
      <div className="mb-4 px-4 sm:px-6 lg:px-10">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">عوامل پشت دوربین</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">تیمی که این اثر را ساخت</p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-6 lg:px-10">
        {crew.map((c, i) => (
          <div
            key={c.id}
            style={{ animationDelay: `${i * 50}ms` }}
            className="reveal-scale group rounded-xl border border-border/60 bg-card/50 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card"
          >
            <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-110">
              <span className="font-display text-sm font-bold">{c.name.charAt(0)}</span>
            </div>
            <p className="truncate text-sm font-bold">{c.name}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
