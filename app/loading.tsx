import { SiteNav } from '@/components/site-nav'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="min-h-screen bg-background tabbar-pad">
      <SiteNav />
      <Skeleton className="h-[70vh] w-full rounded-none bg-[var(--bg-2)]" />
      <div className="space-y-10 px-[var(--space-page-x)] py-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-40 bg-[var(--bg-3)]" />
            <div className="flex gap-[var(--poster-gap)]">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <Skeleton
                  key={j}
                  className="aspect-[2/3] w-[var(--poster-card-w)] shrink-0 rounded-[var(--radius-card)] bg-[var(--bg-2)]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
