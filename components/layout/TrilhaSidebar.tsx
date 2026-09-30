'use client'

import Link from 'next/link'
import { CheckIcon, LockIcon } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { fmt } from '@/i18n/format'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Eyebrow } from '@/components/brand/Brand'

interface AulaItem {
  id: string
  titulo: string
  ordem: number
}

interface TrilhaSidebarProps {
  trilhaTitulo: string
  trilhaId: string
  aulas: AulaItem[]
  aulaAtualId: string
  aulasConcluidas: string[]
}

export default function TrilhaSidebar({ trilhaTitulo, trilhaId, aulas, aulaAtualId, aulasConcluidas }: TrilhaSidebarProps) {
  const { t, href } = useI18n()
  const concluidas = new Set(aulasConcluidas)

  const totalConcluidas = aulas.filter(a => concluidas.has(a.id)).length
  const pct = aulas.length ? Math.round((totalConcluidas / aulas.length) * 100) : 0

  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 h-screen sticky top-0 border-l border-cc-line bg-cc-surface overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-cc-line bg-cc-surface p-5">
        <Eyebrow>{t.trilha.trilha}</Eyebrow>
        <Link href={href(`/trilha/${trilhaId}`)} className="mt-1 block font-display text-lg leading-tight text-cc-green hover:underline underline-offset-4">
          {trilhaTitulo}
        </Link>
        <div className="mt-4 mb-2 flex justify-between text-xs text-muted-foreground">
          <span>{fmt(t.comum.aulasFracao, { done: totalConcluidas, total: aulas.length })}</span>
          <span className="font-semibold text-foreground">{pct}%</span>
        </div>
        <Progress value={pct} />
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {aulas.map((aula, i) => {
          const done = concluidas.has(aula.id)
          const isAtual = aula.id === aulaAtualId
          const prevDone = i === 0 || concluidas.has(aulas[i - 1].id)
          const locked = !prevDone && !done

          const conteudo = (
            <>
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold',
                  done
                    ? 'bg-cc-green text-primary-foreground'
                    : isAtual
                      ? 'bg-cc-purple text-white'
                      : 'bg-cc-surface-2 text-muted-foreground'
                )}
              >
                {done ? <CheckIcon className="size-3.5" strokeWidth={3} /> : locked ? <LockIcon className="size-3" /> : i + 1}
              </span>
              <span className={cn('min-w-0 flex-1 text-sm leading-snug', isAtual ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                {aula.titulo}
              </span>
            </>
          )

          const classes = cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors', isAtual && 'bg-cc-purple/15')

          return locked ? (
            <span key={aula.id} className={cn(classes, 'cursor-not-allowed opacity-50')} aria-disabled>
              {conteudo}
            </span>
          ) : (
            <Link
              key={aula.id}
              href={href(`/aula/${aula.id}?trilha=${trilhaId}`)}
              aria-current={isAtual ? 'page' : undefined}
              className={cn(classes, !isAtual && 'hover:bg-cc-surface-2 hover:text-foreground')}
            >
              {conteudo}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
