import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import PerfilClient from './PerfilClient'

export const dynamic = 'force-dynamic'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: perfil }, { data: progresso }, { data: trilhas }, { data: solicitacoes }] = await Promise.all([
    supabase.from('perfis').select('*').eq('id', user.id).single(),
    supabase.from('progresso_aulas').select('aula_id, concluida').eq('usuario_id', user.id).eq('concluida', true),
    supabase.from('trilhas').select('*, trilha_aulas(aula_id)').eq('ativa', true).order('ordem'),
    supabase.from('certificado_solicitacoes').select('*').eq('usuario_id', user.id),
  ])

  const aulasConcluidas = new Set((progresso || []).map(p => p.aula_id))

  const trilhasComProgresso = (trilhas || []).map(t => {
    const total = t.trilha_aulas?.length || 0
    const done = t.trilha_aulas?.filter((ta: { aula_id: string }) => aulasConcluidas.has(ta.aula_id)).length || 0
    return { ...t, total, done, concluida: total > 0 && done === total }
  })

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--cc-bg)' }}>
      <Sidebar perfil={perfil} />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <PerfilClient
          perfil={perfil}
          email={user.email || ''}
          trilhas={trilhasComProgresso}
          totalConcluidas={aulasConcluidas.size}
          solicitacoes={solicitacoes || []}
        />
      </div>
    </div>
  )
}
