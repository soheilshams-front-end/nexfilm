import Link from 'next/link'
import { Play, Plus, Star } from 'lucide-react'
import type { SaintstreamTitle } from '@/lib/saintstream-home'
import { fa } from '@/lib/format-fa'
import { Badge } from '@/components/untitled/badge'
import { Button } from '@/components/untitled/button'

function SideList({ title, items }: { title: string; items: SaintstreamTitle[] }) {
  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <h3 className="text-[17px] font-semibold text-white sm:text-[20px]">{title}</h3>
      </div>
      <ul className="space-y-1">
        {items.slice(0, 4).map((item) => {
          const href = item.type === 'Series' ? `/series/${item.id}` : `/movie/${item.id}`
          return (
            <li key={item.id}>
              <Link
                href={href}
                tabIndex={0}
                className="group flex items-center gap-3 rounded-[12px] p-2 outline-none transition-colors hover:bg-white/[0.04]"
              >
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded-[10px] bg-[var(--bg-secondary)] ring-1 ring-[var(--border-secondary)]">
                  <img src={item.poster} alt="" className="size-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-en truncate text-start text-[15px] font-medium text-white" dir="ltr">
                    {item.titleEn || item.titleFa}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-[var(--meta-muted)]">
                    <Star className="size-3 fill-[var(--star)] text-[var(--star)]" />
                    {fa(item.rating.toFixed(1))}
                    <span aria-hidden>·</span>
                    {item.genres[0]}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function HomeBottomGrid({
  award,
  popular,
  editors,
}: {
  award: SaintstreamTitle
  popular: SaintstreamTitle[]
  editors: SaintstreamTitle[]
}) {
  const href = award.type === 'Series' ? `/series/${award.id}` : `/movie/${award.id}`

  return (
    <section className="reveal py-[var(--section-py)]">
      <div className="page-max page-pad grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-[1.35fr_1fr_1fr]">
        <div className="relative min-w-0 overflow-hidden rounded-[16px] bg-[var(--bg-secondary)] ring-1 ring-[var(--border-secondary)]">
          <img
            src={award.backdrop || award.poster}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/75 to-transparent" />
          <div className="relative flex min-h-[260px] flex-col justify-end p-4 sm:min-h-[300px] sm:p-6 md:min-h-[320px] md:p-8">
            <Badge color="brand">برنده جایزه</Badge>
            <h3 className="font-en mt-3 text-end text-balance text-[1.35rem] font-bold text-white sm:mt-4 sm:text-[28px]" dir="ltr">
              {award.titleEn || award.titleFa}
            </h3>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[var(--meta-muted)]">
              <span className="inline-flex items-center gap-1 text-white">
                <Star className="size-3.5 fill-[var(--star)] text-[var(--star)]" />
                {fa(award.rating.toFixed(1))}
              </span>
              <span aria-hidden>·</span>
              <span>{award.duration}</span>
              <span aria-hidden>·</span>
              <span>{fa(award.year)}</span>
            </p>
            <p className="mt-3 line-clamp-2 text-[14px] leading-6 text-[var(--fg-secondary)]">
              {award.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="md">
                <Link href={`/watch/${award.id}`}>
                  <Play className="size-4 fill-current" />
                  پخش
                </Link>
              </Button>
              <Button asChild variant="secondary" size="md">
                <Link href={href}>
                  <Plus className="size-4" />
                  جزئیات
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <SideList title="محبوب‌ها" items={popular} />
        <SideList title="انتخاب سردبیر" items={editors} />
      </div>
    </section>
  )
}
