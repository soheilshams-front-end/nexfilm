export type SampleCue = {
  start: number
  end: number
  fa: string
  en: string
  ar: string
  es: string
}

const DEMO_DURATION = 150

const CUES: SampleCue[] = [
  {
    start: 0,
    end: 7,
    fa: 'شب آرام بود؛ شهر نفس می‌کشید.',
    en: 'The night was quiet. The city held its breath.',
    ar: 'كان الليل هادئاً. المدينة تحبس أنفاسها.',
    es: 'La noche estaba en calma. La ciudad contuvo el aliento.',
  },
  {
    start: 7,
    end: 15,
    fa: 'اگر بروی، دیگر برنمی‌گردی.',
    en: 'If you leave now, you do not come back.',
    ar: 'إذا رحلت الآن، فلن تعود.',
    es: 'Si te vas ahora, no vuelves.',
  },
  {
    start: 15,
    end: 23,
    fa: 'من این صحنه را هزار بار دیده‌ام.',
    en: 'I have seen this scene a thousand times.',
    ar: 'رأيت هذا المشهد ألف مرة.',
    es: 'He visto esta escena mil veces.',
  },
  {
    start: 23,
    end: 32,
    fa: 'صبر کن. هنوز تمام نشده.',
    en: 'Wait. This is not over.',
    ar: 'انتظر. لم ينتهِ الأمر بعد.',
    es: 'Espera. Esto no ha terminado.',
  },
  {
    start: 32,
    end: 41,
    fa: 'هر انتخابی، بهایی دارد.',
    en: 'Every choice has a price.',
    ar: 'لكل اختيار ثمن.',
    es: 'Cada elección tiene un precio.',
  },
  {
    start: 41,
    end: 50,
    fa: 'نگاه کن — افق روشن می‌شود.',
    en: 'Look — the horizon is breaking open.',
    ar: 'انظر — الأفق ينفتح.',
    es: 'Mira: el horizonte se abre.',
  },
  {
    start: 50,
    end: 59,
    fa: 'نام من مهم نیست. مسیر مهم است.',
    en: 'My name does not matter. The path does.',
    ar: 'اسمي لا يهم. الطريق هو المهم.',
    es: 'Mi nombre no importa. El camino sí.',
  },
  {
    start: 59,
    end: 68,
    fa: 'دوباره از اول؟ این بار فرق دارد.',
    en: 'From the start again? This time is different.',
    ar: 'من البداية مجدداً؟ هذه المرة مختلفة.',
    es: '¿Otra vez desde el inicio? Esta vez es distinto.',
  },
  {
    start: 68,
    end: 78,
    fa: 'صدای باد، مثل خاطره‌ای که نمی‌رود.',
    en: 'The wind sounds like a memory that will not leave.',
    ar: 'صوت الريح كذكرى لا تغادر.',
    es: 'El viento suena como un recuerdo que no se va.',
  },
  {
    start: 78,
    end: 88,
    fa: 'بگو راستش را. وقت کم است.',
    en: 'Tell me the truth. We are out of time.',
    ar: 'قل الحقيقة. لم يبقَ وقت.',
    es: 'Dime la verdad. Se nos acaba el tiempo.',
  },
  {
    start: 88,
    end: 98,
    fa: 'من هنوز این‌جام. کنار تو.',
    en: 'I am still here. Beside you.',
    ar: 'ما زلت هنا. إلى جانبك.',
    es: 'Sigo aquí. A tu lado.',
  },
  {
    start: 98,
    end: 110,
    fa: 'پس بزن بریم — تا آخرین فریم.',
    en: 'Then let’s go — until the last frame.',
    ar: 'إذن لنذهب — حتى اللقطة الأخيرة.',
    es: 'Entonces vamos: hasta el último fotograma.',
  },
  {
    start: 110,
    end: 124,
    fa: 'بعضی داستان‌ها تمام نمی‌شوند؛ فقط قطع می‌شوند.',
    en: 'Some stories do not end. They just cut away.',
    ar: 'بعض القصص لا تنتهي. تتوقف فقط.',
    es: 'Algunas historias no terminan. Solo se cortan.',
  },
  {
    start: 124,
    end: 140,
    fa: 'چراغ‌ها خاموش می‌شوند. تو بیدار می‌مانی.',
    en: 'The lights go down. You stay awake.',
    ar: 'تنطفئ الأضواء. وتبقى مستيقظاً.',
    es: 'Se apagan las luces. Tú sigues despierto.',
  },
  {
    start: 140,
    end: 150,
    fa: 'ادامه دارد…',
    en: 'To be continued…',
    ar: 'يتبع…',
    es: 'Continuará…',
  },
]

export const DEMO_CLOCK_DURATION = DEMO_DURATION

export function cueTextForLang(cue: SampleCue, lang: string): string {
  if (lang === 'انگلیسی') return cue.en
  if (lang === 'عربی') return cue.ar
  if (lang === 'اسپانیایی') return cue.es
  return cue.fa
}

export function getSampleCue(seconds: number, lang: string): string | null {
  if (!lang || lang === 'خاموش') return null
  const t = ((seconds % DEMO_DURATION) + DEMO_DURATION) % DEMO_DURATION
  const cue = CUES.find((c) => t >= c.start && t < c.end)
  if (!cue) return null
  return cueTextForLang(cue, lang)
}
