export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  progress?: number
  date?: string
}

export type Device = {
  id: string
  name: string
  type: 'mobile' | 'tablet' | 'tv' | 'laptop' | 'desktop'
  location: string
  lastActive: string
  current: boolean
}

export type NotificationItem = {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  type: 'new' | 'system' | 'social' | 'billing'
  icon: string
}

export type DownloadItem = {
  movieId: string
  title: string
  poster: string
  size: string
  quality: string
  progress: number
  status: 'completed' | 'downloading' | 'paused' | 'queued'
  expires: string
}

export type Plan = {
  id: string
  name: string
  price: string
  period: string
  features: string[]
  current: boolean
  accent: string
  badge?: string
}

export type UserStats = {
  titlesWatched: number
  watchTimeHours: number
  rated: number
  reviews: number
  favorites: number
  streak: number
  level: number
  xp: number
  xpToNext: number
  memberSince: string
}

export const userData = {
  name: 'آرشا مهرآیین',
  email: 'arasha@nextfilm.tv',
  phone: '+۹۸ ۹۱۲ ••• ••۷۸',
  avatar: '/avatars/user.png',
  plan: 'Premium',
  joinDate: 'فروردین ۱۴۰۲',
  location: 'تهران، ایران',
}

export const userStats: UserStats = {
  titlesWatched: 248,
  watchTimeHours: 412,
  rated: 87,
  reviews: 23,
  favorites: 34,
  streak: 18,
  level: 7,
  xp: 2840,
  xpToNext: 3500,
  memberSince: 'فروردین ۱۴۰۲',
}

export const achievements: Achievement[] = [
  { id: 'a1', title: 'سینمادوست', description: '۱۰۰ فیلم تماشا کنید', icon: '🎬', earned: true, date: ' خرداد ۱۴۰۲', progress: 100 },
  { id: 'a2', title: 'نظرهنگر', description: 'به ۵۰ فیلم امتیاز دهید', icon: '⭐', earned: true, date: 'تیر ۱۴۰۲', progress: 100 },
  { id: 'a3', title: 'منتقد', description: '۱۰ نقد بنویسید', icon: '✍️', earned: true, date: 'مرداد ۱۴۰۲', progress: 100 },
  { id: 'a4', title: 'علاقه‌مند', description: '۲۵ مورد به علاقه‌مندی‌ها', icon: '❤️', earned: true, date: 'شهریور ۱۴۰۲', progress: 100 },
  { id: 'a5', title: 'بی‌وقفه', description: '۳۰ روز پیاپی تماشا', icon: '🔥', earned: false, progress: 60 },
  { id: 'a6', title: 'مثار', description: '۵۰۰ ساعت تماشا', icon: '🏆', earned: false, progress: 82 },
  { id: 'a7', title: 'کاوشگر', description: '۲۰ ژانر مختلف', icon: '🧭', earned: false, progress: 45 },
  { id: 'a8', title: 'شب‌بیدار', description: '۲۰ فیلم بعد از نیمه‌شب', icon: '🌙', earned: true, date: 'اسفند ۱۴۰۳', progress: 100 },
]

export const devices: Device[] = [
  { id: 'd1', name: 'iPhone 15 Pro', type: 'mobile', location: 'تهران، ایران', lastActive: 'هم‌اکنون', current: true },
  { id: 'd2', name: 'MacBook Pro 16"', type: 'laptop', location: 'تهران، ایران', lastActive: '۲ ساعت پیش', current: false },
  { id: 'd3', name: 'Apple TV 4K', type: 'tv', location: 'تهران، ایران', lastActive: 'دیروز', current: false },
  { id: 'd4', name: 'iPad Air', type: 'tablet', location: 'اصفهان، ایران', lastActive: '۳ روز پیش', current: false },
]

export const notifications: NotificationItem[] = [
  { id: 'n1', title: 'قسمت جدید اضافه شد', body: '«پس‌نور» فصل ۳ قسمت ۴ اکنون در دسترس است', time: '۱۰ دقیقه پیش', read: false, type: 'new', icon: '🎬' },
  { id: 'n2', title: 'پیشنهاد ویژه', body: '«رکوئیم نئون» بر اساس سلیقه شما پیشنهاد می‌شود', time: '۲ ساعت پیش', read: false, type: 'new', icon: '✨' },
  { id: 'n3', title: 'بازnew تجدید شد', body: 'اشتراک Premium شما با موفقیت تمدید شد', time: 'دیروز', read: true, type: 'billing', icon: '💳' },
  { id: 'n4', title: 'دستگاه جدید', body: 'ورود از MacBook Pro در تهران', time: '۲ روز پیش', read: true, type: 'system', icon: '🖥️' },
  { id: 'n5', title: 'پاسخ به نظر شما', body: 'سارا م. به نظر شما پاسخ داد', time: '۳ روز پیش', read: true, type: 'social', icon: '💬' },
  { id: 'n6', title: 'باشگاه برنده‌ها', body: 'یک دستاورد جدید باز شد!', time: '۴ روز پیش', read: true, type: 'system', icon: '🏆' },
]

export const downloads: DownloadItem[] = [
  { movieId: 'echoes-of-tomorrow', title: 'Echoes of Tomorrow', poster: '/posters/echoes.png', size: '۵.۴ GB', quality: '۴K', progress: 100, status: 'completed', expires: '۱۸ روز' },
  { movieId: 'neon-requiem', title: 'Neon Requiem', poster: '/posters/neon.png', size: '4.1 GB', quality: '۱۰۸۰p', progress: 100, status: 'completed', expires: '۹ روز' },
  { movieId: 'afterlight', title: 'Afterlight', poster: '/posters/afterlight.png', size: '6.2 GB', quality: '۴K', progress: 67, status: 'downloading', expires: '—' },
  { movieId: 'silent-horizon', title: 'The Silent Horizon', poster: '/posters/horizon.png', size: '3.8 GB', quality: '۱۰۸۰p', progress: 0, status: 'queued', expires: '—' },
]

export const plans: Plan[] = [
  {
    id: 'basic', name: 'پایه', price: '۹۹٬۰۰۰', period: 'ماهانه',
    features: ['کیفیت ۱۰۸۰p', '۱ دستگاه هم‌زمان', 'بدون تبلیغات', 'دانلود نامحدود'],
    current: false, accent: 'oklch(0.6 0.05 285)',
  },
  {
    id: 'standard', name: 'استاندارد', price: '۱۷۹٬۰۰۰', period: 'ماهانه',
    features: ['کیفیت ۴K', '۲ دستگاه هم‌زمان', 'بدون تبلیغات', 'دانلود نامحدود', 'صدا فراگیر'],
    current: false, accent: 'oklch(0.7 0.12 250)', badge: 'محبوب',
  },
  {
    id: 'premium', name: 'ویژه', price: '۲۴۹٬۰۰۰', period: 'ماهانه',
    features: ['کیفیت ۴K HDR', '۴ دستگاه هم‌زمان', 'بدون تبلیغات', 'دانلود نامحدود', 'صدا فراگیر Dolby Atmos', 'دسترسی زودهنگام'],
    current: true, accent: 'oklch(0.82 0.14 80)', badge: 'فعلی',
  },
]

export const notificationPrefs = [
  { id: 'np1', label: 'قسمت‌های جدید', desc: 'وقتی سریال‌های دنبالی به‌روز می‌شوند', enabled: true, icon: '🎬' },
  { id: 'np2', label: 'پیشنهادها', desc: 'فیلم‌های پیشنهادی بر اساس سلیقه شما', enabled: true, icon: '✨' },
  { id: 'np3', label: 'اعلان‌های مالی', desc: 'فاکتورها، تمدید و تخفیف‌ها', enabled: true, icon: '💳' },
  { id: 'np4', label: 'فعالیت حساب', desc: 'ورود از دستگاه‌های جدید', enabled: true, icon: '🔒' },
  { id: 'np5', label: 'شبکه اجتماعی', desc: 'پاسخ به نظرات و فعالیت دوستان', enabled: false, icon: '💬' },
  { id: 'np6', label: 'خبرنامه', desc: 'اخبار و رویدادهای نکس فیلم', enabled: false, icon: '📧' },
]

export const securityLog = [
  { id: 's1', event: 'ورود موفق', device: 'iPhone 15 Pro', location: 'تهران', time: '۱۰ دقیقه پیش', type: 'success' },
  { id: 's2', event: 'تغییر رمز عبور', device: 'MacBook Pro', location: 'تهران', time: '۲ هفته پیش', type: 'warning' },
  { id: 's3', event: 'ورود موفق', device: 'Apple TV 4K', location: 'تهران', time: 'دیروز', type: 'success' },
  { id: 's4', event: 'تلاش ناموفق ورود', device: 'ناشناخته', location: '—', time: '۳ روز پیش', type: 'danger' },
]

export const watchHistory = [
  { movieId: 'echoes-of-tomorrow', date: 'امروز', time: '۲۱:۳۰', duration: '۴۲ دقیقه', progress: 42 },
  { movieId: 'neon-requiem', date: 'دیروز', time: '۲۰:۱۵', duration: '۱ ساعت ۱۰ دقیقه', progress: 71 },
  { movieId: 'paper-lanterns', date: '۲ روز پیش', time: '۲۲:۰۰', duration: '۱ ساعت ۴۹ دقیقه', progress: 100 },
  { movieId: 'ironclad', date: '۳ روز پیش', time: '۱۹:۴۵', duration: '۳۲ دقیقه', progress: 26 },
  { movieId: 'silent-horizon', date: '۴ روز پیش', time: '۲۱:۰۰', duration: '۱ ساعت ۵۵ دقیقه', progress: 100 },
  { movieId: 'afterlight', date: '۵ روز پیش', time: '۲۰:۳۰', duration: '۵۵ دقیقه', progress: 55 },
]
