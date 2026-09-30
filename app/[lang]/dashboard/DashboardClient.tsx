'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRightIcon, CheckIcon, CompassIcon, ListChecksIcon, PinIcon, PlayIcon } from 'lucide-react'
import { intlLocale } from '@/i18n/config'
import { useI18n } from '@/i18n/I18nProvider'
import { fmt } from '@/i18n/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { BrandBlock, Eyebrow, SectionTitle } from '@/components/brand/Brand'
import { PageContainer } from '@/components/layout/AppShell'
import { TrilhaCard, TrilhaIcon } from '@/components/trilha/TrilhaCard'
import type { Perfil } from '@/types'

export interface TrilhaRaw {
  id: string
  titulo: string
  descricao: string | null
  obrigatoria: boolean
  ordem: number
  trilha_aulas: { aula_id: string; ordem: number; compartilhada: boolean; aulas: { titulo: string } | null }[]
}

export interface ProximaAula {
  aulaId: string
  aulaTitulo: string
  trilhaId: string
  trilhaTitulo: string
  numero: number
  total: number
}

interface MuralItem {
  id: string
  titulo: string
  texto: string
  autor: string
  fixado: boolean
  criado_em: string
}

interface Props {
  trilhas: TrilhaRaw[]
  aulasConcluidas: string[]
  perfil: Perfil | null
  mural: MuralItem[]
  primeiroAcesso: boolean
  proxima: ProximaAula | null
}

const ICONES_ONBOARDING = [CompassIcon, ListChecksIcon, ArrowRightIcon, CheckIcon]

export default function DashboardClient({ trilhas, aulasConcluidas, perfil, mural, primeiroAcesso, proxima }: Props) {
  const router = useRouter()
  const { lang, t, href } = useI18n()
  const concluidas = new Set(aulasConcluidas)
  const [showPopup, setShowPopup] = useState(primeiroAcesso)
  const [popupStep, setPopupStep] = useState(0)

  const nucleo = trilhas.find(tr => tr.obrigatoria)
  const especificas = trilhas.filter(tr => !tr.obrigatoria)

  const nucleoTotal = nucleo?.trilha_aulas.length || 0
  const nucleoFeitas = nucleo?.trilha_aulas.filter(ta => concluidas.has(ta.aula_id)).length || 0
  const nucleoCompleto = nucleoTotal > 0 && nucleoFeitas === nucleoTotal
  const nucleoPct = nucleoTotal ? Math.round((nucleoFeitas / nucleoTotal) * 100) : 0

  const todasAulas = [...new Set(trilhas.flatMap(tr => tr.trilha_aulas.map(ta => ta.aula_id)))]
  const totalGeral = todasAulas.length
  const feitasGeral = todasAulas.filter(id => concluidas.has(id)).length
  const pctGeral = totalGeral ? Math.round((feitasGeral / totalGeral) * 100) : 0

  const nome = perfil?.nome?.split(' ')[0] || t.comum.criador
  const cards = t.dashboard.popup.cards
  const OnboardingIcon = ICONES_ONBOARDING[popupStep]
  const linkProxima = proxima ? href(`/aula/${proxima.aulaId}?trilha=${proxima.trilhaId}`) : null

  function formatarData(iso: string) {
    return new Date(iso).toLocaleDateString(intlLocale[lang], { day: '2-digit', month: 'short' })
  }

  function comecar() {
    setShowPopup(false)
    if (linkProxima) router.push(linkProxima)
  }

  return (
    <PageContainer>
      {/* ONBOARDING — primeiro acesso */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-md" showCloseButton={false}>
          <BrandBlock className="rounded-none p-6">
            <Eyebrow className="text-white/70">{t.dashboard.popup.comoFunciona}</Eyebrow>
            <DialogTitle className="mt-1 text-2xl text-white">{t.dashboard.popup.titulo}</DialogTitle>
            <div className="mt-5 flex gap-1.5">
              {cards.map((_, i) => (
                <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i <= popupStep ? 'bg-cc-green' : 'bg-white/20')} />
              ))}
            </div>
          </BrandBlock>
          <div className="p-6">
            <span className="grid size-12 place-items-center rounded-xl bg-cc-green/12 text-cc-green">
              <OnboardingIcon className="size-6" />
            </span>
            <h3 className="mt-4 font-display text-xl text-cc-green">{cards[popupStep].titulo}</h3>
            <DialogDescription className="mt-2 text-[15px] leading-relaxed">{cards[popupStep].texto}</DialogDescription>
            <div className="mt-6 flex gap-2">
              {popupStep > 0 && (
                <Button variant="outline" className="flex-1" onClick={() => setPopupStep(s => s - 1)}>
                  {t.dashboard.popup.anterior}
                </Button>
              )}
              {popupStep < cards.length - 1 ? (
                <Button className="flex-1" font="display" onClick={() => setPopupStep(s => s + 1)}>
                  {t.dashboard.popup.proximo}
                </Button>
              ) : (
                <Button variant="cta" font="display" className="flex-1" onClick={comecar}>
                  {t.dashboard.popup.comecar}
                </Button>
              )}
            </div>
            <button onClick={() => setShowPopup(false)} className="mt-3 w-full text-sm text-muted-foreground hover:text-foreground">
              {t.dashboard.popup.pular}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* HERO — bloco roxo com saudação, progresso e próxima aula */}
      <BrandBlock className="p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,380px)] lg:items-end">
          <div>
            <Eyebrow className="text-white/70">{t.dashboard.bemVindo}</Eyebrow>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] break-words">
              {fmt(t.dashboard.ola, { nome })}
            </h1>
            <p className="mt-3 label-caps text-white/60">{t.dashboard.slogan}</p>

            <div className="mt-8 max-w-md">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm text-white/80">{fmt(t.dashboard.aulasConcluidasDe, { done: feitasGeral, total: totalGeral })}</span>
                <span className="font-display text-2xl text-cc-green">{pctGeral}%</span>
              </div>
              <Progress value={pctGeral} className="h-2 bg-black/30" aria-label={t.dashboard.progressoGeral} />
            </div>
          </div>

          <div className="rounded-xl bg-black/35 p-5 ring-1 ring-white/10 backdrop-blur-sm">
            {proxima ? (
              <>
                <Eyebrow className="text-white/70">{concluidas.size > 0 ? t.dashboard.continuar : t.dashboard.comecarJornada}</Eyebrow>
                <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
                  <TrilhaIcon id={proxima.trilhaId} className="size-4" />
                  {proxima.trilhaTitulo} · {proxima.numero}/{proxima.total}
                </p>
                <p className="mt-1 text-lg font-semibold leading-snug">{proxima.aulaTitulo}</p>
                <Button asChild variant="cta" size="lg" font="display" className="mt-4 w-full">
                  <Link href={linkProxima!}>
                    <PlayIcon className="fill-current" />
                    {concluidas.size > 0 ? t.dashboard.ctaContinuar : t.dashboard.ctaComecar}
                  </Link>
                </Button>
              </>
            ) : (
              <p className="flex items-start gap-3 text-white/85">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-cc-green" />
                {t.dashboard.tudoConcluido}
              </p>
            )}
          </div>
        </div>
      </BrandBlock>

      {/* NÚCLEO + AVISOS */}
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionTitle eyebrow={t.dashboard.baseTodas}>{t.comum.nucleoObrigatorio}</SectionTitle>
          {nucleo && (
            <Link
              href={href(`/trilha/${nucleo.id}`)}
              className="group block rounded-2xl border border-cc-line bg-cc-surface p-6 transition-all hover:border-cc-green/60"
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    'grid size-12 shrink-0 place-items-center rounded-xl',
                    nucleoCompleto ? 'bg-cc-green text-primary-foreground' : 'bg-cc-purple text-white'
                  )}
                >
                  {nucleoCompleto ? <CheckIcon className="size-6" /> : <CompassIcon className="size-6" />}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-2xl leading-tight">{nucleo.titulo}</h3>
                  {nucleo.descricao && <p className="mt-1.5 text-muted-foreground leading-relaxed">{nucleo.descricao}</p>}
                </div>
                <ArrowRightIcon className="hidden sm:block size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-cc-green" />
              </div>

              <ol className="mt-6 flex gap-1.5" aria-hidden>
                {nucleo.trilha_aulas.map(ta => (
                  <li key={ta.aula_id} className={cn('h-1.5 flex-1 rounded-full', concluidas.has(ta.aula_id) ? 'bg-cc-green' : 'bg-cc-surface-2')} />
                ))}
              </ol>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{fmt(t.comum.aulasFracao, { done: nucleoFeitas, total: nucleoTotal })}</span>
                <span className={cn('font-semibold', nucleoCompleto ? 'text-cc-green' : 'text-foreground')}>{nucleoPct}%</span>
              </div>
            </Link>
          )}
        </section>

        <section>
          <SectionTitle>{t.dashboard.mural}</SectionTitle>
          <div className="flex flex-col gap-3">
            {mural.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-cc-line p-5 text-sm text-muted-foreground">{t.dashboard.muralVazio}</p>
            ) : (
              mural.map(item => (
                <article
                  key={item.id}
                  className={cn(
                    'rounded-2xl border p-4',
                    item.fixado ? 'border-cc-orange/50 bg-cc-orange/[0.07]' : 'border-cc-line bg-cc-surface'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    {item.fixado ? (
                      <span className="label-caps flex items-center gap-1 text-cc-orange">
                        <PinIcon className="size-3" /> {item.autor}
                      </span>
                    ) : (
                      <span className="label-caps text-muted-foreground">{item.autor}</span>
                    )}
                    <time className="text-xs text-muted-foreground">{formatarData(item.criado_em)}</time>
                  </div>
                  <h4 className="mt-2 font-semibold leading-snug">{item.titulo}</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.texto}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* TRILHAS ESPECÍFICAS */}
      <section className="mt-10">
        <SectionTitle
          eyebrow={!nucleoCompleto ? t.comum.concluaNucleo : undefined}
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href={href('/trilhas')}>
                {t.dashboard.verTodas} <ArrowRightIcon />
              </Link>
            </Button>
          }
        >
          {t.comum.trilhasEspecificas}
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {especificas.map(tr => (
            <TrilhaCard
              key={tr.id}
              trilha={{
                id: tr.id,
                titulo: tr.titulo,
                descricao: tr.descricao,
                total: tr.trilha_aulas.length,
                done: tr.trilha_aulas.filter(ta => concluidas.has(ta.aula_id)).length,
                desbloqueada: nucleoCompleto,
              }}
            />
          ))}
        </div>
      </section>

    </PageContainer>
  )
}
