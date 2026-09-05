import sharp from 'sharp'
import fs from 'fs'

const UA = 'Mozilla/5.0'
async function files(page) {
  const r = await fetch(page, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) })
  const html = await r.text()
  console.log(html.match(/<title>([^<]+)/)?.[1]?.slice(0, 90))
  const out = []
  const seen = new Set()
  for (const m of html.matchAll(/\/t\/p\/(?:w\d+|original)\/([a-zA-Z0-9]{20,}\.jpg)/g)) {
    if (!seen.has(m[1])) {
      seen.add(m[1])
      out.push(m[1])
    }
  }
  return out
}
async function dl(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(90000) })
  if (!r.ok) return null
  const b = Buffer.from(await r.arrayBuffer())
  return b.length > 30000 && b[0] === 0xff ? b : null
}
async function savePortrait(rel, page) {
  const list = await files(page)
  console.log(rel, 'candidates', list.slice(0, 5).join(', '))
  let best = null
  for (const f of list.slice(0, 10)) {
    const b = await dl(`https://image.tmdb.org/t/p/original/${f}`)
    if (!b) continue
    const m = await sharp(b).metadata()
    if ((m.width || 0) >= (m.height || 0)) continue
    if (!best || b.length > best.b.length) best = { b, f, m }
  }
  if (!best) return console.log('FAIL', rel)
  const jpg = await sharp(best.b).jpeg({ quality: 93, mozjpeg: true }).toBuffer()
  fs.writeFileSync(`public/saintstream/${rel}`, jpg)
  console.log('OK', rel, best.f, `${best.m.width}x${best.m.height}`, `${(jpg.length / 1024).toFixed(0)}KB`)
}

await savePortrait('posters/ghosted.jpg', 'https://www.themoviedb.org/movie/868759/images/posters')
await savePortrait('posters/sri-asih.jpg', 'https://www.themoviedb.org/movie/624091/images/posters')
await savePortrait('posters/satans-slaves.jpg', 'https://www.themoviedb.org/movie/460793/images/posters')

// Dune landscape backdrop — prefer known wide file
{
  const prefer = [
    'xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    '8uVKfOJUhmybNsVh089EqLHUYEG.jpg',
    'eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    '24Ov8wnusgnzXwjV1eDm0Lzo5da.jpg',
  ]
  let best = null
  for (const f of prefer) {
    const b = await dl(`https://image.tmdb.org/t/p/original/${f}`)
    if (!b) continue
    const m = await sharp(b).metadata()
    if ((m.width || 0) <= (m.height || 0)) continue
    if (!best || b.length > best.b.length) best = { b, f, m }
  }
  if (best) {
    const jpg = await sharp(best.b).jpeg({ quality: 93, mozjpeg: true }).toBuffer()
    fs.writeFileSync('public/saintstream/hero/dune-part-two.jpg', jpg)
    console.log('OK hero/dune', best.f, `${best.m.width}x${best.m.height}`)
  } else console.log('FAIL dune hero')
}
