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
  perfis: { id: string; nome: string; avatar_url?: string | null } | null
  user_liked: boolean
}

interface Props {
  aula: Aula
  quiz: QuizPergunta | null
  progresso: ProgressoAula | null
  userId: string
  userName: string
  userAvatar: string | null
  trilhaId: string | null
}

export default function AulaClient({ aula, quiz, progresso: progressoInicial, userId, userName, userAvatar, trilhaId }: Props) {
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

  useEffect(() => {
    async function fetchComentarios() {
      setCarregandoComentarios(true)
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('aula_id', aula.id)
        .is('pai_id', null)
        .order('criado_em', { ascending: true })

      if (!error && data) {
        const userIds = [...new Set(data.map((c: any) => c.usuario_id))]
        const { data: perfis } = await supabase
          .from('perfis')
          .select('id, nome, avatar_url')
          .in('id', userIds)
        const perfisMap = Object.fromEntries((perfis || []).map(p => [p.id, p]))
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
      .select().single()
    if (!error && data) {
      setProg(data)
      if (data.concluida && !concluida) setMostrarBanner(true)
    }
  }

  async function marcarVideo() { if (videoAssistido) return; await upsertProgresso({ video_assistido: true }) }
  async function marcarPdf() {
    if (pdfBaixado || !videoAssistido) return
    if (aula.pdf_url) window.open(aula.pdf_url, '_blank')
    await upsertProgresso({ pdf_baixado: true })
  }
  async function responderQuiz(idx: number) {
    if (quizRespondido !== null || !quiz || !pdfBaixado) return
    setQuizRespondido(idx)
    if (idx === quiz.resposta_correta) setTimeout(() => upsertProgresso({ quiz_aprovado: true }), 600)
  }

  async function enviarComentario() {
    const texto = novoComentario.trim()
    if (!texto || enviando) return
    setEnviando(true)
    const { error } = await supabase.from('comentarios').insert({ aula_id: aula.id, usuario_id: userId, texto })
    if (!error) {
      setComentarios(prev => [...prev, {
        id: crypto.randomUUID(), aula_id: aula.id, usuario_id: userId, texto,
        pai_id: null, likes: 0, criado_em: new Date().toISOString(),
        perfis: { id: userId, nome: userName, avatar_url: userAvatar },
        user_liked: false,
      }])
      setNovoComentario('')
    }
    setEnviando(false)
  }

  async function toggleLike(comentarioId: string) {
    const { data } = await supabase.rpc('toggle_like', { p_comentario_id: comentarioId, p_usuario_id: userId })
    setComentarios(prev => prev.map(c => c.id === comentarioId ? { ...c, likes: data, user_liked: !c.user_liked } : c))
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

  const initials = userName ? userName.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : userId.slice(0, 2).toUpperCase()

  const etapas = [
    { label: 'VÍDEO', done: videoAssistido, cor: 'var(--cc-purple)' },
    { label: 'PDF', done: pdfBaixado, cor: 'var(--cc-orange)' },
    { label: 'QUIZ', done: quizAprovado, cor: 'var(--cc-green)' },
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">

      {/* HEADER DA AULA */}
      <div className="mb-5">
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-orange)' }}>AULA</p>
        <h1 className="font-display tracking-widest leading-tight mb-2" style={{ fontSize: '44px', color: 'var(--cc-white)' }}>
          {aula.titulo.toUpperCase()}
        </h1>
        {aula.descricao && <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{aula.descricao}</p>}
      </div>

      {/* ETAPAS */}
      <div className="flex gap-2 mb-5">
        {etapas.map((e, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
            style={{
              background: e.done ? 'rgba(0,232,122,0.08)' : 'rgba(255,255,255,0.02)',
              borderColor: e.done ? '#1a3a28' : '#1a1a1a',
            }}>
            <span style={{ color: e.done ? 'var(--cc-green)' : '#333', fontSize: '12px' }}>{e.done ? '✓' : `0${i + 1}`}</span>
            <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '2px', color: e.done ? 'var(--cc-green)' : '#444' }}>{e.label}</span>
          </div>
        ))}
      </div>

      {/* PLAYER */}
      <div className="rounded-2xl overflow-hidden mb-5 border" style={{ borderColor: '#1a1a1a', background: '#050505' }}>
        {aula.youtube_id ? (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${aula.youtube_id}?rel=0&modestbranding=1`} allowFullScreen />
          </div>
        ) : (
          <div className="flex items-center justify-center cursor-pointer" style={{ height: 320, background: '#0a0a0a' }} onClick={marcarVideo}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
              style={{ background: 'var(--cc-purple)', color: '#fff' }}>▶</div>
          </div>
        )}
      </div>

      {/* PROGRESSO TRACKER */}
      <div className="flex gap-1.5 mb-6">
        {etapas.map((e, i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{ background: e.done ? 'var(--cc-green)' : i === etapas.findIndex(x => !x.done) ? 'var(--cc-purple)' : '#1a1a1a' }} />
        ))}
      </div>

      {/* PDF + QUIZ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* PDF */}
        <div className="rounded-xl p-5 border" style={{
          background: pdfBaixado ? 'rgba(0,232,122,0.05)' : videoAssistido ? 'rgba(255,92,26,0.05)' : 'rgba(255,255,255,0.02)',
          borderColor: pdfBaixado ? '#1a3a28' : videoAssistido ? '#2a1800' : '#1a1a1a'
        }}>
          <p className="font-mono text-xs tracking-widest mb-3" style={{ color: '#444' }}>⬇ MATERIAL DE APOIO</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ background: '#1a0d0d', color: 'var(--cc-orange)' }}>📄</div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--cc-white)' }}>{aula.titulo}.pdf</p>
                <p className="font-mono text-xs" style={{ color: '#444' }}>{pdfBaixado ? 'baixado ✓' : 'material da aula'}</p>
              </div>
            </div>
            {pdfBaixado
              ? <span style={{ color: 'var(--cc-green)', fontSize: '26px' }}>✓</span>
              : <button onClick={marcarPdf} disabled={!videoAssistido}
                  className="font-mono text-xs px-4 py-2 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ borderColor: 'var(--cc-orange)', color: 'var(--cc-orange)' }}
                  onMouseEnter={e => { if (videoAssistido) { e.currentTarget.style.background = 'var(--cc-orange)'; e.currentTarget.style.color = '#0a0a0a' }}}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cc-orange)' }}>
                  BAIXAR
                </button>
            }
          </div>
        </div>

        {/* QUIZ */}
        <div className="rounded-xl p-5 border" style={{
          background: quizAprovado ? 'rgba(0,232,122,0.05)' : pdfBaixado ? 'rgba(123,47,255,0.05)' : 'rgba(255,255,255,0.02)',
          borderColor: quizAprovado ? '#1a3a28' : pdfBaixado ? '#3a2f6e' : '#1a1a1a'
        }}>
          <p className="font-mono text-xs tracking-widest mb-3" style={{ color: '#444' }}>? QUIZ</p>
          {!pdfBaixado
            ? <div className="flex flex-col items-center justify-center py-4 gap-2">
                <span style={{ fontSize: '24px' }}>🔒</span>
                <p className="font-mono text-xs" style={{ color: '#444' }}>baixe o PDF para liberar</p>
              </div>
            : quizAprovado
            ? <p className="font-mono text-sm text-center py-4" style={{ color: 'var(--cc-green)' }}>✓ respondido corretamente</p>
            : quiz
            ? <div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--cc-white)' }}>{quiz.pergunta}</p>
                <div className="flex flex-col gap-2">
                  {quiz.opcoes.map((opcao, i) => {
                    let bg = 'transparent', border = '#222', color = 'var(--cc-white)'
                    if (quizRespondido !== null) {
                      if (i === quiz.resposta_correta) { bg = 'rgba(0,232,122,0.1)'; border = 'var(--cc-green)'; color = 'var(--cc-green)' }
                      else if (i === quizRespondido) { bg = 'rgba(255,92,26,0.1)'; border = 'var(--cc-orange)'; color = 'var(--cc-orange)' }
                    }
                    return (
                      <button key={i} onClick={() => responderQuiz(i)} disabled={quizRespondido !== null}
                        className="text-left px-4 py-2.5 rounded-lg text-sm border transition-all disabled:cursor-default"
                        style={{ background: bg, borderColor: border, color }}
                        onMouseEnter={e => { if (quizRespondido === null) e.currentTarget.style.borderColor = 'var(--cc-purple)' }}
                        onMouseLeave={e => { if (quizRespondido === null) e.currentTarget.style.borderColor = '#222' }}>
                        {opcao}
                      </button>
                    )
                  })}
                </div>
              </div>
            : <p className="font-mono text-xs text-center py-4" style={{ color: '#444' }}>Quiz em breve</p>
          }
        </div>
      </div>

      {/* MARCAR VÍDEO */}
      {!videoAssistido && (
        <button onClick={marcarVideo}
          className="w-full py-4 rounded-xl font-mono text-xs tracking-widest border mb-5 transition-colors"
          style={{ borderColor: 'var(--cc-purple)', color: 'var(--cc-purple)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--cc-purple)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cc-purple)' }}>
          MARCAR COMO ASSISTIDO
        </button>
      )}

      {/* BANNER CONCLUSÃO */}
      {mostrarBanner && (
        <div className="rounded-2xl p-6 mb-5 border text-center" style={{ background: 'rgba(0,232,122,0.08)', borderColor: '#1a3a28' }}>
          <p className="font-display tracking-widest mb-1" style={{ fontSize: '32px', color: 'var(--cc-green)' }}>AULA CONCLUÍDA</p>
          <p className="text-sm mb-4" style={{ color: '#555' }}>Progresso salvo. Continue pela lista de aulas ao lado.</p>
          <button onClick={() => router.push(trilhaId ? `/trilha/${trilhaId}` : '/dashboard')}
            className="font-display text-xl tracking-widest px-8 py-3 rounded-xl"
            style={{ background: 'var(--cc-green)', color: '#0a0a0a' }}>
            VER TRILHA
          </button>
        </div>
      )}

      {/* COMENTÁRIOS */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', borderColor: '#1a1a1a' }}>
        <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: '#1a1a1a' }}>
          <h2 className="font-display text-xl tracking-widest" style={{ color: 'var(--cc-white)' }}>COMENTÁRIOS</h2>
          <span className="font-mono text-xs" style={{ color: '#444' }}>
            {carregandoComentarios ? '...' : `${comentarios.length} ${comentarios.length === 1 ? 'comentário' : 'comentários'}`}
          </span>
        </div>

        <div className="p-5">
          {/* Compose */}
          <div className="flex gap-3 mb-5">
            <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden" style={{ background: 'var(--cc-purple)' }}>
              {userAvatar
                ? <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center font-display text-xs" style={{ color: '#fff' }}>{initials}</div>
              }
            </div>
            <div className="flex-1">
              <textarea ref={comentarioRef} value={novoComentario} onChange={e => setNovoComentario(e.target.value)}
                placeholder="Deixe sua dúvida ou comentário sobre esta aula..." rows={2}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: 'var(--cc-white)' }}
                onFocus={e => e.target.style.borderColor = 'var(--cc-purple)'}
                onBlur={e => e.target.style.borderColor = '#1a1a1a'}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="font-mono text-xs" style={{ color: '#333' }}>Seja respeitoso e construtivo</span>
                <button onClick={enviarComentario} disabled={!novoComentario.trim() || enviando}
                  className="font-display text-sm tracking-widest px-5 py-2 rounded-lg transition-opacity disabled:opacity-30"
                  style={{ background: 'var(--cc-purple)', color: '#fff' }}>
                  {enviando ? '...' : 'ENVIAR'}
                </button>
              </div>
            </div>
          </div>

          {/* Lista */}
          {carregandoComentarios
            ? <p className="font-mono text-xs text-center py-4" style={{ color: '#444' }}>Carregando...</p>
            : comentarios.length === 0
            ? <p className="font-mono text-xs text-center py-6" style={{ color: '#333' }}>Seja o primeiro a comentar nesta aula</p>
            : <div className="flex flex-col gap-4">
                {comentarios.map(c => {
                  const nome = c.perfis?.nome || 'Usuário'
                  const iniciais = nome.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
                  const cores = ['#1D9E75', '#7B2FFF', '#D85A30', '#185FA5', '#854F0B']
                  const cor = cores[nome.charCodeAt(0) % cores.length]
                  return (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden" style={{ background: cor }}>
                        {c.perfis?.avatar_url
                          ? <img src={c.perfis.avatar_url} alt={nome} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center font-display text-xs" style={{ color: '#fff' }}>{iniciais}</div>
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-medium" style={{ color: 'var(--cc-white)' }}>{nome}</span>
                          {c.usuario_id === userId && (
                            <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: '#1f1a2e', color: 'var(--cc-purple)' }}>você</span>
                          )}
                          <span className="font-mono text-xs" style={{ color: '#444' }}>{formatarTempo(c.criado_em)}</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-2" style={{ color: '#888' }}>{c.texto}</p>
                        <div className="flex gap-3">
                          <button onClick={() => toggleLike(c.id)} className="font-mono text-xs flex items-center gap-1"
                            style={{ color: c.user_liked ? 'var(--cc-green)' : '#444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            ♥ {c.likes}
                          </button>
                          <button onClick={() => { comentarioRef.current?.focus(); comentarioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}
                            className="font-mono text-xs"
                            style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cc-green)')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
                            ↩ responder
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
          }
        </div>
      </div>
    </div>
  )
}
