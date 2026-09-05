/**
 * Scrape TMDB public pages for poster/backdrop file paths, then download original size.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public', 'saintstream')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** TMDB numeric ids */
const map = {
  'hero/star-wars-backdrop.jpg': { type: 'movie', id: 140607, kind: 'backdrop' },
  'hero/dune-part-two.jpg': { type: 'movie', id: 693134, kind: 'backdrop' },
  'hero/air-featured.jpg': { type: 'movie', id: 864692, kind: 'backdrop' },
  'posters/star-wars-tfa.jpg': { type: 'movie', id: 140607, kind: 'poster' },
  'posters/dune-part-two.jpg': { type: 'movie', id: 693134, kind: 'poster' },
  'posters/enola-holmes-2.jpg': { type: 'movie', id: 829557, kind: 'poster' },
  'posters/satans-slaves.jpg': { type: 'movie', id: 455042, kind: 'poster' },
  'posters/the-flash.jpg': { type: 'movie', id: 298618, kind: 'poster' },
  'posters/ghosted.jpg': { type: 'movie', id: 891294, kind: 'poster' },
  'posters/weak-hero.jpg': { type: 'tv', id: 158056, kind: 'poster' },
  'posters/black-clover.jpg': { type: 'movie', id: 986070, kind: 'poster' },
  'posters/the-last-of-us.jpg': { type: 'tv', id: 100088, kind: 'poster' },
  'posters/sri-asih.jpg': { type: 'movie', id: 791042, kind: 'poster' },
  'posters/air.jpg': { type: 'movie', id: 864692, kind: 'poster' },
  'posters/oppenheimer.jpg': { type: 'movie', id: 872585, kind: 'poster' },
  'posters/gundala.jpg': { type: 'movie', id: 575774, kind: 'poster' },
  'posters/sonic-2.jpg': { type: 'movie', id: 646385, kind: 'poster' },
  'posters/pathaan.jpg': { type: 'movie', id: 762439, kind: 'poster' },
  'posters/squid-game.jpg': { type: 'tv', id: 93405, kind: 'poster' },
  'posters/wednesday.jpg': { type: 'tv', id: 119051, kind: 'poster' },
  'posters/beef.jpg': { type: 'tv', id: 153312, kind: 'poster' },
  'posters/extraordinary-attorney-woo.jpg': { type: 'tv', id: 197067, kind: 'poster' },
  'posters/kingdom-ashin.jpg': { type: 'movie', id: 807352, kind: 'poster' },
  'posters/ant-man-quantumania.jpg': { type: 'movie', id: 640146, kind: 'poster' },
  'posters/john-wick-4.jpg': { type: 'movie', id: 603692, kind: 'poster' },
  'posters/black-adam.jpg': { type: 'movie', id: 436270, kind: 'poster' },
  'posters/witcher.jpg': { type: 'tv', id: 71912, kind: 'poster' },
}

async function scrapePaths(type, id) {
  const url = `https://www.themoviedb.org/${type}/${id}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/html',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })
  if (!res.ok) throw new Error(`TMDB page ${res.status} ${url}`)
  const html = await res.text()
  const posters = [...html.matchAll(/https:\/\/media\.themoviedb\.org\/t\/p\/[^"'\s]+\/([a-zA-Z0-9]+)\.(jpg|jpeg|png|webp)/g)]
  const posters2 = [...html.matchAll(/\/t\/p\/(?:w\d+|original)\/([a-zA-Z0-9]+)\.(jpg|jpeg|png)/g)]
  const files = new Set()
  for (const m of [...posters, ...posters2]) files.add(m[1] + '.' + m[2].replace('jpeg', 'jpg'))
  // also og:image
  const og = html.match(/property="og:image"\s+content="([^"]+)"/)
  if (og) {
    const m = og[1].match(/\/([a-zA-Z0-9]+\.(?:jpg|png|webp))(?:\?|$)/)
    if (m) files.add(m[1])
  }
  return [...files]
}

async function download(url, out) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/*' },
    redirect: 'follow',
  })
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  const ok = buf.length > 20000 && ((buf[0] === 0xff && buf[1] === 0xd8) || (buf[0] === 0x89 && buf[1] === 0x50))
  if (!ok) return null
  let data = buf
  try {
    const sharp = (await import('sharp')).default
    data = await sharp(buf).jpeg({ quality: 93 }).toBuffer()
  } catch {}
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, data)
  return data.length
}

for (const [rel, meta] of Object.entries(map)) {
  const out = path.join(root, rel)
  process.stdout.write(`\n== ${rel} (${meta.type}/${meta.id}) `)
  try {
    const files = await scrapePaths(meta.type, meta.id)
    console.log('files', files.slice(0, 8).join(', '), files.length > 8 ? '...' : '')
    if (!files.length) {
      console.log('  no files scraped')
      continue
    }
    // Prefer first few as candidates; try original size
    let best = 0
    for (const f of files.slice(0, 12)) {
      const url = `https://image.tmdb.org/t/p/original/${f}`
      const n = await download(url, out + '.tmp')
      if (n && n > best) {
        best = n
        fs.renameSync(out + '.tmp', out)
        console.log('  OK', n, f)
      } else if (fs.existsSync(out + '.tmp')) fs.unlinkSync(out + '.tmp')
      // For backdrop, first large enough is enough; for poster too if > 100kb
      if (best > 150000) break
    }
    if (!best) console.log('  FAIL download')
  } catch (e) {
    console.log('  ERR', e.message)
  }
  // polite delay
  await new Promise((r) => setTimeout(r, 400))
}

console.log('\nDONE scrape')
