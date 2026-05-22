export interface Trilha {
  id: string
  titulo: string
  descricao: string | null
  obrigatoria: boolean
  ordem: number
  ativa: boolean
  cor: string
  aulas?: TrilhaAula[]
}

export interface Aula {
  id: string
  titulo: string
  descricao: string | null
  youtube_id: string | null
  pdf_url: string | null
  ordem: number
  ativa: boolean
}

export interface TrilhaAula {
  aula_id: string
  trilha_id: string
  ordem: number
  compartilhada: boolean
  aula: Aula
}

export interface QuizPergunta {
  id: string
  aula_id: string
  pergunta: string
  opcoes: string[]
  resposta_correta: number
  ordem: number
}

export interface Perfil {
  id: string
  nome: string | null
  avatar_url: string | null
}

export interface ProgressoAula {
  id: string
  usuario_id: string
  aula_id: string
  video_assistido: boolean
  pdf_baixado: boolean
  quiz_aprovado: boolean
  concluida: boolean
  concluida_em: string | null
}

export interface Comentario {
  id: string
  aula_id: string
  usuario_id: string
  texto: string
  pai_id: string | null
  likes: number
  criado_em: string
  perfis: Perfil
  user_liked?: boolean
}

export interface TrilhaComProgresso extends Trilha {
  totalAulas: number
  aulasConcluidas: number
  desbloqueada: boolean
}
