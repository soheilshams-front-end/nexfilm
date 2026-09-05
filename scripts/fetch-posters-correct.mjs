/**
 * Re-download posters using TMDB /images/posters page (not og:image).
 * og:image often points at wrong/random assets.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'saintstream')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

const targets = [
  { rel: 'posters/enola-holmes-2.jpg', page: 'https://www.themoviedb.org/movie/829557/images/posters' },
  { rel: 'posters/satans-slaves.jpg', page: 'https://www.themoviedb.org/movie/455042/images/posters' },
  { rel: 'posters/the-flash.jpg', page: 'https://www.themoviedb.org/movie/298618/images/posters' },
  { rel: 'posters/weak-hero.jpg', page: 'https://www.themoviedb.org/tv/158056/images/posters' },
  { rel: 'posters/black-clover.jpg', page: 'https://www.themoviedb.org/movie/986070/images/posters' },
  { rel: 'posters/oppenheimer.jpg', page: 'https://www.themoviedb.org/movie/872585/images/posters' },
  { rel: 'posters/dune-part-two.jpg', page: 'https://www.themoviedb.org/movie/693134/images/posters' },
  { rel: 'posters/pathaan.jpg', page: 'https://www.themoviedb.org/movie/762430/images/posters' },
  { rel: 'posters/ghosted.jpg', page: 'https://www.themoviedb.org/movie/891294/images/posters' },
  { rel: 'posters/witcher.jpg', page: 'https://www.themoviedb.org/tv/71912/images/posters' },
  { rel: 'posters/valhalla-murders.jpg', page: 'https://www.themoviedb.org/tv/97405/images/posters' },
  { rel: 'posters/ghost-doctor.jpg', page: 'https://www.themoviedb.org/tv/152471/images/posters' },
  { rel: 'posters/insider.jpg', page: 'https://www.themoviedb.org/tv/135655/images/posters' },
  { rel: 'posters/race.jpg', page: 'https://www.themoviedb.org/tv/215472/images/posters' },
  { rel: 'posters/toxic.jpg', page: 'https://www.themoviedb.org/movie/731684/images/posters' },
  { rel: 'posters/fall.jpg', page: 'https://www.themoviedb.org/movie/985939/images/posters' },
  { rel: 'posters/gundala.jpg', page: 'https://www.themoviedb.org/movie/575774/images/posters' },
  { rel: 'posters/air.jpg', page: 'https://www.themoviedb.org/movie/864692/images/posters' },
  { rel: 'posters/ant-man-quantumania.jpg', page: 'https://www.themoviedb.org/movie/640146/images/posters' },
  { rel: 'posters/john-wick-4.jpg', page: 'https://www.themoviedb.org/movie/603692/images/posters' },
  { rel: 'posters/mechamato.jpg', page: 'https://www.themoviedb.org/movie/1033219/images/posters' },
  { rel: 'posters/wednesday.jpg', page: 'https://www.themoviedb.org/tv/119051/images/posters' },
  { rel: 'posters/beef.jpg', page: 'https://www.themoviedb.org/tv/153312/images/posters' },
  { rel: 'posters/the-last-of-us.jpg', page: 'https://www.themoviedb.org/tv/100088/images/posters' },
  { rel: 'posters/sri-asih.jpg', page: 'https://www.themoviedb.org/movie/791042/images/posters' },
  { rel: 'posters/sonic-2.jpg', page: 'https://www.themoviedb.org/movie/646385/images/posters' },
  { rel: 'posters/black-adam.jpg', page: 'https://www.themoviedb.org/movie/436270/images/posters' },
  { rel: 'posters/squid-game.jpg', page: 'https://www.themoviedb.org/tv/93405/images/posters' },
  { rel: 'hero/dune-part-two.jpg', page: 'https://www.themoviedb.org/movie/693134/images/backdrops', kind: 'backdrop' },
  { rel: 'hero/air-featured.jpg', page: 'https://www.themoviedb.org/movie/864692/images/backdrops', kind: 'backdrop' },
]

async function posterFiles(page) {
  const res = await fetch(page, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
    signal: AbortSignal.timeout(25000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const files = []
  const seen = new Set()
  for (const m of html.matchAll(/\/t\/p\/(?:w\d+|original)\/([a-zA-Z0-9]{20,}\.jpg)/g)) {
    if (!seen.has(m[1])) {
      seen.add(m[1])
      files.push(m[1])
    }
  }
  return files
}

async function download(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/*' },
    signal: AbortSignal.timeout(90000),
  })
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 40000) return null
  if (!(buf[0] === 0xff && buf[1] === 0xd8)) return null
  return buf
}

for (const t of targets) {
  process.stdout.write(`${t.rel} ... `)
  try {
    const files = await posterFiles(t.page)
    if (!files.length) {
      console.log('no files')
      continue
    }
    // Prefer first few (primary listings), pick largest successful original
    let best = null
    for (const f of files.slice(0, 6)) {
      const buf = await download(`https://image.tmdb.org/t/p/original/${f}`)
      if (!buf) continue
      const meta = await sharp(buf).metadata()
      const landscape = (meta.width || 0) > (meta.height || 0)
      if (t.kind === 'backdrop' && !landscape) continue
      if (t.kind !== 'backdrop' && landscape) continue
      if (!best || buf.length > best.buf.length) best = { buf, f, meta }
    }
    if (!best) {
      console.log('FAIL files=', files.slice(0, 3).join(','))
      continue
    }
    const jpg = await sharp(best.buf).jpeg({ quality: 93, mozjpeg: true }).toBuffer()
    fs.mkdirSync(path.dirname(path.join(root, t.rel)), { recursive: true })
    fs.writeFileSync(path.join(root, t.rel), jpg)
    console.log(`OK ${best.f} ${best.meta.width}x${best.meta.height} ${(jpg.length / 1024).toFixed(0)}KB`)
  } catch (e) {
    console.log('ERR', e.message)
  }
}
