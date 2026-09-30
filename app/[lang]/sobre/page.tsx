import type { Metadata } from 'next'
import { getI18n } from '@/i18n/server'
import { requireUser } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import SobreClient from './SobreClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { t } = await getI18n(params)
  return { title: `${t.meta.sobre} — Escola Classe Creator` }
}

export default async function SobrePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await getI18n(params)
  const { supabase, user } = await requireUser(lang)
  const { data: perfil } = await supabase.from('perfis').select('*').eq('id', user.id).single()

  return (
    <AppShell perfil={perfil}>
      <SobreClient />
    </AppShell>
  )
}
