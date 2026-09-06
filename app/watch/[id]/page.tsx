import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { EpisodeSelector } from '@/components/episode-selector'
import { TitleText } from '@/components/title-text'
import { fa } from '@/lib/format-fa'
import { resolveTitle, getSimilar, getPlaybackUrl, getNextEpisode, getSeasons, getEpisode, listRoutableIds } from '@/lib/movies'
import { WatchResumeClient } from '@/components/watch-resume-client'

export function generateStaticParams() {
  return listRoutableIds().map((id) => ({ id }))
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ s?: string; e?: string }>
}) {
  const { id } = await params
  const { s, e } = await searchParams
  const movie = resolveTitle(id)
  if (!movie) notFound()

  let seasonNum = s ? Number(s) : undefined
  let episodeNum = e ? Number(e) : undefined

  if (movie.type === 'Series' && (seasonNum == null || episodeNum == null)) {
    const seasons = getSeasons(id)
    const first = seasons[0]?.episodes[0]
    if (first) {
      seasonNum = seasons[0].id
      episodeNum = first.id
    }
  }

  const playbackUrl = getPlaybackUrl(id, seasonNum, episodeNum)
  const recommended = getSimilar(id, 6)
  const episode =
    movie.type === 'Series' && seasonNum != null && episodeNum != null
      ? getEpisode(id, seasonNum, episodeNum)
      : undefined

  let nextEpisode: { title: string; href: string } | undefined
  if (movie.type === 'Series' && seasonNum != null && episodeNum != null) {
    const next = getNextEpisode(id, seasonNum, episodeNum)
    if (next) {
      nextEpisode = {
        title: next.title,
        href: `/watch/${id}?s=${next.season}&e=${next.episode}`,
      }
    }
  } else if (recommended[0]) {
    nextEpisode = { title: recommended[0].title, href: `/watch/${recommended[0].id}` }
  }

  const backHref = movie.type === 'Series' ? `/series/${movie.id}` : `/movie/${movie.id}`
  const displayTitle = movie.titleEn || movie.title
  const meta = [
    movie.year ? fa(movie.year) : null,
    seasonNum != null && episodeNum != null
      ? `فصل ${fa(seasonNum)} · قسمت ${fa(episodeNum)}`
      : movie.duration || null,
    movie.rating ? fa(movie.rating.toFixed(1)) : null,
  ].filter(Boolean)
  const noStream = !playbackUrl

  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <header className="sticky top-0 z-40">
        <div className="nf-player-glass mx-auto mt-0 flex h-12 max-w-[1800px] items-center gap-2 rounded-none border-b border-white/10 px-2.5 sm:h-14 sm:gap-3 sm:px-5 lg:mx-3 lg:mt-2 lg:rounded-2xl lg:border-b-0">
          <Link
            href={backHref}
            className="grid size-9 shrink-0 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="بازگشت"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </Link>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-end text-[13px] font-semibold sm:text-sm md:text-[15px]">
              {episode?.title ? (
                <>
                  <TitleText forceEn className="inline">
                    {displayTitle}
                  </TitleText>
                  <span className="mx-1 text-white/40">—</span>
                  <TitleText className="inline">{episode.title}</TitleText>
                </>
              ) : (
                <TitleText forceEn className="inline">
                  {displayTitle}
                </TitleText>
              )}
            </p>
            {meta.length ? (
              <p className="truncate text-[10px] text-white/45 sm:text-[11px] md:text-[12px]">
                {meta.join(' · ')}
              </p>
            ) : null}
          </div>
          <Link
            href="/"
            className="hidden shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white/60 hover:bg-white/10 hover:text-white sm:inline"
          >
            خانه
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 gap-0 overflow-x-hidden lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] xl:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]">
        <div className="min-w-0">
          <div className="relative bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)] anim-fade-up">
            <WatchResumeClient
              movie={movie}
              playbackUrl={playbackUrl}
              nextEpisode={nextEpisode}
              seasonId={seasonNum}
              episodeId={episodeNum}
            />
          </div>

          <div className="anim-fade-up space-y-3 border-t border-white/5 px-3 py-4 sm:px-6 sm:py-5">
            <TitleText forceEn as="h1" className="text-end text-lg font-bold sm:text-xl md:text-2xl">
              {displayTitle}
            </TitleText>
            {episode?.title ? (
              <p className="truncate text-end text-[13px] text-white/55 sm:text-sm">
                فصل {fa(seasonNum!)} · قسمت {fa(episodeNum!)} —{' '}
                <TitleText className="inline">{episode.title}</TitleText>
              </p>
            ) : null}
            {noStream ? (
              <p className="rounded-[14px] bg-white/[0.04] px-3 py-3 text-[12px] leading-6 text-white/60 ring-1 ring-white/10 sm:px-4 sm:text-[13px]">
                پخش کامل این عنوان تجاری در دمو موجود نیست. پوستر، زیرنویس و کیفیت را همین‌جا امتحان کنید.
              </p>
            ) : null}
            {movie.description ? (
              <p className="max-w-3xl text-[13px] leading-6 text-white/65 sm:text-sm sm:leading-7">
                {movie.description}
              </p>
            ) : null}
            {movie.genres.length ? (
              <div className="flex flex-wrap gap-1.5 pt-1 sm:gap-2">
                {movie.genres.slice(0, 5).map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/65 ring-1 ring-white/10 sm:px-3 sm:text-[12px]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="w-full min-w-0 max-w-full border-t border-white/10 bg-[#070707] anim-fade-up lg:max-h-[calc(100dvh-4.25rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:border-t-0 lg:border-r lg:border-white/10">
          <div className="w-full min-w-0 p-3 sm:p-4">
            {movie.type === 'Series' ? (
              <>
                <h2 className="mb-2 text-sm font-bold text-white sm:mb-2.5">قسمت‌ها</h2>
                <EpisodeSelector
                  seriesId={movie.id}
                  showTitle={false}
                  compact
                  currentSeason={seasonNum}
                  currentEpisode={episodeNum}
                />
              </>
            ) : (
              <>
                <h2 className="mb-2 text-sm font-bold text-white sm:mb-2.5">پخش بعدی</h2>
                <ul className="w-full min-w-0 space-y-0.5">
                  {recommended.map((r) => (
                    <li key={r.id} className="min-w-0">
                      <Link
                        href={`/watch/${r.id}`}
                        className="group flex w-full min-w-0 gap-2.5 rounded-[12px] p-1.5 transition-all duration-200 hover:translate-x-0.5 hover:bg-white/[0.06] sm:gap-3 sm:p-2"
                      >
                        <img
                          src={r.poster}
                          alt=""
                          className="h-12 w-9 shrink-0 rounded-lg object-cover ring-1 ring-white/10 sm:h-[4.25rem] sm:w-[3rem]"
                        />
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <TitleText forceEn as="p" className="truncate text-[12px] font-medium text-white/90 group-hover:text-white sm:text-sm">
                            {r.titleEn || r.title}
                          </TitleText>
                          <p className="mt-0.5 truncate text-[10px] text-white/40 sm:mt-1 sm:text-[11px]">
                            {r.year ? fa(r.year) : ''}
                            {r.duration ? ` · ${r.duration}` : ''}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}
