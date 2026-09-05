import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'saintstream', 'posters')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

const jobs = [
  ['mad-max-fury-road.jpg', 'https://www.themoviedb.org/movie/76341'],
  ['spider-verse-into.jpg', 'https://www.themoviedb.org/movie/324857'],
  ['blade-runner-2049.jpg', 'https://www.themoviedb.org/movie/335984'],
]

const extras = {
  'mad-max-fury-road.jpg': [
    'https://upload.wikimedia.org/wikipedia/en/5/52/Mad_Max_Fury_Road.jpg',
    'https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg',
  ],
  'spider-verse-into.jpg': [
    'https://upload.wikimedia.org/wikipedia/en/b/b8/Spider-Man_Into_the_Spider-Verse_%282018_poster%29.png',
    'https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_FMjpg_UX1000_.jpg',
  ],
  'blade-runner-2049.jpg': [
    'https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png',
    'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_FMjpg_UX1000_.jpg',
  ],
}

async function tryUrl(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/*,text/html' },
    redirect: 'follow',
  })
  if (!res.ok) return null
  return Buffer.from(await res.arrayBuffer())
}

async function ogImage(page) {
  const res = await fetch(page, {
    headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en' },
  })
  if (!res.ok) {
    console.log('page', page, res.status)
    return null
  }
  const html = await res.text()
  const m = html.match(/property="og:image"\s+content="([^"]+)"/i)
  return m ? m[1] : null
}

async function saveJpeg(name, buf) {
  const jpg = await sharp(buf).resize(800, 1200, { fit: 'cover', position: 'attention' }).jpeg({ quality: 90, mozjpeg: true }).toBuffer()
  fs.writeFileSync(path.join(root, name), jpg)
  console.log('OK', name, jpg.length)
}

async function main() {
  for (const [name, page] of jobs) {
    const urls = [...(extras[name] || [])]
    try {
      const og = await ogImage(page)
      if (og) urls.unshift(og)
    } catch (e) {
      console.log('og fail', name, e.message)
    }
    let ok = false
    for (const url of urls) {
      try {
        const buf = await tryUrl(url)
        if (!buf || buf.length < 8000) {
          console.log('skip', url)
          continue
        }
        await saveJpeg(name, buf)
        ok = true
        break
      } catch (e) {
        console.log('err', url, e.message)
      }
    }
    if (!ok) console.log('FAIL', name)
  }
}

main()
