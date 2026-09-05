'use client'

import { useState } from 'react'
import { HeroCarousel } from '@/components/hero-carousel'
import { HomeContent } from '@/components/home-content'
import { SiteFooter } from '@/components/site-footer'
import { saintstreamHome } from '@/lib/saintstream-home'

export function HomeExperience() {
  const [index, setIndex] = useState(0)
  const slides = saintstreamHome.heroSlides

  return (
    <div className="home-page-bg relative min-h-screen overflow-hidden">
      <div className="relative z-10">
        <HeroCarousel slides={slides} index={index} onIndexChange={setIndex} />
        <HomeContent />
        <SiteFooter className="relative z-10 bg-transparent" />
      </div>
    </div>
  )
}
