import type { CastMember, CrewMember, Review, Screenshot } from '@/lib/movies'

const tmdbFace = (hash: string) => `https://image.tmdb.org/t/p/w185/${hash}.jpg`

export type TitleCredits = {
  tmdbId?: number
  tmdbType?: 'movie' | 'tv'
  tagline?: string
  director?: string
  cast: CastMember[]
  crew: CrewMember[]
  trailerYoutubeId?: string
  reviews?: Review[]
}

/** عناوین خیالی — از کاتالوگ عمومی حذف می‌شوند (به‌جز نمونهٔ فنی Blender) */
export const FICTIONAL_IDS = new Set([
  'echoes-of-tomorrow',
  'neon-requiem',
  'silent-horizon',
  'crimson-vale',
  'afterlight',
  'paper-lanterns',
  'ironclad',
  'midnight-archive',
])

/** فیلم‌های باز Blender — پخش کامل مجاز */
export const BLENDER_IDS = new Set([
  'sintel-short',
  'big-buck-bunny',
  'tears-of-steel',
  'elephants-dream',
])

export function isPublicCatalogId(id: string): boolean {
  return !FICTIONAL_IDS.has(id)
}

export function normalizeMaturity(raw: string): string {
  const m = raw.trim().toUpperCase()
  if (['G', 'TV-Y', 'TV-G', 'همه'].includes(m) || m === 'همه') return 'همه'
  if (['PG', 'TV-PG', 'TV-Y7'].includes(m)) return '+۷'
  if (['PG-13', 'TV-14', '+۱۳', '13+', '۱۲+', '+۱۲'].includes(m)) return '+۱۳'
  if (['R', 'TV-MA', 'NC-17', '+۱۶', '16+', '+۱۸', '18+'].includes(m)) {
    if (['R', 'TV-MA', 'NC-17', '+۱۸', '18+'].includes(m)) return '+۱۸'
    return '+۱۶'
  }
  if (raw.includes('۱۳') || raw.includes('12')) return '+۱۳'
  if (raw.includes('۱۶') || raw.includes('18') || raw.includes('۱۸')) return '+۱۸'
  return raw.startsWith('+') || raw === 'همه' ? raw : '+۱۳'
}

/** رده‌بندی مناسب کودک */
export function isKidsSafeMaturity(maturity: string): boolean {
  const n = normalizeMaturity(maturity)
  return n === 'همه' || n === '+۷'
}

function c(
  id: string,
  name: string,
  character: string,
  photo: string,
  role = 'بازیگر',
): CastMember {
  return { id, name, role, character, photo }
}

function crew(director: string, extras: CrewMember[] = []): CrewMember[] {
  return [{ id: 'dir', name: director, role: 'کارگردان' }, ...extras]
}

function rev(id: string, author: string, rating: number, content: string): Review {
  return {
    id,
    author,
    avatar: '/avatars/user.webp',
    rating,
    date: 'اخیراً',
    content,
    helpful: 40 + Math.floor(rating * 12),
  }
}

export const titleCredits: Record<string, TitleCredits> = {
  'stranger-things': {
    tmdbId: 66732,
    tmdbType: 'tv',
    tagline: 'فقط عجیب‌تر می‌شود…',
    director: 'برادران دافر',
    trailerYoutubeId: 'b9EkMc79ZSU',
    cast: [
      c('st1', 'میلی بابی براون', 'Eleven', tmdbFace('CBXvSyknYzRjHzxq0twKzYJYZ7C.jpg')),
      c('st2', 'فین ولفهارد', 'Mike Wheeler', tmdbFace('lYeoQ3ht7voP4XDZWsbQxenQWB4.jpg')),
      c('st3', 'وینونا رایدر', 'Joyce Byers', tmdbFace('dG3L90yMgJBZk39n5X8ST0eb1mG.jpg')),
      c('st4', 'دیوید هاربر', 'Jim Hopper', tmdbFace('chPekukMF5SNmP6OBj3AU4dP8.jpg')),
      c('st5', 'گیتن ماتارازو', 'Dustin Henderson', tmdbFace('6TkNb7mYz2P8A2A0xH1.jpg')),
      c('st6', 'کالب مک‌لافلین', 'Lucas Sinclair', tmdbFace('uIVdVXhM4HMwjBMmP8.jpg')),
    ],
    crew: crew('برادران دافر', [{ id: 'cr2', name: 'Shawn Levy', role: 'تهیه‌کننده اجرایی' }]),
    reviews: [
      rev('st-r1', 'سارا م.', 9, 'فضای دههٔ ۸۰ بی‌نقص و شخصیت‌ها فراموش‌نشدنی‌اند.'),
      rev('st-r2', 'آرش ر.', 8, 'فصل‌های اول شاهکارند؛ تعلیق و دوستی در اوج.'),
    ],
  },
  'breaking-bad': {
    tmdbId: 1396,
    tmdbType: 'tv',
    tagline: 'همه چیز را برای خانواده',
    director: 'وینس گیلیگان',
    trailerYoutubeId: 'HhesaQXLuRY',
    cast: [
      c('bb1', 'برایان کرانستون', 'Walter White', tmdbFace('7Jahy5Lbx6IxNhQYMweH8Xc9uP.jpg')),
      c('bb2', 'آرون پال', 'Jesse Pinkman', tmdbFace('aBu2Rm7MLmAwV01v6OdHgXOZH.jpg')),
      c('bb3', 'آنا گان', 'Skyler White', tmdbFace('5X0Y9.jpg')),
      c('bb4', 'دین نوریس', 'Hank Schrader', tmdbFace('vU99Wwn.jpg')),
      c('bb5', 'جاناتان بنکس', 'Mike Ehrmantraut', tmdbFace('h0A.jpg')),
      c('bb6', 'جیانکارلو اسپوزیتو', 'Gus Fring', tmdbFace('b0A.jpg')),
    ],
    crew: crew('وینس گیلیگان'),
    reviews: [rev('bb-r1', 'مریم ک.', 10, 'بهترین سریال جنایی تاریخ تلویزیون.')],
  },
  dark: {
    tmdbId: 70523,
    tmdbType: 'tv',
    tagline: 'همه چیز به هم وصل است',
    director: 'باران بو اودار',
    trailerYoutubeId: 'ESEUoa-k0jI',
    cast: [
      c('dk1', 'لوئیس هافمن', 'Jonas Kahnwald', tmdbFace('A1.jpg')),
      c('dk2', 'لیزا ویچر', 'Martha Nielsen', tmdbFace('A2.jpg')),
      c('dk3', 'آندریاس پیتشمان', 'Ulrich Nielsen', tmdbFace('A3.jpg')),
      c('dk4', 'مکه فیله‌برشت', 'Hannah Kahnwald', tmdbFace('A4.jpg')),
    ],
    crew: crew('باران بو اودار'),
    reviews: [rev('dk-r1', 'نیما', 9, 'پیچیده‌ترین و درخشان‌ترین معمای زمانی.')],
  },
  'the-boys': {
    tmdbId: 76479,
    tmdbType: 'tv',
    tagline: 'هرگز به قهرمان‌ها اعتماد نکن',
    director: 'اریک کریپکه',
    trailerYoutubeId: 'tcrNsIa1dwI',
    cast: [
      c('tb1', 'کارل اربن', 'Billy Butcher', tmdbFace('B1.jpg')),
      c('tb2', 'آنتونی استار', 'Homelander', tmdbFace('B2.jpg')),
      c('tb3', 'جک کویید', 'Hughie Campbell', tmdbFace('B3.jpg')),
      c('tb4', 'ارین موریارتی', 'Starlight', tmdbFace('B4.jpg')),
    ],
    crew: crew('اریک کریپکه'),
  },
  wednesday: {
    tmdbId: 119051,
    tmdbType: 'tv',
    tagline: 'عجیب و شوم',
    director: 'تیم برتون',
    trailerYoutubeId: 'Di310WS8zLk',
    cast: [
      c('wd1', 'جنا اورتگا', 'Wednesday Addams', tmdbFace('w1.jpg')),
      c('wd2', 'اما مایرز', 'Enid Sinclair', tmdbFace('w2.jpg')),
      c('wd3', 'گوندولین کریستی', 'Larissa Weems', tmdbFace('w3.jpg')),
    ],
    crew: crew('تیم برتون'),
  },
  shogun: {
    tmdbId: 126308,
    tmdbType: 'tv',
    tagline: 'قدرت، افتخار، سرنوشت',
    director: 'راشل کوندو و جاستین مارکس',
    trailerYoutubeId: 'y1Ry_LNDF9M',
    cast: [
      c('sg1', 'هیرویوکی سانادا', 'Yoshii Toranaga', tmdbFace('s1.jpg')),
      c('sg2', 'کاسپر کریستنسن', 'John Blackthorne', tmdbFace('s2.jpg')),
      c('sg3', 'آنا ساوای', 'Toda Mariko', tmdbFace('s3.jpg')),
    ],
    crew: crew('راشل کوندو'),
  },
  arcane: {
    tmdbId: 94605,
    tmdbType: 'tv',
    tagline: 'هر جا هستی، روشن کن تا پیدا کنم',
    director: 'پاسکال شاره',
    trailerYoutubeId: 'fXmAurh012s',
    cast: [
      c('ar1', 'هی‌لی استاینفلد', 'Vi', tmdbFace('ar1.jpg'), 'صداپیشه'),
      c('ar2', 'اِلا پورنل', 'Jinx', tmdbFace('ar2.jpg'), 'صداپیشه'),
      c('ar3', 'کوین آلخاندرو', 'Jayce', tmdbFace('ar3.jpg'), 'صداپیشه'),
    ],
    crew: crew('پاسکال شاره'),
  },
  witcher: {
    tmdbId: 71912,
    tmdbType: 'tv',
    tagline: 'سرنوشت همیشه راه خودش را پیدا می‌کند',
    director: 'لوژن کوپرنکی',
    trailerYoutubeId: 'ndl1W4ltcmg',
    cast: [
      c('wt1', 'هنری کاویل', 'Geralt of Rivia', tmdbFace('wt1.jpg')),
      c('wt2', 'آنیا چالوترا', 'Yennefer', tmdbFace('wt2.jpg')),
      c('wt3', 'فریا آلن', 'Ciri', tmdbFace('wt3.jpg')),
    ],
    crew: crew('لوژن کوپرنکی'),
  },
  'squid-game': {
    tmdbId: 93405,
    tmdbType: 'tv',
    tagline: 'با همه‌چیزت بازی کن',
    director: 'هوانگ دونگ-هیوک',
    trailerYoutubeId: 'oqxAJKy0ii4',
    cast: [
      c('sq1', 'لی جونگ-جه', 'Seong Gi-hun', tmdbFace('sq1.jpg')),
      c('sq2', 'پارک هه-سو', 'Cho Sang-woo', tmdbFace('sq2.jpg')),
      c('sq3', 'وی ها-جون', 'Hwang Jun-ho', tmdbFace('sq3.jpg')),
    ],
    crew: crew('هوانگ دونگ-هیوک'),
  },
  'the-last-of-us': {
    tmdbId: 100088,
    tmdbType: 'tv',
    tagline: 'برای نجات آنچه باقی مانده',
    director: 'کریگ مazin و نیل دراکمن',
    trailerYoutubeId: 'uLtkt8BonwM',
    cast: [
      c('tl1', 'پدرو پاسکال', 'Joel', tmdbFace('tl1.jpg')),
      c('tl2', 'بلا رمزی', 'Ellie', tmdbFace('tl2.jpg')),
      c('tl3', 'گابریلا لونا', 'Tess', tmdbFace('tl3.jpg')),
    ],
    crew: crew('کریگ مazin'),
  },
  'weak-hero': {
    tmdbId: 158056,
    tmdbType: 'tv',
    tagline: 'هوش در برابر خشونت',
    director: 'پارک جون-سو',
    trailerYoutubeId: 'K9_VFclusSc',
    cast: [
      c('wh1', 'پارک جی-هون', 'Yeon Si-eun', tmdbFace('wh1.jpg')),
      c('wh2', 'چوی هیون-ووک', 'Ahn Su-ho', tmdbFace('wh2.jpg')),
    ],
    crew: crew('پارک جون-سو'),
  },
  beef: {
    tmdbId: 153312,
    tmdbType: 'tv',
    tagline: 'یک جروبحث، هزار پیامد',
    director: 'لی سانگ جین',
    trailerYoutubeId: 'l7vR7O_R5Y0',
    cast: [
      c('bf1', 'استیون یئون', 'Danny Cho', tmdbFace('bf1.jpg')),
      c('bf2', 'علی ونگ', 'Amy Lau', tmdbFace('bf2.jpg')),
    ],
    crew: crew('لی سانگ جین'),
  },
  insider: {
    tmdbId: 135655,
    tmdbType: 'tv',
    tagline: 'در زندان زنده بمان',
    director: 'جو هیون-تاک',
    cast: [
      c('in1', 'کانگ ها-نول', 'Kim Yo-han', tmdbFace('in1.jpg')),
      c('in2', 'لی یو-یونگ', 'Yoon By', tmdbFace('in2.jpg')),
    ],
    crew: crew('جو هیون-تاک'),
  },
  race: {
    tmdbId: 215472,
    tmdbType: 'tv',
    tagline: 'برای صعود بجنگ',
    director: 'لی جونگ-هیو',
    cast: [
      c('rc1', 'لی سونگ-کیونگ', 'Goo Yi-jeong', tmdbFace('rc1.jpg')),
      c('rc2', 'هونگ جونگ-هیون', 'Seo Dong-ju', tmdbFace('rc2.jpg')),
    ],
    crew: crew('لی جونگ-هیو'),
  },
  'ghost-doctor': {
    tmdbId: 152471,
    tmdbType: 'tv',
    tagline: 'روح جراح، بدن رزیدنت',
    director: 'بو سونگ-چول',
    cast: [
      c('gd1', 'رین', 'Cha Young-min', tmdbFace('gd1.jpg')),
      c('gd2', 'کیم بوم', 'Go Seung-tak', tmdbFace('gd2.jpg')),
    ],
    crew: crew('بو سونگ-چول'),
  },
  'extraordinary-attorney-woo': {
    tmdbId: 197067,
    tmdbType: 'tv',
    tagline: 'عدالت به سبک خودش',
    director: 'یو این-شیک',
    trailerYoutubeId: 'A7LvnQ3fzzE',
    cast: [
      c('ew1', 'پارک اون-بین', 'Woo Young-woo', tmdbFace('ew1.jpg')),
      c('ew2', 'کانگ ته-اوه', 'Lee Jun-ho', tmdbFace('ew2.jpg')),
    ],
    crew: crew('یو این-شیک'),
  },
  'valhalla-murders': {
    tmdbId: 97405,
    tmdbType: 'tv',
    tagline: 'گذشته‌ای که نمی‌میرد',
    director: 'تُر فرای‌ری‌کسون',
    cast: [
      c('vm1', 'نینا دُرسدال', 'Kata', tmdbFace('vm1.jpg')),
      c('vm2', 'بیورن هلینور', 'Arnar', tmdbFace('vm2.jpg')),
    ],
    crew: crew('تُر فرای‌ری‌کسون'),
  },
  'dune-part-two': {
    tmdbId: 693134,
    tmdbType: 'movie',
    tagline: 'سرنوشت در شن‌ها نوشته می‌شود',
    director: 'دنی ویلنوو',
    trailerYoutubeId: 'Way9Dexny3w',
    cast: [
      c('du1', 'تیموتی شالامه', 'Paul Atreides', tmdbFace('du1.jpg')),
      c('du2', 'زندایا', 'Chani', tmdbFace('du2.jpg')),
      c('du3', 'ربکا فرگوسن', 'Lady Jessica', tmdbFace('du3.jpg')),
    ],
    crew: crew('دنی ویلنوو'),
  },
  oppenheimer: {
    tmdbId: 872585,
    tmdbType: 'movie',
    tagline: 'جهان برای همیشه عوض شد',
    director: 'کریستوفر نولان',
    trailerYoutubeId: 'uYPbbksJxIg',
    cast: [
      c('op1', 'کیلین مورفی', 'J. Robert Oppenheimer', tmdbFace('op1.jpg')),
      c('op2', 'امیلی بلانت', 'Kitty Oppenheimer', tmdbFace('op2.jpg')),
      c('op3', 'رابرت داونی جونیور', 'Lewis Strauss', tmdbFace('op3.jpg')),
    ],
    crew: crew('کریستوفر نولان'),
  },
  'john-wick-4': {
    tmdbId: 603692,
    tmdbType: 'movie',
    tagline: 'هیچ‌کس مثل جان ویک نیست',
    director: 'چاد استاهلسکی',
    trailerYoutubeId: 'qEVUtrk8_B4',
    cast: [
      c('jw1', 'کینو ریوز', 'John Wick', tmdbFace('jw1.jpg')),
      c('jw2', 'دانیه بوبو', 'Caine', tmdbFace('jw2.jpg')),
    ],
    crew: crew('چاد استاهلسکی'),
  },
  'star-wars-tfa': {
    tmdbId: 140607,
    tmdbType: 'movie',
    tagline: 'نیروی بیدار می‌شود',
    director: 'جی‌جی آبرامز',
    trailerYoutubeId: 'sGbxmsDFVnE',
    cast: [
      c('sw1', 'دیزی ریدلی', 'Rey', tmdbFace('sw1.jpg')),
      c('sw2', 'جان بویگا', 'Finn', tmdbFace('sw2.jpg')),
      c('sw3', 'آدام درایور', 'Kylo Ren', tmdbFace('sw3.jpg')),
    ],
    crew: crew('جی‌جی آبرامز'),
  },
  interstellar: {
    tmdbId: 157336,
    tmdbType: 'movie',
    tagline: 'عشق فراتر از زمان و مکان',
    director: 'کریستوفر نولان',
    trailerYoutubeId: 'zSWdZVtXT7E',
    cast: [
      c('is1', 'متیو مک‌کانهی', 'Cooper', tmdbFace('is1.jpg')),
      c('is2', 'آن هثوای', 'Brand', tmdbFace('is2.jpg')),
    ],
    crew: crew('کریستوفر نولان'),
  },
  inception: {
    tmdbId: 27205,
    tmdbType: 'movie',
    tagline: 'رویای تو مال من است',
    director: 'کریستوفر نولان',
    trailerYoutubeId: 'YoHD9XEInc0',
    cast: [
      c('ic1', 'لئوناردو دی‌کاپریو', 'Cobb', tmdbFace('ic1.jpg')),
      c('ic2', 'جوزف گوردون-لویت', 'Arthur', tmdbFace('ic2.jpg')),
    ],
    crew: crew('کریستوفر نولان'),
  },
  parasite: {
    tmdbId: 496243,
    tmdbType: 'movie',
    tagline: 'ثروت بوی فقر را می‌فهمد',
    director: 'بونگ جون-هو',
    trailerYoutubeId: '5xH0HfJHsaY',
    cast: [
      c('pr1', 'سونگ کانگ-هو', 'Kim Ki-taek', tmdbFace('pr1.jpg')),
      c('pr2', 'چوی وو-شیک', 'Ki-woo', tmdbFace('pr2.jpg')),
    ],
    crew: crew('بونگ جون-هو'),
  },
  'the-batman': {
    tmdbId: 414906,
    tmdbType: 'movie',
    tagline: 'من انتقامم',
    director: 'مت ریوز',
    trailerYoutubeId: 'mqqft2x_Aa4',
    cast: [
      c('bm1', 'رابرت پتینسون', 'Bruce Wayne / Batman', tmdbFace('bm1.jpg')),
      c('bm2', 'زو کریوتز', 'Selina Kyle', tmdbFace('bm2.jpg')),
    ],
    crew: crew('مت ریوز'),
  },
  'spider-verse': {
    tmdbId: 569094,
    tmdbType: 'movie',
    tagline: 'هر عنکبوتی داستان خودش را دارد',
    director: 'خواکیم دوس سانتوس',
    trailerYoutubeId: 'shWMyWX_5n4',
    cast: [
      c('sv1', 'شیمیک مور', 'Miles Morales', tmdbFace('sv1.jpg'), 'صداپیشه'),
      c('sv2', 'هیلی استاینفلد', 'Gwen Stacy', tmdbFace('sv2.jpg'), 'صداپیشه'),
    ],
    crew: crew('خواکیم دوس سانتوس'),
  },
  'top-gun-maverick': {
    tmdbId: 361743,
    tmdbType: 'movie',
    tagline: 'احساس نیاز به سرعت',
    director: 'جوزف کوسینسکی',
    trailerYoutubeId: 'giXco2jaZ_4',
    cast: [
      c('tg1', 'تام کروز', 'Pete Mitchell', tmdbFace('tg1.jpg')),
      c('tg2', 'مایلز تِلر', 'Rooster', tmdbFace('tg2.jpg')),
    ],
    crew: crew('جوزف کوسینسکی'),
  },
  'avatar-way-of-water': {
    tmdbId: 76600,
    tmdbType: 'movie',
    tagline: 'بازگشت به پاندورا',
    director: 'جیمز کامرون',
    trailerYoutubeId: 'd9MyW72ELq0',
    cast: [
      c('av1', 'سم وورتینگتون', 'Jake Sully', tmdbFace('av1.jpg')),
      c('av2', 'زو سالدانا', 'Neytiri', tmdbFace('av2.jpg')),
    ],
    crew: crew('جیمز کامرون'),
  },
  'guardians-3': {
    tmdbId: 447365,
    tmdbType: 'movie',
    tagline: 'هنوز یک تیمیم',
    director: 'جیمز گان',
    trailerYoutubeId: 'u3V5zVtXT7E',
    cast: [
      c('gu1', 'کریس پرت', 'Star-Lord', tmdbFace('gu1.jpg')),
      c('gu2', 'زویی سالدانا', 'Gamora', tmdbFace('gu2.jpg')),
    ],
    crew: crew('جیمز گان'),
  },
  'everything-everywhere': {
    tmdbId: 545611,
    tmdbType: 'movie',
    tagline: 'یک زندگی، بی‌نهایت جهان',
    director: 'دانیلز',
    trailerYoutubeId: 'wxN1T1uxQ2g',
    cast: [
      c('ee1', 'میشل یئو', 'Evelyn', tmdbFace('ee1.jpg')),
      c('ee2', 'کی هوی کوان', 'Waymond', tmdbFace('ee2.jpg')),
    ],
    crew: crew('دانیلز'),
  },
  'the-dark-knight': {
    tmdbId: 155,
    tmdbType: 'movie',
    tagline: 'چرا این‌قدر جدی؟',
    director: 'کریستوفر نولان',
    trailerYoutubeId: 'EXeTwQWrcwY',
    cast: [
      c('dk1', 'کریستین بیل', 'Batman', tmdbFace('tdk1.jpg')),
      c('dk2', 'هیث لجر', 'Joker', tmdbFace('tdk2.jpg')),
    ],
    crew: crew('کریستوفر نولان'),
  },
  'mad-max-fury-road': {
    tmdbId: 76341,
    tmdbType: 'movie',
    tagline: 'چه کسی دیوانه را کنترل می‌کند؟',
    director: 'جرج میلر',
    trailerYoutubeId: 'hA6hldpSTF8',
    cast: [
      c('mm1', 'تام هاردی', 'Max', tmdbFace('mm1.jpg')),
      c('mm2', 'شارلیز ترون', 'Furiosa', tmdbFace('mm2.jpg')),
    ],
    crew: crew('جرج میلر'),
  },
  'the-godfather': {
    tmdbId: 238,
    tmdbType: 'movie',
    tagline: 'پیشنهادی که نمی‌توانی رد کنی',
    director: 'فرانسیس فورد کاپولا',
    trailerYoutubeId: 'sY1S34973zA',
    cast: [
      c('gf1', 'مارلون براندو', 'Vito Corleone', tmdbFace('gf1.jpg')),
      c('gf2', 'آل پاچینو', 'Michael Corleone', tmdbFace('gf2.jpg')),
    ],
    crew: crew('فرانسیس فورد کاپولا'),
  },
  'shawshank-redemption': {
    tmdbId: 278,
    tmdbType: 'movie',
    tagline: 'ترس می‌تواند تو را زندانی کند، امید آزادت می‌کند',
    director: 'فرانک دارابونت',
    trailerYoutubeId: '6hB3S9bIaco',
    cast: [
      c('sh1', 'تیم رابینز', 'Andy Dufresne', tmdbFace('sh1.jpg')),
      c('sh2', 'مورگان فریمن', 'Red', tmdbFace('sh2.jpg')),
    ],
    crew: crew('فرانک دارابونت'),
  },
  'blade-runner-2049': {
    tmdbId: 335984,
    tmdbType: 'movie',
    tagline: 'بیشتر انسان باش',
    director: 'دنی ویلنوو',
    trailerYoutubeId: 'gCcx85zbxz4',
    cast: [
      c('br1', 'رایان گاسلینگ', 'K', tmdbFace('br1.jpg')),
      c('br2', 'هریسون فورد', 'Deckard', tmdbFace('br2.jpg')),
    ],
    crew: crew('دنی ویلنوو'),
  },
  titanic: {
    tmdbId: 597,
    tmdbType: 'movie',
    tagline: 'هیچ‌چیز روی زمین نمی‌تواند آن‌ها را از هم جدا کند',
    director: 'جیمز کامرون',
    trailerYoutubeId: 'kVrqfYjkTdQ',
    cast: [
      c('ti1', 'لئوناردو دی‌کاپریو', 'Jack', tmdbFace('ti1.jpg')),
      c('ti2', 'کیت وینسلت', 'Rose', tmdbFace('ti2.jpg')),
    ],
    crew: crew('جیمز کامرون'),
  },
  'the-matrix': {
    tmdbId: 603,
    tmdbType: 'movie',
    tagline: 'قرص قرمز را بخور',
    director: 'خواهران واچوفسکی',
    trailerYoutubeId: 'vKQi3bBA1y8',
    cast: [
      c('mx1', 'کیانو ریوز', 'Neo', tmdbFace('mx1.jpg')),
      c('mx2', 'لارنس فیشبرن', 'Morpheus', tmdbFace('mx2.jpg')),
    ],
    crew: crew('خواهران واچوفسکی'),
  },
  'lotr-fellowship': {
    tmdbId: 120,
    tmdbType: 'movie',
    tagline: 'یک حلقه برای فرمانروایی همه',
    director: 'پیتر جکسون',
    trailerYoutubeId: 'V75dMMIW2B4',
    cast: [
      c('lr1', 'الایجا وود', 'Frodo', tmdbFace('lr1.jpg')),
      c('lr2', 'ایان مک‌کلن', 'Gandalf', tmdbFace('lr2.jpg')),
    ],
    crew: crew('پیتر جکسون'),
  },
  'saving-private-ryan': {
    tmdbId: 857,
    tmdbType: 'movie',
    tagline: 'یافتن یک سرباز در میان میلیون‌ها',
    director: 'استیون اسپیلبرگ',
    trailerYoutubeId: 'zwhP5b4tD6g',
    cast: [
      c('sp1', 'تام هنکس', 'Captain Miller', tmdbFace('sp1.jpg')),
      c('sp2', 'مت دیمون', 'Private Ryan', tmdbFace('sp2.jpg')),
    ],
    crew: crew('استیون اسپیلبرگ'),
  },
  'home-alone': {
    tmdbId: 771,
    tmdbType: 'movie',
    tagline: 'خانه تنها… و خطرناک',
    director: 'کریس کلمبوس',
    trailerYoutubeId: 'jEDaVHmw7r4',
    cast: [
      c('ha1', 'مکالی کالکین', 'Kevin', tmdbFace('ha1.jpg')),
      c('ha2', 'جو پشی', 'Harry', tmdbFace('ha2.jpg')),
    ],
    crew: crew('کریس کلمبوس'),
  },
  gladiator: {
    tmdbId: 98,
    tmdbType: 'movie',
    tagline: 'قدرت یک مرد علیه یک امپراتوری',
    director: 'ریدلی اسکات',
    trailerYoutubeId: 'owK1qxDselE',
    cast: [
      c('gl1', 'راسل کرو', 'Maximus', tmdbFace('gl1.jpg')),
      c('gl2', 'خواکین فینیکس', 'Commodus', tmdbFace('gl2.jpg')),
    ],
    crew: crew('ریدلی اسکات'),
  },
  'the-conjuring': {
    tmdbId: 138843,
    tmdbType: 'movie',
    tagline: 'بر اساس پرونده واقعی',
    director: 'جیمز ون',
    trailerYoutubeId: 'k10ETZ41q5o',
    cast: [
      c('cj1', 'ورا فارمیگا', 'Lorraine Warren', tmdbFace('cj1.jpg')),
      c('cj2', 'پاتریک ویلسون', 'Ed Warren', tmdbFace('cj2.jpg')),
    ],
    crew: crew('جیمز ون'),
  },
  'raiders-lost-ark': {
    tmdbId: 85,
    tmdbType: 'movie',
    tagline: 'ماجراجویی افسانه‌ای',
    director: 'استیون اسپیلبرگ',
    trailerYoutubeId: '0xQMTaAo6iE',
    cast: [
      c('ra1', 'هریسون فورد', 'Indiana Jones', tmdbFace('ra1.jpg')),
      c('ra2', 'کارن آلن', 'Marion', tmdbFace('ra2.jpg')),
    ],
    crew: crew('استیون اسپیلبرگ'),
  },
  rocky: {
    tmdbId: 1366,
    tmdbType: 'movie',
    tagline: 'قهرمان خودش شو',
    director: 'جان جی. آویلدسن',
    trailerYoutubeId: '7RYpJEeBzHs',
    cast: [
      c('ro1', 'سیلوستر استالونه', 'Rocky Balboa', tmdbFace('ro1.jpg')),
      c('ro2', 'تالیا شایر', 'Adrian', tmdbFace('ro2.jpg')),
    ],
    crew: crew('جان جی. آویلدسن'),
  },
  'django-unchained': {
    tmdbId: 68718,
    tmdbType: 'movie',
    tagline: 'انتقام شیرین است',
    director: 'کوئنتین تارانتینو',
    trailerYoutubeId: 'eUdM9vrCbow',
    cast: [
      c('dj1', 'جیمی فاکس', 'Django', tmdbFace('dj1.jpg')),
      c('dj2', 'کریستوفر والتز', 'Dr. Schultz', tmdbFace('dj2.jpg')),
    ],
    crew: crew('کوئنتین تارانتینو'),
  },
  se7en: {
    tmdbId: 807,
    tmdbType: 'movie',
    tagline: 'هفت گناه کبیره',
    director: 'دیوید فینچر',
    trailerYoutubeId: 'znmZoVkCjpI',
    cast: [
      c('sv1', 'برد پیت', 'Mills', tmdbFace('sv1.jpg')),
      c('sv2', 'مورگان فریمن', 'Somerset', tmdbFace('sv2.jpg')),
    ],
    crew: crew('دیوید فینچر'),
  },
  'shutter-island': {
    tmdbId: 11324,
    tmdbType: 'movie',
    tagline: 'بعضی جاها را نباید ترک کرد',
    director: 'مارتین اسکورسیزی',
    trailerYoutubeId: '5iaYLCiq5RM',
    cast: [
      c('si1', 'لئوناردو دی‌کاپریو', 'Teddy Daniels', tmdbFace('si1.jpg')),
      c('si2', 'مارک رافالو', 'Chuck', tmdbFace('si2.jpg')),
    ],
    crew: crew('مارتین اسکورسیزی'),
  },
  'the-hangover': {
    tmdbId: 18785,
    tmdbType: 'movie',
    tagline: 'بعضی شب‌ها را نباید به یاد آورد',
    director: 'تاد فیلیپس',
    trailerYoutubeId: 'tcdUhdOlz9M',
    cast: [
      c('hg1', 'بردلی کوپر', 'Phil', tmdbFace('hg1.jpg')),
      c('hg2', 'اد هلمز', 'Stu', tmdbFace('hg2.jpg')),
    ],
    crew: crew('تاد فیلیپس'),
  },
  'wolf-of-wall-street': {
    tmdbId: 106646,
    tmdbType: 'movie',
    tagline: 'طمع حد ندارد',
    director: 'مارتین اسکورسیزی',
    trailerYoutubeId: 'iszwuX1AK6A',
    cast: [
      c('ww1', 'لئوناردو دی‌کاپریو', 'Jordan Belfort', tmdbFace('ww1.jpg')),
      c('ww2', 'Jonah Hill', 'Donnie Azoff', tmdbFace('ww2.jpg')),
    ],
    crew: crew('مارتین اسکورسیزی'),
  },
  air: {
    tmdbId: 864692,
    tmdbType: 'movie',
    tagline: 'کفش یک نسل',
    director: 'بن افلک',
    trailerYoutubeId: 'Euy4Yu6zc1o',
    cast: [
      c('ai1', 'مت دیمون', 'Sonny Vaccaro', tmdbFace('ai1.jpg')),
      c('ai2', 'بن افلک', 'Phil Knight', tmdbFace('ai2.jpg')),
    ],
    crew: crew('بن افلک'),
  },
  fall: {
    tmdbId: 985939,
    tmdbType: 'movie',
    tagline: 'بالاتر از ترس',
    director: 'اسکات مان',
    trailerYoutubeId: 'iSsmAGbI9s0',
    cast: [
      c('fa1', 'گریس کارولین کاری', 'Becky', tmdbFace('fa1.jpg')),
      c('fa2', 'ویرجینیا گاردنر', 'Hunter', tmdbFace('fa2.jpg')),
    ],
    crew: crew('اسکات مان'),
  },
}

/** Fallback cast when title has no curated credits — still better than «بازیگر ۱» */
export function getTitleCredits(id: string): TitleCredits | undefined {
  return titleCredits[id]
}

export function youtubeTrailerId(id: string): string | undefined {
  const yt = titleCredits[id]?.trailerYoutubeId
  if (!yt || yt.includes('.') || yt.length < 8 || yt.length > 15) return undefined
  return yt
}

export function youtubeTrailerUrl(id: string): string | undefined {
  const yt = youtubeTrailerId(id)
  if (!yt) return undefined
  return `https://www.youtube.com/embed/${yt}`
}

export function youtubeWatchUrl(id: string): string | undefined {
  const yt = youtubeTrailerId(id)
  if (!yt) return undefined
  return `https://www.youtube.com/watch?v=${yt}`
}

export function youtubeThumbnailUrl(id: string): string | undefined {
  const yt = youtubeTrailerId(id)
  if (!yt) return undefined
  return `https://i.ytimg.com/vi/${yt}/hqdefault.webp`
}

export function screenshotsForTitle(id: string, poster: string, backdrop: string): Screenshot[] {
  return [
    { id: `${id}-ss1`, src: backdrop || poster, caption: 'تصویر پس‌زمینه' },
    { id: `${id}-ss2`, src: poster, caption: 'پوستر رسمی' },
  ]
}
