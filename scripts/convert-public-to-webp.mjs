/**
 * Convert public raster images to WebP (resize huge assets) and rewrite code refs.
 * Usage: node scripts/convert-public-to-webp.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')

/** Keep Next metadata icons as PNG */
const SKIP = new Set([
  path.join(publicDir, 'apple-icon.png'),
  path.join(publicDir, 'icon-dark-32x32.png'),
  path.join(publicDir, 'icon-light-32x32.png'),
  path.join(root, 'app', 'icon.png'),
  path.join(root, 'app', 'apple-icon.png'),
])

const RASTER = /\.(jpe?g|png)$/i

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name)
    if (name.isDirectory()) walk(full, out)
    else if (RASTER.test(name.name)) out.push(full)
  }
  return out
}

async function convertFile(file) {
  if (SKIP.has(file)) return { skipped: true, file }
  const out = file.replace(RASTER, '.webp')
  if (fs.existsSync(out) && out !== file) {
    // regenerate anyway for consistent quality
  }

  const img = sharp(file, { failOn: 'none' })
  const meta = await img.metadata()
  let pipeline = sharp(file, { failOn: 'none' })

  // Cap display assets; keep small icons as-is size-wise
  const maxW = file.includes(`${path.sep}hero${path.sep}`)
    ? 1920
    : file.includes(`${path.sep}posters${path.sep}`)
      ? 780
      : file.includes(`${path.sep}backdrops${path.sep}`)
        ? 1920
        : 1280

  if (meta.width && meta.width > maxW) {
    pipeline = pipeline.resize({ width: maxW, withoutEnlargement: true })
  }

  const quality = file.includes(`${path.sep}hero${path.sep}`) ? 72 : 78
  await pipeline.webp({ quality, effort: 4 }).toFile(out + '.tmp')
  fs.renameSync(out + '.tmp', out)

  const before = fs.statSync(file).size
  const after = fs.statSync(out).size
  if (path.resolve(file) !== path.resolve(out)) fs.unlinkSync(file)

  return { file, out, before, after }
}

function rewriteCodeRefs() {
  const dirs = ['lib', 'components', 'app', 'content']
  const exts = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.css', '.md'])
  let filesChanged = 0

  function walkSrc(dir) {
    if (!fs.existsSync(dir)) return
    for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, name.name)
      if (name.isDirectory()) {
        if (name.name === 'node_modules' || name.name === '.next') continue
        walkSrc(full)
        continue
      }
      if (!exts.has(path.extname(name.name))) continue
      let text = fs.readFileSync(full, 'utf8')
      const orig = text

      // Local public asset paths only — not remote TMDB hashes ending in .jpg
      text = text.replace(
        /(\/[\w./-]+)\.(jpe?g|png)(?=['"`)])/gi,
        (m, p1, ext) => {
          // keep next app icons referenced as png if under /apple-icon or brand tiny icons optional
          if (/\/(apple-icon|icon-dark-32x32|icon-light-32x32)\.png$/i.test(m)) return m
          // skip obvious remote full URLs already handled by not matching without leading /
          return `${p1}.webp`
        },
      )

      // Helpers that append extension
      text = text.replace(
        /(`\/saintstream\/(?:posters|hero)\/\$\{[^}]+\}+)\.jpg`/g,
        '$1.webp`',
      )
      text = text.replace(
        /(saintstream\/(?:posters|hero)\/\$\{[^}]+\})\.jpg/g,
        '$1.webp',
      )

      if (text !== orig) {
        fs.writeFileSync(full, text)
        filesChanged++
        console.log('rewrite', path.relative(root, full))
      }
    }
  }

  for (const d of dirs) walkSrc(path.join(root, d))
  return filesChanged
}

const files = walk(publicDir).filter((f) => !SKIP.has(f))
console.log(`Converting ${files.length} images…`)

let saved = 0
let beforeTotal = 0
let afterTotal = 0

for (const file of files) {
  try {
    const r = await convertFile(file)
    if (r.skipped) continue
    beforeTotal += r.before
    afterTotal += r.after
    saved += r.before - r.after
    console.log(
      'OK',
      path.relative(publicDir, r.file),
      `→ ${path.extname(r.out)}`,
      `${(r.before / 1024).toFixed(0)}KB → ${(r.after / 1024).toFixed(0)}KB`,
    )
  } catch (e) {
    console.error('FAIL', path.relative(publicDir, file), e.message)
  }
}

const rewritten = rewriteCodeRefs()

// Force helpers in saintstream-home
const home = path.join(root, 'lib', 'saintstream-home.ts')
if (fs.existsSync(home)) {
  let t = fs.readFileSync(home, 'utf8')
  t = t
    .replace(
      /const p = \(name: string\) => `\/saintstream\/posters\/\$\{name\}\.(jpg|webp)`/,
      'const p = (name: string) => `/saintstream/posters/${name}.webp`',
    )
    .replace(
      /const h = \(name: string\) => `\/saintstream\/hero\/\$\{name\}\.(jpg|webp)`/,
      'const h = (name: string) => `/saintstream/hero/${name}.webp`',
    )
  fs.writeFileSync(home, t)
}

console.log('---')
console.log(
  `Done. Before ${(beforeTotal / 1024 / 1024).toFixed(1)}MB → after ${(afterTotal / 1024 / 1024).toFixed(1)}MB (saved ${(saved / 1024 / 1024).toFixed(1)}MB)`,
)
console.log(`Code files rewritten: ${rewritten}`)
