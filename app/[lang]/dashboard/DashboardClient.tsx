'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { intlLocale } from '@/i18n/config'
import { useI18n } from '@/i18n/I18nProvider'
import { fmt } from '@/i18n/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { Perfil } from '@/types'

interface TrilhaRaw {
  id: string
  titulo: string
  descricao: string | null
  obrigatoria: boolean
  ordem: number
  cor: string
  ativa: boolean
  trilha_aulas: { aula_id: string; ordem: number; compartilhada: boolean }[]
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
  primeiraAulaId: string | null
}

const ICONES_POPUP = ['⬡', '◎', '→', '✓']

export default function DashboardClient({ trilhas, aulasConcluidas, perfil, mural, primeiroAcesso, primeiraAulaId }: Props) {
  const router = useRouter()
  const { lang, t, href } = useI18n()
  const concluidas = new Set(aulasConcluidas)
  const [showPopup, setShowPopup] = useState(primeiroAcesso)
  const [popupStep, setPopupStep] = useState(0)

  const nucleo = trilhas.find(t => t.obrigatoria)
  const especificas = trilhas.filter(t => !t.obrigatoria)

  const nucleoTotal = nucleo?.trilha_aulas.length || 0
  const nucleoConcluidas = nucleo?.trilha_aulas.filter(ta => concluidas.has(ta.aula_id)).length || 0
  const nucleoCompleto = nucleoTotal > 0 && nucleoConcluidas === nucleoTotal
  const nucleoPct = nucleoTotal > 0 ? Math.round((nucleoConcluidas / nucleoTotal) * 100) : 0

  const todasAulas = [...new Set(trilhas.flatMap(t => t.trilha_aulas.map(ta => ta.aula_id)))]
  const totalGeral = todasAulas.length
  const concluidasGeral = todasAulas.filter(id => concluidas.has(id)).length
  const pctGeral = totalGeral > 0 ? Math.round((concluidasGeral / totalGeral) * 100) : 0

  const nome = perfil?.nome?.split(' ')[0] || t.comum.criador
  const cards = t.dashboard.popup.cards
  const card = cards[popupStep]

  function formatarData(iso: string) {
    return new Date(iso).toLocaleDateString(intlLocale[lang], { day: '2-digit', month: 'short' })
  }

  function comecar() {
    setShowPopup(false)
    if (primeiraAulaId) router.push(href(`/aula/${primeiraAulaId}?trilha=nucleo`))
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      {/* ONBOARDING — primeiro acesso */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="p-0 gap-0 sm:max-w-md bg-[#111] border-cc-gray2" showCloseButton={false}>
          <div className="p-5 border-b border-cc-gray">
            <p className="font-mono text-xs tracking-widest mb-1 text-cc-green">{t.dashboard.popup.comoFunciona}</p>
            <DialogTitle className="text-2xl">{t.dashboard.popup.titulo}</DialogTitle>
          </div>
          <div className="p-5">
            <div className="flex gap-1.5 mb-5">
              {cards.map((_, i) => (
                <div key={i} className={cn('flex-1 h-1 rounded-full transition-all', i <= popupStep ? 'bg-cc-green' : 'bg-cc-gray2')} />
              ))}
            </div>
            <div className="rounded-xl p-4 mb-5 bg-cc-bg">
              <div className="text-3xl mb-3">{ICONES_POPUP[popupStep]}</div>
              <h3 className="font-display text-xl tracking-wider mb-2">{card.titulo.toUpperCase()}</h3>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">{card.texto}</DialogDescription>
            </div>
            <div className="flex gap-2">
              {popupStep > 0 && (
                <Button variant="outline" font="mono" className="flex-1" onClick={() => setPopupStep(s => s - 1)}>
                  {t.dashboard.popup.anterior}
                </Button>
              )}
              {popupStep < cards.length - 1 ? (
                <Button variant="secondary" font="display" className="flex-1" onClick={() => setPopupStep(s => s + 1)}>
                  {t.dashboard.popup.proximo}
                </Button>
              ) : (
                <Button font="display" className="flex-1" onClick={comecar}>
                  {t.dashboard.popup.comecar}
                </Button>
              )}
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full mt-2 font-mono text-xs text-center py-1 text-muted-foreground hover:text-foreground"
            >
              {t.dashboard.popup.pular}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* HERO */}
      <Card className="rounded-2xl p-6 mb-5 bg-white/[0.02] border-cc-gray">
        <p className="font-mono text-xs tracking-widest mb-1 text-muted-foreground">{t.dashboard.bemVindo}</p>
        <h1 className="font-display tracking-widest mb-1 text-cc-green text-[clamp(40px,10vw,64px)] leading-none break-words">
          {nome.toUpperCase()}
        </h1>
        <p className="font-mono text-xs tracking-widest text-[#444]">{t.dashboard.slogan}</p>
      </Card>

      {/* PROGRESSO GERAL */}
      <Card className="p-5 mb-5 flex-row items-center gap-5 bg-white/[0.02] border-cc-gray">
        <div className="flex-1">
          <p className="font-mono text-xs tracking-widest mb-2 text-muted-foreground">{t.dashboard.progressoGeral}</p>
          <Progress value={pctGeral} className="h-2 mb-2" />
          <p className="font-mono text-xs text-muted-foreground">
            {fmt(t.dashboard.aulasConcluidasDe, { done: concluidasGeral, total: totalGeral })}
          </p>
        </div>
        <p className="font-display text-cc-green text-[clamp(40px,10vw,64px)] leading-none">{pctGeral}%</p>
      </Card>

      {/* NÚCLEO + MURAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2">
          <p className="font-mono tracking-widest mb-3 text-cc-purple text-[clamp(10px,2vw,14px)]">{t.comum.nucleoObrigatorio}</p>
          {nucleo && (
            <Link
              href={href(`/trilha/${nucleo.id}`)}
              className={cn(
                'block rounded-xl border overflow-hidden transition-colors bg-cc-purple/6 hover:border-cc-purple',
                nucleoCompleto ? 'border-[#1a3a28]' : 'border-[#3a2f6e]'
              )}
            >
              <div className={cn('h-1', nucleoCompleto ? 'bg-cc-green' : 'bg-cc-purple')} />
              <div className="p-5">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <div className="min-w-0">
                    <p className={cn('font-mono text-xs tracking-widest mb-1', nucleoCompleto ? 'text-cc-green' : 'text-cc-purple')}>
                      {t.dashboard.baseTodas}
                    </p>
                    <h2 className="font-display tracking-widest text-[clamp(28px,6vw,44px)] leading-tight">
                      {nucleo.titulo.toUpperCase()}
                    </h2>
                  </div>
                  <span className={cn('text-[44px] leading-none', nucleoCompleto ? 'text-cc-green' : 'text-cc-purple')}>
                    {nucleoCompleto ? '✓' : '▶'}
                  </span>
                </div>
                <p className="text-sm mb-4 text-[#999]">{nucleo.descricao}</p>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {fmt(t.comum.aulasFracao, { done: nucleoConcluidas, total: nucleoTotal })}
                  </span>
                  <span className={cn('font-mono text-xs', nucleoCompleto ? 'text-cc-green' : 'text-cc-purple')}>{nucleoPct}%</span>
                </div>
                <Progress value={nucleoPct} indicatorClassName={nucleoCompleto ? 'bg-cc-green' : 'bg-cc-purple'} />
              </div>
            </Link>
          )}
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest mb-3 text-cc-orange">{t.dashboard.mural}</p>
          <div className="flex flex-col gap-2">
            {mural.length === 0 ? (
              <Card className="p-4 bg-white/[0.02] border-cc-gray">
                <p className="font-mono text-xs text-[#555]">{t.dashboard.muralVazio}</p>
              </Card>
            ) : (
              mural.map(item => (
                <Card
                  key={item.id}
                  className={cn('overflow-hidden', item.fixado ? 'bg-cc-orange/5 border-[#2a1800]' : 'bg-white/[0.02] border-cc-gray')}
                >
                  {item.fixado && <div className="h-0.5 bg-cc-orange" />}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-display text-base tracking-wider">
                        {item.fixado && <span className="text-cc-orange">📌 </span>}
                        {item.titulo}
                      </h4>
                      <span className="font-mono text-xs shrink-0 text-muted-foreground">{formatarData(item.criado_em)}</span>
                    </div>
                    <p className="text-xs leading-relaxed mb-2 text-[#999]">{item.texto}</p>
                    <p className="font-mono text-[9px] text-cc-orange">— {item.autor}</p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* TRILHAS ESPECÍFICAS */}
      <section id="trilhas-section">
        <div className="flex items-baseline justify-between mb-4 gap-2">
          <p className="font-mono tracking-widest text-muted-foreground text-[clamp(10px,2vw,14px)]">{t.comum.trilhasEspecificas}</p>
          {!nucleoCompleto && <span className="font-mono text-sm text-[#999]">{t.comum.concluaNucleo}</span>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {especificas.map((tr, i) => {
            const total = tr.trilha_aulas.length
            const done = tr.trilha_aulas.filter(ta => concluidas.has(ta.aula_id)).length
            const desbloqueada = nucleoCompleto && total > 0
            const emBreve = total === 0
            const trConcluida = total > 0 && done === total
            const pct = total > 0 ? Math.round((done / total) * 100) : 0

            const conteudo = (
              <>
                {desbloqueada && <div className={cn('h-0.5', trConcluida ? 'bg-cc-green' : 'bg-cc-orange')} />}
                <div className="p-4">
                  <p
                    className={cn(
                      'font-mono mb-1 text-[9px] tracking-[2px]',
                      desbloqueada ? (trConcluida ? 'text-cc-green' : 'text-cc-orange') : 'text-[#444]'
                    )}
                  >
                    {fmt(t.dashboard.trilhaN, { n: String(i + 1).padStart(2, '0') })}
                  </p>
                  <h3
                    className={cn(
                      'font-display tracking-wider mb-1 leading-tight text-[clamp(16px,4vw,26px)]',
                      desbloqueada ? 'text-foreground' : 'text-[#444]'
                    )}
                  >
                    {tr.titulo.toUpperCase()}
                  </h3>

                  {desbloqueada && (
                    <>
                      <Progress
                        value={pct}
                        className="h-1 mb-1.5"
                        indicatorClassName={trConcluida ? 'bg-cc-green' : 'bg-cc-orange'}
                      />
                      <div className="flex justify-between gap-1">
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {fmt(t.comum.aulasFracao, { done, total })}
                        </span>
                        <span className={cn('font-mono text-[9px]', trConcluida ? 'text-cc-green' : 'text-cc-orange')}>
                          {trConcluida ? `✓ ${t.dashboard.concluida}` : `▶ ${t.dashboard.disponivel}`}
                        </span>
                      </div>
                    </>
                  )}

                  {emBreve && <span className="font-mono text-[9px] text-[#555]">{t.comum.emBreve}</span>}

                  {!desbloqueada && !emBreve && (
                    <div className="rounded-lg p-2 mt-2 bg-cc-purple/8 border border-[#2a1f4a]">
                      <p className="font-mono mb-0.5 text-[8px] tracking-[1px] text-cc-purple">{t.dashboard.paraDesbloquear}</p>
                      <p className="text-sm text-muted-foreground leading-snug">
                        {t.dashboard.concluaO} <span className="text-cc-purple">{t.dashboard.nucleoObrigatorio}</span>
                      </p>
                    </div>
                  )}
                </div>
              </>
            )

            const base = cn(
              'rounded-xl border overflow-hidden transition-colors',
              trConcluida
                ? 'bg-cc-green/6 border-[#1a3a28]'
                : desbloqueada
                  ? 'bg-cc-orange/6 border-[#2a1800]'
                  : 'bg-white/[0.01] border-[#151515]'
            )

            return desbloqueada ? (
              <Link
                key={tr.id}
                href={href(`/trilha/${tr.id}`)}
                className={cn(base, trConcluida ? 'hover:border-cc-green' : 'hover:border-cc-orange')}
              >
                {conteudo}
              </Link>
            ) : (
              <div key={tr.id} className={cn(base, !emBreve && 'opacity-50')}>
                {conteudo}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
