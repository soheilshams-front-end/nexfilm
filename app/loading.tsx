import { SiteNav } from '@/components/site-nav'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="min-h-screen bg-black tabbar-pad">
      <SiteNav />
      <div className="relative h-[min(70vh,640px)] w-full overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none bg-[var(--bg-2)]" />
        <div className="absolute inset-x-0 bottom-16 page-pad space-y-3">
          <Skeleton className="h-8 w-40 bg-white/10" />
          <Skeleton className="h-12 w-[min(70%,28rem)] bg-white/10" />
          <Skeleton className="h-4 w-[min(50%,18rem)] bg-white/8" />
        </div>
      </div>
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
