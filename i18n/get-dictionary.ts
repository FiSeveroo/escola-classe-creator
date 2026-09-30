import type { Locale } from './config'
import type { Dictionary } from './types'

// Carrega só o dicionário do idioma pedido. Usado em Server Components;
// Client Components recebem o dicionário via <I18nProvider>.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pt: () => import('./dictionaries/pt').then(m => m.default),
  en: () => import('./dictionaries/en').then(m => m.default),
  es: () => import('./dictionaries/es').then(m => m.default),
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}
