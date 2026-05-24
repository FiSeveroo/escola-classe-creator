'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Aula, QuizPergunta, ProgressoAula } from '@/types'

interface ComentarioLocal {
  id: string
  aula_id: string
  usuario_id: string
  texto: string
  pai_id: string | null
  likes: number
  criado_em: string
  perfis: { id: string; nome: string } | null
  user_liked: boolean
}

interface Props {
  aula: Aula
  quiz: QuizPergunta | null
  progresso: ProgressoAula | null
  userId: string
  userName: string
  trilhaId: string | null
}

export default function AulaClient({ aula, quiz, progresso: progressoInicial, userId, userName, trilhaId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [prog, setProg] = useState<ProgressoAula | null>(progressoInicial)
  const [comentarios, setComentarios] = useState<ComentarioLocal[]>([])
  const [carregandoComentarios, setCarregandoComentarios] = useState(true)
  const [novoComentario, setNovoComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [quizRespondido, setQuizRespondido] = useState<number | null>(null)
  const [mostrarBanner, setMostrarBanner] = useState(false)
  const comentarioRef = useRef<HTMLTextAreaElement>(null)

  const videoAssistido = prog?.video_assistido || false
  const pdfBaixado = prog?.pdf_baixado || false
  const quizAprovado = prog?.quiz_aprovado || false
  const concluida = prog?.concluida || false

  // Busca comentários no cliente
  useEffect(() => {
    async function fetchComentarios() {
      setCarregandoComentarios(true)
      // Busca comentários sem join para evitar problema de RLS
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('aula_id', aula.id)
        .is('pai_id', null)
        .order('criado_em', { ascending: true })

      if (!error && data) {
        // Busca perfis separadamente
        const userIds = [...new Set(data.map((c: any) => c.usuario_id))]
        const { data: perfis } = await supabase
          .from('perfis')
          .select('id, nome')
          .in('id', userIds)

        const perfisMap = Object.fromEntries((perfis || []).map(p => [p.id, p]))

        // Busca likes do usuário
        const { data: likes } = await supabase
          .from('comentario_likes')
          .select('comentario_id')
          .eq('usuario_id', userId)

        const likedIds = new Set((likes || []).map(l => l.comentario_id))
        setComentarios(data.map((c: any) => ({
          ...c,
          perfis: perfisMap[c.usuario_id] || { id: c.usuario_id, nome: 'Usuário' },
          user_liked: likedIds.has(c.id)
        })))
      }
      setCarregandoComentarios(false)
    }
    fetchComentarios()
  }, [aula.id])

  async function upsertProgresso(patch: Partial<ProgressoAula>) {
    const atual = prog || { usuario_id: userId, aula_id: aula.id, video_assistido: false, pdf_baixado: false, quiz_aprovado: false, concluida: false }
    const novo = { ...atual, ...patch } as ProgressoAula
    novo.concluida = novo.video_assistido && novo.pdf_baixado && novo.quiz_aprovado
    if (novo.concluida && !atual.concluida) novo.concluida_em = new Date().toISOString()

    const { data, error } = await supabase
      .from('progresso_aulas')
      .upsert({ ...novo, atualizado_em: new Date().toISOString() }, { onConflict: 'usuario_id,aula_id' })
      .select()
      .single()

    if (!error && data) {
      setProg(data)
      if (data.concluida && !concluida) setMostrarBanner(true)
    }
  }

  async function marcarVideo() {
    if (videoAssistido) return
    await upsertProgresso({ video_assistido: true })
  }

  async function marcarPdf() {
    if (pdfBaixado || !videoAssistido) return
    if (aula.pdf_url) window.open(aula.pdf_url, '_blank')
    await upsertProgresso({ pdf_baixado: true })
  }

  async function responderQuiz(idx: number) {
    if (quizRespondido !== null || !quiz || !pdfBaixado) return
    setQuizRespondido(idx)
    if (idx === quiz.resposta_correta) {
      setTimeout(() => upsertProgresso({ quiz_aprovado: true }), 600)
    }
  }

  async function enviarComentario() {
    const texto = novoComentario.trim()
    if (!texto || enviando) return
    setEnviando(true)

    const { error } = await supabase
      .from('comentarios')
      .insert({ aula_id: aula.id, usuario_id: userId, texto })

    if (!error) {
      const novoItem: ComentarioLocal = {
        id: crypto.randomUUID(),
        aula_id: aula.id,
        usuario_id: userId,
        texto,
        pai_id: null,
        likes: 0,
        criado_em: new Date().toISOString(),
        perfis: { id: userId, nome: userName },
        user_liked: false,
      }
      setComentarios(prev => [...prev, novoItem])
      setNovoComentario('')
    }
    setEnviando(false)
  }

  async function toggleLike(comentarioId: string) {
    const { data } = await supabase.rpc('toggle_like', {
      p_comentario_id: comentarioId,
      p_usuario_id: userId,
    })
    setComentarios(prev => prev.map(c =>
      c.id === comentarioId ? { ...c, likes: data, user_liked: !c.user_liked } : c
    ))
  }

  function formatarTempo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'agora mesmo'
    if (m < 60) return `${m}min atrás`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h atrás`
    return `${Math.floor(h / 24)}d atrás`
  }

  const initials = userName
    ? userName.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : userId.slice(0, 2).toUpperCase()

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      <div className="mb-4">
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-orange)' }}>AULA</p>
        <h1 className="font-display text-3xl lg:text-4xl tracking-widest leading-tight" style={{ color: 'var(--cc-white)' }}>
          {aula.titulo.toUpperCase()}
        </h1>
        {aula.descricao && (
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--cc-muted)' }}>{aula.descricao}</p>
        )}
      </div>

      <div className="rounded-xl overflow-hidden mb-2 border" style={{ borderColor: 'var(--cc-gray2)' }}>
        {aula.youtube_id ? (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${aula.youtube_id}?rel=0&modestbranding=1`}
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex items-center justify-center cursor-pointer" style={{ height: 300, background: '#111' }} onClick={marcarVideo}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--cc-purple)', color: '#fff' }}>▶</div>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 mb-6">
        {[videoAssistido, pdfBaixado, quizAprovado].map((done, i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{ background: done ? 'var(--cc-green)' : (i === 0 && !videoAssistido) || (i === 1 && videoAssistido && !pdfBaixado) || (i === 2 && pdfBaixado && !quizAprovado) ? 'var(--cc-purple)' : 'var(--cc-gray2)' }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl p-4 border" style={{ background: 'var(--cc-gray)', borderColor: pdfBaixado ? '#1a3a28' : videoAssistido ? 'var(--cc-purple)' : 'var(--cc-gray2)' }}>
          <p className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--cc-muted)' }}>⬇ MATERIAL DE APOIO</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: '#1a0d0d', color: 'var(--cc-orange)' }}>📄</div>
              <div>
                <p className="text-sm" style={{ color: 'var(--cc-white)' }}>{aula.titulo}.pdf</p>
                <p className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>{pdfBaixado ? 'baixado ✓' : 'material da aula'}</p>
              </div>
            </div>
            {pdfBaixado
              ? <span style={{ color: 'var(--cc-green)' }}>✓</span>
              : <button onClick={marcarPdf} disabled={!videoAssistido}
                  className="font-mono text-xs px-3 py-1.5 rounded border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ borderColor: 'var(--cc-orange)', color: 'var(--cc-orange)' }}
                  onMouseEnter={e => { if (videoAssistido) { e.currentTarget.style.background = 'var(--cc-orange)'; e.currentTarget.style.color = 'var(--cc-bg)' }}}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cc-orange)' }}
                >BAIXAR</button>
            }
          </div>
        </div>

        <div className="rounded-xl p-4 border" style={{ background: 'var(--cc-gray)', borderColor: quizAprovado ? '#1a3a28' : pdfBaixado ? 'var(--cc-purple)' : 'var(--cc-gray2)' }}>
          <p className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--cc-muted)' }}>? QUIZ</p>
          {!pdfBaixado
            ? <p className="font-mono text-xs text-center py-2" style={{ color: 'var(--cc-muted)' }}>🔒 baixe o PDF para liberar</p>
            : quizAprovado
            ? <p className="font-mono text-xs text-center py-2" style={{ color: 'var(--cc-green)' }}>✓ respondido corretamente</p>
            : quiz
            ? <div>
                <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--cc-white)' }}>{quiz.pergunta}</p>
                <div className="flex flex-col gap-1.5">
                  {quiz.opcoes.map((opcao, i) => {
                    let borderColor = 'var(--cc-gray3)', bg = 'var(--cc-bg)', textColor = 'var(--cc-white)'
                    if (quizRespondido !== null) {
                      if (i === quiz.resposta_correta) { borderColor = 'var(--cc-green)'; bg = '#0d1f15'; textColor = 'var(--cc-green)' }
                      else if (i === quizRespondido) { borderColor = 'var(--cc-orange)'; bg = '#1f120d'; textColor = 'var(--cc-orange)' }
                    }
                    return (
                      <button key={i} onClick={() => responderQuiz(i)} disabled={quizRespondido !== null}
                        className="text-left px-3 py-2 rounded text-xs border transition-colors disabled:cursor-default"
                        style={{ borderColor, background: bg, color: textColor }}
                        onMouseEnter={e => { if (quizRespondido === null) e.currentTarget.style.borderColor = 'var(--cc-purple)' }}
                        onMouseLeave={e => { if (quizRespondido === null) e.currentTarget.style.borderColor = 'var(--cc-gray3)' }}
                      >{opcao}</button>
                    )
                  })}
                </div>
              </div>
            : <p className="font-mono text-xs text-center py-2" style={{ color: 'var(--cc-muted)' }}>Quiz em breve</p>
          }
        </div>
      </div>

      {!videoAssistido && (
        <button onClick={marcarVideo}
          className="w-full py-3 rounded-xl font-mono text-xs tracking-widest border mb-6 transition-colors"
          style={{ borderColor: 'var(--cc-purple)', color: 'var(--cc-purple)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--cc-purple)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cc-purple)' }}
        >MARCAR COMO ASSISTIDO</button>
      )}

      {mostrarBanner && (
        <div className="rounded-xl p-5 mb-6 border text-center" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-green)' }}>
          <p className="font-display text-2xl tracking-widest mb-1" style={{ color: 'var(--cc-green)' }}>AULA CONCLUÍDA</p>
          <p className="text-sm mb-4" style={{ color: 'var(--cc-muted)' }}>Progresso salvo. Continue pela lista de aulas ao lado.</p>
          <button onClick={() => router.push(trilhaId ? `/trilha/${trilhaId}` : '/dashboard')}
            className="font-display text-xl tracking-widest px-6 py-2.5 rounded-lg"
            style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}
          >VER TRILHA</button>
        </div>
      )}

      {/* COMENTÁRIOS */}
      <div className="rounded-xl p-4 border" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl tracking-widest" style={{ color: 'var(--cc-white)' }}>COMENTÁRIOS</h2>
          <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
            {carregandoComentarios ? '...' : `${comentarios.length} ${comentarios.length === 1 ? 'comentário' : 'comentários'}`}
          </span>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-display text-xs mt-0.5"
            style={{ background: 'var(--cc-purple)', color: '#fff' }}>{initials}</div>
          <div className="flex-1">
            <textarea ref={comentarioRef} value={novoComentario} onChange={e => setNovoComentario(e.target.value)}
              placeholder="Deixe sua dúvida ou comentário sobre esta aula..." rows={2}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
              style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
              onFocus={e => e.target.style.borderColor = 'var(--cc-purple)'}
              onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>Seja respeitoso e construtivo</span>
              <button onClick={enviarComentario} disabled={!novoComentario.trim() || enviando}
                className="font-display text-sm tracking-widest px-4 py-1.5 rounded-lg transition-opacity disabled:opacity-30"
                style={{ background: 'var(--cc-purple)', color: '#fff' }}
              >{enviando ? 'ENVIANDO...' : 'ENVIAR'}</button>
            </div>
          </div>
        </div>

        {carregandoComentarios
          ? <p className="font-mono text-xs text-center py-4" style={{ color: 'var(--cc-muted)' }}>Carregando comentários...</p>
          : comentarios.length === 0
          ? <div className="text-center py-6"><p className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>Seja o primeiro a comentar nesta aula</p></div>
          : <>
              <hr className="mb-4" style={{ borderColor: 'var(--cc-gray2)' }} />
              <div className="flex flex-col gap-4">
                {comentarios.map(c => {
                  const nome = c.perfis?.nome || 'Usuário'
                  const iniciais = nome.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
                  const cores = ['#1D9E75', '#7B2FFF', '#D85A30', '#185FA5', '#854F0B']
                  const cor = cores[nome.charCodeAt(0) % cores.length]
                  return (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-display text-xs"
                        style={{ background: cor, color: '#fff' }}>{iniciais}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-medium" style={{ color: 'var(--cc-white)' }}>{nome}</span>
                          {c.usuario_id === userId && (
                            <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: '#1f1a2e', color: 'var(--cc-purple)' }}>você</span>
                          )}
                          <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>{formatarTempo(c.criado_em)}</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#ccc' }}>{c.texto}</p>
                        <div className="flex gap-3 mt-1.5">
                          <button onClick={() => toggleLike(c.id)}
                            className="font-mono text-xs flex items-center gap-1"
                            style={{ color: c.user_liked ? 'var(--cc-green)' : 'var(--cc-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            ♥ {c.likes}
                          </button>
                          <button
                            onClick={() => { comentarioRef.current?.focus(); comentarioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}
                            className="font-mono text-xs"
                            style={{ color: 'var(--cc-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cc-green)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--cc-muted)')}
                          >↩ responder</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
        }
      </div>
    </div>
  )
}
