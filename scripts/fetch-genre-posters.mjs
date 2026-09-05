/**
 * Download official theatrical posters for genre showcase titles.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public', 'saintstream', 'posters')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

const posters = {
  'mad-max-fury-road.jpg': [
    'https://image.tmdb.org/t/p/original/hA2pea9bUd690VJ0AccE4CeonwN.jpg',
    'https://image.tmdb.org/t/p/w780/hA2pea9bUd690VJ0AccE4CeonwN.jpg',
    'https://image.tmdb.org/t/p/original/8tZYtuWezp8JbcsvHYPga2e3f4d.jpg',
  ],
  'spider-verse-into.jpg': [
    'https://image.tmdb.org/t/p/original/iiZZdoQOEFhkqXexS2K7X0HhB2E.jpg',
    'https://image.tmdb.org/t/p/w780/iiZZdoQOEFhkqXexS2K7X0HhB2E.jpg',
  ],
  'gladiator.jpg': [
    'https://image.tmdb.org/t/p/original/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    'https://image.tmdb.org/t/p/w780/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
  ],
  'the-conjuring.jpg': [
    'https://image.tmdb.org/t/p/original/wVYREutTvI2tmxr6ujrHT704wGF.jpg',
    'https://image.tmdb.org/t/p/w780/wVYREutTvI2tmxr6ujrHT704wGF.jpg',
  ],
  'the-godfather.jpg': [
    'https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  ],
  'saving-private-ryan.jpg': [
    'https://image.tmdb.org/t/p/original/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg',
    'https://image.tmdb.org/t/p/w780/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg',
  ],
  'home-alone.jpg': [
    'https://image.tmdb.org/t/p/original/onTSipX8R330IhjcwbK6dWKaMFv.jpg',
    'https://image.tmdb.org/t/p/w780/9wS3kMkTOyTv0zKViO6AqnYV3F5.jpg',
  ],
  'shawshank-redemption.jpg': [
    'https://image.tmdb.org/t/p/original/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    'https://image.tmdb.org/t/p/w780/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
  ],
  'blade-runner-2049.jpg': [
    'https://image.tmdb.org/t/p/original/aMpyrCizvSdc0EN9aw24P8ADw3.jpg',
    'https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWj3Bl/HmxP4Q5.jpg',
    'https://image.tmdb.org/t/p/w780/aMpyrCizvSdc0EN9aw24P8ADw3.jpg',
  ],
  'titanic.jpg': [
    'https://image.tmdb.org/t/p/original/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
    'https://image.tmdb.org/t/p/w780/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
  ],
  'the-matrix.jpg': [
    'https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    'https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
  ],
  'lotr-fellowship.jpg': [
    'https://image.tmdb.org/t/p/original/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    'https://image.tmdb.org/t/p/w780/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
  ],
  'the-hangover.jpg': [
    'https://image.tmdb.org/t/p/original/uluhlXjZ9LqrGozFpXHShSbWkAy.jpg',
    'https://image.tmdb.org/t/p/w780/kfX8CecuFsT6PvevLM8AoROsDhb.jpg',
  ],
  'wolf-of-wall-street.jpg': [
    'https://image.tmdb.org/t/p/original/pWHf4khOloNVfCxscsXFj3jj6gP.jpg',
    'https://image.tmdb.org/t/p/w780/pWHf4khOloNVfCxscsXFj3jj6gP.jpg',
  ],
  'raiders-lost-ark.jpg': [
    'https://image.tmdb.org/t/p/original/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
    'https://image.tmdb.org/t/p/w780/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
  ],
  'shutter-island.jpg': [
    'https://image.tmdb.org/t/p/original/kve20tXwUZpu4GUX8l6N4DDNlT6.jpg',
    'https://image.tmdb.org/t/p/w780/4GNaVxOhjBLVlC8WpGb8Z3zjXgN.jpg',
  ],
  'rocky.jpg': [
    'https://image.tmdb.org/t/p/original/iCzStOk4dxGTCBQfy7CwJ8dI1Ah.jpg',
    'https://image.tmdb.org/t/p/w780/i5DCXLxMRhczx1lUfO5nT9o8Fr7.jpg',
  ],
  'django-unchained.jpg': [
    'https://image.tmdb.org/t/p/original/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg',
    'https://image.tmdb.org/t/p/w780/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg',
  ],
  'se7en.jpg': [
    'https://image.tmdb.org/t/p/original/6yoghtyTpznpBik8EngEmJskVUO.jpg',
    'https://image.tmdb.org/t/p/w780/6yoghtyTpznpBik8EngEmJskVUO.jpg',
  ],
  'the-dark-knight.jpg': [
    'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
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
    return buf
  } catch {
    return null
  }
}

async function save(name, urls) {
  const out = path.join(root, name)
  if (fs.existsSync(out) && fs.statSync(out).size > 40000) {
    console.log(`SKIP ${name}`)
    return true
  }
  for (const url of urls) {
    const buf = await download(url)
    if (!buf) continue
    try {
      const jpg = await sharp(buf)
        .resize(800, 1200, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 90, mozjpeg: true })
        .toBuffer()
      const meta = await sharp(jpg).metadata()
      if ((meta.width || 0) < 200) continue
      fs.mkdirSync(root, { recursive: true })
      fs.writeFileSync(out, jpg)
      console.log(`OK   ${name}  ${meta.width}x${meta.height}  ${(jpg.length / 1024).toFixed(0)}KB`)
      return true
    } catch {
      continue
    }
  }
  console.log(`FAIL ${name}`)
  return false
}

async function main() {
  fs.mkdirSync(root, { recursive: true })
  for (const [name, urls] of Object.entries(posters)) {
    await save(name, urls)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
