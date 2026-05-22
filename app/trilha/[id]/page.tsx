import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import TrilhaClient from './TrilhaClient'

export default async function TrilhaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: perfil }, { data: trilha }, { data: progresso }, { data: nucleo }] = await Promise.all([
    supabase.from('perfis').select('*').eq('id', user.id).single(),
    supabase.from('trilhas')
      .select('*, trilha_aulas(aula_id, ordem, compartilhada, aulas(*))')
      .eq('id', id)
      .eq('ativa', true)
      .single(),
    supabase.from('progresso_aulas')
      .select('*')
      .eq('usuario_id', user.id),
    supabase.from('trilhas')
      .select('*, trilha_aulas(aula_id)')
      .eq('obrigatoria', true)
      .single(),
  ])

  if (!trilha) notFound()

  const aulasConcluidas = new Set((progresso || []).filter(p => p.concluida).map(p => p.aula_id))
  const nucleoAulas = nucleo?.trilha_aulas?.map((ta: { aula_id: string }) => ta.aula_id) || []
  const nucleoCompleto = nucleoAulas.length > 0 && nucleoAulas.every((id: string) => aulasConcluidas.has(id))

  // Protege trilhas específicas se núcleo não foi concluído
  if (!trilha.obrigatoria && !nucleoCompleto) redirect('/dashboard')

  const progressoMap = Object.fromEntries((progresso || []).map(p => [p.aula_id, p]))

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--cc-bg)' }}>
      <Navbar perfil={perfil} backHref="/dashboard" backLabel="DASHBOARD" />
      <TrilhaClient
        trilha={trilha}
        progressoMap={progressoMap}
        aulasConcluidas={Array.from(aulasConcluidas)}
      />
    </div>
  )
}
