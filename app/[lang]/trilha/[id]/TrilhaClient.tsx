'use client'

import Link from 'next/link'
import { ArrowLeftIcon, CheckIcon, ChevronRightIcon, LockIcon, PlayIcon, RepeatIcon } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { fmt } from '@/i18n/format'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BrandBlock, Eyebrow } from '@/components/brand/Brand'
import { PageContainer } from '@/components/layout/AppShell'
import { TrilhaIcon } from '@/components/trilha/TrilhaCard'
import type { ProgressoAula } from '@/types'

interface TrilhaAulaRaw {
  aula_id: string
  ordem: number
  compartilhada: boolean
  aulas: { id: string; titulo: string; descricao: string | null }
}

interface TrilhaRaw {
  id: string
  titulo: string
  descricao: string | null
  obrigatoria: boolean
  trilha_aulas: TrilhaAulaRaw[]
}

interface Props {
  trilha: TrilhaRaw
  progressoMap: Record<string, ProgressoAula>
  aulasConcluidas: string[]
}

export default function TrilhaClient({ trilha, progressoMap, aulasConcluidas }: Props) {
  const { t, href } = useI18n()
  const concluidas = new Set(aulasConcluidas)
  const aulas = [...trilha.trilha_aulas].sort((a, b) => a.ordem - b.ordem)

  const feitas = aulas.filter(ta => concluidas.has(ta.aula_id)).length
  const pct = aulas.length ? Math.round((feitas / aulas.length) * 100) : 0
  const proxima = aulas.find(ta => !concluidas.has(ta.aula_id))
  const linkAula = (id: string) => href(`/aula/${id}?trilha=${trilha.id}`)

  return (
    <PageContainer className="max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
        <Link href={href('/trilhas')}>
          <ArrowLeftIcon /> {t.nav.trilhas}
        </Link>
      </Button>

      <BrandBlock className="p-6 sm:p-8">
        <Eyebrow className="text-white/70">{trilha.obrigatoria ? t.comum.nucleoObrigatorio : t.comum.trilhaEspecifica}</Eyebrow>
        <div className="mt-3 flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <TrilhaIcon id={trilha.id} className="size-6" />
          </span>
          <h1 className="font-display text-3xl sm:text-4xl leading-none">{trilha.titulo}</h1>
        </div>
        {trilha.descricao && <p className="mt-4 max-w-2xl text-white/80 leading-relaxed">{trilha.descricao}</p>}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <div className="mb-2 flex justify-between text-sm text-white/80">
              <span>
                {t.trilha.seuProgresso} · {fmt(t.comum.aulasFracao, { done: feitas, total: aulas.length })}
              </span>
              <span className="font-semibold text-cc-green">{pct}%</span>
            </div>
            <Progress value={pct} className="h-2 bg-black/30" />
          </div>
          {proxima && (
            <Button asChild variant="cta" size="lg" font="display" className="sm:w-auto">
              <Link href={linkAula(proxima.aula_id)}>
                <PlayIcon className="fill-current" /> {feitas > 0 ? t.trilhas.continuar : t.trilhas.comecar}
              </Link>
            </Button>
          )}
        </div>
      </BrandBlock>

      <ol className="relative mt-10">
        {aulas.map((ta, i) => {
          const aula = ta.aulas
          const done = concluidas.has(aula.id)
          const prevDone = i === 0 || concluidas.has(aulas[i - 1].aula_id)
          const locked = !prevDone && !done
          const atual = prevDone && !done
          const emAndamento = !done && !!progressoMap[aula.id]
          const ultima = i === aulas.length - 1

          const corpo = (
            <>
              <div className="min-w-0 flex-1">
                <p className={cn('label-caps', atual ? 'text-cc-green' : 'text-muted-foreground')}>
                  {t.aula.aula} {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-1 font-semibold leading-snug">{aula.titulo}</p>
                {(ta.compartilhada || done || emAndamento) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {ta.compartilhada && (
                      <Badge variant="secondary">
                        <RepeatIcon /> {t.trilha.tambemNoNucleo}
                      </Badge>
                    )}
                    {done && (
                      <Badge variant="success">
                        <CheckIcon /> {t.trilha.concluida}
                      </Badge>
                    )}
                    {emAndamento && <Badge variant="warning">{t.trilha.emAndamento}</Badge>}
                  </div>
                )}
              </div>
              {locked ? (
                <LockIcon className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-cc-green" />
              )}
            </>
          )

          return (
            <li key={aula.id} className="relative flex gap-4 pb-4">
              {/* Linha do tempo */}
              {!ultima && (
                <span
                  aria-hidden
                  className={cn('absolute left-[19px] top-11 bottom-0 w-0.5', done ? 'bg-cc-green' : 'bg-cc-line')}
                />
              )}
              <span
                className={cn(
                  'relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ring-4 ring-cc-bg',
                  done
                    ? 'bg-cc-green text-primary-foreground'
                    : atual
                      ? 'bg-cc-purple text-white'
                      : 'bg-cc-surface-2 text-muted-foreground'
                )}
              >
                {done ? <CheckIcon className="size-5" strokeWidth={3} /> : i + 1}
              </span>

              {locked ? (
                <div className="flex flex-1 items-center gap-4 rounded-2xl border border-cc-line bg-cc-surface/50 p-4 opacity-55" aria-disabled>
                  {corpo}
                </div>
              ) : (
                <Link
                  href={linkAula(aula.id)}
                  className={cn(
                    'group flex flex-1 items-center gap-4 rounded-2xl border bg-cc-surface p-4 transition-colors hover:border-cc-green/60',
                    atual ? 'border-cc-purple' : 'border-cc-line'
                  )}
                >
                  {corpo}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </PageContainer>
  )
}
