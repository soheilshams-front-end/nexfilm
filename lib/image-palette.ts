export type AmbientRgb = { r: number; g: number; b: number }

export type AmbientPalette = {
  primary: string
  secondary: string
  accent: string
  cool: string
  rgb: AmbientRgb
}

/** Brand-green fallback — only used if the image cannot be sampled */
export const defaultAmbientPalette: AmbientPalette = {
  primary: 'rgba(29, 214, 111, 0.42)',
  secondary: 'rgba(29, 214, 111, 0.22)',
  accent: 'rgba(29, 214, 111, 0.14)',
  cool: 'rgba(29, 214, 111, 0.1)',
  rgb: { r: 29, g: 214, b: 111 },
}

const cache = new Map<string, AmbientPalette>()

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`
}

function cinematic(r: number, g: number, b: number, sat = 1.45) {
  const avg = (r + g + b) / 3
  let nr = avg + (r - avg) * sat
  let ng = avg + (g - avg) * sat
  let nb = avg + (b - avg) * sat
  const bright = (nr + ng + nb) / 3
  if (bright > 175) {
    const scale = 175 / bright
    nr *= scale
    ng *= scale
    nb *= scale
  }
  if (bright < 48) {
    const lift = 48 / Math.max(bright, 1)
    nr = Math.min(255, nr * lift)
    ng = Math.min(255, ng * lift)
    nb = Math.min(255, nb * lift)
  }
  return {
    r: clamp(nr, 0, 255),
    g: clamp(ng, 0, 255),
    b: clamp(nb, 0, 255),
  }
}

function samplePixels(data: Uint8ClampedArray) {
  let r = 0
  let g = 0
  let b = 0
  let weightSum = 0
  let bestSat = 0
  let best = { r: 29, g: 214, b: 111 }

  for (let i = 0; i < data.length; i += 4) {
    const pr = data[i]
    const pg = data[i + 1]
    const pb = data[i + 2]
    const brightness = (pr + pg + pb) / 3
    if (brightness < 28 || brightness > 230) continue
    const max = Math.max(pr, pg, pb)
    const min = Math.min(pr, pg, pb)
    const sat = max === 0 ? 0 : (max - min) / max
    if (sat < 0.18) continue
    const w = sat * sat * (0.6 + brightness / 255)
    r += pr * w
    g += pg * w
    b += pb * w
    weightSum += w
    if (sat > bestSat) {
      bestSat = sat
      best = { r: pr, g: pg, b: pb }
    }
  }

  if (!weightSum) return null
  return {
    r: best.r * 0.62 + (r / weightSum) * 0.38,
    g: best.g * 0.62 + (g / weightSum) * 0.38,
    b: best.b * 0.62 + (b / weightSum) * 0.38,
  }
}

function buildPalette(sample: AmbientRgb): AmbientPalette {
  const a = cinematic(sample.r, sample.g, sample.b, 1.5)
  const m = cinematic(sample.r, sample.g, sample.b, 1.2)
  return {
    primary: rgba(a.r, a.g, a.b, 0.58),
    secondary: rgba(m.r, m.g, m.b, 0.34),
    accent: rgba(a.r, a.g, a.b, 0.22),
    cool: rgba(m.r, m.g, m.b, 0.16),
    rgb: { r: Math.round(a.r), g: Math.round(a.g), b: Math.round(a.b) },
  }
}

function paletteFromImageElement(img: HTMLImageElement): AmbientPalette | null {
  const canvas = document.createElement('canvas')
  const size = 64
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(img, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)
  const sample = samplePixels(data)
  if (!sample) return null
  return buildPalette(sample)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function extractAmbientFromImage(src: string): Promise<AmbientPalette> {
  if (cache.has(src)) return cache.get(src)!
  if (typeof window === 'undefined') return defaultAmbientPalette

  try {
    const img = await loadImage(src)
    await img.decode().catch(() => undefined)
    const palette = paletteFromImageElement(img)
    if (!palette) return defaultAmbientPalette
    cache.set(src, palette)
    return palette
  } catch {
    return defaultAmbientPalette
  }
}

export function extractAmbientFromElement(img: HTMLImageElement | null): AmbientPalette | null {
  if (!img || !img.naturalWidth) return null
  try {
    return paletteFromImageElement(img)
  } catch {
    return null
  }
}

export function preloadAmbientPalettes(sources: string[]) {
  sources.forEach((src) => {
    if (src) void extractAmbientFromImage(src)
  })
}

export function paletteToCssVars(palette: AmbientPalette): Record<string, string> {
  return {
    '--home-glow-a': palette.primary,
    '--home-glow-b': palette.secondary,
    '--home-glow-c': palette.accent,
    '--home-glow-d': palette.cool,
  }
}
