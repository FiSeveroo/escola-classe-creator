'use client'

import { useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { intlLocale } from '@/i18n/config'
import { useI18n } from '@/i18n/I18nProvider'
import { cn, iniciais } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Aula, ComentarioView, ProgressoAula, QuizPergunta } from '@/types'
import { alternarLike, avancarEtapa, enviarComentario, type Etapa } from './actions'

interface Props {
  aula: Aula
  quiz: QuizPergunta | null
  progresso: ProgressoAula | null
  comentariosIniciais: ComentarioView[]
  userId: string
  userName: string
  userAvatar: string | null
  trilhaId: string | null
}

const CORES_AVATAR = ['#1D9E75', '#7B2FFF', '#D85A30', '#185FA5', '#854F0B']
const esperar = (ms: number) => new Promise(r => setTimeout(r, ms))

export default function AulaClient({
  aula,
  quiz,
  progresso: progressoInicial,
  comentariosIniciais,
  userId,
  userName,
  userAvatar,
  trilhaId,
}: Props) {
  const { lang, t, href } = useI18n()

  const [prog, setProg] = useState<ProgressoAula | null>(progressoInicial)
  const [salvando, startSalvar] = useTransition()
  const [erroProgresso, setErroProgresso] = useState('')
  const [quizRespondido, setQuizRespondido] = useState<number | null>(null)
  const [quizErrado, setQuizErrado] = useState(false)
  const [mostrarBanner, setMostrarBanner] = useState(false)

  const [comentarios, setComentarios] = useState(comentariosIniciais)
  const [novoComentario, setNovoComentario] = useState('')
  const [enviando, startEnviar] = useTransition()
  const comentarioRef = useRef<HTMLTextAreaElement>(null)

  const videoAssistido = prog?.video_assistido || false
  const pdfBaixado = prog?.pdf_baixado || false
  const quizAprovado = prog?.quiz_aprovado || false

  function avancar(etapa: Etapa, resposta?: number, atraso = 0) {
    setErroProgresso('')
    startSalvar(async () => {
      const [res] = await Promise.all([avancarEtapa(aula.id, etapa, resposta), esperar(atraso)])
      if (res.ok) {
        if (res.data.concluida && !prog?.concluida) setMostrarBanner(true)
        setProg(res.data)
      } else if (res.motivo === 'resposta_errada') {
        setQuizErrado(true)
      } else {
        setErroProgresso(t.aula.erroSalvar)
        if (etapa === 'quiz') setQuizRespondido(null)
      }
    })
  }

  function marcarVideo() {
    if (!videoAssistido && !salvando) avancar('video')
  }

  function marcarPdf() {
    if (pdfBaixado || !videoAssistido || salvando) return
    // Abre antes de qualquer await para não ser bloqueado como pop-up.
    if (aula.pdf_url) window.open(aula.pdf_url, '_blank', 'noopener')
    avancar('pdf')
  }

  function responderQuiz(idx: number) {
    if (quizRespondido !== null || !quiz || !pdfBaixado) return
    setQuizRespondido(idx)
    setQuizErrado(false)
    // Pequena pausa para o aluno ver o feedback antes do card mudar.
    avancar('quiz', idx, 600)
  }

  function tentarQuizDeNovo() {
    setQuizRespondido(null)
    setQuizErrado(false)
  }

  function enviar() {
    const texto = novoComentario.trim()
    if (!texto || enviando) return
    startEnviar(async () => {
      const criado = await enviarComentario(aula.id, texto)
      if (criado) {
        setComentarios(prev => [
          ...prev,
          { ...criado, autor: { id: userId, nome: userName, avatar_url: userAvatar }, user_liked: false },
        ])
        setNovoComentario('')
      }
    })
  }

  async function curtir(id: string) {
    const likes = await alternarLike(id)
    if (likes === null) return
    setComentarios(prev => prev.map(c => (c.id === id ? { ...c, likes, user_liked: !c.user_liked } : c)))
  }

  function tempoRelativo(iso: string) {
    const minutos = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
    if (minutos < 1) return t.aula.agora
    const rtf = new Intl.RelativeTimeFormat(intlLocale[lang], { numeric: 'auto', style: 'short' })
    if (minutos < 60) return rtf.format(-minutos, 'minute')
    const horas = Math.floor(minutos / 60)
    if (horas < 24) return rtf.format(-horas, 'hour')
    return rtf.format(-Math.floor(horas / 24), 'day')
  }

  const etapas = [
    { label: t.aula.video, done: videoAssistido },
    { label: t.aula.pdf, done: pdfBaixado },
    { label: t.aula.quiz, done: quizAprovado },
  ]
  const etapaAtual = etapas.findIndex(e => !e.done)

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      {/* HEADER */}
      <div className="mb-5">
        <p className="font-mono text-xs tracking-widest mb-1 text-cc-orange">{t.aula.aula}</p>
        <h1 className="font-display tracking-widest leading-tight mb-2 text-[clamp(28px,6vw,52px)]">
          {aula.titulo.toUpperCase()}
        </h1>
        {aula.descricao && <p className="text-sm leading-relaxed text-[#999]">{aula.descricao}</p>}
      </div>

      {/* ETAPAS */}
      <div className="flex gap-2 mb-5">
        {etapas.map((e, i) => (
          <div
            key={e.label}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border',
              e.done ? 'bg-cc-green/8 border-[#1a3a28]' : 'bg-white/[0.02] border-cc-gray'
            )}
          >
            <span className={cn('text-xs', e.done ? 'text-cc-green' : 'text-[#333]')}>{e.done ? '✓' : `0${i + 1}`}</span>
            <span className={cn('font-mono text-[9px] tracking-[2px]', e.done ? 'text-cc-green' : 'text-[#444]')}>
              {e.label}
            </span>
          </div>
        ))}
      </div>

      {/* PLAYER */}
      <div className="rounded-2xl overflow-hidden mb-5 border border-cc-gray bg-[#050505]">
        {aula.youtube_id ? (
          <div className="relative w-full aspect-video">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${aula.youtube_id}?rel=0&modestbranding=1&hl=${lang}`}
              title={aula.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={marcarVideo}
            className="flex w-full h-80 items-center justify-center bg-cc-bg"
            aria-label={t.aula.marcarAssistido}
          >
            <span className="size-20 rounded-full flex items-center justify-center text-3xl bg-secondary text-white">▶</span>
          </button>
        )}
      </div>

      {/* PROGRESSO */}
      <div className="flex gap-1.5 mb-6">
        {etapas.map((e, i) => (
          <div
            key={e.label}
            className={cn(
              'flex-1 h-1 rounded-full transition-all duration-500',
              e.done ? 'bg-cc-green' : i === etapaAtual ? 'bg-cc-purple' : 'bg-cc-gray'
            )}
          />
        ))}
      </div>

      {erroProgresso && (
        <p role="alert" className="font-mono text-xs text-cc-orange mb-4">
          {erroProgresso}
        </p>
      )}

      {/* PDF + QUIZ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <Card
          className={cn(
            'p-5',
            pdfBaixado
              ? 'bg-cc-green/5 border-[#1a3a28]'
              : videoAssistido
                ? 'bg-cc-orange/5 border-[#2a1800]'
                : 'bg-white/[0.02] border-cc-gray'
          )}
        >
          <p className="font-mono text-xs tracking-widest mb-3 text-muted-foreground">⬇ {t.aula.material}</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 shrink-0 rounded-lg flex items-center justify-center text-lg bg-[#1a0d0d] text-cc-orange">
                📄
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{aula.titulo}.pdf</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {pdfBaixado ? `${t.aula.baixado} ✓` : t.aula.materialDaAula}
                </p>
              </div>
            </div>
            {pdfBaixado ? (
              <span className="text-cc-green text-[26px]">✓</span>
            ) : (
              <Button variant="outline-destructive" font="mono" onClick={marcarPdf} disabled={!videoAssistido || salvando}>
                {t.aula.baixar}
              </Button>
            )}
          </div>
        </Card>

        <Card
          className={cn(
            'p-5',
            quizAprovado
              ? 'bg-cc-green/5 border-[#1a3a28]'
              : pdfBaixado
                ? 'bg-cc-purple/5 border-[#3a2f6e]'
                : 'bg-white/[0.02] border-cc-gray'
          )}
        >
          <p className="font-mono text-xs tracking-widest mb-3 text-muted-foreground">? {t.aula.quiz}</p>
          {!pdfBaixado ? (
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <span className="text-2xl">🔒</span>
              <p className="font-mono text-xs text-muted-foreground">{t.aula.quizBloqueado}</p>
            </div>
          ) : quizAprovado ? (
            <p className="font-mono text-sm text-center py-4 text-cc-green">✓ {t.aula.quizCorreto}</p>
          ) : quiz ? (
            <div>
              <p className="text-sm mb-4 leading-relaxed">{quiz.pergunta}</p>
              <div className="flex flex-col gap-2">
                {quiz.opcoes.map((opcao, i) => {
                  const respondido = quizRespondido !== null
                  const correta = respondido && i === quiz.resposta_correta
                  const escolhidaErrada = respondido && i === quizRespondido && !correta
                  return (
                    <button
                      key={i}
                      onClick={() => responderQuiz(i)}
                      disabled={respondido}
                      className={cn(
                        'text-left px-4 py-2.5 rounded-lg text-sm border transition-all disabled:cursor-default',
                        correta
                          ? 'bg-cc-green/10 border-cc-green text-cc-green'
                          : escolhidaErrada
                            ? 'bg-cc-orange/10 border-cc-orange text-cc-orange'
                            : 'border-cc-gray2 enabled:hover:border-cc-purple'
                      )}
                    >
                      {opcao}
                    </button>
                  )
                })}
              </div>
              {quizErrado && (
                <div className="mt-3 flex flex-col gap-2">
                  <p className="font-mono text-xs text-cc-orange">{t.aula.quizErrado}</p>
                  <Button variant="outline" font="mono" size="sm" onClick={tentarQuizDeNovo} className="self-start">
                    {t.aula.tentarNovamente}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="font-mono text-xs text-center py-4 text-muted-foreground">{t.aula.quizEmBreve}</p>
          )}
        </Card>
      </div>

      {!videoAssistido && (
        <Button
          variant="outline-secondary"
          font="mono"
          onClick={marcarVideo}
          disabled={salvando}
          className="w-full h-auto py-4 rounded-xl mb-5"
        >
          {t.aula.marcarAssistido}
        </Button>
      )}

      {mostrarBanner && (
        <div className="rounded-2xl p-6 mb-5 border text-center bg-cc-green/8 border-[#1a3a28]">
          <p className="font-display tracking-widest mb-1 text-[32px] text-cc-green">{t.aula.concluidaTitulo}</p>
          <p className="text-sm mb-4 text-[#999]">{t.aula.concluidaTexto}</p>
          <Button asChild size="lg" font="display" className="text-xl px-8 rounded-xl">
            <Link href={href(trilhaId ? `/trilha/${trilhaId}` : '/dashboard')}>{t.aula.verTrilha}</Link>
          </Button>
        </div>
      )}

      {/* COMENTÁRIOS */}
      <Card className="bg-white/[0.02] border-cc-gray rounded-2xl">
        <div className="px-5 py-4 border-b border-cc-gray flex justify-between items-center">
          <h2 className="font-display text-xl tracking-widest">{t.aula.comentarios}</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {comentarios.length} {comentarios.length === 1 ? t.aula.comentario1 : t.aula.comentarioN}
          </span>
        </div>

        <CardContent>
          <div className="flex gap-3 mb-5">
            <Avatar>
              {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
              <AvatarFallback>{iniciais(userName, userId.slice(0, 2).toUpperCase())}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                ref={comentarioRef}
                value={novoComentario}
                onChange={e => setNovoComentario(e.target.value)}
                placeholder={t.aula.placeholder}
                rows={2}
                className="rounded-xl px-4 py-3 resize-none border-cc-gray focus-visible:border-cc-purple focus-visible:ring-cc-purple/30"
              />
              <div className="flex justify-between items-center mt-2 gap-2">
                <span className="font-mono text-xs text-[#555]">{t.aula.respeito}</span>
                <Button variant="secondary" font="display" size="sm" className="text-sm px-5" onClick={enviar} disabled={!novoComentario.trim() || enviando}>
                  {enviando ? '...' : t.aula.enviar}
                </Button>
              </div>
            </div>
          </div>

          {comentarios.length === 0 ? (
            <p className="font-mono text-xs text-center py-6 text-[#555]">{t.aula.primeiro}</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {comentarios.map(c => {
                const nome = c.autor.nome || t.comum.usuario
                return (
                  <li key={c.id} className="flex gap-3">
                    <Avatar>
                      {c.autor.avatar_url && <AvatarImage src={c.autor.avatar_url} alt={nome} />}
                      <AvatarFallback style={{ background: CORES_AVATAR[nome.charCodeAt(0) % CORES_AVATAR.length] }}>
                        {iniciais(nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium">{nome}</span>
                        {c.usuario_id === userId && <Badge variant="secondary">{t.aula.voce}</Badge>}
                        <span className="font-mono text-xs text-muted-foreground" suppressHydrationWarning>
                          {tempoRelativo(c.criado_em)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mb-2 text-muted-foreground whitespace-pre-line break-words">{c.texto}</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => curtir(c.id)}
                          aria-pressed={c.user_liked}
                          aria-label={t.aula.curtir}
                          className={cn(
                            'font-mono text-xs flex items-center gap-1 transition-colors',
                            c.user_liked ? 'text-cc-green' : 'text-[#555] hover:text-foreground'
                          )}
                        >
                          ♥ {c.likes}
                        </button>
                        <button
                          onClick={() => {
                            comentarioRef.current?.focus()
                            comentarioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          }}
                          className="font-mono text-xs text-muted-foreground hover:text-cc-green transition-colors"
                        >
                          ↩ {t.aula.responder}
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
