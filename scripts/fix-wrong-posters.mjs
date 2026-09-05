import sharp from 'sharp'
import fs from 'fs'

const UA = 'Mozilla/5.0'
async function files(page) {
  const r = await fetch(page, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(25000) })
  const html = await r.text()
  const title = html.match(/<title>([^<]+)/)?.[1]
  console.log('PAGE', page, '->', title?.slice(0, 80))
  const out = []
  const seen = new Set()
  for (const m of html.matchAll(/\/t\/p\/(?:w\d+|original)\/([a-zA-Z0-9]{20,}\.jpg)/g)) {
    if (!seen.has(m[1])) {
      seen.add(m[1])
      out.push(m[1])
    }
  }
  console.log(' files', out.slice(0, 6).join(', '))
  return out
}

async function dl(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(60000) })
  if (!r.ok) return null
  const b = Buffer.from(await r.arrayBuffer())
  return b.length > 40000 && b[0] === 0xff ? b : null
}

async function saveBest(rel, page) {
  const list = await files(page)
  let best = null
  for (const f of list.slice(0, 8)) {
    const b = await dl(`https://image.tmdb.org/t/p/original/${f}`)
    if (!b) continue
    const m = await sharp(b).metadata()
    if ((m.width || 0) >= (m.height || 0)) continue // want portrait
    if (!best || b.length > best.b.length) best = { b, f, m }
  }
  if (!best) {
    console.log('FAIL', rel)
    return
  }
  const jpg = await sharp(best.b).jpeg({ quality: 93, mozjpeg: true }).toBuffer()
  fs.writeFileSync(`public/saintstream/${rel}`, jpg)
  console.log('OK', rel, best.f, best.m.width + 'x' + best.m.height, (jpg.length / 1024).toFixed(0) + 'KB')
}

await saveBest('posters/enola-holmes-2.jpg', 'https://www.themoviedb.org/movie/829280/images/posters')
await saveBest('posters/ghosted.jpg', 'https://www.themoviedb.org/movie/594767/images/posters') // try Guardians? no
// search ghosted
{
  const r = await fetch('https://www.themoviedb.org/search?query=Ghosted+Chris+Evans', {
    headers: { 'User-Agent': UA },
  })
  const html = await r.text()
  const ids = [...html.matchAll(/href="(\/movie\/\d+[^"]*)"/g)].map((m) => m[1]).slice(0, 8)
  console.log('ghosted candidates', ids)
}
await saveBest('posters/ghosted.jpg', 'https://www.themoviedb.org/movie/1003579/images/posters')
await saveBest('posters/satans-slaves.jpg', 'https://www.themoviedb.org/movie/455042/images/posters')
await saveBest('posters/sri-asih.jpg', 'https://www.themoviedb.org/movie/791042/images/posters')
await saveBest('posters/toxic.jpg', 'https://www.themoviedb.org/movie/731684/images/posters')
await saveBest('hero/dune-part-two.jpg', 'https://www.themoviedb.org/movie/693134/images/backdrops')
// for dune backdrop allow landscape
{
  const list = await files('https://www.themoviedb.org/movie/693134/images/backdrops')
  let best = null
  for (const f of list.slice(0, 8)) {
    const b = await dl(`https://image.tmdb.org/t/p/original/${f}`)
    if (!b) continue
    const m = await sharp(b).metadata()
    if ((m.width || 0) <= (m.height || 0)) continue
    if (!best || b.length > best.b.length) best = { b, f, m }
  }
  if (best) {
    const jpg = await sharp(best.b).jpeg({ quality: 93, mozjpeg: true }).toBuffer()
    fs.writeFileSync('public/saintstream/hero/dune-part-two.jpg', jpg)
    console.log('OK hero/dune', best.f, best.m.width + 'x' + best.m.height)
  }
}
