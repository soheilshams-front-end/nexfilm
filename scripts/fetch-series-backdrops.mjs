/**
 * Re-download landscape hero/backdrops from TMDB /images/backdrops
 * (never use main page og:image — often cast headshots).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'saintstream')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** Prefer known cinematic backdrops when scrape order is noisy */
const FORCE = {
  'hero/arcane.jpg': 'qJxzj24GAcqgztFhesHwWbWl1Ms.jpg',
  'hero/stranger-things.jpg': '56v2KjBlU4XaOv9rVYEQypGREWX.jpg',
  'hero/breaking-bad.jpg': 'tsRy63Mu8uV8Zjsb6JiSY5WMqXZ.jpg',
  'hero/the-boys.jpg': 'mY7SeH4HFFxW1hiI6cWvxUNh9fI.jpg',
  'hero/shogun.jpg': '6Y6B0tY8xqM4dH8xZ5Qzqzqzq.jpg',
}

const targets = [
  { rel: 'hero/arcane.jpg', page: 'https://www.themoviedb.org/tv/94605/images/backdrops' },
  { rel: 'hero/stranger-things.jpg', page: 'https://www.themoviedb.org/tv/66732/images/backdrops' },
  { rel: 'hero/breaking-bad.jpg', page: 'https://www.themoviedb.org/tv/1396/images/backdrops' },
  { rel: 'hero/dark.jpg', page: 'https://www.themoviedb.org/tv/70523/images/backdrops' },
  { rel: 'hero/the-boys.jpg', page: 'https://www.themoviedb.org/tv/76479/images/backdrops' },
  { rel: 'hero/wednesday.jpg', page: 'https://www.themoviedb.org/tv/119051/images/backdrops' },
  { rel: 'hero/shogun.jpg', page: 'https://www.themoviedb.org/tv/126308/images/backdrops' },
  { rel: 'hero/witcher.jpg', page: 'https://www.themoviedb.org/tv/71912/images/backdrops' },
  { rel: 'hero/squid-game.jpg', page: 'https://www.themoviedb.org/tv/93405/images/backdrops' },
  { rel: 'hero/the-last-of-us.jpg', page: 'https://www.themoviedb.org/tv/100088/images/backdrops' },
]

async function files(page) {
  const res = await fetch(page, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const out = []
  const seen = new Set()
  for (const m of html.matchAll(/\/t\/p\/(?:w\d+|original)\/([a-zA-Z0-9]{20,}\.jpg)/g)) {
    if (!seen.has(m[1])) {
      seen.add(m[1])
      out.push(m[1])
    }
  }
  return out
}

async function download(hash) {
  const res = await fetch(`https://image.tmdb.org/t/p/original/${hash}`, {
    headers: { 'User-Agent': UA, Accept: 'image/*' },
    signal: AbortSignal.timeout(90000),
  })
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 50000 || !(buf[0] === 0xff && buf[1] === 0xd8)) return null
  return buf
}

async function saveLandscape(rel, hash) {
  const buf = await download(hash)
  if (!buf) return null
  const meta = await sharp(buf).metadata()
  if ((meta.width || 0) <= (meta.height || 0)) return null
  const jpg = await sharp(buf).resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 90, mozjpeg: true }).toBuffer()
  const out = path.join(root, rel)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, jpg)
  return { hash, meta, size: jpg.length }
}

for (const t of targets) {
  process.stdout.write(`${t.rel} ... `)
  try {
    const forced = FORCE[t.rel]
    if (forced) {
      const ok = await saveLandscape(t.rel, forced)
      if (ok) {
        console.log(`OK forced ${ok.hash} ${ok.meta.width}x${ok.meta.height}`)
        continue
      }
      console.log('forced FAIL, scrape…')
    }
    const list = await files(t.page)
    let best = null
    for (const f of list.slice(0, 10)) {
      const buf = await download(f)
      if (!buf) continue
      const meta = await sharp(buf).metadata()
      if ((meta.width || 0) <= (meta.height || 0)) continue
      if (!best || buf.length > best.buf.length) best = { buf, f, meta }
    }
    if (!best) {
      console.log('FAIL')
      continue
    }
    const jpg = await sharp(best.buf).resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 90, mozjpeg: true }).toBuffer()
    fs.mkdirSync(path.dirname(path.join(root, t.rel)), { recursive: true })
    fs.writeFileSync(path.join(root, t.rel), jpg)
    console.log(`OK ${best.f} ${best.meta.width}x${best.meta.height}`)
  } catch (e) {
    console.log('ERR', e.message)
  }
}
