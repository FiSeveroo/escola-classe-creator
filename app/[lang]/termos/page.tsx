import type { Metadata } from 'next'
import { getI18n } from '@/i18n/server'
import { LegalPage } from '@/components/legal/LegalPage'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { t } = await getI18n(params)
  return { title: `${t.meta.termos} — Escola Classe Creator` }
}

export default async function TermosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await getI18n(params)
  return <LegalPage lang={lang} t={t} titulo={t.legal.termos.titulo} secoes={t.legal.termos.secoes} />
}
