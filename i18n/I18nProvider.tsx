'use client'

import { createContext, useContext, useMemo } from 'react'
import { localePath, type Locale } from './config'
import type { Dictionary } from './types'

interface I18nContextValue {
  lang: Locale
  t: Dictionary
  /** Caminho interno com prefixo de idioma: href('/dashboard') → '/en/dashboard'. */
  href: (path: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  lang,
  dictionary,
  children,
}: {
  lang: Locale
  dictionary: Dictionary
  children: React.ReactNode
}) {
  const value = useMemo(
    () => ({ lang, t: dictionary, href: (path: string) => localePath(lang, path) }),
    [lang, dictionary]
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n precisa estar dentro de <I18nProvider>')
  return ctx
}
