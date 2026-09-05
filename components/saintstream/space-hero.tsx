'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { SaintstreamTitle } from '@/lib/saintstream-home'
import { Tilt, TiltContent } from '@/components/animate-ui/primitives/effects/tilt'
import { Particles, ParticlesEffect } from '@/components/animate-ui/primitives/effects/particles'

type FloatPoster = {
  id: string
  poster: string
  title: string
  x: number
  y: number
  z: number
  rotateY: number
  rotateZ: number
  scale: number
  duration: number
  delay: number
}

function buildFloatPosters(titles: SaintstreamTitle[], slideSeed: number): FloatPoster[] {
  const unique = Array.from(new Map(titles.map((t) => [t.id, t])).values())
  const pool = [...unique, ...unique].slice(0, 10)

  return pool.map((item, i) => {
    const seed = slideSeed * 17 + i * 13
    const x = ((seed * 7) % 100) - 50
    const y = ((seed * 11) % 80) - 40
    const z = -120 - (i % 4) * 80
    return {
      id: `${item.id}-${i}`,
      poster: item.poster,
      title: item.titleEn || item.titleFa,
      x,
      y,
      z,
      rotateY: ((seed * 3) % 40) - 20,
      rotateZ: ((seed * 5) % 16) - 8,
      scale: 0.72 + (i % 3) * 0.12,
      duration: 6 + (i % 4) * 1.5,
      delay: i * 0.35,
    }
  })
}

export function SpaceHeroScene({
  posters,
  slideSeed = 0,
}: {
  posters: SaintstreamTitle[]
  slideSeed?: number
}) {
  const reduceMotion = useReducedMotion()
  const floats = useMemo(() => buildFloatPosters(posters, slideSeed), [posters, slideSeed])

  return (
    <div className="absolute inset-0 overflow-hidden bg-black" style={{ perspective: '1200px' }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(0,146,93,0.18),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,146,93,0.08),transparent_50%)]"
      />

      <Particles className="absolute inset-0">
        <ParticlesEffect count={18} radius={2} spread={360} duration={4} side="top" />
      </Particles>

      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {floats.map((item) => (
          <motion.div
            key={item.id}
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{
              transformStyle: 'preserve-3d',
              zIndex: Math.round(1000 + item.z),
            }}
            initial={{
              x: item.x * 4,
              y: item.y * 4,
              z: item.z,
              rotateY: item.rotateY,
              rotateZ: item.rotateZ,
              scale: item.scale * 0.85,
              opacity: 0,
            }}
            animate={
              reduceMotion
                ? {
                    x: item.x * 4,
                    y: item.y * 4,
                    z: item.z,
                    rotateY: item.rotateY,
                    rotateZ: item.rotateZ,
                    scale: item.scale,
                    opacity: 0.85,
                  }
                : {
                    x: [item.x * 4, item.x * 4 + 18, item.x * 4 - 12, item.x * 4],
                    y: [item.y * 4, item.y * 4 - 24, item.y * 4 + 16, item.y * 4],
                    z: item.z,
                    rotateY: [item.rotateY, item.rotateY + 12, item.rotateY - 8, item.rotateY],
                    rotateZ: [item.rotateZ, item.rotateZ + 4, item.rotateZ - 3, item.rotateZ],
                    scale: item.scale,
                    opacity: 0.9,
                  }
            }
            transition={{
              duration: reduceMotion ? 0.3 : item.duration,
              repeat: reduceMotion ? 0 : Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            <Tilt maxTilt={8} perspective={900}>
              <TiltContent>
                <div
                  className="relative size-[clamp(88px,12vw,148px)] overflow-hidden rounded-2xl border border-white/10 shadow-[var(--elevation-3)]"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,146,93,0.08)' }}
                >
                  <img src={item.poster} alt={item.title} className="size-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5" />
                </div>
              </TiltContent>
            </Tilt>
          </motion.div>
        ))}
      </div>

      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-black/30" />
    </div>
  )
}
