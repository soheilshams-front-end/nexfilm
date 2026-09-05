#!/usr/bin/env node
/**
 * Scaffold a new title entry for lib/movies.ts
 * Usage: node scripts/add-title.mjs content/titles/example.json
 *
 * Prints a ready-to-paste TypeScript object. Does NOT auto-edit movies.ts.
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const input = process.argv[2]
if (!input) {
  console.error('Usage: node scripts/add-title.mjs <path-to-json>')
  process.exit(1)
}

const raw = readFileSync(resolve(input), 'utf8')
const data = JSON.parse(raw)

const required = ['id', 'title', 'titleEn', 'poster', 'backdrop', 'type']
for (const key of required) {
  if (!data[key]) {
    console.error(`Missing required field: ${key}`)
    process.exit(1)
  }
}

const lines = [
  '  {',
  `    id: '${data.id}',`,
  `    title: '${data.title}',`,
  `    titleEn: '${data.titleEn}',`,
  `    tagline: '${data.tagline ?? ''}',`,
  `    description: '${(data.description ?? '').replace(/'/g, "\\'")}',`,
  `    poster: '${data.poster}',`,
  `    backdrop: '${data.backdrop}',`,
  `    year: ${data.year ?? 2024},`,
  `    rating: ${data.rating ?? 7.0},`,
  `    maturity: '${data.maturity ?? '+۱۳'}',`,
  `    duration: '${data.duration ?? ''}',`,
  `    genres: [${(data.genres ?? []).map((g) => `'${g}'`).join(', ')}],`,
  `    cast: [${(data.cast ?? []).map((c) => `'${c}'`).join(', ')}],`,
  `    director: '${data.director ?? ''}',`,
  `    type: '${data.type}',`,
  `    match: ${data.match ?? 80},`,
]

if (data.videoUrl) lines.push(`    videoUrl: '${data.videoUrl}',`)
if (data.trailerUrl) lines.push(`    trailerUrl: '${data.trailerUrl}',`)
if (data.isNew) lines.push('    isNew: true,')
if (data.featured) lines.push('    featured: true,')

lines.push('  },')

console.log('\nPaste into movies array in lib/movies.ts:\n')
console.log(lines.join('\n'))
console.log('\nThen add mp4 to public/videos/ if using local path.\n')
