'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { fmt } from '@/i18n/format'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PageContainer, PageHeader } from '@/components/layout/AppShell'

interface TrilhaItem {
  id: string
  titulo: string
  descricao: string | null
  obrigatoria: boolean
  cor: string
  total: number
  done: number
  concluida: boolean
  desbloqueada: boolean
}

interface Props {
  trilhas: TrilhaItem[]
  nucleoCompleto: boolean
}

const ICONES: Record<string, string> = { nucleo: '⬡', yt: '▶', tt: '◉', ds: '◈', ed: '✂' }

export default function TrilhasClient({ trilhas, nucleoCompleto }: Props) {
  const { t, href } = useI18n()

  const nucleo = trilhas.find(tr => tr.obrigatoria)
  const especificas = trilhas.filter(tr => !tr.obrigatoria)
  const nucleoPct = nucleo ? Math.round((nucleo.done / Math.max(nucleo.total, 1)) * 100) : 0
  const nucleoInfo = nucleo ? t.trilhas.info[nucleo.id] : undefined

  return (
    <PageContainer>
      <PageHeader eyebrow={t.trilhas.formacao} title={t.trilhas.titulo}>
        <p className="text-sm mt-2 text-muted-foreground">{t.trilhas.instrucao}</p>
      </PageHeader>

      {nucleo && (
        <section className="mb-8">
          <p className="font-mono text-sm tracking-widest mb-3 text-cc-purple">{t.comum.nucleoObrigatorio}</p>
          <Link
            href={href(`/trilha/${nucleo.id}`)}
            className={cn(
              'group block rounded-xl border overflow-hidden transition-colors bg-card hover:border-cc-green',
              nucleo.concluida ? 'border-[#1a3a28]' : 'border-cc-purple'
            )}
          >
            <div className={cn('h-1.5', nucleo.concluida ? 'bg-cc-green' : 'bg-cc-purple')} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{ICONES[nucleo.id] || '⬡'}</span>
                    <h2 className="font-display tracking-widest text-[clamp(20px,4vw,28px)]">{nucleo.titulo.toUpperCase()}</h2>
                  </div>
                  <p className="text-base leading-relaxed text-muted-foreground">{nucleo.descricao}</p>
                </div>
                {nucleo.concluida && <span className="text-2xl text-cc-green">✓</span>}
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {[
                  { label: nucleoInfo?.publico || t.trilhas.paraTodos, icon: '◎' },
                  { label: nucleoInfo?.duracao || `${nucleo.total} ${t.comum.aulas}`, icon: '◷' },
                  { label: t.comum.gratuito, icon: '○' },
                ].map(tag => (
                  <Badge key={tag.label} className="rounded-full px-2.5 py-1">
                    {tag.icon} {tag.label}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-xs text-muted-foreground">
                  {fmt(t.trilhas.aulasConcluidasFracao, { done: nucleo.done, total: nucleo.total })}
                </span>
                <span className={cn('font-mono text-xs', nucleo.concluida ? 'text-cc-green' : 'text-cc-purple')}>{nucleoPct}%</span>
              </div>
              <Progress
                value={nucleoPct}
                className="bg-cc-gray2"
                indicatorClassName={nucleo.concluida ? 'bg-cc-green' : 'bg-cc-purple'}
              />

              <span
                className={cn(
                  buttonVariants({ variant: nucleo.concluida ? 'outline' : 'secondary', size: 'sm', font: 'display' }),
                  'mt-4 text-sm px-5',
                  nucleo.concluida && 'bg-cc-gray2 text-white border-transparent'
                )}
              >
                {nucleo.concluida ? t.trilhas.revisitar : nucleo.done > 0 ? t.trilhas.continuar : t.trilhas.comecar}
              </span>
            </div>
          </Link>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3 gap-2">
          <p className="font-mono text-xs tracking-widest text-cc-orange">{t.comum.trilhasEspecificas}</p>
          {!nucleoCompleto && <span className="font-mono text-xs text-muted-foreground">{t.comum.concluaNucleo}</span>}
        </div>
        <div className="flex flex-col gap-3">
          {especificas.map(tr => {
            const info = t.trilhas.info[tr.id]
            const pct = Math.round((tr.done / Math.max(tr.total, 1)) * 100)
            const emBreve = tr.total === 0
            const acessivel = tr.desbloqueada && !emBreve

            const conteudo = (
              <>
                {!emBreve && <div className={cn('h-1', tr.concluida ? 'bg-cc-green' : 'bg-cc-orange')} />}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xl">{ICONES[tr.id] || '◎'}</span>
                        <h3 className="font-display tracking-wider text-[clamp(18px,3vw,22px)]">{tr.titulo.toUpperCase()}</h3>
                        {emBreve && <Badge>{t.comum.emBreveCaps}</Badge>}
                      </div>
                      <p className="text-base mb-3 text-muted-foreground">{tr.descricao}</p>
                      <div className="flex flex-wrap gap-2">
                        {info && (
                          <>
                            <Badge>◎ {info.publico}</Badge>
                            <Badge>◷ {info.duracao}</Badge>
                          </>
                        )}
                        {!tr.desbloqueada && <Badge className="bg-cc-gray text-[#999]">🔒 {t.comum.bloqueada}</Badge>}
                      </div>
                    </div>
                    {tr.concluida && <span className="text-xl ml-3 text-cc-green">✓</span>}
                  </div>

                  {acessivel && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-xs text-muted-foreground">
                          {fmt(t.comum.aulasFracao, { done: tr.done, total: tr.total })}
                        </span>
                        <span className={cn('font-mono text-xs', tr.concluida ? 'text-cc-green' : 'text-cc-orange')}>{pct}%</span>
                      </div>
                      <Progress
                        value={pct}
                        className="h-1 bg-cc-gray2"
                        indicatorClassName={tr.concluida ? 'bg-cc-green' : 'bg-cc-orange'}
                      />
                    </div>
                  )}
                </div>
              </>
            )

            const base = cn(
              'block rounded-xl border overflow-hidden transition-colors bg-card',
              tr.concluida ? 'border-[#1a3a28]' : 'border-cc-gray2'
            )

            return acessivel ? (
              <Link key={tr.id} href={href(`/trilha/${tr.id}`)} className={cn(base, 'hover:border-cc-orange')}>
                {conteudo}
              </Link>
            ) : (
              <div key={tr.id} className={cn(base, 'opacity-50 cursor-not-allowed')} aria-disabled>
                {conteudo}
              </div>
            )
          })}
        </div>
      </section>
    </PageContainer>
  )
}
