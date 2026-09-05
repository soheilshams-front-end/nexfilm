'use client'

import { useEffect } from 'react'

export function ScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
        el.classList.add('is-visible')
      })
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    const observeNew = () => {
      document
        .querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')
        .forEach((el) => io.observe(el))
    }

    observeNew()

    const mo = new MutationObserver(() => observeNew())
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
