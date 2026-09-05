import { getAllTitles, resolveTitle, type Movie } from '@/lib/movies'
import { getLikedIds } from '@/lib/user-store'

function getDislikedIds(): string[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem('nextfilm-user-state')
  if (!raw) return []
  try {
    const s = JSON.parse(raw)
    return s.dislikes?.[s.activeProfileId] ?? []
  } catch {
    return []
  }
}

export function getBecauseYouLikedRows(): { title: string; movies: Movie[] }[] {
  const liked = getLikedIds().slice(0, 3)
  const catalog = getAllTitles()
  return liked
    .map((id) => {
      const m = resolveTitle(id)
      if (!m) return null
      const similar = catalog
        .filter((x) => x.id !== id && !getDislikedIds().includes(x.id))
        .sort((a, b) => {
          const aG = a.genres.filter((g) => m.genres.includes(g)).length
          const bG = b.genres.filter((g) => m.genres.includes(g)).length
          return bG - aG
        })
        .slice(0, 6)
      return { title: `چون «${m.title}» را پسندیدید`, movies: similar }
    })
    .filter((r): r is { title: string; movies: Movie[] } => Boolean(r))
}

export function aiSearchMock(query: string): Movie[] {
  const q = query.toLowerCase()
  const keywords = q.split(/\s+/).filter(Boolean)
  return getAllTitles()
    .filter((m) => {
      const hay = `${m.title} ${m.titleEn} ${m.description} ${m.genres.join(' ')} ${m.cast.join(' ')}`.toLowerCase()
      return keywords.some((k) => hay.includes(k)) || hay.includes(q)
    })
    .slice(0, 8)
}
