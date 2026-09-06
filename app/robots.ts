import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nextfilm.ir'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile/', '/profiles/', '/watch/', '/login', '/signup'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
