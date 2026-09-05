/**
 * Download correct aspect: posters portrait, hero backdrops landscape from TMDB image galleries.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public', 'saintstream')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

const jobs = [
  { rel: 'hero/star-wars-backdrop.jpg', type: 'movie', id: 140607, want: 'backdrop' },
  { rel: 'hero/dune-part-two.jpg', type: 'movie', id: 693134, want: 'backdrop' },
  { rel: 'hero/air-featured.jpg', type: 'movie', id: 864692, want: 'backdrop' },
  { rel: 'posters/star-wars-tfa.jpg', type: 'movie', id: 140607, want: 'poster' },
  { rel: 'posters/dune-part-two.jpg', type: 'movie', id: 693134, want: 'poster' },
  { rel: 'posters/enola-holmes-2.jpg', type: 'movie', id: 829557, want: 'poster' },
  { rel: 'posters/ghosted.jpg', type: 'movie', id: 890656, want: 'poster' }, // try alternate
  { rel: 'posters/pathaan.jpg', type: 'movie', id: 762439, want: 'poster' },
  { rel: 'posters/satans-slaves.jpg', type: 'movie', id: 455042, want: 'poster' },
]

async function listImageFiles(type, id, kind) {
  // kind: posters | backdrops
  const url = `https://www.themoviedb.org/${type}/${id}/images/${kind === 'poster' ? 'posters' : 'backdrops'}`
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html' } })
  if (!res.ok) {
    // fallback main page
    const res2 = await fetch(`https://www.themoviedb.org/${type}/${id}`, {
      headers: { 'User-Agent': UA },
    })
    if (!res2.ok) throw new Error(`${res.status}/${res2.status}`)
    const html = await res2.text()
    return extractFiles(html)
  }
  return extractFiles(await res.text())
}

function extractFiles(html) {
  const files = []
  const re = /(?:media\.themoviedb\.org|image\.tmdb\.org)\/t\/p\/[^/"'\s]+\/([a-zA-Z0-9]+\.(?:jpg|png|webp))/g
  let m
  while ((m = re.exec(html))) files.push(m[1])
  // data-src patterns
  const re2 = /\/t\/p\/(?:w\d+|original)\/([a-zA-Z0-9]+\.(?:jpg|png))/g
  while ((m = re2.exec(html))) files.push(m[1])
  return [...new Set(files)]
}

async function fetchBuf(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*' }, redirect: 'follow' })
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 30000) return null
  if (!(buf[0] === 0xff || buf[0] === 0x89)) return null
  return buf
}

async function pickBest(files, want) {
  let best = null
  for (const f of files.slice(0, 20)) {
    const url = `https://image.tmdb.org/t/p/original/${f}`
    const buf = await fetchBuf(url)
    if (!buf) continue
    const meta = await sharp(buf).metadata()
    const landscape = meta.width > meta.height
    const portrait = meta.height > meta.width
    if (want === 'backdrop' && !landscape) continue
    if (want === 'poster' && !portrait) continue
    const score = buf.length
    if (!best || score > best.score) {
      best = { buf, meta, f, score }
      console.log('  cand', f, meta.width + 'x' + meta.height, buf.length)
    }
    if (best.score > 800000) break
  }
  return best
}

// Also try Ghosted search
async function findGhostedId() {
  const url = 'https://www.themoviedb.org/search/movie?query=Ghosted%20Chris%20Evans'
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  const html = await res.text()
  const m = html.match(/\/movie\/(\d+)[^"]*Ghosted/i) || html.match(/href="\/movie\/(\d+)"/)
  return m ? m[1] : null
}

const gid = await findGhostedId()
console.log('Ghosted id?', gid)
if (gid) {
  const j = jobs.find((x) => x.rel.includes('ghosted'))
  if (j) j.id = Number(gid)
}

for (const job of jobs) {
  console.log('\n==', job.rel, job.type + '/' + job.id, job.want)
  try {
    const files = await listImageFiles(job.type, job.id, job.want)
    console.log('  files', files.length)
    const best = await pickBest(files, job.want)
    if (!best) {
      console.log('  FAIL')
      continue
    }
    const out = path.join(root, job.rel)
    const jpeg = await sharp(best.buf).jpeg({ quality: 92 }).toBuffer()
    fs.writeFileSync(out, jpeg)
    // also write png-less hero path without UI
    if (job.rel.includes('star-wars-backdrop')) {
      fs.writeFileSync(path.join(root, 'hero', 'star-wars-backdrop.png'), jpeg)
    }
    console.log('  SAVED', best.meta.width + 'x' + best.meta.height, jpeg.length)
  } catch (e) {
    console.log('  ERR', e.message)
  }
  await new Promise((r) => setTimeout(r, 350))
}

console.log('\nDONE aspect fix')
