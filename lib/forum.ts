export type ForumTopic = {
  id: string
  title: string
  author: string
  replies: number
  views: number
  tag: string
  excerpt: string
  movieId?: string
}

export type ForumPost = {
  id: string
  author: string
  body: string
  createdAt: string
}

export const forumTopics: ForumTopic[] = [
  {
    id: 't1',
    title: 'بهترین تریلرهای ۲۰۲۴ کدام‌اند؟',
    author: 'سهیل',
    replies: 42,
    views: 1204,
    tag: 'عمومی',
    excerpt: 'لیست پیشنهادی خودتان را بنویسید و دلیل بیاورید.',
  },
  {
    id: 't2',
    title: 'نقد سریال The Last of Us — فصل دوم',
    author: 'آتنا',
    replies: 87,
    views: 3401,
    tag: 'سریال',
    excerpt: 'بدون اسپویل سنگین لطفاً درباره ریتم و شخصیت‌ها حرف بزنیم.',
    movieId: 'the-last-of-us',
  },
  {
    id: 't3',
    title: 'پیشنهاد فیلم برای تماشای گروهی',
    author: 'نیما',
    replies: 19,
    views: 612,
    tag: 'تماشای گروهی',
    excerpt: 'چیزی سبک و جذاب برای جمع دوستانه می‌خواهیم.',
  },
  {
    id: 't4',
    title: 'جنگ ستارگان هنوز ارزش تماشا دارد؟',
    author: 'مریم',
    replies: 55,
    views: 2100,
    tag: 'فیلم',
    excerpt: 'از کجا شروع کنیم و کدام قسمت‌ها را رد کنیم؟',
    movieId: 'star-wars-tfa',
  },
]

export const forumPosts: Record<string, ForumPost[]> = {
  t1: [
    { id: 'p1', author: 'سهیل', body: 'به نظرم Dune Part Two هنوز قوی‌ترین تریلر سال است.', createdAt: '۲ ساعت پیش' },
    { id: 'p2', author: 'آتنا', body: 'با Deadpool & Wolverine هم موافقم — انرژی خیلی بالایی دارد.', createdAt: '۱ ساعت پیش' },
  ],
  t2: [
    { id: 'p1', author: 'آتنا', body: 'فصل دوم از نظر تم تاریک‌تر است و شخصیت‌پردازی عمیق‌تری دارد.', createdAt: 'دیروز' },
  ],
  t3: [
    { id: 'p1', author: 'نیما', body: 'یک کمدی اکشن کوتاه پیشنهاد دهید.', createdAt: '۳ ساعت پیش' },
  ],
  t4: [
    { id: 'p1', author: 'مریم', body: 'ترتیب انتشار بهتر از ترتیب زمانی برای تازه‌واردهاست.', createdAt: '۵ ساعت پیش' },
  ],
}

export function getTopic(id: string) {
  return forumTopics.find((t) => t.id === id)
}
