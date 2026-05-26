import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TrilhasClient from './TrilhasClient'

export const dynamic = 'force-dynamic'

export default async function TrilhasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: perfil }, { data: trilhas }, { data: progresso }] = await Promise.all([
    supabase.from('perfis').select('*').eq('id', user.id).single(),
    supabase.from('trilhas')
      .select('*, trilha_aulas(aula_id)')
      .eq('ativa', true)
      .order('ordem'),
    supabase.from('progresso_aulas')
      .select('aula_id, concluida')
      .eq('usuario_id', user.id)
      .eq('concluida', true),
  ])

  const aulasConcluidas = new Set((progresso || []).map(p => p.aula_id))
  const nucleoTrilha = (trilhas || []).find(t => t.obrigatoria)
  const nucleoAulas = nucleoTrilha?.trilha_aulas?.map((ta: any) => ta.aula_id) || []
  const nucleoCompleto = nucleoAulas.length > 0 && nucleoAulas.every((id: string) => aulasConcluidas.has(id))

  const trilhasComProgresso = (trilhas || []).map(t => {
    const total = t.trilha_aulas?.length || 0
    const done = t.trilha_aulas?.filter((ta: any) => aulasConcluidas.has(ta.aula_id)).length || 0
    return { ...t, total, done, concluida: total > 0 && done === total, desbloqueada: t.obrigatoria || nucleoCompleto }
  })

  return (
    <div className="flex min-h-screen" style={{ background: 'transparent' }}>
      <Sidebar perfil={perfil} />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <TrilhasClient trilhas={trilhasComProgresso} nucleoCompleto={nucleoCompleto} />
      </div>
    </div>
  )
}
