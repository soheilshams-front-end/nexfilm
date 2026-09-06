/** Smoke: genre canonical aliases */
import assert from 'node:assert/strict'

const ALIASES = {
  'علمی-تخیلی': 'علمی‌تخیلی',
  هیجان: 'هیجان‌انگیز',
}

function canonicalizeGenre(genre) {
  return ALIASES[genre] ?? genre
}

assert.equal(canonicalizeGenre('علمی-تخیلی'), 'علمی‌تخیلی')
assert.equal(canonicalizeGenre('هیجان'), 'هیجان‌انگیز')
assert.equal(canonicalizeGenre('اکشن'), 'اکشن')
console.log('smoke-genre: ok')
