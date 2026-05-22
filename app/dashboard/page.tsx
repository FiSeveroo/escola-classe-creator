import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import DashboardClient from './DashboardClient'

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
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--cc-bg)' }}>
      <Navbar perfil={perfil} />
      <DashboardClient
        trilhas={trilhas || []}
        aulasConcluidas={Array.from(aulasConcluidas)}
        perfil={perfil}
      />
    </div>
  )
}
