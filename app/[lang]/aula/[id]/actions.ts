'use server'

import { createClient } from '@/lib/supabase/server'
import type { ProgressoAula } from '@/types'

export type Etapa = 'video' | 'pdf' | 'quiz'

type Resultado<T> = { ok: true; data: T } | { ok: false; motivo: 'nao_autenticado' | 'fora_de_ordem' | 'resposta_errada' | 'erro' }

async function getUsuario() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

/**
 * Avança uma etapa da aula (vídeo → PDF → quiz). A ordem e a resposta do quiz
 * são conferidas no servidor, não só na interface.
 */
export async function avancarEtapa(aulaId: string, etapa: Etapa, resposta?: number): Promise<Resultado<ProgressoAula>> {
  const { supabase, user } = await getUsuario()
  if (!user) return { ok: false, motivo: 'nao_autenticado' }

  const { data: atual } = await supabase
    .from('progresso_aulas')
    .select('*')
    .eq('usuario_id', user.id)
    .eq('aula_id', aulaId)
    .maybeSingle()

  const novo = {
    usuario_id: user.id,
    aula_id: aulaId,
    video_assistido: atual?.video_assistido ?? false,
    pdf_baixado: atual?.pdf_baixado ?? false,
    quiz_aprovado: atual?.quiz_aprovado ?? false,
    concluida: atual?.concluida ?? false,
    concluida_em: atual?.concluida_em ?? null,
  }

  if (etapa === 'video') {
    novo.video_assistido = true
  } else if (etapa === 'pdf') {
    if (!novo.video_assistido) return { ok: false, motivo: 'fora_de_ordem' }
    novo.pdf_baixado = true
  } else {
    if (!novo.pdf_baixado) return { ok: false, motivo: 'fora_de_ordem' }
    const { data: quiz } = await supabase
      .from('quiz_perguntas')
      .select('resposta_correta')
      .eq('aula_id', aulaId)
      .order('ordem')
      .limit(1)
      .maybeSingle()
    if (!quiz || resposta !== quiz.resposta_correta) return { ok: false, motivo: 'resposta_errada' }
    novo.quiz_aprovado = true
  }

  const concluidaAgora = novo.video_assistido && novo.pdf_baixado && novo.quiz_aprovado
  if (concluidaAgora && !novo.concluida) novo.concluida_em = new Date().toISOString()
  novo.concluida = concluidaAgora

  const { data, error } = await supabase
    .from('progresso_aulas')
    .upsert({ ...novo, atualizado_em: new Date().toISOString() }, { onConflict: 'usuario_id,aula_id' })
    .select()
    .single()

  if (error || !data) return { ok: false, motivo: 'erro' }
  return { ok: true, data }
}

export async function enviarComentario(aulaId: string, texto: string) {
  const { supabase, user } = await getUsuario()
  const limpo = texto.trim()
  if (!user || !limpo) return null

  const { data, error } = await supabase
    .from('comentarios')
    .insert({ aula_id: aulaId, usuario_id: user.id, texto: limpo })
    .select('id, aula_id, usuario_id, texto, pai_id, likes, criado_em')
    .single()

  return error ? null : data
}

/** Curte/descurte e devolve o novo total de likes. */
export async function alternarLike(comentarioId: string) {
  const { supabase, user } = await getUsuario()
  if (!user) return null

  const { data, error } = await supabase.rpc('toggle_like', {
    p_comentario_id: comentarioId,
    p_usuario_id: user.id,
  })
  return error ? null : (data as number)
}
