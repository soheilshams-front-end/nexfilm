#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = join(process.cwd(), 'public', 'saintstream', 'posters')
await mkdir(root, { recursive: true })

const sources = {
  'star-wars-tfa':
    'https://upload.wikimedia.org/wikipedia/en/a/a2/Star_Wars_The_Force_Awakens_Theatrical_Poster.jpg',
  'dune-part-two':
    'https://upload.wikimedia.org/wikipedia/en/5/5f/Dune_Part_Two_poster.jpeg',
  'enola-holmes-2':
    'https://upload.wikimedia.org/wikipedia/en/0/09/Enola_Holmes_2_poster.jpeg',
  'satans-slaves':
    'https://upload.wikimedia.org/wikipedia/en/8/8c/Satan%27s_Slaves_%282017_film%29.jpg',
  'the-flash':
    'https://upload.wikimedia.org/wikipedia/en/e/ed/The_Flash_%28film%29_poster.jpg',
  ghosted:
    'https://m.media-amazon.com/images/M/MV5BNGMzYWZlYmYtNTcyMC00ZGVjLThjN2ItMjY4MjkwN2NlMjYwXkEyXkFqcGdeQXVyOTU0NjY1MDM@._V1_FMjpg_UX1000_.jpg',
  'black-clover':
    'https://img1.ak.crunchyroll.com/i/spire4/a0055b1a7454869c56e92d633a6388b61670405134_main.jpg',
  'the-last-of-us':
    'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Last_of_Us_cover.jpg',
  'sri-asih':
    'https://upload.wikimedia.org/wikipedia/en/4/4e/Sri_Asih_%28film%29.jpg',
  air: 'https://upload.wikimedia.org/wikipedia/en/4/4e/Air_2023_film_poster.jpg',
  gundala:
    'https://upload.wikimedia.org/wikipedia/en/5/5e/Gundala_%282019_film%29.jpg',
  oppenheimer:
    'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%282023%29_poster.jpg',
  'sonic-2':
    'https://upload.wikimedia.org/wikipedia/en/5/59/Sonic_the_Hedgehog_2_film_poster.jpg',
  pathaan:
    'https://upload.wikimedia.org/wikipedia/en/2/2f/Pathaan_%28film%29_poster.jpg',
  'squid-game':
    'https://upload.wikimedia.org/wikipedia/en/d/df/Squid_Game_%28season_1%29_poster.jpg',
  'extraordinary-attorney-woo':
    'https://upload.wikimedia.org/wikipedia/en/9/99/Extraordinary_Attorney_Woo.jpg',
  'kingdom-ashin':
    'https://upload.wikimedia.org/wikipedia/en/1/1b/Kingdom_Ashin_of_the_North.jpg',
}

for (const [name, url] of Object.entries(sources)) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NextFilm/1.0 (poster fetch)' },
    })
    if (!res.ok) {
      console.warn(`skip ${name}: HTTP ${res.status}`)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    const ext = url.includes('.png') ? 'png' : 'jpg'
    await writeFile(join(root, `${name}.${ext}`), buf)
    console.log(`saved ${name}`)
  } catch (e) {
    console.warn(`fail ${name}:`, e.message)
  }
}
