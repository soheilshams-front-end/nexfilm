/**
 * Fast HQ fetch for new Nex Film catalog — direct TMDB original URLs.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public', 'saintstream')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** Known high-quality TMDB original filenames */
const assets = {
  // remaining posters
  'posters/guardians-3.jpg': [
    'https://image.tmdb.org/t/p/original/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
    'https://image.tmdb.org/t/p/original/5YFUcCJYYpB8JzE3YfXm0H8vG0.jpg',
  ],
  'posters/stranger-things.jpg': [
    'https://image.tmdb.org/t/p/original/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
  ],
  'posters/breaking-bad.jpg': [
    'https://image.tmdb.org/t/p/original/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  ],
  'posters/dark.jpg': [
    'https://image.tmdb.org/t/p/original/5LoHuHWA4H8oPJ8iZItBfGkSYlr.jpg',
  ],
  'posters/the-boys.jpg': [
    'https://image.tmdb.org/t/p/original/2zmTngn1tYcURqHqmKl0aaBv0KD.jpg',
  ],
  'posters/shogun.jpg': [
    'https://image.tmdb.org/t/p/original/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
  ],
  'posters/arcane.jpg': [
    'https://image.tmdb.org/t/p/original/fqldfD9owaZ1cpYBQjsgLJ4T0uD.jpg',
  ],

  // hero / landscape backdrops
  'hero/oppenheimer.jpg': [
    'https://image.tmdb.org/t/p/original/rLb2cwF3PazuxowEGqtasnyDkDh.jpg',
  ],
  'hero/john-wick-4.jpg': [
    'https://image.tmdb.org/t/p/original/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg',
  ],
  'hero/the-last-of-us.jpg': [
    'https://image.tmdb.org/t/p/original/uDgy6hyPd82unNwFOdtBPb3yRba.jpg',
  ],
  'hero/squid-game.jpg': [
    'https://image.tmdb.org/t/p/original/2EewdrjdhGllkR42zk4Zvjn0TsH.jpg',
  ],
  'hero/interstellar.jpg': [
    'https://image.tmdb.org/t/p/original/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg',
  ],
  'hero/inception.jpg': [
    'https://image.tmdb.org/t/p/original/s3TbrmD968F7aolS6sAE0sI0fEz.jpg',
  ],
  'hero/the-batman.jpg': [
    'https://image.tmdb.org/t/p/original/b0PlkVZRNqSmNCJLIqYHXusQ2A.jpg',
  ],
  'hero/spider-verse.jpg': [
    'https://image.tmdb.org/t/p/original/14F2g9vpkR9CW6t1vC0z9y8vV1.jpg',
    'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
  ],
  'hero/top-gun-maverick.jpg': [
    'https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8G4SG.jpg',
  ],
  'hero/parasite.jpg': [
    'https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
  ],
  'hero/avatar-way-of-water.jpg': [
    'https://image.tmdb.org/t/p/original/s16H6R8KTWNUHxuxOQKo5YaCA9.jpg',
  ],
  'hero/stranger-things.jpg': [
    'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypGROQ.jpg',
  ],
  'hero/breaking-bad.jpg': [
    'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
  ],
  'hero/the-boys.jpg': [
    'https://image.tmdb.org/t/p/original/mY7SeH4HFFxH1cyX9GyRlHYhlkB.jpg',
  ],
  'hero/shogun.jpg': [
    'https://image.tmdb.org/t/p/original/6Lz9VsjZ0BAb5sHxy0JQ5Q9Y5Y.jpg',
    'https://image.tmdb.org/t/p/original/6Lz9VsjZ0BAb5sHxy0JQ5Q9Y5Y.jpg',
  ],
  'hero/arcane.jpg': [
    'https://image.tmdb.org/t/p/original/q8eejQcg1bOdRmGBPgTYbF5OZt.jpg',
  ],
}

async function download(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'image/*' },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 20000) return null
    const jpeg = buf[0] === 0xff && buf[1] === 0xd8
    const png = buf[0] === 0x89 && buf[1] === 0x50
    if (!jpeg && !png) return null
    return buf
  } catch {
    return null
  }
}

async function save(rel, urls) {
  const out = path.join(root, rel)
  if (fs.existsSync(out) && fs.statSync(out).size > 40000) {
    console.log(`SKIP ${rel}`)
    return true
  }
  for (const url of urls) {
    const buf = await download(url)
    if (!buf) continue
    try {
      const jpg = await sharp(buf).jpeg({ quality: 92, mozjpeg: true }).toBuffer()
      const meta = await sharp(jpg).metadata()
      fs.mkdirSync(path.dirname(out), { recursive: true })
      fs.writeFileSync(out, jpg)
      console.log(`OK   ${rel}  ${meta.width}x${meta.height}  ${(jpg.length / 1024).toFixed(0)}KB`)
      return true
    } catch {
      continue
    }
  }
  console.log(`FAIL ${rel}`)
  return false
}

async function main() {
  for (const [rel, urls] of Object.entries(assets)) {
    await save(rel, urls)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
