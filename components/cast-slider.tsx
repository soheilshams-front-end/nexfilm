'use client'

import { getCast } from '@/lib/movies'

export function CastSlider({ titleId }: { titleId?: string }) {
  const cast = getCast(titleId)
  if (!cast.length) return null

  return (
    <section className="py-2">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="text-[1.15rem] font-bold text-white sm:text-[1.35rem]">بازیگران</h2>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-1">
        {cast.map((c) => (
          <div key={c.id} className="w-[6.5rem] shrink-0 sm:w-28">
            <div className="aspect-[3/4] overflow-hidden rounded-[14px] bg-white/[0.06] ring-1 ring-white/10">
              <img src={c.photo} alt={c.name} className="size-full object-cover" loading="lazy" />
            </div>
            <p className="mt-2 truncate text-[13px] font-semibold text-white/90">{c.name}</p>
            {c.character ? (
              <p className="truncate text-[12px] text-white/45">{c.character}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
