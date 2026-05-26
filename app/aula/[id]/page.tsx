import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TrilhaSidebar from '@/components/layout/TrilhaSidebar'
import AulaClient from './AulaClient'

export const dynamic = 'force-dynamic'

export default async function AulaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ trilha?: string }>
}) {
  const { id } = await params
  const { trilha: trilhaId } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: perfil }, { data: aula }, { data: quiz }, { data: progresso }] = await Promise.all([
    supabase.from('perfis').select('*').eq('id', user.id).single(),
    supabase.from('aulas').select('*').eq('id', id).single(),
    supabase.from('quiz_perguntas').select('*').eq('aula_id', id).order('ordem').limit(1),
    supabase.from('progresso_aulas').select('*').eq('usuario_id', user.id).eq('aula_id', id).single(),
  ])

  if (!aula) notFound()

  // Busca aulas da trilha para o sidebar direito
  let trilhaAulas: { id: string; titulo: string; ordem: number }[] = []
  let trilhaTitulo = ''
  let aulasConcluidas: string[] = []

  if (trilhaId) {
    const [{ data: trilhaData }, { data: progressoGeral }] = await Promise.all([
      supabase.from('trilhas')
        .select('titulo, trilha_aulas(ordem, aulas(id, titulo, ordem))')
        .eq('id', trilhaId)
        .single(),
      supabase.from('progresso_aulas')
        .select('aula_id, concluida')
        .eq('usuario_id', user.id)
        .eq('concluida', true),
    ])

    if (trilhaData) {
      trilhaTitulo = trilhaData.titulo
      trilhaAulas = (trilhaData.trilha_aulas as any[])
        .map((ta: any) => ({ ...ta.aulas, ordem: ta.ordem }))
        .sort((a: any, b: any) => a.ordem - b.ordem)
      aulasConcluidas = (progressoGeral || []).map(p => p.aula_id)
    }
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'transparent' }}>
      <Sidebar perfil={perfil} />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <AulaClient
            aula={aula}
            quiz={quiz?.[0] || null}
            progresso={progresso || null}
            userId={user.id}
            userName={perfil?.nome || user.email?.split('@')[0] || 'Usuário'}
            userAvatar={perfil?.avatar_url || null}
            trilhaId={trilhaId || null}
          />
        </div>
        {trilhaId && trilhaAulas.length > 0 && (
          <TrilhaSidebar
            trilhaTitulo={trilhaTitulo}
            trilhaId={trilhaId}
            aulas={trilhaAulas}
            aulaAtualId={id}
            aulasConcluidas={aulasConcluidas}
          />
        )}
      </div>
    </div>
  )
}
