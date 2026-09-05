import fs from 'node:fs'

const path = 'lib/movies.ts'
let s = fs.readFileSync(path, 'utf8')
const pairs = [
  ['پژواک فردا', 'Echoes of Tomorrow'],
  ['رکوئیم نئون', 'Neon Requiem'],
  ['افق خاموش', 'The Silent Horizon'],
  ['دره سرخ', 'Crimson Vale'],
  ['پس‌نور', 'Afterlight'],
  ['فانوس‌های کاغذی', 'Paper Lanterns'],
  ['زره‌آهنین', 'Ironclad'],
  ['آرشیو نیمه‌شب', 'Midnight Archive'],
  ['سینتل', 'Sintel'],
  ['خرگوش بزرگ', 'Big Buck Bunny'],
  ['اشک فولاد', 'Tears of Steel'],
  ['رویای فیل‌ها', 'Elephants Dream'],
]

let n = 0
for (const [fa, en] of pairs) {
  const needle = `title: '${fa}'`
  if (s.includes(needle)) {
    s = s.replaceAll(needle, `title: '${en}'`)
    n++
  }
}
fs.writeFileSync(path, s)
console.log('updated', n)
