'use client'

import { motion, useReducedMotion } from 'motion/react'

export function PageHero({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="page-max page-pad min-w-0 pt-24 sm:pt-28 md:pt-32"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.28, 0.11, 0.32, 1] }}
    >
      <h1 className="text-large-title break-words text-[var(--fg-primary)] md:text-[2.5rem]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-xl text-[14px] leading-6 text-[var(--fg-tertiary)] sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  )
}
