import { Sparkles, RefreshCw } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { MovieGrid } from '@/components/dashboard/movie-grid'
import { RecommendationsContent } from '@/components/recommendations-content'
import { fa } from '@/lib/format-fa'

export default function RecommendationsPage() {
  return (
    <main className="min-h-screen">      <SiteNav />
      <DashboardShell>
        <PageHeader
          title="پیشنهادهای ویژه شما"
          subtitle="بر اساس پسندها و تاریخچه تماشا"
          action={
            <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary">
              <RefreshCw className="size-4" />
              به‌روزرسانی
            </button>
          }
        />

        <div className="mb-6 flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-sm text-primary">
          <Sparkles className="size-4" />
          Because you liked — موتور پیشنهاد Nex Film
        </div>

        <RecommendationsContent />
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
