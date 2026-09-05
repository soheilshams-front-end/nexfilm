import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { TrustArticle } from '@/components/trust-article'
import { termsSections } from '@/lib/trust-content'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <TrustArticle
        title="شرایط استفاده"
        subtitle="قوانین استفاده از نکس‌فیلم — نسخهٔ محصول فریمیوم"
        sections={termsSections}
      />
      <SiteFooter />
    </main>
  )
}
