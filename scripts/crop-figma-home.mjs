import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const base = path.join('public', 'saintstream')
const src = path.join(base, 'ref', 'home-default.png')
const { width: W, height: H } = await sharp(src).metadata()

async function extract(rel, left, top, width, height) {
  const out = path.join(base, rel)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  await sharp(src)
    .extract({
      left: Math.max(0, Math.round(left)),
      top: Math.max(0, Math.round(top)),
      width: Math.min(Math.round(width), W - Math.round(left)),
      height: Math.min(Math.round(height), H - Math.round(top)),
    })
    .jpeg({ quality: 94 })
    .toFile(out)
  console.log(rel, fs.statSync(out).size)
}

// Image-only poster crops (exclude baked title text at bottom of Figma flat cards)
// Just Release band ~880-1120, posters ~200 wide
const jr = [
  ['enola-holmes-2', 75],
  ['satans-slaves', 299],
  ['the-flash', 523],
  ['ghosted', 747],
  ['black-clover', 971],
]
for (const [n, x] of jr) {
  await extract(`posters/${n}.jpg`, x, 900, 200, 250)
}

// Popular week thumbs — brightness peak ~1440
const pop = [
  ['the-last-of-us', 200],
  ['sri-asih', 500],
  ['the-flash-thumb', 800],
  ['enola-thumb', 1100],
]
for (const [n, x] of pop) {
  await extract(`posters/${n}.jpg`, x, 1400, 120, 160)
}

// Featured Air poster stack area
await extract('hero/air-featured.jpg', 0, 1640, W, 400)
await extract('posters/air.jpg', 900, 1680, 220, 320)

// Movies ~2200-2480
const mov = [
  ['oppenheimer', 75],
  ['wednesday', 299],
  ['air-mov', 523],
  ['pathaan', 747],
  ['sonic-2', 971],
]
for (const [n, x] of mov) {
  await extract(`posters/${n}.jpg`, x, 2220, 200, 250)
}

const ser = [
  ['the-last-of-us-wide', 75],
  ['squid-game', 299],
  ['wednesday-s', 523],
  ['black-clover-s', 747],
]
for (const [n, x] of ser) {
  await extract(`posters/${n}.jpg`, x, 2540, 200, 250)
}

const kor = [
  ['extraordinary-attorney-woo', 75],
  ['kingdom-ashin', 299],
  ['squid-game-2', 523],
]
for (const [n, x] of kor) {
  await extract(`posters/${n}.jpg`, x, 2900, 200, 250)
}

await extract('posters/gundala.jpg', 75, 3260, 420, 260)
await extract('brands/partners-strip.jpg', 40, 710, 1180, 95)

// Hero without nav chrome: crop from y=70
await sharp(src)
  .extract({ left: 0, top: 70, width: W, height: 610 })
  .png()
  .toFile(path.join(base, 'hero', 'star-wars-backdrop.png'))

console.log('done')
