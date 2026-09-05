/**
 * Re-download official series posters from TMDB /images/posters
 * (not the main page og:image — that often returns cast headshots).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'saintstream')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** Known-good primary poster file hashes when scrape order is noisy */
const FORCE = {
  'posters/stranger-things.jpg': '49WQbTl4T5Dw0bPBBkBQafEbYjV.jpg',
  'posters/arcane.jpg': 'fqldf2e1vmix1bwsmEaJvZR4R7D.jpg',
  'posters/breaking-bad.jpg': 'ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  'posters/dark.jpg': 'apbrbWs8M9lyOpJYU9A8d2sEYm.jpg',
  'posters/the-boys.jpg': '2zmTngn1tXT5S6cVwWHwPsYiZYo.jpg',
  'posters/shogun.jpg': '7O4kdHkUNDwE8nPaZQdOpvJqEQm.jpg',
  'posters/wednesday.jpg': '9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
  'posters/witcher.jpg': '7vjaFXkbzPcKi3RZiyT17m2cbP0.jpg',
  'posters/squid-game.jpg': 'dDlEmuJyWbo9pzM7m2PZ7xZKO5K.jpg',
  'posters/the-last-of-us.jpg': 'uKvJV5Pi9Gg8GvBKqPU7ZxX0U8.jpg',
}

const targets = [
  { rel: 'posters/stranger-things.jpg', page: 'https://www.themoviedb.org/tv/66732/images/posters' },
  { rel: 'posters/arcane.jpg', page: 'https://www.themoviedb.org/tv/94605/images/posters' },
  { rel: 'posters/breaking-bad.jpg', page: 'https://www.themoviedb.org/tv/1396/images/posters' },
  { rel: 'posters/dark.jpg', page: 'https://www.themoviedb.org/tv/70523/images/posters' },
  { rel: 'posters/the-boys.jpg', page: 'https://www.themoviedb.org/tv/76479/images/posters' },
  { rel: 'posters/wednesday.jpg', page: 'https://www.themoviedb.org/tv/119051/images/posters' },
  { rel: 'posters/shogun.jpg', page: 'https://www.themoviedb.org/tv/126308/images/posters' },
  { rel: 'posters/witcher.jpg', page: 'https://www.themoviedb.org/tv/71912/images/posters' },
  { rel: 'posters/squid-game.jpg', page: 'https://www.themoviedb.org/tv/93405/images/posters' },
  { rel: 'posters/the-last-of-us.jpg', page: 'https://www.themoviedb.org/tv/100088/images/posters' },
  { rel: 'posters/weak-hero.jpg', page: 'https://www.themoviedb.org/tv/158056/images/posters' },
  { rel: 'posters/beef.jpg', page: 'https://www.themoviedb.org/tv/153312/images/posters' },
  { rel: 'posters/valhalla-murders.jpg', page: 'https://www.themoviedb.org/tv/97405/images/posters' },
  { rel: 'posters/insider.jpg', page: 'https://www.themoviedb.org/tv/135655/images/posters' },
  { rel: 'posters/race.jpg', page: 'https://www.themoviedb.org/tv/215472/images/posters' },
  { rel: 'posters/ghost-doctor.jpg', page: 'https://www.themoviedb.org/tv/152471/images/posters' },
  { rel: 'posters/extraordinary-attorney-woo.jpg', page: 'https://www.themoviedb.org/tv/197067/images/posters' },
]

async function posterFiles(page) {
  const res = await fetch(page, {
    headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
    signal: AbortSignal.timeout(30000),
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

async function savePortrait(rel, fileHash) {
  const buf = await download(`https://image.tmdb.org/t/p/original/${fileHash}`)
  if (!buf) return null
  const meta = await sharp(buf).metadata()
  if ((meta.width || 0) >= (meta.height || 0)) return null
  const jpg = await sharp(buf).jpeg({ quality: 93, mozjpeg: true }).toBuffer()
  const out = path.join(root, rel)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, jpg)
  return { f: fileHash, meta, size: jpg.length }
}

for (const t of targets) {
  process.stdout.write(`${t.rel} ... `)
  try {
    const forced = FORCE[t.rel]
    if (forced) {
      const ok = await savePortrait(t.rel, forced)
      if (ok) {
        console.log(`OK forced ${ok.f} ${ok.meta.width}x${ok.meta.height} ${(ok.size / 1024).toFixed(0)}KB`)
        continue
      }
      console.log('forced FAIL, scrape…')
    }
    const files = await posterFiles(t.page)
    if (!files.length) {
      console.log('no files')
      continue
    }
    let best = null
    for (const f of files.slice(0, 8)) {
      const buf = await download(`https://image.tmdb.org/t/p/original/${f}`)
      if (!buf) continue
      const meta = await sharp(buf).metadata()
      if ((meta.width || 0) >= (meta.height || 0)) continue
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
