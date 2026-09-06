import { Compass } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { EmptyState } from '@/components/empty-state'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black">
      <SiteNav />
      <div className="page-max page-pad pt-28">
        <EmptyState
          icon={Compass}
          title="این صفحه پیدا نشد"
          description="آدرس اشتباه است یا این عنوان از آرشیو برداشته شده. به خانه برگردید و دوباره جستجو کنید."
          actionHref="/"
          actionLabel="بازگشت به خانه"
        />
      </div>
      <SiteFooter />
    </main>
  )
}
