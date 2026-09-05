export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.35,
} as const

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
} as const

export const spring = {
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },
  soft: { type: 'spring' as const, stiffness: 300, damping: 28 },
} as const

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.base, ease: ease.out },
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
}

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.base, ease: ease.out },
}
