'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getUsuario() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function atualizarPerfil(campos: { nome?: string; avatar_url?: string }) {
  const { supabase, user } = await getUsuario()
  if (!user) return false

  const patch: { nome?: string; avatar_url?: string } = {}
  if (campos.nome !== undefined) {
    const nome = campos.nome.trim()
    if (!nome) return false
    patch.nome = nome
  }
  if (campos.avatar_url !== undefined) patch.avatar_url = campos.avatar_url

  const { error } = await supabase.from('perfis').update(patch).eq('id', user.id)
  if (error) return false

  // Nome e avatar aparecem no sidebar de todas as páginas.
  revalidatePath('/[lang]', 'layout')
  return true
}

export interface SolicitacaoCertificado {
  trilhaId: string
  nomeCompleto: string
  email: string
  urgente: boolean
  motivoUrgencia: string
}

export async function solicitarCertificado(input: SolicitacaoCertificado) {
  const { supabase, user } = await getUsuario()
  if (!user) return false

  const nomeCompleto = input.nomeCompleto.trim()
  const email = input.email.trim()
  const motivo = input.motivoUrgencia.trim()
  if (!nomeCompleto || !/^\S+@\S+\.\S+$/.test(email) || (input.urgente && !motivo)) return false

  // Só trilhas específicas, e só se todas as aulas estiverem concluídas.
  const [{ data: trilha }, { data: progresso }] = await Promise.all([
    supabase.from('trilhas').select('obrigatoria, trilha_aulas(aula_id)').eq('id', input.trilhaId).single(),
    supabase.from('progresso_aulas').select('aula_id').eq('usuario_id', user.id).eq('concluida', true),
  ])
  if (!trilha || trilha.obrigatoria) return false
  const concluidas = new Set((progresso || []).map(p => p.aula_id))
  const aulas: { aula_id: string }[] = trilha.trilha_aulas || []
  if (aulas.length === 0 || !aulas.every(ta => concluidas.has(ta.aula_id))) return false

  const { error } = await supabase.from('certificado_solicitacoes').insert({
    usuario_id: user.id,
    trilha_id: input.trilhaId,
    urgente: input.urgente,
    motivo_urgencia: input.urgente ? motivo : null,
    nome_completo: nomeCompleto,
    email_certificado: email,
  })
  if (error) return false

  revalidatePath('/[lang]/perfil', 'page')
  return true
}
