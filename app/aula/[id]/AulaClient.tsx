'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Aula, QuizPergunta, ProgressoAula, Comentario } from '@/types'

interface Props {
  aula: Aula
  quiz: QuizPergunta | null
  progresso: ProgressoAula | null
  comentarios: (Comentario & { user_liked: boolean })[]
  userId: string
  trilhaId: string | null
}

export default function AulaClient({ aula, quiz, progresso: progressoInicial, comentarios: comentariosIniciais, userId, trilhaId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [prog, setProg] = useState<ProgressoAula | null>(progressoInicial)
  const [comentarios, setComentarios] = useState(comentariosIniciais)
  const [novoComentario, setNovoComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [quizRespondido, setQuizRespondido] = useState<number | null>(null)
  const [mostrarBanner, setMostrarBanner] = useState(false)
  const comentarioRef = useRef<HTMLTextAreaElement>(null)

  const videoAssistido = prog?.video_assistido || false
  const pdfBaixado = prog?.pdf_baixado || false
  const quizAprovado = prog?.quiz_aprovado || false
  const concluida = prog?.concluida || false

  async function upsertProgresso(patch: Partial<ProgressoAula>) {
    const atual = prog || { usuario_id: userId, aula_id: aula.id, video_assistido: false, pdf_baixado: false, quiz_aprovado: false, concluida: false }
    const novo = { ...atual, ...patch }
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
    const { data, error } = await supabase
      .from('comentarios')
      .insert({ aula_id: aula.id, usuario_id: userId, texto })
      .select('*, perfis(id, nome)')
      .single()
    if (!error && data) {
      setComentarios(prev => [...prev, { ...data, user_liked: false }])
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

  const stepDotStyle = (done: boolean, current: boolean) => ({
    flex: 1, height: 3, borderRadius: 2,
    background: done ? 'var(--cc-green)' : current ? 'var(--cc-purple)' : 'var(--cc-gray2)',
    transition: 'background 0.3s',
  })

  return (
    <main className="flex-1 p-5 max-w-2xl mx-auto w-full">

      {/* Header */}
      <div className="mb-5">
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-orange)' }}>
          AULA
        </p>
        <h1 className="font-display text-3xl tracking-widest leading-tight" style={{ color: 'var(--cc-white)' }}>
          {aula.titulo.toUpperCase()}
        </h1>
        {aula.descricao && (
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--cc-muted)' }}>
            {aula.descricao}
          </p>
        )}
      </div>

      {/* Tracker de etapas */}
      <div className="flex gap-1.5 mb-5">
        <div style={stepDotStyle(videoAssistido, !videoAssistido)} />
        <div style={stepDotStyle(pdfBaixado, videoAssistido && !pdfBaixado)} />
        <div style={stepDotStyle(quizAprovado, pdfBaixado && !quizAprovado)} />
      </div>

      {/* ETAPA 1 — Vídeo */}
      <div
        className="rounded-xl p-4 mb-3 border"
        style={{
          background: 'var(--cc-gray)',
          borderColor: videoAssistido ? '#1a3a28' : 'var(--cc-purple)',
          opacity: videoAssistido ? 0.8 : 1,
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--cc-muted)' }}>
            ▶ ASSISTIR AULA
          </span>
          {videoAssistido
            ? <span className="font-mono text-xs" style={{ color: 'var(--cc-green)' }}>✓ Concluído</span>
            : <span className="font-mono text-xs" style={{ color: 'var(--cc-purple)' }}>Em andamento</span>
          }
        </div>

        {aula.youtube_id ? (
          <div className="relative rounded-lg overflow-hidden mb-2" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${aula.youtube_id}?rel=0&modestbranding=1`}
              allowFullScreen
              onLoad={() => {}}
            />
          </div>
        ) : (
          <div
            className="rounded-lg flex items-center justify-center mb-2 cursor-pointer"
            style={{ height: 140, background: '#111', border: '1px solid var(--cc-gray2)' }}
            onClick={marcarVideo}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--cc-purple)' }}
            >
              <span className="text-white text-xl">▶</span>
            </div>
          </div>
        )}

        {!videoAssistido && (
          <button
            onClick={marcarVideo}
            className="w-full py-2 rounded-lg font-mono text-xs tracking-widest border transition-colors"
            style={{ borderColor: 'var(--cc-purple)', color: 'var(--cc-purple)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--cc-purple)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cc-purple)' }}
          >
            MARCAR COMO ASSISTIDO
          </button>
        )}
      </div>

      {/* ETAPA 2 — PDF */}
      <div
        className="rounded-xl p-4 mb-3 border"
        style={{
          background: 'var(--cc-gray)',
          borderColor: pdfBaixado ? '#1a3a28' : videoAssistido ? 'var(--cc-purple)' : 'var(--cc-gray2)',
          opacity: pdfBaixado ? 0.8 : 1,
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--cc-muted)' }}>
            ⬇ MATERIAL DE APOIO
          </span>
          {pdfBaixado
            ? <span className="font-mono text-xs" style={{ color: 'var(--cc-green)' }}>✓ Concluído</span>
            : videoAssistido
            ? <span className="font-mono text-xs" style={{ color: 'var(--cc-purple)' }}>Em andamento</span>
            : null
          }
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: '#1a0d0d', color: 'var(--cc-orange)' }}
            >
              📄
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--cc-white)' }}>{aula.titulo}.pdf</p>
              <p className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
                {pdfBaixado ? 'baixado ✓' : 'material de apoio da aula'}
              </p>
            </div>
          </div>
          {pdfBaixado ? (
            <span className="text-lg" style={{ color: 'var(--cc-green)' }}>✓</span>
          ) : (
            <button
              onClick={marcarPdf}
              disabled={!videoAssistido}
              className="font-mono text-xs px-3 py-1.5 rounded border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ borderColor: 'var(--cc-orange)', color: 'var(--cc-orange)' }}
              onMouseEnter={e => { if (videoAssistido) { e.currentTarget.style.background = 'var(--cc-orange)'; e.currentTarget.style.color = 'var(--cc-bg)' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cc-orange)' }}
            >
              BAIXAR
            </button>
          )}
        </div>
      </div>

      {/* ETAPA 3 — Quiz */}
      <div
        className="rounded-xl p-4 mb-3 border"
        style={{
          background: 'var(--cc-gray)',
          borderColor: quizAprovado ? '#1a3a28' : pdfBaixado ? 'var(--cc-purple)' : 'var(--cc-gray2)',
          opacity: quizAprovado ? 0.8 : 1,
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--cc-muted)' }}>
            ? QUIZ
          </span>
          {quizAprovado
            ? <span className="font-mono text-xs" style={{ color: 'var(--cc-green)' }}>✓ Concluído</span>
            : pdfBaixado
            ? <span className="font-mono text-xs" style={{ color: 'var(--cc-purple)' }}>Em andamento</span>
            : null
          }
        </div>

        {!pdfBaixado ? (
          <div className="text-center py-4">
            <p className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
              🔒 baixe o PDF para liberar o quiz
            </p>
          </div>
        ) : quizAprovado ? (
          <div className="text-center py-3">
            <p className="font-mono text-xs" style={{ color: 'var(--cc-green)' }}>✓ respondido corretamente</p>
          </div>
        ) : quiz ? (
          <div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--cc-white)' }}>
              {quiz.pergunta}
            </p>
            <div className="flex flex-col gap-2">
              {quiz.opcoes.map((opcao, i) => {
                let borderColor = 'var(--cc-gray3)'
                let bg = 'var(--cc-bg)'
                let textColor = 'var(--cc-white)'
                if (quizRespondido !== null) {
                  if (i === quiz.resposta_correta) { borderColor = 'var(--cc-green)'; bg = '#0d1f15'; textColor = 'var(--cc-green)' }
                  else if (i === quizRespondido) { borderColor = 'var(--cc-orange)'; bg = '#1f120d'; textColor = 'var(--cc-orange)' }
                }
                return (
                  <button
                    key={i}
                    onClick={() => responderQuiz(i)}
                    disabled={quizRespondido !== null}
                    className="text-left px-3 py-2.5 rounded-lg text-sm border transition-colors disabled:cursor-default"
                    style={{ borderColor, background: bg, color: textColor }}
                    onMouseEnter={e => { if (quizRespondido === null) e.currentTarget.style.borderColor = 'var(--cc-purple)' }}
                    onMouseLeave={e => { if (quizRespondido === null) e.currentTarget.style.borderColor = 'var(--cc-gray3)' }}
                  >
                    {opcao}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="font-mono text-xs text-center py-3" style={{ color: 'var(--cc-muted)' }}>
            Quiz em breve
          </p>
        )}
      </div>

      {/* Banner de conclusão */}
      {mostrarBanner && (
        <div
          className="rounded-xl p-5 mb-3 border text-center"
          style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-green)' }}
        >
          <p className="font-display text-2xl tracking-widest mb-1" style={{ color: 'var(--cc-green)' }}>
            AULA CONCLUÍDA
          </p>
          <p className="text-sm mb-4" style={{ color: 'var(--cc-muted)' }}>
            Progresso salvo. Continue para a próxima aula.
          </p>
          <button
            onClick={() => trilhaId ? router.push(`/trilha/${trilhaId}`) : router.push('/dashboard')}
            className="font-display text-xl tracking-widest px-6 py-2.5 rounded-lg"
            style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}
          >
            VER TRILHA
          </button>
        </div>
      )}

      {/* COMENTÁRIOS */}
      <div
        className="rounded-xl p-4 border mt-3"
        style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl tracking-widest" style={{ color: 'var(--cc-white)' }}>
            COMENTÁRIOS
          </h2>
          <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
            {comentarios.length} {comentarios.length === 1 ? 'comentário' : 'comentários'}
          </span>
        </div>

        {/* Campo de novo comentário */}
        <div className="flex gap-3 mb-4">
          <div
            className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-display text-xs mt-0.5"
            style={{ background: 'var(--cc-purple)', color: '#fff' }}
          >
            F
          </div>
          <div className="flex-1">
            <textarea
              ref={comentarioRef}
              value={novoComentario}
              onChange={e => setNovoComentario(e.target.value)}
              placeholder="Deixe sua dúvida ou comentário sobre esta aula..."
              rows={2}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
              style={{
                background: 'var(--cc-bg)',
                border: '1px solid var(--cc-gray3)',
                color: 'var(--cc-white)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--cc-purple)'}
              onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) enviarComentario() }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
                Seja respeitoso e construtivo
              </span>
              <button
                onClick={enviarComentario}
                disabled={!novoComentario.trim() || enviando}
                className="font-display text-sm tracking-widest px-4 py-1.5 rounded-lg transition-opacity disabled:opacity-30"
                style={{ background: 'var(--cc-purple)', color: '#fff' }}
              >
                {enviando ? 'ENVIANDO...' : 'ENVIAR'}
              </button>
            </div>
          </div>
        </div>

        {/* Lista de comentários */}
        {comentarios.length === 0 ? (
          <div className="text-center py-6">
            <p className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
              Seja o primeiro a comentar nesta aula
            </p>
          </div>
        ) : (
          <>
            <hr className="mb-4" style={{ borderColor: 'var(--cc-gray2)' }} />
            <div className="flex flex-col gap-4">
              {comentarios.map(c => {
                const nome = c.perfis?.nome || 'Usuário'
                const iniciais = nome.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
                const cores = ['#1D9E75', '#7B2FFF', '#D85A30', '#185FA5', '#854F0B']
                const cor = cores[nome.charCodeAt(0) % cores.length]

                return (
                  <div key={c.id} className="flex gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-display text-xs"
                      style={{ background: cor, color: '#fff' }}
                    >
                      {iniciais}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: 'var(--cc-white)' }}>{nome}</span>
                        {c.usuario_id === userId && (
                          <span
                            className="font-mono text-xs px-1.5 py-0.5 rounded"
                            style={{ background: '#1f1a2e', color: 'var(--cc-purple)' }}
                          >
                            você
                          </span>
                        )}
                        <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
                          {formatarTempo(c.criado_em)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#ccc' }}>{c.texto}</p>
                      <div className="flex gap-3 mt-1.5">
                        <button
                          onClick={() => toggleLike(c.id)}
                          className="font-mono text-xs flex items-center gap-1 transition-colors"
                          style={{ color: c.user_liked ? 'var(--cc-green)' : 'var(--cc-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          ♥ {c.likes}
                        </button>
                        <button
                          onClick={() => { comentarioRef.current?.focus(); comentarioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}
                          className="font-mono text-xs transition-colors"
                          style={{ color: 'var(--cc-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--cc-green)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--cc-muted)')}
                        >
                          ↩ responder
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
