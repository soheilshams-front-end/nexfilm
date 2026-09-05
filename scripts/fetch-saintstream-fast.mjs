/**
 * Fast HQ download — scrape og:image only, then fetch original/w1280.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public', 'saintstream')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** Remaining / fix targets after partial run */
const targets = [
  { rel: 'posters/pathaan.jpg', page: 'https://www.themoviedb.org/movie/762430' },
  { rel: 'posters/squid-game.jpg', page: 'https://www.themoviedb.org/tv/93405' },
  { rel: 'posters/wednesday.jpg', page: 'https://www.themoviedb.org/tv/119051' },
  { rel: 'posters/beef.jpg', page: 'https://www.themoviedb.org/tv/153312' },
  { rel: 'posters/witcher.jpg', page: 'https://www.themoviedb.org/tv/71912' },
  { rel: 'posters/valhalla-murders.jpg', page: 'https://www.themoviedb.org/tv/97405' },
  { rel: 'posters/ant-man-quantumania.jpg', page: 'https://www.themoviedb.org/movie/640146' },
  { rel: 'posters/john-wick-4.jpg', page: 'https://www.themoviedb.org/movie/603692' },
  { rel: 'posters/mechamato.jpg', page: 'https://www.themoviedb.org/movie/1033219-mechamato-movie' },
  { rel: 'posters/black-adam.jpg', page: 'https://www.themoviedb.org/movie/436270' },
  { rel: 'posters/ghost-doctor.jpg', page: 'https://www.themoviedb.org/tv/152471' },
  { rel: 'posters/insider.jpg', page: 'https://www.themoviedb.org/tv/135655' },
  { rel: 'posters/race.jpg', page: 'https://www.themoviedb.org/tv/215472-race' },
  { rel: 'posters/toxic.jpg', page: 'https://www.themoviedb.org/movie/731684' }, // Air Murder aka Toxic
  { rel: 'posters/fall.jpg', page: 'https://www.themoviedb.org/movie/985939-fall' },
  { rel: 'posters/ghosted.jpg', page: 'https://www.themoviedb.org/movie/891694' },
  { rel: 'posters/extraordinary-attorney-woo.jpg', page: 'https://www.themoviedb.org/tv/197067' },
  { rel: 'posters/kingdom-ashin.jpg', page: 'https://www.themoviedb.org/movie/807352' },
  // Re-fetch weak / square outliers
  { rel: 'posters/black-clover.jpg', page: 'https://www.themoviedb.org/movie/986070' },
  { rel: 'posters/enola-holmes-2.jpg', page: 'https://www.themoviedb.org/movie/829557' },
  { rel: 'posters/satans-slaves.jpg', page: 'https://www.themoviedb.org/movie/455042' },
]

async function ogFile(page) {
  const ctrl = AbortSignal.timeout(20000)
  const res = await fetch(page, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
    signal: ctrl,
  })
  if (!res.ok) throw new Error(`page ${res.status}`)
  const html = await res.text()
  const og = html.match(/property="og:image"\s+content="([^"]+)"/)
  if (!og) throw new Error('no og:image')
  const m = og[1].match(/\/([a-zA-Z0-9]+\.(?:jpg|png|webp))/)
  if (!m) throw new Error('no file in og')
  return m[1]
}

async function download(url) {
  const ctrl = AbortSignal.timeout(60000)
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/*' },
    signal: ctrl,
  })
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 40000) return null
  if (!(buf[0] === 0xff && buf[1] === 0xd8) && !(buf[0] === 0x89 && buf[1] === 0x50)) return null
  return buf
}

async function one(t) {
  const out = path.join(root, t.rel)
  process.stdout.write(`${t.rel} ... `)
  try {
    const file = await ogFile(t.page)
    let best = null
    for (const size of ['original', 'w1280', 'w780']) {
      const buf = await download(`https://image.tmdb.org/t/p/${size}/${file}`)
      if (!buf) continue
      if (!best || buf.length > best.length) best = buf
      if (size === 'original' && buf.length > 100000) break
    }
    if (!best) {
      console.log('FAIL')
      return false
    }
    const jpg = await sharp(best).jpeg({ quality: 93, mozjpeg: true }).toBuffer()
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, jpg)
    const meta = await sharp(jpg).metadata()
    console.log(`OK ${meta.width}x${meta.height} ${(jpg.length / 1024).toFixed(0)}KB`)
    return true
  } catch (e) {
    console.log(`ERR ${e.message}`)
    return false
  }
}

async function collageHero() {
  const poster = path.join(root, 'posters', 'star-wars-tfa.jpg')
  const out = path.join(root, 'hero', 'star-wars-backdrop.jpg')
  const m = await sharp(poster).metadata()
  const w = m.width
  const h = m.height
  const cropH = Math.round(w / (16 / 9))
  const top = Math.round(h * 0.06)
  const height = Math.min(cropH, h - top)
  await sharp(poster)
    .extract({ left: 0, top, width: w, height })
    .resize(3840, 2160, { fit: 'cover' })
    .jpeg({ quality: 93, mozjpeg: true })
    .toFile(out)
  console.log(`hero collage OK ${3840}x${2160}`)
}

for (const t of targets) await one(t)
await collageHero()
