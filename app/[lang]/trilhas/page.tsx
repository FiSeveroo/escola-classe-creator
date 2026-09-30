import { getI18n } from '@/i18n/server'
import { requireUser } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import TrilhasClient from './TrilhasClient'

export const dynamic = 'force-dynamic'

export default async function TrilhasPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await getI18n(params)
  const { supabase, user } = await requireUser(lang)

  const [{ data: perfil }, { data: trilhas }, { data: progresso }] = await Promise.all([
    supabase.from('perfis').select('*').eq('id', user.id).single(),
    supabase.from('trilhas').select('*, trilha_aulas(aula_id)').eq('ativa', true).order('ordem'),
    supabase.from('progresso_aulas').select('aula_id, concluida').eq('usuario_id', user.id).eq('concluida', true),
  ])

  const aulasConcluidas = new Set((progresso || []).map(p => p.aula_id))
  const nucleoTrilha = (trilhas || []).find(t => t.obrigatoria)
  const nucleoAulas: string[] = nucleoTrilha?.trilha_aulas?.map((ta: { aula_id: string }) => ta.aula_id) || []
  const nucleoCompleto = nucleoAulas.length > 0 && nucleoAulas.every(id => aulasConcluidas.has(id))

  const trilhasComProgresso = (trilhas || []).map(t => {
    const ids: string[] = t.trilha_aulas?.map((ta: { aula_id: string }) => ta.aula_id) || []
    const total = ids.length
    const done = ids.filter(id => aulasConcluidas.has(id)).length
    return { ...t, total, done, concluida: total > 0 && done === total, desbloqueada: t.obrigatoria || nucleoCompleto }
  })

  return (
    <AppShell perfil={perfil}>
      <TrilhasClient trilhas={trilhasComProgresso} nucleoCompleto={nucleoCompleto} />
    </AppShell>
  )
}
