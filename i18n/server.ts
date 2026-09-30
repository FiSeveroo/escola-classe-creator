import { notFound } from 'next/navigation'
import { hasLocale, type Locale } from './config'
import { getDictionary } from './get-dictionary'

/** Valida o segmento [lang] e devolve { lang, t }. Para Server Components. */
export async function getI18n(params: Promise<{ lang: string }>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = await getDictionary(lang as Locale)
  return { lang: lang as Locale, t }
}
