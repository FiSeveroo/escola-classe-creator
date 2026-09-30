export const locales = ['pt', 'en', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pt'

// Cookie que guarda a escolha manual de idioma (lido pelo middleware).
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const localeNames: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
}

// Usado em toLocaleDateString, Intl.RelativeTimeFormat e metadata.
export const intlLocale: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
}

export const ogLocale: Record<Locale, string> = {
  pt: 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
}

export function hasLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

/** Prefixa um caminho interno com o idioma: localePath('en', '/dashboard') → '/en/dashboard'. */
export function localePath(lang: Locale, path: string) {
  if (!path.startsWith('/')) path = `/${path}`
  return path === '/' ? `/${lang}` : `/${lang}${path}`
}

/** Remove o prefixo de idioma de um pathname: '/en/trilha/yt' → '/trilha/yt'. */
export function stripLocale(pathname: string) {
  const [, first, ...rest] = pathname.split('/')
  if (hasLocale(first)) return `/${rest.join('/')}`
  return pathname
}
