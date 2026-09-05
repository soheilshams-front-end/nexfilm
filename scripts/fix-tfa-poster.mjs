import sharp from 'sharp'
import fs from 'fs'

const UA = 'Mozilla/5.0'
async function dl(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!r.ok) return null
  const b = Buffer.from(await r.arrayBuffer())
  if (b.length < 50000) return null
  return b
}

const posters = [
  'wqnLdwVXoBjKibFRR5U3y0aDUhs.jpg',
  'k6EOrckWFuz7I4z4wiRwz8zsj4H.jpg',
  'gzFoqLYdFClzfXBsxUTjfFwMvXe.jpg',
  'nYnMEyVxhnNqnB2iAPtYr6oy3b1.jpg',
]

let best = null
let bestName = ''
for (const f of posters) {
  const url = `https://image.tmdb.org/t/p/original/${f}`
  const b = await dl(url)
  console.log(f, b ? `${(b.length / 1024).toFixed(0)}KB` : 'fail')
  if (b && (!best || b.length > best.length)) {
    best = b
    bestName = f
  }
}

if (!best) throw new Error('no poster')
const jpg = await sharp(best).jpeg({ quality: 93, mozjpeg: true }).toBuffer()
fs.writeFileSync('public/saintstream/posters/star-wars-tfa.jpg', jpg)
const m = await sharp(jpg).metadata()
console.log('saved poster', bestName, m.width, m.height)

const w = m.width
const h = m.height
const cropH = Math.round(w / (16 / 9))
const top = Math.max(0, Math.round((h - cropH) * 0.18))
await sharp(jpg)
  .extract({ left: 0, top, width: w, height: Math.min(cropH, h - top) })
  .resize(3840, 2160, { fit: 'cover' })
  .jpeg({ quality: 93, mozjpeg: true })
  .toFile('public/saintstream/hero/star-wars-backdrop.jpg')
console.log('hero done top', top)
