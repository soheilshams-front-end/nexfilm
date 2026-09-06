import type { MetadataRoute } from 'next'
import { listRoutableIds, resolveTitle } from '@/lib/movies'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nextfilm.ir'
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/movies',
    '/series',
    '/browse',
    '/search',
    '/subscription',
    '/about',
    '/faq',
    '/support',
    '/terms',
    '/privacy',
  ].map((path) => ({
    url: `${base}${path || '/'}`,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  const titles: MetadataRoute.Sitemap = listRoutableIds().flatMap((id) => {
    const t = resolveTitle(id)
    if (!t) return []
    const path = t.type === 'Series' ? `/series/${id}` : `/movie/${id}`
    return [
      {
        url: `${base}${path}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ]
  })

  return [...staticRoutes, ...titles]
}
