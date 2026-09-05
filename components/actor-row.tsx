'use client'

import { fa } from '@/lib/format-fa'
import { actors } from '@/lib/movies'
import { Star } from 'lucide-react'

export function ActorRow() {
  return (
    <section className="reveal">
      <div className="mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white sm:text-xl">بازیگران محبوب</h2>
        <p className="text-xs text-muted-foreground">چهره‌هایی که تماشا می‌کنی</p>
      </div>

      <div className="no-scrollbar flex gap-5 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-8">
        {actors.map((actor) => (
          <div
            key={actor.id}
            className="group flex w-28 shrink-0 flex-col items-center text-center sm:w-32"
          >
            <div className="relative">
              <img
                src={actor.photo}
                alt={actor.name}
                className="size-24 rounded-full border-2 border-white/10 object-cover transition-all duration-300 group-hover:border-primary sm:size-28"
              />
            </div>
            <h3 className="mt-3 truncate text-sm font-bold text-white">{actor.name}</h3>
            <p className="truncate text-xs text-muted-foreground">{actor.role}</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-primary">
              <Star className="size-3 fill-primary" />
              {fa(actor.films)} اثر
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
