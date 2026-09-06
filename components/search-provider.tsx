'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import type { Movie, Actor } from '@/lib/movies'
import { isKidsProfileActive } from '@/lib/user-store'
import { isKidsSafeMaturity } from '@/lib/title-credits'

type MovieResult = { kind: 'movie'; movie: Movie }
type ActorResult = { kind: 'actor'; actor: Actor }
export type SearchHit = MovieResult | ActorResult

type SearchContextValue = {
  open: boolean
  query: string
  hits: SearchHit[]
  loading: boolean
  recents: string[]
  trending: string[]
  popularMovies: Movie[]
  popularActors: Actor[]
  openSearch: (initialQuery?: string) => void
  closeSearch: () => void
  setQuery: (q: string) => void
  clearRecents: () => void
  addRecent: (q: string) => void
  submit: (q?: string) => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

const RECENTS_KEY = 'nextfilm:search:recents'
const RECENTS_MAX = 6

const TRENDING = [
  'تل‌ماس',
  'جنگ ستارگان',
  'بازی مرکب',
  'اوپنهایمر',
  'چیزهای عجیب',
  'اکشن',
]

type CatalogModule = typeof import('@/lib/movies')

let catalogPromise: Promise<CatalogModule> | null = null

function loadCatalog() {
  if (!catalogPromise) catalogPromise = import('@/lib/movies')
  return catalogPromise
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [query, setQueryState] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const [recents, setRecents] = useState<string[]>([])
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [popularActors, setPopularActors] = useState<Actor[]>([])
  const router = useRouter()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENTS_KEY)
      if (raw) setRecents(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  // Prefetch catalog only once search is opened
  useEffect(() => {
    if (!open) return
    let cancelled = false
    void loadCatalog().then((mod) => {
      if (cancelled) return
      setPopularMovies(
        [...mod.getAllTitles()].sort((a, b) => b.rating - a.rating).slice(0, 4),
      )
      setPopularActors(mod.actors.slice(0, 4))
    })
    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }

      if (e.key === '/' && !typing) {
        e.preventDefault()
        setOpen(true)
        return
      }

      if (e.key === 'Escape' && open) {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  const openSearch = useCallback((initialQuery?: string) => {
    setQueryState(initialQuery ?? '')
    setOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setOpen(false)
  }, [])

  const setQuery = useCallback((q: string) => {
    setQueryState(q)
  }, [])

  const addRecent = useCallback((q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    setRecents((prev) => {
      const next = [trimmed, ...prev.filter((r) => r !== trimmed)].slice(0, RECENTS_MAX)
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const clearRecents = useCallback(() => {
    setRecents([])
    try {
      localStorage.removeItem(RECENTS_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const submit = useCallback(
    (q?: string) => {
      const term = (q ?? query).trim()
      if (!term) return
      addRecent(term)
      setOpen(false)
      setQueryState('')
      router.push(`/search?q=${encodeURIComponent(term)}`)
    },
    [query, addRecent, router],
  )

  useEffect(() => {
    if (!open) return
    const term = query.trim()
    if (!term) {
      setHits([])
      setLoading(false)
      return
    }
    setLoading(true)
    const t = setTimeout(() => {
      void loadCatalog().then((mod) => {
        const lower = term.toLowerCase()
        const catalog = mod
          .getAllTitles()
          .filter((m) => !isKidsProfileActive() || isKidsSafeMaturity(m.maturity))
        const movieHits: SearchHit[] = catalog
          .filter(
            (m) =>
              m.title.toLowerCase().includes(lower) ||
              m.titleEn.toLowerCase().includes(lower) ||
              m.genres.some((g) => g.toLowerCase().includes(lower)) ||
              m.cast.some((c) => c.toLowerCase().includes(lower)) ||
              m.director.toLowerCase().includes(lower),
          )
          .slice(0, 8)
          .map((movie) => ({ kind: 'movie' as const, movie }))

        const actorHits: SearchHit[] = mod.actors
          .filter((a) => a.name.toLowerCase().includes(lower) || a.role.toLowerCase().includes(lower))
          .slice(0, 3)
          .map((actor) => ({ kind: 'actor' as const, actor }))

        setHits([...movieHits, ...actorHits])
        setLoading(false)
      })
    }, 220)
    return () => clearTimeout(t)
  }, [query, open])

  const value: SearchContextValue = {
    open,
    query,
    hits,
    loading,
    recents,
    trending: TRENDING,
    popularMovies,
    popularActors,
    openSearch,
    closeSearch,
    setQuery,
    clearRecents,
    addRecent,
    submit,
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchProvider')
  return ctx
}
