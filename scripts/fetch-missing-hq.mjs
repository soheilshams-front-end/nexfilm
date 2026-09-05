/**
 * Fill missing new-catalog assets via TMDB page scrape (og:image + /images).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public', 'saintstream')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

const missing = {
  'posters/dark.jpg': { type: 'tv', id: 70523, kind: 'poster' },
  'posters/the-boys.jpg': { type: 'tv', id: 76479, kind: 'poster' },
  'posters/arcane.jpg': { type: 'tv', id: 94605, kind: 'poster' },
  'posters/guardians-3.jpg': { type: 'movie', id: 447365, kind: 'poster' },
  'hero/oppenheimer.jpg': { type: 'movie', id: 872585, kind: 'backdrop' },
  'hero/the-last-of-us.jpg': { type: 'tv', id: 100088, kind: 'backdrop' },
  'hero/squid-game.jpg': { type: 'tv', id: 93405, kind: 'backdrop' },
  'hero/interstellar.jpg': { type: 'movie', id: 157336, kind: 'backdrop' },
  'hero/inception.jpg': { type: 'movie', id: 27205, kind: 'backdrop' },
  'hero/the-batman.jpg': { type: 'movie', id: 414906, kind: 'backdrop' },
  'hero/top-gun-maverick.jpg': { type: 'movie', id: 361743, kind: 'backdrop' },
  'hero/avatar-way-of-water.jpg': { type: 'movie', id: 76600, kind: 'backdrop' },
  'hero/stranger-things.jpg': { type: 'tv', id: 66732, kind: 'backdrop' },
  'hero/the-boys.jpg': { type: 'tv', id: 76479, kind: 'backdrop' },
  'hero/shogun.jpg': { type: 'tv', id: 126308, kind: 'backdrop' },
  'hero/arcane.jpg': { type: 'tv', id: 94605, kind: 'backdrop' },
}

async function scrapeCandidates(type, id, kind) {
  const urls = [
    `https://www.themoviedb.org/${type}/${id}`,
    `https://www.themoviedb.org/${type}/${id}/images/${kind === 'backdrop' ? 'backdrops' : 'posters'}`,
  ]
  const files = new Set()
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en' },
      })
      if (!res.ok) continue
      const html = await res.text()
      for (const m of html.matchAll(/\/t\/p\/(?:w\d+|original)\/([a-zA-Z0-9_-]+\.(?:jpg|png|webp))/g)) {
        files.add(m[1])
      }
      const og = html.match(/property="og:image"\s+content="([^"]+)"/i)
      if (og) {
        const m = og[1].match(/\/([a-zA-Z0-9_-]+\.(?:jpg|png|webp))/i)
        if (m) files.add(m[1])
      }
    } catch {
      /* continue */
    }
  }
  return [...files]
}

async function tryUrl(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'image/*' },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 25000) return null
    return buf
  } catch {
    return null
  }
}

async function fetchOne(rel, meta) {
  const out = path.join(root, rel)
  if (fs.existsSync(out) && fs.statSync(out).size > 50000) {
    console.log(`SKIP ${rel}`)
    return true
  }
  const files = await scrapeCandidates(meta.type, meta.id, meta.kind)
  console.log(`SCRAPE ${rel} candidates=${files.length}`)
  let best = null
  let bestScore = 0
  const candidates = []
  for (const f of files.slice(0, 20)) {
    candidates.push(`https://image.tmdb.org/t/p/original/${f}`)
    candidates.push(`https://image.tmdb.org/t/p/w1280/${f}`)
  }
  for (const url of candidates) {
    const buf = await tryUrl(url)
    if (!buf) continue
    try {
      const m = await sharp(buf).metadata()
      const w = m.width || 0
      const h = m.height || 0
      const wantLand = meta.kind === 'backdrop'
      const isLand = w > h
      let score = w * h
      if (wantLand && isLand) score *= 3
      if (!wantLand && !isLand) score *= 3
      if (score > bestScore) {
        bestScore = score
        best = buf
      }
    } catch {
      /* skip */
    }
  }
  if (!best) {
    console.log(`FAIL ${rel}`)
    return false
  }
  const jpg = await sharp(best).jpeg({ quality: 92, mozjpeg: true }).toBuffer()
  const metaOut = await sharp(jpg).metadata()
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, jpg)
  console.log(`OK   ${rel}  ${metaOut.width}x${metaOut.height}  ${(jpg.length / 1024).toFixed(0)}KB`)
  return true
}

async function main() {
  for (const [rel, meta] of Object.entries(missing)) {
    await fetchOne(rel, meta)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
