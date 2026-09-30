import { notFound } from 'next/navigation'
import { getI18n } from '@/i18n/server'
import { requireUser } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import TrilhaSidebar from '@/components/layout/TrilhaSidebar'
import type { ComentarioView } from '@/types'
import AulaClient from './AulaClient'

export const dynamic = 'force-dynamic'

export default async function AulaPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; id: string }>
  searchParams: Promise<{ trilha?: string }>
}) {
  const { lang, t } = await getI18n(params)
  const { id } = await params
  const { trilha: trilhaId } = await searchParams
  const { supabase, user } = await requireUser(lang)

  const [{ data: perfil }, { data: aula }, { data: quiz }, { data: progresso }, { data: comentariosRaw }] =
    await Promise.all([
      supabase.from('perfis').select('*').eq('id', user.id).single(),
      supabase.from('aulas').select('*').eq('id', id).single(),
      supabase.from('quiz_perguntas').select('*').eq('aula_id', id).order('ordem').limit(1),
      supabase.from('progresso_aulas').select('*').eq('usuario_id', user.id).eq('aula_id', id).maybeSingle(),
      supabase
        .from('comentarios')
        .select('id, aula_id, usuario_id, texto, pai_id, likes, criado_em')
        .eq('aula_id', id)
        .is('pai_id', null)
        .order('criado_em', { ascending: true }),
    ])

  if (!aula) notFound()

  // Autores e likes do usuário para os comentários desta aula.
  const comentariosBase = comentariosRaw || []
  const autorIds = [...new Set(comentariosBase.map(c => c.usuario_id))]
  const comentarioIds = comentariosBase.map(c => c.id)
  const [{ data: autores }, { data: meusLikes }] = await Promise.all([
    autorIds.length
      ? supabase.from('perfis').select('id, nome, avatar_url').in('id', autorIds)
      : Promise.resolve({ data: [] as { id: string; nome: string | null; avatar_url: string | null }[] }),
    comentarioIds.length
      ? supabase.from('comentario_likes').select('comentario_id').eq('usuario_id', user.id).in('comentario_id', comentarioIds)
      : Promise.resolve({ data: [] as { comentario_id: string }[] }),
  ])
  const autoresMap = new Map((autores || []).map(a => [a.id, a]))
  const curtidos = new Set((meusLikes || []).map(l => l.comentario_id))
  const comentarios: ComentarioView[] = comentariosBase.map(c => ({
    ...c,
    autor: autoresMap.get(c.usuario_id) ?? { id: c.usuario_id, nome: null, avatar_url: null },
    user_liked: curtidos.has(c.id),
  }))

  // Aulas da trilha para a coluna da direita.
  let trilhaAulas: { id: string; titulo: string; ordem: number }[] = []
  let trilhaTitulo = ''
  let aulasConcluidas: string[] = []

  if (trilhaId) {
    const [{ data: trilhaData }, { data: progressoGeral }] = await Promise.all([
      supabase.from('trilhas').select('titulo, trilha_aulas(ordem, aulas(id, titulo, ordem))').eq('id', trilhaId).single(),
      supabase.from('progresso_aulas').select('aula_id').eq('usuario_id', user.id).eq('concluida', true),
    ])

    if (trilhaData) {
      trilhaTitulo = trilhaData.titulo
      trilhaAulas = (trilhaData.trilha_aulas as unknown as { ordem: number; aulas: { id: string; titulo: string } }[])
        .map(ta => ({ ...ta.aulas, ordem: ta.ordem }))
        .sort((a, b) => a.ordem - b.ordem)
      aulasConcluidas = (progressoGeral || []).map(p => p.aula_id)
    }
  }

  const indiceAtual = trilhaAulas.findIndex(a => a.id === id)
  const proximaAulaId = indiceAtual >= 0 ? (trilhaAulas[indiceAtual + 1]?.id ?? null) : null

  return (
    <AppShell
      perfil={perfil}
      aside={
        trilhaId && trilhaAulas.length > 0 ? (
          <TrilhaSidebar
            trilhaTitulo={trilhaTitulo}
            trilhaId={trilhaId}
            aulas={trilhaAulas}
            aulaAtualId={id}
            aulasConcluidas={aulasConcluidas}
          />
        ) : undefined
      }
    >
      <AulaClient
        aula={aula}
        quiz={quiz?.[0] || null}
        progresso={progresso || null}
        comentariosIniciais={comentarios}
        userId={user.id}
        userName={perfil?.nome || user.email?.split('@')[0] || t.comum.usuario}
        userAvatar={perfil?.avatar_url || null}
        trilhaId={trilhaId || null}
        trilhaTitulo={trilhaTitulo || null}
        numero={indiceAtual >= 0 ? indiceAtual + 1 : null}
        proximaAulaId={proximaAulaId}
      />
    </AppShell>
  )
}
