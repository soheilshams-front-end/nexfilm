/**
 * Download HQ movie/TV art matching Saintstream Figma home titles.
 * Tries multiple public CDN candidates; keeps the largest valid JPEG/PNG.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public', 'saintstream')
const postersDir = path.join(root, 'posters')
const heroDir = path.join(root, 'hero')
fs.mkdirSync(postersDir, { recursive: true })
fs.mkdirSync(heroDir, { recursive: true })

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** @type {Record<string, string[]>} */
const assets = {
  // Hero backdrops (wide)
  'hero/star-wars-backdrop.jpg': [
    'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    'https://image.tmdb.org/t/p/original/c5TqLqpgKhVOxZxktpWxFLbBtBp.jpg',
    'https://image.tmdb.org/t/p/original/4iJfYYoQzZcONB9hNzg0J0wWyPH.jpg',
    'https://upload.wikimedia.org/wikipedia/en/a/a2/Star_Wars_The_Force_Awakens_Theatrical_Poster.jpg',
    'https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_FMjpg_UX1280_.jpg',
  ],
  'hero/dune-part-two.jpg': [
    'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05vxl1.jpg',
    'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc1LThmOTItZGE3NjhHO4NkJmU4XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1280_.jpg',
  ],
  'hero/air-featured.jpg': [
    'https://image.tmdb.org/t/p/original/7RyHsO4dJb2u0kQ4V5RhS6s8.jpg',
    'https://image.tmdb.org/t/p/original/2E1xvsG9Vs0bZQ6kY5.jpg',
    'https://m.media-amazon.com/images/M/MV5BYmNlOTNlYjctNjEyZC00YjYzLWJhZDktNTlkZWU5YTBkYjE0XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1280_.jpg',
    'https://image.tmdb.org/t/p/original/bQXAqRx2RCic2nhT4mS9q1l8.jpg',
  ],

  // Posters (portrait)
  'posters/star-wars-tfa.jpg': [
    'https://image.tmdb.org/t/p/original/wqnLdwVXoBjKWfQoCcQPdHrEQzX.jpg',
    'https://image.tmdb.org/t/p/original/fYfia2eC9zKzq4rWy2R1CiyKhmw.jpg',
    'https://upload.wikimedia.org/wikipedia/en/a/a2/Star_Wars_The_Force_Awakens_Theatrical_Poster.jpg',
    'https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_FMjpg_UX1000_.jpg',
  ],
  'posters/dune-part-two.jpg': [
    'https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc1LThmOTItZGE3NjhHO4NkJmU4XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg',
  ],
  'posters/enola-holmes-2.jpg': [
    'https://image.tmdb.org/t/p/original/qoPPhIJe3gSXgXsuMfCK5PLFaBm.jpg',
    'https://image.tmdb.org/t/p/original/rijpyNAdJb8LoQCVDcv5JCNTZTf.jpg',
    'https://m.media-amazon.com/images/M/MV5BNjg5NmI2NDktOWYwYS00YzE0LTllYjYtYzY5Y2Y5Y2Y5XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/d/dc/Enola_Holmes_2_poster.jpg',
  ],
  'posters/satans-slaves.jpg': [
    'https://image.tmdb.org/t/p/original/gUYZVKDWMlPsHLgUDTQ3g2gqGJk.jpg',
    'https://image.tmdb.org/t/p/original/9MQFk1Y5bI5fS7PHnGyFAXh5PPX.jpg',
    'https://m.media-amazon.com/images/M/MV5BMjI5OTU3NjY4OF5BMl5BanBnXkFtZTgwNjE1Mjg4MzI@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/8/8a/Pengabdi_Setan_poster.jpg',
  ],
  'posters/the-flash.jpg': [
    'https://image.tmdb.org/t/p/original/rktDFPBFMmJKudCFSqDJ6YxYVhD.jpg',
    'https://image.tmdb.org/t/p/original/fim5ONnWKwFwD7i9u6H9nJ7x.jpg',
    'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/e/ed/The_Flash_%28film%29_poster.jpg',
  ],
  'posters/ghosted.jpg': [
    'https://image.tmdb.org/t/p/original/liDNLeab146hnaD49NzYXzAG5Yq.jpg',
    'https://m.media-amazon.com/images/M/MV5BNGMzYWUyYmMtZTdlNS00ZDRiLWI2YTItMzU5YzI3ZWMwYmM5XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/a/a8/Ghosted_film_poster.png',
  ],
  'posters/weak-hero.jpg': [
    'https://image.tmdb.org/t/p/original/oEJCEyxNkeGtSva9g4nKtm3MbqU.jpg',
    'https://image.tmdb.org/t/p/original/5iGVw8Q5q7.jpg',
    'https://m.media-amazon.com/images/M/MV5BMzZmN2E5YzYtYzE4Yy00YjU0LTg2LTgtMzE5YjE2YjY5XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_FMjpg_UX1000_.jpg',
  ],
  'posters/black-clover.jpg': [
    'https://image.tmdb.org/t/p/original/h58SVth540sZ5eqOA1RW7y0jUlF.jpg',
    'https://image.tmdb.org/t/p/original/iVxtdk3icv0DSOmopGOsdEhp74n.jpg',
    'https://m.media-amazon.com/images/M/MV5BYzE1YzQzYzYtYzE1YzQzYzYtYzE1YzQzYzYtYzE1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/7/7a/Black_Clover_Sword_of_the_Wizard_King_poster.jpg',
  ],
  'posters/the-last-of-us.jpg': [
    'https://image.tmdb.org/t/p/original/uKvVjHNqB7VmFN0hnY9cY6r7u2g.jpg',
    'https://image.tmdb.org/t/p/original/dmo6QZ8p7s6Y5.jpg',
    'https://m.media-amazon.com/images/M/MV5BZGUzYTI3M2EtZmM0Yy00NGUyLWI4NDEtN2Q4OGEyMzJjZGFkXkEyXkFqcGdeQXVyNTU4MzU5MzM@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/0/05/The_Last_of_Us_TV_series_logo.png',
    'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/01/the-last-of-us-hbo-poster.jpg',
  ],
  'posters/sri-asih.jpg': [
    'https://image.tmdb.org/t/p/original/4YxN3x7hY3rYqGqJ9R0hYvFqYx.jpg',
    'https://m.media-amazon.com/images/M/MV5BYjE5YzE5YzYtYzE5YzYtYzE5YzYtYzE5YzYtYzE5XkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/5/5e/Sri_Asih_poster.jpg',
  ],
  'posters/air.jpg': [
    'https://image.tmdb.org/t/p/original/76rm6R0zMWFLKSs7r3nTB0mQ6kM.jpg',
    'https://m.media-amazon.com/images/M/MV5BY2E5YzYtYzE0LTg2LTgtMzE5YjE2YjY5XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/d/d4/Air_%282023_film%29.jpg',
  ],
  'posters/oppenheimer.jpg': [
    'https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg',
  ],
  'posters/gundala.jpg': [
    'https://image.tmdb.org/t/p/original/y0oX0s8Z5qYqYq.jpg',
    'https://image.tmdb.org/t/p/original/1V5m7qVqJ5zqYqYqYqYqYqYqYq.jpg',
    'https://m.media-amazon.com/images/M/MV5BNWU5YzE5YzYtYzE5YzYtYzE5YzYtYzE5YzYtYzE5XkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/0/0a/Gundala_%28film%29.jpg',
  ],
  'posters/sonic-2.jpg': [
    'https://image.tmdb.org/t/p/original/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg',
    'https://m.media-amazon.com/images/M/MV5BODBhNmFhY2ItNGEzNy00YWU2LWI4MTYtOWYyMjAyZmMwYTQwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/3/3e/Sonic_the_Hedgehog_2_film_poster.jpg',
  ],
  'posters/pathaan.jpg': [
    'https://image.tmdb.org/t/p/original/k2v9lqnlcqXpzNpkAS5YkCeTRXT.jpg',
    'https://m.media-amazon.com/images/M/MV5BNDdkNTY1MDQtY2I5NS00NzU5LTkzOTctMDhiYjY4YzYxYzE5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg',
  ],
  'posters/squid-game.jpg': [
    'https://image.tmdb.org/t/p/original/d0wb31cpkq2ibAfuxJQI4QFwB0.jpg',
    'https://image.tmdb.org/t/p/original/uBP1vx0BiTGVkRYKJZAcXlthxXu.jpg',
    'https://m.media-amazon.com/images/M/MV5BYWE3MDVkN2EtNjQ5MS00ZDQ4LTliNzYtMjc2YWMzMDEwMTA3XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/d/dd/Squid_Game.jpg',
  ],
  'posters/wednesday.jpg': [
    'https://image.tmdb.org/t/p/original/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    'https://m.media-amazon.com/images/M/MV5BMWE4OTAxYTQtYzQxZi00YzA4LTgwYTgtYzAxYzE5YzYtYzE5XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Wednesday_%28TV_series%29_title_card.png/800px-Wednesday_%28TV_series%29_title_card.png',
    'https://static.wikia.nocookie.net/wednesday/images/3/3e/Wednesday_Netflix_Poster.jpeg/revision/latest?cb=20221117000000',
  ],
  'posters/beef.jpg': [
    'https://image.tmdb.org/t/p/original/5iGVw8Q5q7.jpg',
    'https://image.tmdb.org/t/p/original/qZ1K0z8ZQ5.jpg',
    'https://m.media-amazon.com/images/M/MV5BMzZmN2E5YzYtYzE4Yy00YjU0LTg2LTgtMzE5YjE2YjY5XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/1/1e/Beef_TV_series_poster.png',
  ],
  'posters/extraordinary-attorney-woo.jpg': [
    'https://image.tmdb.org/t/p/original/3xqNyqFq.jpg',
    'https://image.tmdb.org/t/p/original/hY8R0n9s8k8k8.jpg',
    'https://m.media-amazon.com/images/M/MV5BYWE3MDVkN2EtNjQ5MS00ZDQ4LTliNzYtMjc2YWMzMDEwMTA3XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/8/8a/Extraordinary_Attorney_Woo.jpg',
  ],
  'posters/kingdom-ashin.jpg': [
    'https://image.tmdb.org/t/p/original/2r7y.jpg',
    'https://m.media-amazon.com/images/M/MV5BYzE1YzQzYzYtYzE1YzQzYzYtYzE1YzQzYzYtYzE1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/3/3a/Kingdom_Ashin_of_the_North.jpg',
  ],
  'posters/ant-man-quantumania.jpg': [
    'https://image.tmdb.org/t/p/original/qnqGbB22YJTDQOGTZFSKsjJw0.jpg',
    'https://image.tmdb.org/t/p/original/ngl2FKBlU4fhbdsrtdOm8lZja.jpg',
    'https://m.media-amazon.com/images/M/MV5BODZhNzlmOGItMWUyNy00OGQ0LTg4YzgtNzU4YzE5YzYtYzE5XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/b/ba/Ant-Man_and_the_Wasp_Quantumania_poster.jpg',
  ],
  'posters/john-wick-4.jpg': [
    'https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VaZ5WAqWa.jpg',
    'https://image.tmdb.org/t/p/original/tAxI6tgd8xcMjkXQDl5xVvK.jpg',
    'https://m.media-amazon.com/images/M/MV5BMDExZGMyOTMtMDgyYi00NGIwLWJhMTEtOTdkZGFjNmZiMTEwXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/d/d0/John_Wick_-_Chapter_4_poster.jpg',
  ],
  'posters/black-adam.jpg': [
    'https://image.tmdb.org/t/p/original/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg',
    'https://m.media-amazon.com/images/M/MV5BYzZkOGUwMzMtMTgyNS00YjFlLTg5ZmYtYzJhZWUzYjE3ODA2XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/a/a9/Black_Adam_%28film%29_poster.jpg',
  ],
  'posters/witcher.jpg': [
    'https://image.tmdb.org/t/p/original/7vjaCdMw15OEbvlgltzdaPX.jpg',
    'https://m.media-amazon.com/images/M/MV5BN2FiOWU4YzYtMzZiOS00MzcyLWE1YjItNjQ5YzE0YzYtYzE5XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1000_.jpg',
    'https://upload.wikimedia.org/wikipedia/en/2/23/The_Witcher_Title_Card.png',
  ],
}

async function downloadBest(relPath, urls) {
  const out = path.join(root, relPath)
  let best = null
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'image/*,*/*' },
        redirect: 'follow',
      })
      if (!res.ok) {
        console.log('  skip', res.status, url.slice(0, 70))
        continue
      }
      const buf = Buffer.from(await res.arrayBuffer())
      const ct = (res.headers.get('content-type') || '').toLowerCase()
      const isJpeg = buf[0] === 0xff && buf[1] === 0xd8
      const isPng = buf[0] === 0x89 && buf[1] === 0x50
      if ((!isJpeg && !isPng) || buf.length < 8000) {
        console.log('  bad', buf.length, ct, url.slice(0, 70))
        continue
      }
      if (!best || buf.length > best.length) {
        best = { buf, url, isPng }
        console.log('  cand', buf.length, url.slice(0, 80))
      }
    } catch (e) {
      console.log('  err', e.message, url.slice(0, 60))
    }
  }
  if (!best) {
    console.log('FAIL', relPath)
    return false
  }
  // Always store as jpg path; convert png via sharp if available
  let data = best.buf
  if (best.isPng || out.endsWith('.jpg')) {
    try {
      const sharp = (await import('sharp')).default
      data = await sharp(best.buf).jpeg({ quality: 92 }).toBuffer()
    } catch {
      if (best.isPng) {
        const pngOut = out.replace(/\.jpg$/i, '.png')
        fs.writeFileSync(pngOut, best.buf)
        console.log('OK-PNG', relPath, '->', pngOut, best.buf.length)
        return true
      }
    }
  }
  fs.writeFileSync(out, data)
  console.log('OK', relPath, data.length, 'from', best.url.slice(0, 70))
  return true
}

// Wikipedia API helper for missing posters
async function wikiThumb(title) {
  const api = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  try {
    const res = await fetch(api, { headers: { 'User-Agent': UA } })
    if (!res.ok) return null
    const j = await res.json()
    return j.originalimage?.source || j.thumbnail?.source || null
  } catch {
    return null
  }
}

const wikiTitles = {
  'posters/enola-holmes-2.jpg': 'Enola_Holmes_2',
  'posters/the-flash.jpg': 'The_Flash_(film)',
  'posters/air.jpg': 'Air_(2023_film)',
  'posters/oppenheimer.jpg': 'Oppenheimer_(film)',
  'posters/sonic-2.jpg': 'Sonic_the_Hedgehog_2_(film)',
  'posters/pathaan.jpg': 'Pathaan_(film)',
  'posters/squid-game.jpg': 'Squid_Game',
  'posters/wednesday.jpg': 'Wednesday_(TV_series)',
  'posters/beef.jpg': 'Beef_(TV_series)',
  'posters/the-last-of-us.jpg': 'The_Last_of_Us_(TV_series)',
  'posters/gundala.jpg': 'Gundala_(film)',
  'posters/star-wars-tfa.jpg': 'Star_Wars:_The_Force_Awakens',
  'posters/john-wick-4.jpg': 'John_Wick:_Chapter_4',
  'posters/ant-man-quantumania.jpg': 'Ant-Man_and_the_Wasp:_Quantumania',
  'posters/black-adam.jpg': 'Black_Adam_(film)',
  'posters/satans-slaves.jpg': 'Satan%27s_Slaves',
  'posters/sri-asih.jpg': 'Sri_Asih',
  'posters/extraordinary-attorney-woo.jpg': 'Extraordinary_Attorney_Woo',
  'posters/kingdom-ashin.jpg': 'Kingdom:_Ashin_of_the_North',
  'posters/ghosted.jpg': 'Ghosted_(2023_film)',
  'posters/black-clover.jpg': 'Black_Clover:_Sword_of_the_Wizard_King',
  'hero/star-wars-backdrop.jpg': 'Star_Wars:_The_Force_Awakens',
  'hero/dune-part-two.jpg': 'Dune:_Part_Two',
  'hero/air-featured.jpg': 'Air_(2023_film)',
}

for (const [rel, urls] of Object.entries(assets)) {
  console.log('\n==', rel)
  const wikiKey = wikiTitles[rel]
  if (wikiKey) {
    const w = await wikiThumb(wikiKey)
    if (w) urls.unshift(w)
  }
  await downloadBest(rel, urls)
}

console.log('\nDONE')
