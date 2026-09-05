import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'saintstream')
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

async function dl(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*' }, signal: AbortSignal.timeout(90000) })
  if (!r.ok) return null
  const b = Buffer.from(await r.arrayBuffer())
  if (b.length < 80000) return null
  if (!(b[0] === 0xff && b[1] === 0xd8) && !(b[0] === 0x89 && b[1] === 0x50)) return null
  return b
}

async function save(rel, buf) {
  const jpg = await sharp(buf).jpeg({ quality: 93, mozjpeg: true }).toBuffer()
  const out = path.join(root, rel)
  fs.writeFileSync(out, jpg)
  const m = await sharp(jpg).metadata()
  console.log('OK', rel, `${m.width}x${m.height}`, `${(jpg.length / 1024).toFixed(0)}KB`)
  return jpg
}

const jobs = {
  'posters/star-wars-tfa.jpg': [
    // Official theatrical collage (known TMDB poster path)
    'https://image.tmdb.org/t/p/original/wqnLdwVXoBjKWfQoCcQPdHrEQzX.jpg',
    'https://image.tmdb.org/t/p/original/fYfia2eC9zKzq4rWy2R1CiyKhmw.jpg',
    'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    'https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_FMjpg_UX1200_.jpg',
  ],
  'posters/ghosted.jpg': [
    'https://image.tmdb.org/t/p/original/liDNLeab146hnaD49NzYXzAG5Yq.jpg',
    'https://image.tmdb.org/t/p/original/5Fh2cNxkwfq0guYWiAaDyEyPo3.jpg',
    'https://m.media-amazon.com/images/M/MV5BNGMzYWUyYmMtZTdlNS00ZDRiLWI2YTItMzU5YzI3ZWMwYmM5XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg',
  ],
  'posters/enola-holmes-2.jpg': [
    'https://image.tmdb.org/t/p/original/qoPPhIJe3gSXgXsuMfCK5PLFaBm.jpg',
    'https://image.tmdb.org/t/p/original/rijpyNAdJb8LoQCVDcv5JCNTZTf.jpg',
  ],
  'posters/witcher.jpg': [
    'https://image.tmdb.org/t/p/original/7vjaCdMw15OEbVl7Rm2I5RRrVl5.jpg',
    'https://image.tmdb.org/t/p/original/jBJWaqoSCiARWtfV0GlqHrcd5Vg.jpg',
    'https://image.tmdb.org/t/p/original/8WUVHemHFH2RIxU8oL2k1nW6H8.jpg',
  ],
  'posters/ghost-doctor.jpg': [
    'https://image.tmdb.org/t/p/original/qJxzjUjGp2dJYL3sJpc09RtCAFB.jpg',
    'https://image.tmdb.org/t/p/original/8Q6QpAq8vqGqZ0xYxYxYxYxY.jpg',
  ],
  'posters/valhalla-murders.jpg': [
    'https://image.tmdb.org/t/p/original/2Xc5i7IiG8Fsi0e5K4sM1zJ5Q.jpg',
    'https://image.tmdb.org/t/p/original/oEJCEyxNkeGtSva9g4nKtm3MbqU.jpg',
  ],
}

for (const [rel, urls] of Object.entries(jobs)) {
  let best = null
  for (const u of urls) {
    process.stdout.write(`try ${rel} <- ${u.slice(0, 60)}... `)
    const b = await dl(u)
    if (!b) {
      console.log('skip')
      continue
    }
    console.log(`${(b.length / 1024).toFixed(0)}KB`)
    if (!best || b.length > best.length) best = b
  }
  if (!best) {
    console.log('FAIL', rel)
    continue
  }
  await save(rel, best)
}

// Build collage hero from theatrical poster: mid band with Rey/Finn/Kylo
const posterPath = path.join(root, 'posters', 'star-wars-tfa.jpg')
const poster = await sharp(posterPath).metadata()
const w = poster.width
const h = poster.height
const cropH = Math.round(w / (16 / 9))
// Bias toward middle of collage (characters), not logo-only top
const top = Math.max(0, Math.round((h - cropH) * 0.22))
const height = Math.min(cropH, h - top)
await sharp(posterPath)
  .extract({ left: 0, top, width: w, height })
  .resize(3840, 2160, { fit: 'cover' })
  .jpeg({ quality: 93, mozjpeg: true })
  .toFile(path.join(root, 'hero', 'star-wars-backdrop.jpg'))
console.log('hero collage rebuilt', w, h, '-> crop top', top, 'h', height)
