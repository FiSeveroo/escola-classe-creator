'use client'

import Link from 'next/link'
import { ArrowRightIcon, CheckIcon, ClockIcon, UsersIcon } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { fmt } from '@/i18n/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BrandBlock, Eyebrow, SectionTitle } from '@/components/brand/Brand'
import { PageContainer, PageHeader } from '@/components/layout/AppShell'
import { TrilhaCard, TrilhaIcon } from '@/components/trilha/TrilhaCard'

interface TrilhaItem {
  id: string
  titulo: string
  descricao: string | null
  obrigatoria: boolean
  total: number
  done: number
  concluida: boolean
  desbloqueada: boolean
}

interface Props {
  trilhas: TrilhaItem[]
  nucleoCompleto: boolean
}

export default function TrilhasClient({ trilhas, nucleoCompleto }: Props) {
  const { t, href } = useI18n()

  const nucleo = trilhas.find(tr => tr.obrigatoria)
  const especificas = trilhas.filter(tr => !tr.obrigatoria)
  const nucleoPct = nucleo ? Math.round((nucleo.done / Math.max(nucleo.total, 1)) * 100) : 0
  const nucleoInfo = nucleo ? t.trilhas.info[nucleo.id] : undefined

  return (
    <PageContainer>
      <PageHeader eyebrow={t.trilhas.formacao} title={t.trilhas.titulo}>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t.trilhas.instrucao}</p>
      </PageHeader>

      {nucleo && (
        <BrandBlock className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Eyebrow className="text-white/70">{t.comum.nucleoObrigatorio}</Eyebrow>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
                  {nucleo.concluida ? <CheckIcon className="size-6 text-cc-green" /> : <TrilhaIcon id={nucleo.id} className="size-6" />}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl leading-none">{nucleo.titulo}</h2>
              </div>
              {nucleo.descricao && <p className="mt-4 text-white/80 leading-relaxed">{nucleo.descricao}</p>}
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/85">
                <span className="flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1">
                  <UsersIcon className="size-3.5" /> {nucleoInfo?.publico || t.trilhas.paraTodos}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1">
                  <ClockIcon className="size-3.5" /> {nucleoInfo?.duracao || `${nucleo.total} ${t.comum.aulas}`}
                </span>
                <span className="rounded-full bg-black/25 px-3 py-1">{t.comum.gratuito}</span>
              </div>
            </div>

            <div className="w-full lg:w-72 shrink-0">
              <div className="mb-2 flex justify-between text-sm text-white/80">
                <span>{fmt(t.trilhas.aulasConcluidasFracao, { done: nucleo.done, total: nucleo.total })}</span>
                <span className="font-semibold text-cc-green">{nucleoPct}%</span>
              </div>
              <Progress value={nucleoPct} className="h-2 bg-black/30" />
              <Button asChild variant={nucleo.concluida ? 'outline' : 'cta'} size="lg" font="display" className={cn('mt-4 w-full', nucleo.concluida && 'border-white/30 text-white hover:bg-white/10')}>
                <Link href={href(`/trilha/${nucleo.id}`)}>
                  {nucleo.concluida ? t.trilhas.revisitar : nucleo.done > 0 ? t.trilhas.continuar : t.trilhas.comecar}
                  <ArrowRightIcon />
                </Link>
              </Button>
            </div>
          </div>
        </BrandBlock>
      )}

      <section className="mt-12">
        <SectionTitle eyebrow={!nucleoCompleto ? t.comum.concluaNucleo : undefined}>{t.comum.trilhasEspecificas}</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {especificas.map(tr => (
            <TrilhaCard key={tr.id} detalhado trilha={tr} />
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
