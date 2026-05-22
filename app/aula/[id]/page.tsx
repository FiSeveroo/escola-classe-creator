import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import AulaClient from './AulaClient'

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

  const [{ data: perfil }, { data: aula }, { data: quiz }, { data: progresso }, { data: comentarios }, { data: likes }] =
    await Promise.all([
      supabase.from('perfis').select('*').eq('id', user.id).single(),
      supabase.from('aulas').select('*').eq('id', id).single(),
      supabase.from('quiz_perguntas').select('*').eq('aula_id', id).order('ordem').limit(1),
      supabase.from('progresso_aulas').select('*').eq('usuario_id', user.id).eq('aula_id', id).single(),
      supabase.from('comentarios')
        .select('*, perfis(id, nome)')
        .eq('aula_id', id)
        .is('pai_id', null)
        .order('criado_em', { ascending: true }),
      supabase.from('comentario_likes').select('comentario_id').eq('usuario_id', user.id),
    ])

  if (!aula) notFound()

  const likedIds = new Set((likes || []).map(l => l.comentario_id))
  const comentariosComLike = (comentarios || []).map(c => ({
    ...c,
    user_liked: likedIds.has(c.id),
  }))

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--cc-bg)' }}>
      <Navbar
        perfil={perfil}
        backHref={trilhaId ? `/trilha/${trilhaId}` : '/dashboard'}
        backLabel={trilhaId ? 'TRILHA' : 'DASHBOARD'}
      />
      <AulaClient
        aula={aula}
        quiz={quiz?.[0] || null}
        progresso={progresso || null}
        comentarios={comentariosComLike}
        userId={user.id}
        trilhaId={trilhaId || null}
      />
    </div>
  )
}
