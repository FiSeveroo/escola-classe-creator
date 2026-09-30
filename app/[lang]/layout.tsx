import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, intlLocale, locales, ogLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { I18nProvider } from '@/i18n/I18nProvider'
import '@fontsource-variable/dm-sans'
import '../globals.css'

const SITE_URL = 'https://escola.classecreator.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0b0c',
}

export function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const t = await getDictionary(lang)

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    authors: [{ name: 'Filipe Severo', url: 'https://classecreator.com' }],
    creator: 'Classe Creator',
    publisher: 'Classe Creator',
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map(l => [intlLocale[l], `/${l}`])),
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.ogDescription,
      url: `${SITE_URL}/${lang}`,
      siteName: 'Escola Classe Creator',
      locale: ogLocale[lang],
      alternateLocale: locales.filter(l => l !== lang).map(l => ogLocale[l]),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Escola Classe Creator',
      description: t.meta.twitterDescription,
      creator: '@classecreator',
    },
    robots: { index: true, follow: true },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dictionary = await getDictionary(lang as Locale)

  return (
    <html lang={intlLocale[lang as Locale]} className="dark">
      <body>
        <I18nProvider lang={lang as Locale} dictionary={dictionary}>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
