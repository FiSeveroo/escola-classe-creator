import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getI18n } from '@/i18n/server'
import { intlLocale, locales, ogLocale } from '@/i18n/config'
import { Landing } from '@/components/landing/Landing'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang, t } = await getI18n(params)
  const imagem = { url: `/brand/og-${lang}.jpg`, width: 1200, height: 630, alt: t.landing.metaTitulo }
  return {
    title: t.landing.metaTitulo,
    description: t.landing.metaDescricao,
    alternates: { canonical: `/${lang}`, languages: Object.fromEntries(locales.map(l => [intlLocale[l], `/${l}`])) },
    openGraph: {
      title: t.landing.metaTitulo,
      description: t.landing.metaDescricao,
      url: `/${lang}`,
      siteName: 'Escola Classe Creator',
      locale: ogLocale[lang],
      type: 'website',
      images: [imagem],
    },
    twitter: { card: 'summary_large_image', title: t.landing.metaTitulo, description: t.landing.metaDescricao, images: [imagem.url] },
  }
}

/** Home pública: landing de conversão. Quem já está logado vê o CTA "ir para minhas aulas". */
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await getI18n(params)

  let logado = false
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    logado = !!user
  } catch {
    // Supabase indisponível: mostra a landing como visitante.
  }

  return <Landing lang={lang} t={t} logado={logado} />
}
