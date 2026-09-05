/**
 * One-shot: set every titleFa equal to its titleEn (English display names).
 */
import fs from 'node:fs'

const path = new URL('../lib/saintstream-home.ts', import.meta.url)
const file = fs.readFileSync(path, 'utf8')

const updated = file.replace(
  /titleEn:\s*((?:'(?:\\'|[^'])*'|"(?:\\"|[^"])*"))\s*,\s*\n(\s*)titleFa:\s*(?:'(?:\\'|[^'])*'|"(?:\\"|[^"])*")/g,
  (_m, en, indent) => `titleEn: ${en},\n${indent}titleFa: ${en}`,
)

const before = (file.match(/titleFa:/g) || []).length
const afterDiff = before
fs.writeFileSync(path, updated)
const changed = [...updated.matchAll(/titleFa:\s*([^\n]+)/g)].slice(0, 3).map((m) => m[1])
console.log('titleFa entries:', before)
console.log('samples:', changed.join(' | '))
