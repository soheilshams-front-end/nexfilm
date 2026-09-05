import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { TrustArticle } from '@/components/trust-article'
import { privacySections } from '@/lib/trust-content'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <TrustArticle
        title="حریم خصوصی"
        subtitle="چگونه با داده‌های شما در نسخهٔ فعلی برخورد می‌کنیم"
        sections={privacySections}
      />
      <SiteFooter />
    </main>
  )
}
