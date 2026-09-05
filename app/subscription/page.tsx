import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { SubscriptionSellPage } from '@/components/subscription-sell-page'

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <SubscriptionSellPage />
      <SiteFooter />
    </main>
  )
}
