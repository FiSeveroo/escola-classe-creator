'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { fmt } from '@/i18n/format'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

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
    <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 h-screen sticky top-0 border-l overflow-y-auto bg-card">
      <div className="p-4 border-b sticky top-0 z-10 bg-card">
        <p className="font-mono text-xs tracking-widest mb-1 text-cc-orange">{t.trilha.trilha}</p>
        <h3 className="font-display text-lg tracking-wider leading-tight mb-3">{trilhaTitulo.toUpperCase()}</h3>
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-mono text-xs text-muted-foreground">
            {fmt(t.comum.aulasFracao, { done: totalConcluidas, total: aulas.length })}
          </span>
          <span className="font-mono text-xs text-cc-green">{pct}%</span>
        </div>
        <Progress value={pct} className="h-1 bg-cc-gray2" />
      </div>

      <nav className="flex flex-col py-2">
        {aulas.map((aula, i) => {
          const done = concluidas.has(aula.id)
          const isAtual = aula.id === aulaAtualId
          const prevDone = i === 0 || concluidas.has(aulas[i - 1].id)
          const locked = !prevDone && !done
          const rotulo = `${String(i + 1).padStart(2, '0')}. ${aula.titulo}`

          const conteudo = (
            <>
              <span
                className={cn(
                  'size-5 rounded-full shrink-0 flex items-center justify-center text-xs border-2 transition-colors',
                  done
                    ? 'border-cc-green bg-cc-green text-cc-bg'
                    : isAtual
                      ? 'border-cc-purple text-transparent'
                      : 'border-cc-gray3 text-transparent'
                )}
              >
                {done ? '✓' : ''}
              </span>
              <span
                className={cn(
                  'flex-1 min-w-0 text-xs leading-snug truncate',
                  isAtual ? 'text-foreground font-medium' : done ? 'text-muted-foreground' : 'text-foreground'
                )}
              >
                {rotulo}
              </span>
            </>
          )

          const classes = cn(
            'flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2',
            isAtual ? 'border-l-cc-green bg-cc-green/5' : 'border-l-transparent'
          )

          return locked ? (
            <span key={aula.id} className={cn(classes, 'opacity-35 cursor-not-allowed')} aria-disabled>
              {conteudo}
            </span>
          ) : (
            <Link
              key={aula.id}
              href={href(`/aula/${aula.id}?trilha=${trilhaId}`)}
              aria-current={isAtual ? 'page' : undefined}
              className={cn(classes, !isAtual && 'hover:bg-cc-gray2')}
            >
              {conteudo}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
