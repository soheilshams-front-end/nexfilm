import { notFound } from 'next/navigation'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { MovieRow } from '@/components/movie-row'
import { CastSlider } from '@/components/cast-slider'
import { DetailHero } from '@/components/detail-hero'
import { fa } from '@/lib/format-fa'
import { resolveTitle, getSimilar, getCrew, getReviews, listRoutableIds } from '@/lib/movies'
import { youtubeTrailerUrl, youtubeThumbnailUrl } from '@/lib/title-credits'
import { TrailerPlayer } from '@/components/trailer-player'

export function generateStaticParams() {
  return listRoutableIds().map((id) => ({ id }))
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const movie = resolveTitle(id)
  if (!movie || movie.type === 'Series') notFound()

  const similar = getSimilar(id)
  const crew = getCrew(id)
  const reviews = getReviews(id)
  const embed = youtubeTrailerUrl(id)
  const trailerThumb = youtubeThumbnailUrl(id)

  return (
    <main className="min-h-screen bg-black">
      <SiteNav />
      <DetailHero movie={movie} />

      <div className="relative z-10 -mt-6 space-y-10 bg-gradient-to-b from-transparent via-black to-black pb-10 sm:-mt-10 sm:space-y-12">
        <div className="page-max page-pad grid w-full min-w-0 gap-6 overflow-x-hidden sm:gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.75fr)] lg:gap-10">
          <div className="space-y-8">
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-[1.15rem] font-bold text-white sm:text-[1.35rem]">تریلر</h2>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/60">
                  رسمی
                </span>
              </div>
              <div className="overflow-hidden rounded-[18px] bg-[#0a0a0a] ring-1 ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                {embed ? (
                  <TrailerPlayer
                    embedUrl={embed}
                    title={`تریلر ${movie.title}`}
                    poster={movie.backdrop || trailerThumb || movie.poster}
                  />
                ) : (
                  <a href={`/watch/${movie.id}`} className="relative block aspect-video w-full">
                    <img
                      src={movie.backdrop || movie.poster}
                      alt=""
                      className="size-full object-cover opacity-80"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-black/35 text-sm font-semibold text-white">
                      رفتن به پخش
                    </span>
                  </a>
                )}
              </div>
            </section>

            <CastSlider titleId={movie.id} />

            {reviews.length > 0 ? (
              <section>
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

          <aside className="space-y-4 lg:pt-1">
            <div className="rounded-[18px] bg-white/[0.04] p-5 ring-1 ring-white/10">
              <h3 className="text-[15px] font-bold text-white">درباره اثر</h3>
              <dl className="mt-4 space-y-3 text-[13px]">
                {crew.map((c) => (
                  <div key={c.id} className="flex items-start justify-between gap-3">
                    <dt className="text-white/40">{c.role}</dt>
                    <dd className="text-left text-white/85">{c.name}</dd>
                  </div>
                ))}
                {movie.cast.length ? (
                  <div className="flex items-start justify-between gap-3 border-t border-white/10 pt-3">
                    <dt className="text-white/40">ستاره‌ها</dt>
                    <dd className="max-w-[70%] text-left text-white/85">
                      {movie.cast.slice(0, 4).join('، ')}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </aside>
        </div>

        {similar.length > 0 ? (
          <div className="pb-4">
            <MovieRow title="آثار مشابه" movies={similar} />
          </div>
        ) : null}
      </div>

      <SiteFooter />
    </main>
  )
}
