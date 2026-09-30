import { notFound, redirect } from 'next/navigation'
import { localePath } from '@/i18n/config'
import { getI18n } from '@/i18n/server'
import { requireUser } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import TrilhaClient from './TrilhaClient'

export const dynamic = 'force-dynamic'

export default async function TrilhaPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang } = await getI18n(params)
  const { id } = await params
  const { supabase, user } = await requireUser(lang)

  const [{ data: perfil }, { data: trilha }, { data: progresso }, { data: nucleo }] = await Promise.all([
    supabase.from('perfis').select('*').eq('id', user.id).single(),
    supabase
      .from('trilhas')
      .select('*, trilha_aulas(aula_id, ordem, compartilhada, aulas(*))')
      .eq('id', id)
      .eq('ativa', true)
      .single(),
    supabase.from('progresso_aulas').select('*').eq('usuario_id', user.id),
    supabase.from('trilhas').select('*, trilha_aulas(aula_id)').eq('obrigatoria', true).single(),
  ])

  if (!trilha) notFound()

  const aulasConcluidas = new Set((progresso || []).filter(p => p.concluida).map(p => p.aula_id))
  const nucleoAulas: string[] = nucleo?.trilha_aulas?.map((ta: { aula_id: string }) => ta.aula_id) || []
  const nucleoCompleto = nucleoAulas.length > 0 && nucleoAulas.every(aulaId => aulasConcluidas.has(aulaId))

  if (!trilha.obrigatoria && !nucleoCompleto) redirect(localePath(lang, '/dashboard'))

  const progressoMap = Object.fromEntries((progresso || []).map(p => [p.aula_id, p]))

  return (
    <AppShell perfil={perfil}>
      <TrilhaClient trilha={trilha} progressoMap={progressoMap} aulasConcluidas={Array.from(aulasConcluidas)} />
    </AppShell>
  )
}
