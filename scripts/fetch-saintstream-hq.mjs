/**
 * Download highest-quality posters/backdrops matching Saintstream Figma home.
 * Uses TMDB original CDN + fallback Amazon/Wikimedia URLs; keeps largest valid JPEG.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public', 'saintstream')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** @type {Record<string, { type: 'movie'|'tv', id: number, kind: 'poster'|'backdrop', fallbacks?: string[] }>} */
const map = {
  'hero/star-wars-backdrop.jpg': {
    type: 'movie',
    id: 140607,
    kind: 'backdrop',
    fallbacks: [
      'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05vxl1.jpg',
      'https://image.tmdb.org/t/p/original/c5TqLqpgKhVOxZxktpWxFLbBtBp.jpg',
    ],
  },
  'hero/dune-part-two.jpg': { type: 'movie', id: 693134, kind: 'backdrop' },
  'hero/air-featured.jpg': { type: 'movie', id: 864692, kind: 'backdrop' },
  'posters/star-wars-tfa.jpg': { type: 'movie', id: 140607, kind: 'poster' },
  'posters/dune-part-two.jpg': { type: 'movie', id: 693134, kind: 'poster' },
  'posters/enola-holmes-2.jpg': { type: 'movie', id: 829557, kind: 'poster' },
  'posters/satans-slaves.jpg': {
    type: 'movie',
    id: 455042,
    kind: 'poster',
    fallbacks: [
      'https://image.tmdb.org/t/p/original/gUYZVKDWMlPsHLgUDTQ3g2gqGJk.jpg',
      'https://m.media-amazon.com/images/M/MV5BMjI5OTU3NjY4OF5BMl5BanBnXkFtZTgwNjE1Mjg4MzI@._V1_FMjpg_UX1000_.jpg',
    ],
  },
  'posters/the-flash.jpg': { type: 'movie', id: 298618, kind: 'poster' },
  'posters/weak-hero.jpg': { type: 'tv', id: 158056, kind: 'poster' },
  'posters/black-clover.jpg': { type: 'movie', id: 986070, kind: 'poster' },
  'posters/ghosted.jpg': { type: 'movie', id: 891294, kind: 'poster' },
  'posters/the-last-of-us.jpg': { type: 'tv', id: 100088, kind: 'poster' },
  'posters/sri-asih.jpg': { type: 'movie', id: 791042, kind: 'poster' },
  'posters/air.jpg': { type: 'movie', id: 864692, kind: 'poster' },
  'posters/gundala.jpg': { type: 'movie', id: 575774, kind: 'poster' },
  'posters/oppenheimer.jpg': { type: 'movie', id: 872585, kind: 'poster' },
  'posters/sonic-2.jpg': { type: 'movie', id: 646385, kind: 'poster' },
  'posters/pathaan.jpg': {
    type: 'movie',
    id: 762430,
    kind: 'poster',
    fallbacks: [
      'https://image.tmdb.org/t/p/original/i9XloXF7HtCsAYZ1XfURqoxysru.jpg',
      'https://m.media-amazon.com/images/M/MV5BYTYyM2JmZjEtM2I1ZC00ZWNjLTk3NzctZmVjZjRlYmU1ZWI0XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg',
    ],
  },
  'posters/squid-game.jpg': { type: 'tv', id: 93405, kind: 'poster' },
  'posters/wednesday.jpg': { type: 'tv', id: 119051, kind: 'poster' },
  'posters/beef.jpg': { type: 'tv', id: 153312, kind: 'poster' },
  'posters/witcher.jpg': { type: 'tv', id: 71912, kind: 'poster' },
  'posters/valhalla-murders.jpg': { type: 'tv', id: 97405, kind: 'poster' },
  'posters/ant-man-quantumania.jpg': { type: 'movie', id: 640146, kind: 'poster' },
  'posters/john-wick-4.jpg': { type: 'movie', id: 603692, kind: 'poster' },
  'posters/mechamato.jpg': {
    type: 'movie',
    id: 1033219,
    kind: 'poster',
    fallbacks: [
      'https://image.tmdb.org/t/p/original/wQnH6lE7FEyL5KouCkOy1gaiCG0.jpg',
    ],
  },
  'posters/black-adam.jpg': { type: 'movie', id: 436270, kind: 'poster' },
  'posters/extraordinary-attorney-woo.jpg': { type: 'tv', id: 197067, kind: 'poster' },
  'posters/kingdom-ashin.jpg': { type: 'movie', id: 807352, kind: 'poster' },
  'posters/ghost-doctor.jpg': { type: 'tv', id: 152471, kind: 'poster' },
  'posters/insider.jpg': {
    type: 'tv',
    id: 157236,
    kind: 'poster',
    fallbacks: ['https://image.tmdb.org/t/p/original/qJqQYzqXzqzqzq.jpg'],
  },
  'posters/toxic.jpg': {
    type: 'tv',
    id: 203734,
    kind: 'poster',
  },
  'posters/race.jpg': {
    type: 'tv',
    id: 211578,
    kind: 'poster',
  },
  'posters/fall.jpg': { type: 'movie', id: 985939, kind: 'poster' },
  'posters/wonder-woman.jpg': { type: 'movie', id: 297762, kind: 'poster' },

  // Hero backdrops for carousel (existing titles)
  'hero/oppenheimer.jpg': { type: 'movie', id: 872585, kind: 'backdrop' },
  'hero/john-wick-4.jpg': { type: 'movie', id: 603692, kind: 'backdrop' },
  'hero/the-last-of-us.jpg': { type: 'tv', id: 100088, kind: 'backdrop' },
  'hero/squid-game.jpg': { type: 'tv', id: 93405, kind: 'backdrop' },

  // New catalog — posters
  'posters/interstellar.jpg': { type: 'movie', id: 157336, kind: 'poster' },
  'posters/inception.jpg': { type: 'movie', id: 27205, kind: 'poster' },
  'posters/the-batman.jpg': { type: 'movie', id: 414906, kind: 'poster' },
  'posters/spider-verse.jpg': { type: 'movie', id: 569094, kind: 'poster' },
  'posters/top-gun-maverick.jpg': { type: 'movie', id: 361743, kind: 'poster' },
  'posters/everything-everywhere.jpg': { type: 'movie', id: 545611, kind: 'poster' },
  'posters/parasite.jpg': { type: 'movie', id: 496243, kind: 'poster' },
  'posters/avatar-way-of-water.jpg': { type: 'movie', id: 76600, kind: 'poster' },
  'posters/guardians-3.jpg': { type: 'movie', id: 447365, kind: 'poster' },
  'posters/stranger-things.jpg': { type: 'tv', id: 66732, kind: 'poster' },
  'posters/breaking-bad.jpg': { type: 'tv', id: 1396, kind: 'poster' },
  'posters/dark.jpg': { type: 'tv', id: 70523, kind: 'poster' },
  'posters/the-boys.jpg': { type: 'tv', id: 76479, kind: 'poster' },
  'posters/shogun.jpg': { type: 'tv', id: 126308, kind: 'poster' },
  'posters/arcane.jpg': { type: 'tv', id: 94605, kind: 'poster' },

  // New catalog — hero / wide backdrops
  'hero/interstellar.jpg': { type: 'movie', id: 157336, kind: 'backdrop' },
  'hero/inception.jpg': { type: 'movie', id: 27205, kind: 'backdrop' },
  'hero/the-batman.jpg': { type: 'movie', id: 414906, kind: 'backdrop' },
  'hero/spider-verse.jpg': { type: 'movie', id: 569094, kind: 'backdrop' },
  'hero/top-gun-maverick.jpg': { type: 'movie', id: 361743, kind: 'backdrop' },
  'hero/parasite.jpg': { type: 'movie', id: 496243, kind: 'backdrop' },
  'hero/avatar-way-of-water.jpg': { type: 'movie', id: 76600, kind: 'backdrop' },
  'hero/stranger-things.jpg': { type: 'tv', id: 66732, kind: 'backdrop' },
  'hero/breaking-bad.jpg': { type: 'tv', id: 1396, kind: 'backdrop' },
  'hero/the-boys.jpg': { type: 'tv', id: 76479, kind: 'backdrop' },
  'hero/shogun.jpg': { type: 'tv', id: 126308, kind: 'backdrop' },
  'hero/arcane.jpg': { type: 'tv', id: 94605, kind: 'backdrop' },
}

async function scrapeFiles(type, id) {
  const url = `https://www.themoviedb.org/${type}/${id}`
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
  })
  if (!res.ok) return []
  const html = await res.text()
  const files = new Set()
  for (const m of html.matchAll(/\/t\/p\/(?:w\d+|original)\/([a-zA-Z0-9]+\.(?:jpg|png|webp))/g)) {
    files.add(m[1])
  }
  const og = html.match(/property="og:image"\s+content="([^"]+)"/)
  if (og) {
    const m = og[1].match(/\/([a-zA-Z0-9]+\.(?:jpg|png|webp))(?:\?|$)/)
    if (m) files.add(m[1])
  }
  // media subdomain
  for (const m of html.matchAll(/media\.themoviedb\.org\/t\/p\/[^/"']+\/([a-zA-Z0-9]+\.(?:jpg|png|webp))/g)) {
    files.add(m[1])
  }
  return [...files]
}

async function tryDownload(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'image/*' },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    const jpeg = buf[0] === 0xff && buf[1] === 0xd8
    const png = buf[0] === 0x89 && buf[1] === 0x50
    if ((!jpeg && !png) || buf.length < 30000) return null
    return buf
  } catch {
    return null
  }
}

async function saveBestJpeg(buf, out) {
  const jpg = await sharp(buf).jpeg({ quality: 93, mozjpeg: true }).toBuffer()
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, jpg)
  const meta = await sharp(jpg).metadata()
  return { size: jpg.length, width: meta.width, height: meta.height }
}

async function fetchAsset(rel, meta) {
  const out = path.join(root, rel)
  const candidates = [...(meta.fallbacks || [])]
  const files = await scrapeFiles(meta.type, meta.id)
  // Prefer og/poster-like files; try original first
  for (const f of files.slice(0, 15)) {
    candidates.push(`https://image.tmdb.org/t/p/original/${f}`)
  }
  // Also try w1280 for backdrops if original fails
  for (const f of files.slice(0, 8)) {
    candidates.push(`https://image.tmdb.org/t/p/w1280/${f}`)
  }

  let best = null
  let bestScore = 0
  for (const url of candidates) {
    const buf = await tryDownload(url)
    if (!buf) continue
    let score = buf.length
    try {
      const m = await sharp(buf).metadata()
      const pixels = (m.width || 0) * (m.height || 0)
      const wantLandscape = meta.kind === 'backdrop'
      const isLandscape = (m.width || 0) > (m.height || 0)
      if (wantLandscape && isLandscape) score = pixels * 2 + buf.length
      if (!wantLandscape && !isLandscape) score = pixels * 2 + buf.length
      else score = pixels + buf.length * 0.1
    } catch {
      continue
    }
    if (score > bestScore) {
      bestScore = score
      best = buf
    }
  }

  if (!best) {
    console.log(`FAIL ${rel} (no valid image)`)
    return false
  }
  const info = await saveBestJpeg(best, out)
  console.log(`OK   ${rel}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`)
  return true
}

async function buildStarWarsCollageHero() {
  const poster = path.join(root, 'posters', 'star-wars-tfa.jpg')
  const out = path.join(root, 'hero', 'star-wars-backdrop.jpg')
  if (!fs.existsSync(poster)) {
    console.log('SKIP collage hero — missing poster')
    return
  }
  const m = await sharp(poster).metadata()
  const w = m.width
  const h = m.height
  // Crop upper-middle band of theatrical collage → 16:9 (characters + lightsaber, no UI)
  const cropH = Math.round(w / (16 / 9))
  const top = Math.round(h * 0.08)
  const left = 0
  const height = Math.min(cropH, h - top)
  await sharp(poster)
    .extract({ left, top, width: w, height })
    .resize(3840, 2160, { fit: 'cover' })
    .jpeg({ quality: 93, mozjpeg: true })
    .toFile(out)
  const info = await sharp(out).metadata()
  console.log(`OK   hero/star-wars-backdrop.jpg (collage crop) ${info.width}x${info.height}`)
}

async function main() {
  fs.mkdirSync(path.join(root, 'posters'), { recursive: true })
  fs.mkdirSync(path.join(root, 'hero'), { recursive: true })

  const onlyNew =
    process.argv.includes('--new') || process.env.FETCH_NEW_ONLY === '1'

  const entries = Object.entries(map).filter(([rel]) => {
    if (rel.startsWith('hero/star-wars')) return false
    if (!onlyNew) return true
    return (
      rel.includes('interstellar') ||
      rel.includes('inception') ||
      rel.includes('the-batman') ||
      rel.includes('spider-verse') ||
      rel.includes('top-gun-maverick') ||
      rel.includes('everything-everywhere') ||
      rel.includes('parasite') ||
      rel.includes('avatar-way-of-water') ||
      rel.includes('guardians-3') ||
      rel.includes('stranger-things') ||
      rel.includes('breaking-bad') ||
      rel.includes('dark') ||
      rel.includes('the-boys') ||
      rel.includes('shogun') ||
      rel.includes('arcane') ||
      rel === 'hero/oppenheimer.jpg' ||
      rel === 'hero/john-wick-4.jpg' ||
      rel === 'hero/the-last-of-us.jpg' ||
      rel === 'hero/squid-game.jpg'
    )
  })

  // Posters before heroes
  for (const [rel, meta] of entries) {
    if (rel.startsWith('hero/')) continue
    await fetchAsset(rel, meta)
  }
  for (const [rel, meta] of entries) {
    if (!rel.startsWith('hero/')) continue
    await fetchAsset(rel, meta)
  }

  if (!onlyNew) {
    await fetchAsset('posters/star-wars-tfa.jpg', map['posters/star-wars-tfa.jpg'])
    await buildStarWarsCollageHero()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
