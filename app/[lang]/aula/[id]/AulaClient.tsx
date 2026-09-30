'use client'

import { useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  FileTextIcon,
  HeartIcon,
  ListChecksIcon,
  LockIcon,
  PlayIcon,
  ReplyIcon,
  RotateCcwIcon,
  type LucideIcon,
} from 'lucide-react'
import { intlLocale } from '@/i18n/config'
import { useI18n } from '@/i18n/I18nProvider'
import { cn, iniciais } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eyebrow, SectionTitle } from '@/components/brand/Brand'
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
  trilhaTitulo: string | null
  numero: number | null
  proximaAulaId: string | null
}

const CORES_AVATAR = ['#27D337', '#560BF2', '#D36C27', '#185FA5', '#854F0B']
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
  trilhaTitulo,
  numero,
  proximaAulaId,
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

  const etapas: { label: string; titulo: string; done: boolean; liberada: boolean; Icon: LucideIcon; acao?: React.ReactNode }[] = [
    {
      label: t.aula.video,
      titulo: t.aula.passoVideo,
      done: videoAssistido,
      liberada: true,
      Icon: PlayIcon,
      acao: (
        <Button variant="outline" size="sm" onClick={marcarVideo} disabled={salvando}>
          <CheckIcon /> {t.aula.marcarAssistido}
        </Button>
      ),
    },
    {
      label: t.aula.pdf,
      titulo: t.aula.passoPdf,
      done: pdfBaixado,
      liberada: videoAssistido,
      Icon: FileTextIcon,
      acao: (
        <Button variant="outline" size="sm" onClick={marcarPdf} disabled={!videoAssistido || salvando}>
          <DownloadIcon /> {t.aula.baixar}
        </Button>
      ),
    },
    {
      label: t.aula.quiz,
      titulo: t.aula.passoQuiz,
      done: quizAprovado,
      liberada: pdfBaixado,
      Icon: ListChecksIcon,
    },
  ]
  const etapaAtual = etapas.findIndex(e => !e.done)
  const linkDepois = proximaAulaId
    ? href(`/aula/${proximaAulaId}?trilha=${trilhaId}`)
    : href(trilhaId ? `/trilha/${trilhaId}` : '/dashboard')

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
      {trilhaId && (
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
          <Link href={href(`/trilha/${trilhaId}`)}>
            <ArrowLeftIcon /> {trilhaTitulo || t.trilha.trilha}
          </Link>
        </Button>
      )}

      {/* CABEÇALHO */}
      <header className="mb-6">
        <Eyebrow className="text-cc-purple-text">
          {t.aula.aula}
          {numero ? ` ${String(numero).padStart(2, '0')}` : ''}
        </Eyebrow>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-[0.95] text-cc-green">{aula.titulo}</h1>
        {aula.descricao && <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">{aula.descricao}</p>}
      </header>

      {/* PLAYER */}
      <div className="overflow-hidden rounded-2xl border border-cc-line bg-black">
        {aula.youtube_id ? (
          <div className="relative w-full aspect-video">
            <iframe
              className="absolute inset-0 h-full w-full"
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
            className="group relative grid w-full aspect-video place-items-center bg-textura"
            aria-label={t.aula.marcarAssistido}
          >
            <span className="absolute inset-0 bg-black/60" />
            <span className="relative grid size-20 place-items-center rounded-full bg-cc-green text-primary-foreground shadow-[0_0_0_8px_rgba(39,211,55,0.15)] transition-transform group-hover:scale-105">
              <PlayIcon className="size-8 translate-x-0.5 fill-current" />
            </span>
          </button>
        )}
      </div>

      {/* ETAPAS */}
      <section className="mt-8" aria-label={t.aula.etapas}>
        <ol className="grid gap-3 sm:grid-cols-3">
          {etapas.map((e, i) => {
            const atual = i === etapaAtual
            return (
              <li
                key={e.label}
                className={cn(
                  'flex flex-col rounded-2xl border p-4 transition-colors',
                  e.done ? 'border-cc-green/40 bg-cc-green/[0.06]' : atual ? 'border-cc-purple bg-cc-purple/[0.08]' : 'border-cc-line bg-cc-surface'
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-full',
                      e.done ? 'bg-cc-green text-primary-foreground' : atual ? 'bg-cc-purple text-white' : 'bg-cc-surface-2 text-muted-foreground'
                    )}
                  >
                    {e.done ? <CheckIcon className="size-4" strokeWidth={3} /> : e.liberada ? <e.Icon className="size-4" /> : <LockIcon className="size-4" />}
                  </span>
                  <div className="min-w-0">
                    <p className="label-caps text-muted-foreground">
                      {i + 1}. {e.label}
                    </p>
                    <p className={cn('text-sm font-semibold', !e.liberada && 'text-muted-foreground')}>{e.titulo}</p>
                  </div>
                </div>
                {!e.done && e.acao && atual && <div className="mt-4">{e.acao}</div>}
                {i === 1 && !pdfBaixado && atual && (
                  <p className="mt-2 truncate text-xs text-muted-foreground">
                    {aula.titulo}.pdf · {t.aula.materialDaAula}
                  </p>
                )}
              </li>
            )
          })}
        </ol>

        {erroProgresso && (
          <p role="alert" className="mt-3 rounded-lg border border-cc-orange/40 bg-cc-orange/10 px-3 py-2.5 text-sm text-cc-orange">
            {erroProgresso}
          </p>
        )}
      </section>

      {/* QUIZ */}
      {pdfBaixado && !quizAprovado && (
        <section className="mt-6 rounded-2xl border border-cc-purple/60 bg-cc-surface p-5 sm:p-6">
          <Eyebrow className="text-cc-purple-text">{t.aula.quiz}</Eyebrow>
          {quiz ? (
            <>
              <p className="mt-2 text-lg font-semibold leading-snug">{quiz.pergunta}</p>
              <div className="mt-5 grid gap-2">
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
                        'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-colors disabled:cursor-default',
                        correta
                          ? 'border-cc-green bg-cc-green/10 text-cc-green'
                          : escolhidaErrada
                            ? 'border-cc-orange bg-cc-orange/10 text-cc-orange'
                            : 'border-cc-line bg-cc-bg enabled:hover:border-cc-purple enabled:hover:bg-cc-purple/[0.06]'
                      )}
                    >
                      <span
                        className={cn(
                          'grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold',
                          correta ? 'border-cc-green' : escolhidaErrada ? 'border-cc-orange' : 'border-cc-line text-muted-foreground'
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opcao}
                    </button>
                  )
                })}
              </div>
              {quizErrado && (
                <div className="mt-4 flex flex-col gap-3 rounded-xl border border-cc-orange/40 bg-cc-orange/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-cc-orange">{t.aula.quizErrado}</p>
                  <Button variant="outline" size="sm" onClick={tentarQuizDeNovo}>
                    <RotateCcwIcon /> {t.aula.tentarNovamente}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="mt-2 text-muted-foreground">{t.aula.quizEmBreve}</p>
          )}
        </section>
      )}

      {/* CONCLUSÃO */}
      {(mostrarBanner || (quizAprovado && prog?.concluida)) && (
        <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-cc-green/50 bg-cc-green/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-cc-green text-primary-foreground">
              <CheckIcon className="size-6" strokeWidth={3} />
            </span>
            <div>
              <p className="font-display text-2xl text-cc-green">{t.aula.concluidaTitulo}</p>
              <p className="text-sm text-muted-foreground">{t.aula.concluidaTexto}</p>
            </div>
          </div>
          <Button asChild variant="cta" size="lg" font="display">
            <Link href={linkDepois}>
              {proximaAulaId ? t.aula.proximaAula : t.aula.verTrilha} <ArrowRightIcon />
            </Link>
          </Button>
        </section>
      )}

      {/* COMENTÁRIOS */}
      <section className="mt-12">
        <SectionTitle
          action={
            <span className="text-sm text-muted-foreground">
              {comentarios.length} {comentarios.length === 1 ? t.aula.comentario1 : t.aula.comentarioN}
            </span>
          }
        >
          {t.aula.comentarios}
        </SectionTitle>

        <div className="flex gap-3">
          <Avatar className="size-9">
            {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
            <AvatarFallback>{iniciais(userName, userId.slice(0, 2).toUpperCase())}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              ref={comentarioRef}
              value={novoComentario}
              onChange={e => setNovoComentario(e.target.value)}
              placeholder={t.aula.placeholder}
              rows={3}
              className="resize-none rounded-xl px-4 py-3 text-[15px]"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{t.aula.respeito}</span>
              <Button size="sm" onClick={enviar} disabled={!novoComentario.trim() || enviando}>
                {enviando ? '...' : t.aula.enviar}
              </Button>
            </div>
          </div>
        </div>

        {comentarios.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-cc-line p-6 text-center text-sm text-muted-foreground">{t.aula.primeiro}</p>
        ) : (
          <ul className="mt-8 flex flex-col divide-y divide-cc-line">
            {comentarios.map(c => {
              const nome = c.autor.nome || t.comum.usuario
              return (
                <li key={c.id} className="flex gap-3 py-5 first:pt-0">
                  <Avatar className="size-9">
                    {c.autor.avatar_url && <AvatarImage src={c.autor.avatar_url} alt={nome} />}
                    <AvatarFallback style={{ background: CORES_AVATAR[nome.charCodeAt(0) % CORES_AVATAR.length] }}>
                      {iniciais(nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{nome}</span>
                      {c.usuario_id === userId && <Badge variant="secondary">{t.aula.voce}</Badge>}
                      <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                        {tempoRelativo(c.criado_em)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-line break-words text-[15px] leading-relaxed text-foreground/85">{c.texto}</p>
                    <div className="mt-2 flex gap-4">
                      <button
                        onClick={() => curtir(c.id)}
                        aria-pressed={c.user_liked}
                        aria-label={t.aula.curtir}
                        className={cn(
                          'flex items-center gap-1.5 text-xs font-semibold transition-colors',
                          c.user_liked ? 'text-cc-green' : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <HeartIcon className={cn('size-4', c.user_liked && 'fill-current')} /> {c.likes}
                      </button>
                      <button
                        onClick={() => {
                          comentarioRef.current?.focus()
                          comentarioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ReplyIcon className="size-4" /> {t.aula.responder}
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
