import { getI18n } from '@/i18n/server'
import { requireUser } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await getI18n(params)
  const { supabase, user } = await requireUser(lang)

  const [{ data: perfil }, { data: trilhas }, { data: progresso }, { data: mural }] = await Promise.all([
    supabase.from('perfis').select('*').eq('id', user.id).single(),
    supabase.from('trilhas').select('*, trilha_aulas(aula_id, ordem, compartilhada)').eq('ativa', true).order('ordem'),
    supabase.from('progresso_aulas').select('aula_id, concluida').eq('usuario_id', user.id).eq('concluida', true),
    supabase
      .from('mural')
      .select('*')
      .eq('ativo', true)
      .order('fixado', { ascending: false })
      .order('criado_em', { ascending: false })
      .limit(5),
  ])

  const aulasConcluidas = new Set((progresso || []).map(p => p.aula_id))

  // Primeiro acesso = nenhuma aula concluída ainda.
  const primeiroAcesso = aulasConcluidas.size === 0

  const nucleo = (trilhas || []).find(t => t.obrigatoria)
  const primeiraAula =
    [...(nucleo?.trilha_aulas || [])].sort((a: { ordem: number }, b: { ordem: number }) => a.ordem - b.ordem)[0]
      ?.aula_id || null

  return (
    <AppShell perfil={perfil}>
      <DashboardClient
        trilhas={trilhas || []}
        aulasConcluidas={Array.from(aulasConcluidas)}
        perfil={perfil}
        mural={mural || []}
        primeiroAcesso={primeiroAcesso}
        primeiraAulaId={primeiraAula}
      />
    </AppShell>
  )
}
