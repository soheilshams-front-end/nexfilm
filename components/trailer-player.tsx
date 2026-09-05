'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

export function TrailerPlayer({
  embedUrl,
  title,
  poster,
  autoPlay = false,
}: {
  embedUrl: string
  title: string
  poster?: string
  autoPlay?: boolean
}) {
  const [playing, setPlaying] = useState(autoPlay)

  if (playing) {
    return (
      <div className="relative aspect-video w-full bg-black">
        {poster ? (
          <img src={poster} alt="" className="absolute inset-0 size-full object-cover opacity-70" />
        ) : null}
        <iframe
          src={`${embedUrl}?rel=0&autoplay=1&modestbranding=1`}
          title={title}
          className="relative z-[1] size-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative aspect-video w-full overflow-hidden bg-black text-start"
      aria-label={`پخش ${title}`}
    >
      {poster ? (
        <img src={poster} alt="" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      ) : (
        <div className="absolute inset-0 bg-[#111]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-16 place-items-center rounded-full bg-white text-black shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-transform duration-200 group-hover:scale-105 sm:size-[4.5rem]">
          <Play className="ms-1 size-7 fill-current sm:size-8" />
        </span>
      </span>
      <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur-sm sm:bottom-4 sm:right-4 sm:px-3 sm:text-[12px]">
        تریلر رسمی
      </span>
    </button>
  )
}
