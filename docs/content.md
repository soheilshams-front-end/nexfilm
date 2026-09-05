# راهنمای محتوا — Nex Film

## وضعیت فعلی

کاتالوگ در [`lib/movies.ts`](../lib/movies.ts) نگه‌داری می‌شود. هر عنوان شامل متادیتا + اختیاری `videoUrl` / `trailerUrl` است.

### عناوین تست با پخش واقعی

| ID | عنوان | پخش |
|----|--------|-----|
| `echoes-of-tomorrow` | پژواک فردا | Sintel (نمونه CC) |
| `sintel-short` | سینتل | Sintel |
| `big-buck-bunny` | خرگosh بزرگ | Big Buck Bunny |
| `tears-of-steel` | اشک فولاد | Tears of Steel |
| `elephants-dream` | رویای فیل‌ها | Elephants Dream |

سریال‌ها: `afterlight` و `midnight-archive` — هر قسمت `videoUrl` جدا دارد.

---

## افزودن یک فیلم جدید (دستی)

### ۱. فایل ویدیو (اختیاری)

فایل mp4 کوتاه را در `public/videos/` بگذارید:

```
public/videos/my-film.mp4
```

در کاتالوگ:

```ts
videoUrl: '/videos/my-film.mp4',
```

یا URL خارجی (CDN):

```ts
videoUrl: 'https://cdn.example.com/films/my-film.mp4',
```

### ۲. تصاویر

```
public/posters/my-film.webp   # ترجیحاً WebP زیر 200KB
public/backdrops/my-film.webp
```

### ۳. ردیف در `movies`

به آرایه `movies` در `lib/movies.ts` اضافه کنید:

```ts
{
  id: 'my-film',
  title: 'عنوان فارسی',
  titleEn: 'English Title',
  tagline: '...',
  description: '...',
  poster: '/posters/my-film.webp',
  backdrop: '/backdrops/my-film.webp',
  year: 2024,
  rating: 8.0,
  maturity: '+۱۳',
  duration: '۱ ساعت ۳۰ دقیقه',
  genres: ['درام'],
  cast: ['...'],
  director: '...',
  type: 'Film',
  match: 90,
  videoUrl: '/videos/my-film.mp4',
}
```

### ۴. سریال + فصل‌ها

```ts
seriesSeasons['my-series'] = [
  {
    id: 1,
    title: 'فصل ۱',
    episodes: [
      {
        id: 1,
        title: 'قسمت اول',
        duration: '۴۵ دقیقه',
        description: '...',
        thumbnail: '/backdrops/my-film.webp',
        videoUrl: '/videos/my-series-s01e01.mp4',
      },
    ],
  },
]
```

و یک `Movie` با `type: 'Series'` و همان `id`.

پخش: `/watch/my-series?s=1&e=1`

---

## اسکریپت کمکی

```bash
node scripts/add-title.mjs content/titles/example.json
```

قالب JSON در `content/titles/example.json`.

---

## مسیر مقیاس ~۱۵٬۰۰۰ عنوان (فاز ۲)

| مرحله | کار |
|-------|-----|
| ۱ | Postgres: `titles`, `seasons`, `episodes`, `assets` |
| ۲ | آپلود ویدیو/تصویر به R2/S3 + CDN |
| ۳ | Job ingest از TMDB یا CMS → DB |
| ۴ | `getMovie` / Home از API به‌جای `movies.ts` |
| ۵ | HLS (`.m3u8`) + URL امضاشده برای پخش |

**مهم:** متادیتا از منبع مجاز (TMDB/API)؛ فایل ویدیو فقط از محتوای لایسنس‌دار خودتان روی CDN.

---

## تست سریع

1. `npm run dev`
2. برو `/watch/big-buck-bunny` — باید ویدیوی واقعی پخش شود
3. برو `/watch/afterlight?s=1&e=1` — قسمت اول سریال
