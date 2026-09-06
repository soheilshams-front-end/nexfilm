'use client'

import { useEffect } from 'react'
import { applyAppearance, loadAppearance } from '@/lib/appearance-prefs'

/** Applies saved theme/accent on every page load */
export function AppearanceBootstrap() {
  useEffect(() => {
    applyAppearance(loadAppearance())
  }, [])
  return null
}
