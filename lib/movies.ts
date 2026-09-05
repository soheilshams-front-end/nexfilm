import { getAllSaintstreamIds, getSaintstreamTitle } from '@/lib/saintstream-home'
import {
  BLENDER_IDS,
  FICTIONAL_IDS,
  getTitleCredits,
  isPublicCatalogId,
  normalizeMaturity,
  screenshotsForTitle,
  youtubeWatchUrl,
} from '@/lib/title-credits'
import { fa } from '@/lib/format-fa'
import { seriesEpisodes } from '@/lib/series-episodes'

export { fa } from '@/lib/format-fa'

export type TitleAccess = 'free' | 'premium'

export type Movie = {
  id: string
  title: string
  titleEn: string
  tagline: string
  description: string
  poster: string
  backdrop: string
  year: number
  rating: number
  maturity: string
  duration: string
  genres: string[]
  cast: string[]
  director: string
  type: 'Film' | 'Series'
  match: number
  progress?: number // 0-100 for continue watching
  featured?: boolean
  award?: string
  isNew?: boolean
  rank?: number
  /** Freemium: free base watch vs premium quality/subs */
  access?: TitleAccess
  /** Local path (/videos/foo.mp4) or remote URL for real playback */
  videoUrl?: string
  trailerUrl?: string
}

export type CastMember = {
  id: string
  name: string
  role: string
  character: string
  photo: string
}

export type CrewMember = {
  id: string
  name: string
  role: string
}

export type Review = {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  content: string
  helpful: number
}

export type Screenshot = {
  id: string
  src: string
  caption: string
}

export type Episode = {
  id: number
  title: string
  duration: string
  description: string
  thumbnail: string
  videoUrl?: string
}

export type Season = {
  id: number
  title: string
  episodes: Episode[]
}

export type Actor = {
  id: string
  name: string
  role: string
  photo: string
  films: number
}

export type Collection = {
  id: string
  title: string
  subtitle: string
  cover: string
  count: number
  accent: string
}

export type Studio = {
  id: string
  name: string
  logo: string
  titles: number
  accent: string
}

export type EditorPick = {
  movieId: string
  note: string
}

export type NewEpisode = {
  movieId: string
  episodeTitle: string
  season: number
  episode: number
  addedAgo: string
}

const backdrops = {
  echoes: '/backdrops/echoes.png',
  neon: '/backdrops/neon.png',
  horizon: '/backdrops/horizon.png',
}

/** Creative Commons sample clips (Google-hosted) for dev/test playback */
export const sampleVideos = {
  bigBuckBunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  tearsOfSteel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  elephantsDream: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  forBiggerBlazes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
} as const

/** Sample premium titles for freemium UI (Phase 1 — no payment) */
const PREMIUM_IDS = new Set([
  'dune-part-two',
  'star-wars-tfa',
  'neon-requiem',
  'echoes-of-tomorrow',
  'the-last-of-us',
  'squid-game',
])

const DEMO_VIDEO_POOL = [
  sampleVideos.sintel,
  sampleVideos.bigBuckBunny,
  sampleVideos.tearsOfSteel,
  sampleVideos.elephantsDream,
  sampleVideos.forBiggerBlazes,
]

function demoVideoForId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i) * (i + 1)) % DEMO_VIDEO_POOL.length
  return DEMO_VIDEO_POOL[hash] ?? sampleVideos.sintel
}

function withCatalogDefaults(movie: Movie): Movie {
  const access: TitleAccess = movie.access ?? (PREMIUM_IDS.has(movie.id) ? 'premium' : 'free')
  const credits = getTitleCredits(movie.id)
  const trailer = movie.trailerUrl ?? youtubeWatchUrl(movie.id)
  const isBlender = BLENDER_IDS.has(movie.id)
  // Commercial titles: do not pretend a sample bunny clip is the feature film.
  // Use explicit videoUrl (Blender) or leave unset so watch page can show trailer CTA.
  const videoUrl = isBlender
    ? movie.videoUrl ?? demoVideoForId(movie.id)
    : movie.videoUrl && !(DEMO_VIDEO_POOL as readonly string[]).includes(movie.videoUrl)
      ? movie.videoUrl
      : undefined

  return {
    ...movie,
    access,
    maturity: normalizeMaturity(movie.maturity),
    tagline: movie.tagline || credits?.tagline || movie.genres.slice(0, 2).join(' · '),
    director: movie.director && movie.director !== 'کارگردان' ? movie.director : credits?.director || movie.director,
    cast:
      movie.cast?.[0] && movie.cast[0] !== 'بازیگر ۱'
        ? movie.cast
        : credits?.cast.map((c) => c.name) ?? movie.cast,
    trailerUrl: trailer,
    videoUrl,
  }
}

export function isPremiumTitle(movieOrId: Movie | string): boolean {
  if (typeof movieOrId === 'string') return PREMIUM_IDS.has(movieOrId)
  return (movieOrId.access ?? (PREMIUM_IDS.has(movieOrId.id) ? 'premium' : 'free')) === 'premium'
}

/** Qualities/subtitles that require subscription (UI lock only) */
export const PREMIUM_QUALITIES = new Set(['۴K HDR', '۱۰۸۰p'])
export const PREMIUM_SUBTITLES = new Set(['فارسی اختصاصی'])

export const movies: Movie[] = [
  {
    id: 'echoes-of-tomorrow',
    title: 'Echoes of Tomorrow',
    titleEn: 'Echoes of Tomorrow',
    tagline: 'آینده، همه‌چیز را به یاد می‌آورد.',
    description:
      'ستاره‌شناسی سرگردان بنای باستانی‌ای را کشف می‌کند که خاطرات تمدنی را پخش می‌کند که هنوز متولد نشده. هنگامی که پیام‌ها قوی‌تر می‌شوند، او باید تصمیم بگیرد که آیا به آینده‌ای پاسخ دهد که ممکن است گذشته‌اش را پاک کند یا خیر.',
    poster: '/posters/echoes.png',
    backdrop: backdrops.echoes,
    year: 2025,
    rating: 8.9,
    maturity: '+۱۳',
    duration: '۲ ساعت ۱۸ دقیقه',
    genres: ['علمی‌تخیلی', 'درام', 'معمایی'],
    cast: ['نائومی وِیل', 'الیاس کُر', 'ماریسول چن', 'دِو اشکرافت'],
    director: 'ایوو مارشتی',
    type: 'Film',
    match: 98,
    progress: 42,
    featured: true,
    award: 'برنده خرس طلایی',
    isNew: true,
    videoUrl: sampleVideos.sintel,
    trailerUrl: sampleVideos.forBiggerBlazes,
  },
  {
    id: 'neon-requiem',
    title: 'Neon Requiem',
    titleEn: 'Neon Requiem',
    tagline: 'در شهری که هرگز نمی‌خوابد، کسی باید بیدار بماند.',
    description:
      'کارآگاهی فرسوده در تعقیب شبحی از دل زیرشهر بارانی و نئون‌پوش، جایی که هر انعکاسی دروغی را پنهان می‌کند و خاطره خودش به فروش می‌رسد.',
    poster: '/posters/neon.png',
    backdrop: backdrops.neon,
    year: 2024,
    rating: 8.4,
    maturity: '+۱۸',
    duration: '۱ ساعت ۵۶ دقیقه',
    genres: ['هیجان‌انگیز', 'سایبرپانک', 'جنایی'],
    cast: ['ریس کالووی', 'سوکی تاناکا', 'امبروز لین'],
    director: 'پترا سول',
    type: 'Film',
    match: 95,
    progress: 71,
    award: 'نامزد اسکار',
  },
  {
    id: 'silent-horizon',
    title: 'The Silent Horizon',
    titleEn: 'The Silent Horizon',
    tagline: 'دریا رازهای خودش را نگه می‌دارد.',
    description:
      'وقتی ماهیگیری تنها در سواحل ناپدید می‌شود، دخترش برای بازگرداندنش به خانه، وارد طوفانی از حقیقت‌های مدفون خانوادگی می‌شود؛ پیش از آنکه جذر و مد برای همیشه برگردد.',
    poster: '/posters/horizon.png',
    backdrop: backdrops.horizon,
    year: 2023,
    rating: 8.1,
    maturity: '+۱۳',
    duration: '۲ ساعت ۰۴ دقیقه',
    genres: ['درام', 'هیجان‌انگیز'],
    cast: ['فرِیا لوند', 'توماس برگ', 'آیْف رایان'],
    director: 'لنا هارتمان',
    type: 'Film',
    match: 91,
    progress: 18,
  },
  {
    id: 'crimson-vale',
    title: 'Crimson Vale',
    titleEn: 'Crimson Vale',
    tagline: 'هر افسانه‌ای در غبار به پایان می‌رسد.',
    description:
      'تفنگچی بازنشسته‌ای برای تسویه آخرین حساب به شهر مرزی در حال مرگی بازمی‌گردد، اما می‌بیند گذشته در لبه افقی خون‌رنگ به انتظار او نشسته است.',
    poster: '/posters/crimson.png',
    backdrop: backdrops.echoes,
    year: 2024,
    rating: 7.9,
    maturity: '+۱۸',
    duration: '۲ ساعت ۱۱ دقیقه',
    genres: ['وسترن', 'اکشن', 'درام'],
    cast: ['کورمک ریس', 'ایزابل دوآرت', 'وایت استون'],
    director: 'دیگو کروز',
    type: 'Film',
    match: 88,
    award: 'برنده نخل طلایی',
  },
  {
    id: 'afterlight',
    title: 'Afterlight',
    titleEn: 'Afterlight',
    tagline: 'فراتر از آخرین ستاره، چیزی در انتظار است.',
    description:
      'خدمه یک کشتی نجات فضاییِ ژرف، فراخوان اضطراری را از سیاره‌ای دریافت می‌کنند که نباید وجود داشته باشد؛ رو به کشفی می‌روند که معنای انسان بودن را دگرگون می‌کند.',
    poster: '/posters/afterlight.png',
    backdrop: backdrops.echoes,
    year: 2025,
    rating: 8.6,
    maturity: '+۱۳',
    duration: '۳ فصل',
    genres: ['علمی‌تخیلی', 'ماجراجویی'],
    cast: ['جونیا اُکورو', 'ساشا ولکوف', 'مالیک رِن'],
    director: 'هانا یوشیدا',
    type: 'Series',
    match: 96,
    progress: 55,
    isNew: true,
  },
  {
    id: 'paper-lanterns',
    title: 'Paper Lanterns',
    titleEn: 'Paper Lanterns',
    tagline: 'برخی نورها هرگز خاموش نمی‌شوند.',
    description:
      'دو غریبه در جشنواره‌ای تابستانی با هم آشنا می‌شوند و شبی را با هم می‌گذرانند که طنینش در دو دهه، دو شهر و هر انتخابی در میان آن‌ها پیچیده خواهد شد.',
    poster: '/posters/lanterns.png',
    backdrop: backdrops.neon,
    year: 2023,
    rating: 8.3,
    maturity: 'همه',
    duration: '۱ ساعت ۴۹ دقیقه',
    genres: ['عاشقانه', 'درام'],
    cast: ['می لین', 'آرجون رائو', 'کلارا بی‌شاپ'],
    director: 'سوفیا فریرا',
    type: 'Film',
    match: 90,
  },
  {
    id: 'ironclad',
    title: 'Ironclad',
    titleEn: 'Ironclad',
    tagline: 'هیچ زرهی به اندازه کافی ضخیم نیست.',
    description:
      'سرباز ویژه‌ای در خط مقدم دشمن رها می‌شود و باید از میان آتش و خیانت بجنگد تا فرماندهی‌ای را که یگانش را قربانی کرد، افشا کند.',
    poster: '/posters/ironclad.png',
    backdrop: backdrops.echoes,
    year: 2024,
    rating: 7.7,
    maturity: '+۱۸',
    duration: '۲ ساعت ۰۲ دقیقه',
    genres: ['اکشن', 'جنگی', 'هیجان‌انگیز'],
    cast: ['دانا فراست', 'ئو مارش', 'کنجی آبه'],
    director: 'مارکوس ولز',
    type: 'Film',
    match: 84,
  },
  {
    id: 'midnight-archive',
    title: 'Midnight Archive',
    titleEn: 'Midnight Archive',
    tagline: 'هر پرونده‌ای جسدی را پنهان می‌کند.',
    description:
      'کارمند ظریف آرشیو، توطئه‌ای دهه‌سال‌ه در دل بایگانی شهر کشف می‌کند و تنها کسی می‌شود که می‌تواند آن را ثابت کند — یا نام بعدی باشد که ناپدید می‌شود.',
    poster: '/posters/archive.png',
    backdrop: backdrops.neon,
    year: 2025,
    rating: 8.0,
    maturity: '+۱۶',
    duration: '۲ فصل',
    genres: ['معمایی', 'هیجان‌انگیز', 'درام'],
    cast: ['نورا وینتر', 'سم اُکافور', 'پریا ناندان'],
    director: 'النا راث',
    type: 'Series',
    match: 89,
    progress: 33,
    isNew: true,
  },
  {
    id: 'sintel-short',
    title: 'Sintel',
    titleEn: 'Sintel',
    tagline: 'جستجویی که تمام نمی‌شود.',
    description:
      'دختری جوان در جستجوی اژدهایی که روزی پرورش داده — انیمیشن کوتاه متن‌باز Blender Foundation، مناسب تست پخش واقعی.',
    poster: '/posters/echoes.png',
    backdrop: backdrops.horizon,
    year: 2010,
    rating: 8.2,
    maturity: '+۱۳',
    duration: '۱۵ دقیقه',
    genres: ['انیمیشن', 'فانتزی', 'درام'],
    cast: ['ملانی فگر'],
    director: 'کولین لیسبتر',
    type: 'Film',
    match: 92,
    isNew: true,
    videoUrl: sampleVideos.sintel,
    trailerUrl: sampleVideos.forBiggerBlazes,
  },
  {
    id: 'big-buck-bunny',
    title: 'Big Buck Bunny',
    titleEn: 'Big Buck Bunny',
    tagline: 'یک ماجرای جنگلی با حجم کم.',
    description:
      'انیمیشن کوتاه متن‌باز Blender — فایل تست کم‌حجم برای پخش mp4 در Nex Film.',
    poster: '/posters/lanterns.png',
    backdrop: backdrops.horizon,
    year: 2008,
    rating: 7.8,
    maturity: 'همه',
    duration: '۱۰ دقیقه',
    genres: ['انیمیشن', 'کمدی', 'خانوادگی'],
    cast: [],
    director: 'Blender Foundation',
    type: 'Film',
    match: 88,
    isNew: true,
    videoUrl: sampleVideos.bigBuckBunny,
  },
  {
    id: 'tears-of-steel',
    title: 'Tears of Steel',
    titleEn: 'Tears of Steel',
    tagline: 'علمی‌تخیلی live-action کوتاه.',
    description:
      'فیلم کوتاه VFX از Blender Foundation — تست پخش با کیفیت بالاتر و مدت بیشتر.',
    poster: '/posters/ironclad.png',
    backdrop: backdrops.echoes,
    year: 2012,
    rating: 7.5,
    maturity: '+۱۳',
    duration: '۱۲ دقیقه',
    genres: ['علمی‌تخیلی', 'اکشن'],
    cast: ['دerek de Lint'],
    director: 'Ian Hubert',
    type: 'Film',
    match: 86,
    videoUrl: sampleVideos.tearsOfSteel,
  },
  {
    id: 'elephants-dream',
    title: 'Elephants Dream',
    titleEn: 'Elephants Dream',
    tagline: 'اولین پروژه متن‌باز Open Movie.',
    description:
      'انیمیشن سورreal کوتاه — یکی دیگر از نمونه‌های رسمی برای تست پلیر.',
    poster: '/posters/neon.png',
    backdrop: backdrops.neon,
    year: 2006,
    rating: 7.2,
    maturity: '+۱۳',
    duration: '۱۱ دقیقه',
    genres: ['انیمیشن', 'معمایی'],
    cast: [],
    director: 'Blender Foundation',
    type: 'Film',
    match: 82,
    videoUrl: sampleVideos.elephantsDream,
  },
]

export const episodes = [
  {
    id: 1,
    title: 'سیگنال',
    duration: '۵۸ دقیقه',
    description:
      'یک بررسی معمولی به اولین تماس تبدیل می‌شود وقتی خدمه پخشی را دریافت می‌کنند که کهنه‌تر از خود کهکشان است.',
  },
  {
    id: 2,
    title: 'چاه گرانش',
    duration: '۵۲ دقیقه',
    description:
      'هنگامی که کشتی به سمت سیاره غیرممکن کشیده می‌شود، وفاداری‌های کهن زیر فشار می‌شکنند.',
  },
  {
    id: 3,
    title: 'فرود',
    duration: '۱ ساعت ۰۱ دقیقه',
    description:
      'گروه فرود وارد طوفان‌های سطح می‌شود و ویرانه‌هایی را می‌یابد که آن‌ها را به یاد می‌آورد.',
  },
  {
    id: 4,
    title: 'اتاق پژواک',
    duration: '۵۵ دقیقه',
    description:
      'سیگنال با صدای مردگان سخن می‌گوید و ناخدا باید تصمیم بگیرد به چه کسی اعتماد کند.',
  },
]

export const actors: Actor[] = [
  { id: 'a1', name: 'نائومی وِیل', role: 'بازیگر نقش اول زن', photo: '/actors/a1.png', films: 32 },
  { id: 'a2', name: 'الیاس کُر', role: 'بازیگر نقش اول مرد', photo: '/actors/a2.png', films: 41 },
  { id: 'a3', name: 'ماریسول چن', role: 'بازیگر مکمل', photo: '/actors/a3.png', films: 27 },
  { id: 'a4', name: 'دِو اشکرافت', role: 'بازیگر مکمل', photo: '/actors/a4.png', films: 19 },
  { id: 'a5', name: 'ریس کالووی', role: 'بازیگر نقش اول مرد', photo: '/actors/a5.png', films: 35 },
  { id: 'a6', name: 'سوکی تاناکا', role: 'بازیگر نقش اول زن', photo: '/actors/a6.png', films: 24 },
]

export const castMembers: CastMember[] = [
  { id: 'c1', name: 'نائومی وِیل', role: 'بازیگر نقش اول زن', character: 'دکتر لیا وِنس', photo: '/actors/a1.png' },
  { id: 'c2', name: 'الیاس کُر', role: 'بازیگر نقش اول مرد', character: 'کاپیتان اِرو کُر', photo: '/actors/a2.png' },
  { id: 'c3', name: 'ماریسول چن', role: 'بازیگر مکمل', character: 'سارا', photo: '/actors/a3.png' },
  { id: 'c4', name: 'دِو اشکرافت', role: 'بازیگر مکمل', character: 'مارتین', photo: '/actors/a4.png' },
  { id: 'c5', name: 'ریس کالووی', role: 'بازیگر نقش اول مرد', character: 'کارآگاه هِل', photo: '/actors/a5.png' },
  { id: 'c6', name: 'سوکی تاناکا', role: 'بازیگر نقش اول زن', character: 'کیکو', photo: '/actors/a6.png' },
]

export const crewMembers: CrewMember[] = [
  { id: 'cr1', name: 'ایوو مارشتی', role: 'کارگردان' },
  { id: 'cr2', name: 'هانا یوشیدا', role: 'نویسنده' },
  { id: 'cr3', name: 'لارس اِکبِری', role: 'مدیر فیلم‌برداری' },
  { id: 'cr4', name: 'میا فونتان', role: 'تدوین‌گر' },
  { id: 'cr5', name: 'کای نوردمار', role: 'موسیقی' },
  { id: 'cr6', name: 'روزا کلِمنس', role: 'طراح تولید' },
]

export const reviews: Review[] = [
  {
    id: 'r1', author: 'سارا م.', avatar: '/actors/a3.png', rating: 9, date: '۲ هفته پیش',
    content: 'یکی از زیباترین فیلم‌های علمی‌تخیلی سال. تصویربرداری نفس‌گیر و داستانی که تا انتها شما را درگیر نگه می‌دارد.',
    helpful: 248,
  },
  {
    id: 'r2', author: 'آرش ر.', avatar: '/actors/a2.png', rating: 8, date: '۱ ماه پیش',
    content: 'فضاسازی فوق‌العاده و بازی‌های درخشان. پایان‌بندی هوشمندانه بود و انتظار دنباله را دارم.',
    helpful: 156,
  },
  {
    id: 'r3', author: 'مریم ک.', avatar: '/actors/a6.png', rating: 10, date: '۳ روز پیش',
    content: 'شاهکاری در روایت‌گری. موسیقی و جلوه‌های ویژه بی‌نقص بودند. حتماً تماشا کنید.',
    helpful: 92,
  },
]

export const screenshots: Screenshot[] = [
  { id: 's1', src: '/backdrops/echoes.png', caption: 'صحنه افتتاحیه — بنای باستانی' },
  { id: 's2', src: '/backdrops/neon.png', caption: 'شهر نئونی — تعقیب و گریز' },
  { id: 's3', src: '/backdrops/horizon.png', caption: 'ساحل خاموش — لحظه وداع' },
  { id: 's4', src: '/posters/echoes.png', caption: 'پوستر بین‌المللی' },
  { id: 's5', src: '/posters/neon.png', caption: 'پوستر تبلیغاتی' },
  { id: 's6', src: '/posters/horizon.png', caption: 'پوستر جایگزین' },
]

export const seriesSeasons: Record<string, Season[]> = {
  afterlight: [
    {
      id: 1,
      title: 'فصل ۱',
      episodes: [
        {
          id: 1,
          title: 'سیگنال',
          duration: '۵۸ دقیقه',
          description: 'خدمه اولین پخش را دریافت می‌کنند.',
          thumbnail: '/backdrops/echoes.png',
          videoUrl: sampleVideos.sintel,
        },
        {
          id: 2,
          title: 'چاه گرانش',
          duration: '۵۲ دقیقه',
          description: 'کشتی به سمت سیاره غیرممکن کشیده می‌شود.',
          thumbnail: '/backdrops/neon.png',
          videoUrl: sampleVideos.forBiggerBlazes,
        },
        {
          id: 3,
          title: 'فرود',
          duration: '۱ ساعت ۰۱ دقیقه',
          description: 'گروه فرود وارد طوفان‌های سطح می‌شود.',
          thumbnail: '/backdrops/horizon.png',
          videoUrl: sampleVideos.bigBuckBunny,
        },
      ],
    },
    {
      id: 2,
      title: 'فصل ۲',
      episodes: [
        {
          id: 1,
          title: 'بازگشت',
          duration: '۵۴ دقیقه',
          description: 'خدمه به خانه بازمی‌گردند.',
          thumbnail: '/backdrops/neon.png',
          videoUrl: sampleVideos.tearsOfSteel,
        },
        {
          id: 2,
          title: 'شکاف',
          duration: '۴۹ دقیقه',
          description: 'گذشته و حال در هم می‌آمیزد.',
          thumbnail: '/backdrops/echoes.png',
          videoUrl: sampleVideos.elephantsDream,
        },
      ],
    },
  ],
  'midnight-archive': [
    {
      id: 1,
      title: 'فصل ۱',
      episodes: [
        {
          id: 1,
          title: 'پرونده گمشده',
          duration: '۴۸ دقیقه',
          description: 'اولین سرنخ در بایگانی نیمه‌شب.',
          thumbnail: '/backdrops/neon.png',
          videoUrl: sampleVideos.sintel,
        },
        {
          id: 2,
          title: 'سایه‌های بایگانی',
          duration: '۵۱ دقیقه',
          description: 'هر پرونده جسدی را پنهان می‌کند.',
          thumbnail: '/backdrops/echoes.png',
          videoUrl: sampleVideos.bigBuckBunny,
        },
      ],
    },
    {
      id: 2,
      title: 'فصل ۲',
      episodes: [
        {
          id: 1,
          title: 'نام بعدی',
          duration: '۵۰ دقیقه',
          description: 'لیست ناپدیدشدگان طولانی‌تر می‌شود.',
          thumbnail: '/backdrops/horizon.png',
          videoUrl: sampleVideos.tearsOfSteel,
        },
      ],
    },
  ],
}

/** @deprecated use getSeasons(seriesId) */
export const seasons: Season[] = seriesSeasons.afterlight

export const playerSettings = {
  qualities: ['خودکار', '۴K HDR', '۱۰۸۰p', '۷۲۰p', '۴۸۰p'],
  audios: ['فارسی (دوبله)', 'انگلیسی (اصلی)', 'انگلیسی + توضیح صوتی'],
  subtitles: ['خاموش', 'فارسی', 'فارسی اختصاصی', 'انگلیسی', 'عربی', 'اسپانیایی'],
  speeds: ['۰.۵×', '۰.۷۵×', '۱×', '۱.۲۵×', '۱.۵×', '۲×'],
}

export const collections: Collection[] = [
  {
    id: 'scifi-night',
    title: 'شب علمی‌تخیلی',
    subtitle: 'سفری به کهکشان‌های دوردست',
    cover: '/backdrops/echoes.png',
    count: 18,
    accent: 'oklch(0.7 0.15 250)',
  },
  {
    id: 'neon-noir',
    title: 'نئون و نوآر',
    subtitle: 'جنایت در زیر نور شهر',
    cover: '/backdrops/neon.png',
    count: 12,
    accent: 'oklch(0.7 0.18 320)',
  },
  {
    id: 'epic-drama',
    title: 'درام‌های حماسی',
    subtitle: 'داستان‌هایی که ماندگارند',
    cover: '/backdrops/horizon.png',
    count: 24,
    accent: 'oklch(0.75 0.12 60)',
  },
]

export const genres = [
  'همه',
  'علمی‌تخیلی',
  'درام',
  'هیجان‌انگیز',
  'معمایی',
  'اکشن',
  'عاشقانه',
  'جنایی',
  'ماجراجویی',
  'وسترن',
  'سایبرپانک',
  'جنگی',
]

export const genreTiles = [
  { id: 'scifi', label: 'علمی‌تخیلی', poster: '/posters/echoes.png', accent: 'oklch(0.7 0.16 255)' },
  { id: 'noir', label: 'نئون و نوآر', poster: '/posters/neon.png', accent: 'oklch(0.65 0.19 320)' },
  { id: 'drama', label: 'درام', poster: '/posters/horizon.png', accent: 'oklch(0.7 0.12 75)' },
  { id: 'action', label: 'اکشن', poster: '/posters/ironclad.png', accent: 'oklch(0.62 0.2 28)' },
  { id: 'romance', label: 'عاشقانه', poster: '/posters/lanterns.png', accent: 'oklch(0.7 0.15 15)' },
  { id: 'western', label: 'وسترن', poster: '/posters/crimson.png', accent: 'oklch(0.6 0.15 40)' },
]

export const studios: Studio[] = [
  { id: 's1', name: 'استودیو آرتمیس', logo: '/posters/echoes.png', titles: 48, accent: 'oklch(0.7 0.16 255)' },
  { id: 's2', name: 'نئون لاین', logo: '/posters/neon.png', titles: 32, accent: 'oklch(0.65 0.19 320)' },
  { id: 's3', name: 'هورایزن پیکچرز', logo: '/posters/horizon.png', titles: 27, accent: 'oklch(0.7 0.12 75)' },
  { id: 's4', name: 'کریمسون ورکس', logo: '/posters/crimson.png', titles: 19, accent: 'oklch(0.6 0.15 40)' },
  { id: 's5', name: 'لانترن فیلمز', logo: '/posters/lanterns.png', titles: 22, accent: 'oklch(0.7 0.15 15)' },
  { id: 's6', name: 'آیرون‌کَست', logo: '/posters/ironclad.png', titles: 16, accent: 'oklch(0.62 0.2 28)' },
]

export const editorPicks: EditorPick[] = [
  { movieId: 'dune-part-two', note: 'حماسهٔ شن و سرنوشت.' },
  { movieId: 'oppenheimer', note: 'تاریخی، سنگین، فراموش‌نشدنی.' },
  { movieId: 'parasite', note: 'درام اجتماعی در اوج.' },
]

export const newEpisodes: NewEpisode[] = [
  { movieId: 'stranger-things', episodeTitle: 'Chapter One: The Vanishing of Will Byers', season: 1, episode: 1, addedAgo: 'این هفته' },
  { movieId: 'the-last-of-us', episodeTitle: 'When You\'re Lost in the Darkness', season: 1, episode: 1, addedAgo: 'این هفته' },
  { movieId: 'wednesday', episodeTitle: 'Wednesday\'s Child Is Full of Woe', season: 1, episode: 1, addedAgo: 'اخیراً' },
  { movieId: 'shogun', episodeTitle: 'Anjin', season: 1, episode: 1, addedAgo: 'اخیراً' },
]

export function getMovie(id: string): Movie | undefined {
  const m = movies.find((item) => item.id === id)
  return m ? withCatalogDefaults(m) : undefined
}

/** Resolve catalog movie OR Saintstream Figma title into a Movie for detail/watch routes. */
export function resolveTitle(id: string): Movie | undefined {
  const fromCatalog = getMovie(id)
  if (fromCatalog) return fromCatalog

  const ss = getSaintstreamTitle(id)
  if (!ss) return undefined

  // Saintstream ratings are ~0–5; catalog uses ~0–10. Normalize for UI consistency.
  const rating = ss.rating <= 5 ? Number((ss.rating * 2).toFixed(1)) : ss.rating
  const credits = getTitleCredits(ss.id)

  return withCatalogDefaults({
    id: ss.id,
    title: ss.titleEn,
    titleEn: ss.titleEn,
    tagline: credits?.tagline || ss.genres.slice(0, 2).join(' · '),
    description: ss.description,
    poster: ss.poster,
    backdrop: ss.backdrop,
    year: ss.year,
    rating,
    maturity: normalizeMaturity(ss.maturity),
    duration: ss.duration,
    genres: ss.genres,
    cast: credits?.cast.map((c) => c.name) ?? [],
    director: credits?.director || '—',
    type: ss.type,
    match: Math.round(rating * 10),
    featured: Boolean(ss.rank),
    rank: ss.rank,
    isNew: false,
    trailerUrl: youtubeWatchUrl(ss.id),
  })
}

/** Unified catalog: movies.ts ∪ Saintstream (no duplicate ids). Fictionals excluded by default. */
let allTitlesCache: Movie[] | null = null
let allTitlesDemoCache: Movie[] | null = null

function buildAllTitles(includeDemo: boolean): Movie[] {
  const seen = new Set<string>()
  const out: Movie[] = []
  for (const m of movies) {
    if (!includeDemo && FICTIONAL_IDS.has(m.id)) continue
    seen.add(m.id)
    out.push(withCatalogDefaults(m))
  }
  for (const id of getAllSaintstreamIds()) {
    if (seen.has(id)) continue
    if (!includeDemo && !isPublicCatalogId(id)) continue
    const title = resolveTitle(id)
    if (title) {
      seen.add(id)
      out.push(title)
    }
  }
  return out
}

export function getAllTitles(opts?: { includeDemo?: boolean }): Movie[] {
  const includeDemo = opts?.includeDemo === true
  if (includeDemo) {
    if (!allTitlesDemoCache) allTitlesDemoCache = buildAllTitles(true)
    return allTitlesDemoCache
  }
  if (!allTitlesCache) allTitlesCache = buildAllTitles(false)
  return allTitlesCache
}

export function listRoutableIds(): string[] {
  return getAllTitles().map((m) => m.id)
}

export function getSimilar(id: string, count = 6): Movie[] {
  const all = getAllTitles()
  const current = resolveTitle(id)
  if (!current) return all.slice(0, count)
  return all
    .filter((m) => m.id !== id)
    .sort((a, b) => {
      const aShared = a.genres.filter((g) => current.genres.includes(g)).length
      const bShared = b.genres.filter((g) => current.genres.includes(g)).length
      if (bShared !== aShared) return bShared - aShared
      return b.rating - a.rating
    })
    .slice(0, count)
}

export function getFeatured(): Movie {
  return getAllTitles().find((m) => m.featured) ?? getAllTitles()[0]
}

export function getHeroSlides(count = 5): Movie[] {
  const all = getAllTitles()
  const featured = all.filter((m) => m.featured || m.rating >= 8.5)
  return (featured.length ? featured : all).slice(0, count)
}

export function getTopRated(count = 10): Movie[] {
  return [...getAllTitles()].sort((a, b) => b.rating - a.rating).slice(0, count)
}

export function getAwardWinners(): Movie[] {
  return getAllTitles().filter((m) => Boolean(m.award))
}

export function getRecentlyAdded(count = 8): Movie[] {
  return getAllTitles().filter((m) => m.isNew).slice(0, count)
}

export function getSeries(): Movie[] {
  return getAllTitles().filter((m) => m.type === 'Series')
}

export function getFilms(): Movie[] {
  return getAllTitles().filter((m) => m.type === 'Film')
}

export function getCatalogGenres(): string[] {
  const set = new Set<string>()
  for (const m of getAllTitles()) {
    for (const g of m.genres) set.add(g)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'fa'))
}

export function getEditorPicks(): { movie: Movie; note: string }[] {
  return editorPicks
    .map((p) => {
      const movie = resolveTitle(p.movieId)
      return movie ? { movie, note: p.note } : null
    })
    .filter((p): p is { movie: Movie; note: string } => Boolean(p))
}

export function getNewEpisodes(): { movie: Movie; ep: NewEpisode }[] {
  return newEpisodes
    .map((ep) => {
      const movie = resolveTitle(ep.movieId)
      return movie ? { movie, ep } : null
    })
    .filter((p): p is { movie: Movie; ep: NewEpisode } => Boolean(p))
}

function buildDemoSeasons(movie: Movie): Season[] {
  return [
    {
      id: 1,
      title: 'فصل ۱',
      episodes: [1, 2, 3].map((i) => ({
        id: i,
        title: `قسمت ${fa(i)}`,
        duration: '۴۵ دقیقه',
        description: movie.description.slice(0, 120) || movie.tagline,
        thumbnail: movie.backdrop || movie.poster,
      })),
    },
  ]
}

export function getSeasons(seriesId?: string): Season[] {
  if (!seriesId) return seriesEpisodes['stranger-things'] ?? []
  if (seriesEpisodes[seriesId]) return seriesEpisodes[seriesId]
  if (seriesSeasons[seriesId]) return seriesSeasons[seriesId]
  // Only fictional leftover series may fall back to demo seasons
  if (FICTIONAL_IDS.has(seriesId)) {
    const title = resolveTitle(seriesId)
    if (title?.type === 'Series') return buildDemoSeasons(title)
  }
  const title = resolveTitle(seriesId)
  if (title?.type === 'Series' && seriesEpisodes[seriesId]) return seriesEpisodes[seriesId]
  if (title?.type === 'Series') return buildDemoSeasons(title)
  return []
}

export function getEpisode(
  seriesId: string,
  seasonId: number,
  episodeId: number,
): Episode | undefined {
  const season = getSeasons(seriesId).find((s) => s.id === seasonId)
  return season?.episodes.find((e) => e.id === episodeId)
}

export function getNextEpisode(
  seriesId: string,
  seasonId: number,
  episodeId: number,
): { season: number; episode: number; title: string } | null {
  const seasonsList = getSeasons(seriesId)
  const season = seasonsList.find((s) => s.id === seasonId)
  if (!season) return null
  const idx = season.episodes.findIndex((e) => e.id === episodeId)
  if (idx >= 0 && idx < season.episodes.length - 1) {
    const next = season.episodes[idx + 1]
    return { season: seasonId, episode: next.id, title: next.title }
  }
  const seasonIdx = seasonsList.findIndex((s) => s.id === seasonId)
  const nextSeason = seasonsList[seasonIdx + 1]
  if (nextSeason?.episodes[0]) {
    return {
      season: nextSeason.id,
      episode: nextSeason.episodes[0].id,
      title: nextSeason.episodes[0].title,
    }
  }
  return null
}

/** Resolve playback URL for watch page (film or episode). Commercial titles: no fake feature stream. */
export function getPlaybackUrl(
  movieId: string,
  seasonId?: number,
  episodeId?: number,
): string | undefined {
  const movie = resolveTitle(movieId)
  if (!movie) return undefined
  if (movie.type === 'Series' && seasonId != null && episodeId != null) {
    const ep = getEpisode(movieId, seasonId, episodeId)
    if (ep?.videoUrl) return ep.videoUrl
  }
  if (movie.videoUrl) return movie.videoUrl
  if (BLENDER_IDS.has(movieId) || FICTIONAL_IDS.has(movieId)) return demoVideoForId(movieId)
  return undefined
}

export function getCast(titleId?: string): CastMember[] {
  if (titleId) {
    const credits = getTitleCredits(titleId)
    if (credits?.cast?.length) {
      return credits.cast.map((member) => ({
        ...member,
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1c1c1e&color=1DD66F&size=256`,
      }))
    }
  }
  return []
}

export function getCrew(titleId?: string): CrewMember[] {
  if (titleId) {
    const credits = getTitleCredits(titleId)
    if (credits?.crew?.length) return credits.crew
    const movie = resolveTitle(titleId)
    if (movie?.director && movie.director !== '—') {
      return [{ id: 'dir', name: movie.director, role: 'کارگردان' }]
    }
  }
  return []
}

export function getReviews(titleId?: string): Review[] {
  if (titleId) {
    const credits = getTitleCredits(titleId)
    if (credits?.reviews?.length) return credits.reviews
    const movie = resolveTitle(titleId)
    if (movie) {
      return [
        {
          id: `${titleId}-r1`,
          author: 'کاربر نکس‌فیلم',
          avatar: '/avatars/user.png',
          rating: Math.round(movie.rating),
          date: 'اخیراً',
          content: `تجربه‌ای قوی از «${movie.title}» — پیشنهاد می‌شود.`,
          helpful: 24,
        },
      ]
    }
  }
  return []
}

export function getScreenshots(titleId?: string): Screenshot[] {
  if (titleId) {
    const movie = resolveTitle(titleId)
    if (movie) return screenshotsForTitle(titleId, movie.poster, movie.backdrop)
  }
  return []
}

export const rows: { title: string; ids: string[]; icon?: string }[] = [
  {
    title: 'داغ‌ترین‌ها',
    ids: ['dune-part-two', 'oppenheimer', 'stranger-things', 'the-boys', 'john-wick-4', 'squid-game'],
    icon: 'trending',
  },
  {
    title: 'پیشنهاد ویژه برای شما',
    ids: ['interstellar', 'inception', 'parasite', 'the-batman', 'arcane', 'breaking-bad'],
    icon: 'recommended',
  },
  {
    title: 'محبوب‌ترین فیلم‌ها',
    ids: ['oppenheimer', 'dune-part-two', 'top-gun-maverick', 'avatar-way-of-water', 'the-dark-knight', 'mad-max-fury-road'],
    icon: 'popular',
  },
  {
    title: 'تازه‌ها',
    ids: ['shogun', 'dune-part-two', 'the-boys', 'arcane', 'wednesday'],
    icon: 'new',
  },
  {
    title: 'برنده و نامزد جایزه',
    ids: ['parasite', 'oppenheimer', 'everything-everywhere', 'the-godfather', 'shawshank-redemption'],
    icon: 'award',
  },
]
