import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { Button } from '@/components/untitled/button'
import { Card } from '@/components/untitled/card'
import { aboutBlocks } from '@/lib/trust-content'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <PageHero
        title="درباره نکس‌فیلم"
        subtitle="استریم فریمیوم فارسی: تماشای پایه رایگان، پرمیوم برای کیفیت و امکانات بیشتر"
      />

      <div className="page-max page-pad mt-10 grid gap-4 pb-10 md:grid-cols-3">
        {aboutBlocks.map((b) => (
          <Card key={b.title} padding>
            <h2 className="text-base font-semibold text-[var(--fg-primary)]">{b.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--fg-tertiary)]">{b.body}</p>
          </Card>
        ))}
      </div>

      <div className="page-max page-pad flex flex-wrap items-center justify-center gap-3 pb-16">
        <Button asChild size="lg">
          <Link href="/subscription">مشاهده اشتراک</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/faq">سوالات متداول</Link>
        </Button>
      </div>

      <SiteFooter />
    </main>
  )
}
