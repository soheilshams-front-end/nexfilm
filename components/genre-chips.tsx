'use client'

import { useState } from 'react'
import { genres } from '@/lib/movies'
import { cn } from '@/lib/utils'

export function GenreChips() {
  const [active, setActive] = useState('همه')

  return (
    <section className="reveal space-y-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white sm:text-xl">فیلتر سریع ژانر</h2>
        <p className="text-xs text-muted-foreground">ژانر مورد علاقه‌ات را انتخاب کن</p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1 sm:px-6 lg:px-8">
        {genres.map((g) => {
          const isActive = active === g
          return (
            <button
              key={g}
              onClick={() => setActive(g)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm transition-all duration-200',
                isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-white/15 text-muted-foreground hover:border-white/30 hover:text-white',
              )}
            >
              {g}
            </button>
          )
        })}
      </div>
    </section>
  )
}
