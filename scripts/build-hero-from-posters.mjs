/**
 * Build missing hero landscapes from existing posters (16:9 crop).
 * No network — works when TMDB scrape is blocked.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public', 'saintstream')

const needed = [
  'interstellar',
  'inception',
  'the-batman',
  'top-gun-maverick',
  'avatar-way-of-water',
  'stranger-things',
  'the-boys',
  'shogun',
  'arcane',
  'squid-game',
  'the-last-of-us',
  'oppenheimer',
  'john-wick-4',
  'spider-verse',
  'parasite',
  'breaking-bad',
]

async function makeHero(id) {
  const out = path.join(root, 'hero', `${id}.jpg`)
  if (fs.existsSync(out) && fs.statSync(out).size > 80000) {
    console.log(`SKIP hero/${id}.jpg`)
    return
  }
  const poster = path.join(root, 'posters', `${id}.jpg`)
  if (!fs.existsSync(poster)) {
    console.log(`FAIL hero/${id}.jpg — no poster`)
    return
  }
  const m = await sharp(poster).metadata()
  const w = m.width || 1000
  const h = m.height || 1500
  // Upper-middle band → cinematic 16:9
  const cropH = Math.min(h, Math.round(w / (16 / 9)))
  const top = Math.max(0, Math.round((h - cropH) * 0.22))
  await sharp(poster)
    .extract({ left: 0, top, width: w, height: Math.min(cropH, h - top) })
    .resize(2560, 1440, { fit: 'cover' })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(out)
  const info = await sharp(out).metadata()
  console.log(`OK   hero/${id}.jpg  ${info.width}x${info.height}`)
}

async function main() {
  fs.mkdirSync(path.join(root, 'hero'), { recursive: true })
  for (const id of needed) await makeHero(id)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
