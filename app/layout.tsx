import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { SearchProvider } from '@/components/search-provider'
import { SearchModalLazy } from '@/components/search-modal-lazy'
import { ToastProvider } from '@/components/toast-provider'
import { AppearanceBootstrap } from '@/components/appearance-bootstrap'

const peyda = localFont({
  src: [
    { path: './fonts/Peyda-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/Peyda-Medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/Peyda-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/Peyda-Bold.ttf', weight: '700', style: 'normal' },
    { path: './fonts/Peyda-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: './fonts/Peyda-Black.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-peyda',
  display: 'swap',
})

const bebasNeue = localFont({
  src: './fonts/BebasNeue-Regular.ttf',
  variable: '--font-bebas',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'نکس فیلم — تماشای فیلم و سریال با کیفیت سینمایی',
  description:
    'نکس فیلم، پلتفرم پخش آنلاین فیلم و سریال با کیفیت سینمایی. جدیدترین و محبوب‌ترین آثار جهان را کشف کنید و تماشا کنید.',
  icons: {
    icon: [{ url: '/brand/logo.webp', type: 'image/webp' }],
    apple: [{ url: '/brand/logo-512.webp', type: 'image/webp' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#141e1a',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`dark bg-background ${peyda.variable} ${bebasNeue.variable}`}
    >
      <body className={`${peyda.className} font-sans antialiased`}>
        <SearchProvider>
          <ToastProvider>
            <AppearanceBootstrap />
            {children}
            <SearchModalLazy />
          </ToastProvider>
        </SearchProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
