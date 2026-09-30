import { getI18n } from '@/i18n/server'
import { requireUser } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import PerfilClient from './PerfilClient'

export const dynamic = 'force-dynamic'

export default async function PerfilPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await getI18n(params)
  const { supabase, user } = await requireUser(lang)

  const [{ data: perfil }, { data: progresso }, { data: trilhas }, { data: solicitacoes }] = await Promise.all([
    supabase.from('perfis').select('*').eq('id', user.id).single(),
    supabase.from('progresso_aulas').select('aula_id, concluida').eq('usuario_id', user.id).eq('concluida', true),
    supabase.from('trilhas').select('*, trilha_aulas(aula_id)').eq('ativa', true).order('ordem'),
    supabase.from('certificado_solicitacoes').select('*').eq('usuario_id', user.id),
  ])

  const aulasConcluidas = new Set((progresso || []).map(p => p.aula_id))

  const trilhasComProgresso = (trilhas || []).map(t => {
    const ids: string[] = t.trilha_aulas?.map((ta: { aula_id: string }) => ta.aula_id) || []
    const total = ids.length
    const done = ids.filter(id => aulasConcluidas.has(id)).length
    return { ...t, total, done, concluida: total > 0 && done === total }
  })

  return (
    <AppShell perfil={perfil}>
      <PerfilClient
        perfil={perfil}
        email={user.email || ''}
        trilhas={trilhasComProgresso}
        totalConcluidas={aulasConcluidas.size}
        solicitacoes={solicitacoes || []}
      />
    </AppShell>
  )
}
