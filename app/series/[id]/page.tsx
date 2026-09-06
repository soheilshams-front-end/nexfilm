import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { MovieScroller } from '@/components/saintstream/movie-scroller'
import { CastSlider } from '@/components/cast-slider'
import { DetailHero } from '@/components/detail-hero'
import { EpisodeSelector } from '@/components/episode-selector'
import { fa } from '@/lib/format-fa'
import { resolveTitle, getSimilar, getReviews, getCrew, getSeasons, listRoutableIds } from '@/lib/movies'

export function generateStaticParams() {
  return listRoutableIds().map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const movie = resolveTitle(id)
  if (!movie || movie.type !== 'Series') return { title: 'سریال پیدا نشد' }
  return {
    title: `${movie.titleEn || movie.title} | نکس فیلم`,
    description: movie.description.slice(0, 160),
    openGraph: {
      title: movie.titleEn || movie.title,
      description: movie.description.slice(0, 160),
      images: [movie.poster],
    },
  }
}

export default async function SeriesDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const series = resolveTitle(id)
  if (!series || series.type !== 'Series') notFound()

  const similar = getSimilar(id)
  const reviews = getReviews(id)
  const crew = getCrew(id)
  const seasons = getSeasons(id)
  const episodeCount = seasons.reduce((n, s) => n + s.episodes.length, 0)

  return (
    <main className="min-h-screen bg-black">
      <SiteNav />
      <DetailHero movie={series} />

      <div className="relative z-10 -mt-4 w-full min-w-0 space-y-7 overflow-x-hidden bg-gradient-to-b from-transparent via-black to-black pb-10 sm:-mt-10 sm:space-y-12">
        <div className="page-max page-pad grid w-full min-w-0 gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.7fr)] lg:gap-10">
          <div className="w-full min-w-0 space-y-6 sm:space-y-8">
            <section className="reveal is-visible w-full min-w-0 max-w-full overflow-hidden rounded-[14px] bg-white/[0.03] p-2 ring-1 ring-white/10 sm:rounded-[18px] sm:p-4 md:p-5">
              <div className="mb-2 flex min-w-0 items-baseline justify-between gap-2 sm:mb-4">
                <h2 className="min-w-0 truncate text-[15px] font-bold text-white sm:text-[1.15rem] md:text-[1.35rem]">
                  قسمت‌ها
                </h2>
                <p className="shrink-0 text-[10px] text-white/45 sm:text-[12px]">
                  {fa(seasons.length)} فصل · {fa(episodeCount)} قسمت
                </p>
              </div>
              <EpisodeSelector seriesId={series.id} showTitle={false} />
            </section>

            <CastSlider titleId={series.id} />

            {reviews.length > 0 ? (
              <section className="reveal is-visible">
                <h2 className="mb-4 text-[1.15rem] font-bold text-white sm:text-[1.35rem]">نقدها</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {reviews.map((r) => (
                    <article
                      key={r.id}
                      className="rounded-[16px] bg-white/[0.04] p-4 ring-1 ring-white/10"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white">{r.author}</p>
                        <p className="text-[12px] font-semibold text-[var(--brand)]">
                          {fa(r.rating)}/۱۰
                        </p>
                      </div>
                      <p className="mt-2 text-[13px] leading-6 text-white/60">{r.content}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="w-full min-w-0 space-y-4 lg:pt-1">
            <div className="rounded-[16px] bg-white/[0.04] p-4 ring-1 ring-white/10 sm:rounded-[18px] sm:p-5">
              <h3 className="text-[14px] font-bold text-white sm:text-[15px]">درباره سریال</h3>
              <dl className="mt-3 space-y-3 text-[12px] sm:mt-4 sm:text-[13px]">
                {crew.map((c) => (
                  <div key={c.id} className="flex min-w-0 items-start justify-between gap-3">
                    <dt className="shrink-0 text-white/40">{c.role}</dt>
                    <dd className="min-w-0 truncate text-left text-white/85">{c.name}</dd>
                  </div>
                ))}
                <div className="flex items-start justify-between gap-3 border-t border-white/10 pt-3">
                  <dt className="text-white/40">فصل‌ها</dt>
                  <dd className="text-left text-white/85">{fa(seasons.length)}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-white/40">قسمت‌ها</dt>
                  <dd className="text-left text-white/85">{fa(episodeCount)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        {similar.length > 0 ? (
          <div className="pb-4">
            <MovieScroller title="سریال‌های مشابه" items={similar} href="/series" />
          </div>
        ) : null}
      </div>

      <SiteFooter />
    </main>
  )
}
