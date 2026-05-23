import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: perfil }, { data: trilhas }, { data: progresso }] = await Promise.all([
    supabase.from('perfis').select('*').eq('id', user.id).single(),
    supabase.from('trilhas')
      .select('*, trilha_aulas(aula_id, ordem, compartilhada)')
      .eq('ativa', true)
      .order('ordem'),
    supabase.from('progresso_aulas')
      .select('aula_id, concluida')
      .eq('usuario_id', user.id)
      .eq('concluida', true),
  ])

  const aulasConcluidas = new Set((progresso || []).map(p => p.aula_id))

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--cc-bg)' }}>
      <Sidebar perfil={perfil} />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <DashboardClient
          trilhas={trilhas || []}
          aulasConcluidas={Array.from(aulasConcluidas)}
          perfil={perfil}
        />
      </div>
    </div>
  )
}
