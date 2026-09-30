import { getI18n } from '@/i18n/server'
import { requireUser } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import DashboardClient, { type ProximaAula, type TrilhaRaw } from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await getI18n(params)
  const { supabase, user } = await requireUser(lang)

  const [{ data: perfil }, { data: trilhasData }, { data: progresso }, { data: mural }] = await Promise.all([
    supabase.from('perfis').select('*').eq('id', user.id).single(),
    supabase
      .from('trilhas')
      .select('*, trilha_aulas(aula_id, ordem, compartilhada, aulas(titulo))')
      .eq('ativa', true)
      .order('ordem'),
    supabase.from('progresso_aulas').select('aula_id, concluida').eq('usuario_id', user.id).eq('concluida', true),
    supabase
      .from('mural')
      .select('*')
      .eq('ativo', true)
      .order('fixado', { ascending: false })
      .order('criado_em', { ascending: false })
      .limit(5),
  ])

  const trilhas: TrilhaRaw[] = (trilhasData || []).map(t => ({
    ...t,
    trilha_aulas: [...(t.trilha_aulas || [])].sort((a: { ordem: number }, b: { ordem: number }) => a.ordem - b.ordem),
  }))
  const concluidas = new Set((progresso || []).map(p => p.aula_id))

  // Primeiro acesso = nenhuma aula concluída ainda.
  const primeiroAcesso = concluidas.size === 0

  const nucleo = trilhas.find(t => t.obrigatoria)
  const nucleoCompleto = !!nucleo && nucleo.trilha_aulas.length > 0 && nucleo.trilha_aulas.every(ta => concluidas.has(ta.aula_id))

  // Próxima aula: primeira não concluída, começando pelo núcleo; trilhas específicas só depois dele.
  let proxima: ProximaAula | null = null
  for (const trilha of trilhas) {
    if (!trilha.obrigatoria && !nucleoCompleto) continue
    const idx = trilha.trilha_aulas.findIndex(ta => !concluidas.has(ta.aula_id))
    if (idx === -1) continue
    const ta = trilha.trilha_aulas[idx]
    proxima = {
      aulaId: ta.aula_id,
      aulaTitulo: ta.aulas?.titulo ?? '',
      trilhaId: trilha.id,
      trilhaTitulo: trilha.titulo,
      numero: idx + 1,
      total: trilha.trilha_aulas.length,
    }
    break
  }

  return (
    <AppShell perfil={perfil}>
      <DashboardClient
        trilhas={trilhas}
        aulasConcluidas={Array.from(concluidas)}
        perfil={perfil}
        mural={mural || []}
        primeiroAcesso={primeiroAcesso}
        proxima={proxima}
      />
    </AppShell>
  )
}
