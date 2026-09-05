import { SiteNav } from '@/components/site-nav'
import { HomeExperience } from '@/components/home-experience'
import { ScrollReveal } from '@/components/scroll-reveal'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <ScrollReveal />
      <SiteNav />
      <HomeExperience />
    </main>
  )
}
