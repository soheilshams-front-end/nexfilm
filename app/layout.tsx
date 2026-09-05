import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { SearchProvider } from '@/components/search-provider'
import { SearchModalLazy } from '@/components/search-modal-lazy'
import { ToastProvider } from '@/components/toast-provider'

const yekanBakh = localFont({
  src: './fonts/YekanBakh-VF.woff2',
  variable: '--font-yekan',
  display: 'swap',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'نکس فیلم — تماشای فیلم و سریال با کیفیت سینمایی',
  description:
    'نکس فیلم، پلتفرم پخش آنلاین فیلم و سریال با کیفیت سینمایی. جدیدترین و محبوب‌ترین آثار جهان را کشف کنید و تماشا کنید.',
  icons: {
    icon: [{ url: '/brand/logo.png', type: 'image/png' }],
    apple: [{ url: '/brand/logo-512.png', type: 'image/png' }],
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
    <html lang="fa" dir="rtl" className={`dark bg-background ${yekanBakh.variable}`}>
      <body className={`${yekanBakh.className} font-sans antialiased`}>
        <SearchProvider>
          <ToastProvider>
            {children}
            <SearchModalLazy />
          </ToastProvider>
        </SearchProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
