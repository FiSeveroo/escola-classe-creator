'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { ProgressoAula } from '@/types'

interface AulaRaw {
  id: string
  titulo: string
  descricao: string | null
  youtube_id: string | null
  pdf_url: string | null
  ordem: number
}

interface TrilhaAulaRaw {
  aula_id: string
  ordem: number
  compartilhada: boolean
  aulas: AulaRaw
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

  return (
    <main className="p-5 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <p className={cn('font-mono text-xs tracking-widest mb-1', trilha.obrigatoria ? 'text-cc-purple' : 'text-cc-orange')}>
          {trilha.obrigatoria ? t.comum.nucleoObrigatorio : t.comum.trilhaEspecifica}
        </p>
        <h1 className="font-display text-4xl tracking-widest">{trilha.titulo.toUpperCase()}</h1>
        {trilha.descricao && <p className="text-sm mt-2 leading-relaxed text-muted-foreground">{trilha.descricao}</p>}
      </div>

      <ol className="flex flex-col gap-3">
        {aulas.map((ta, i) => {
          const aula = ta.aulas
          const prog = progressoMap[aula.id]
          const done = concluidas.has(aula.id)
          const prevDone = i === 0 || concluidas.has(aulas[i - 1].aula_id)
          const locked = !prevDone && !done
          const current = prevDone && !done

          const conteudo = (
            <>
              <span
                className={cn(
                  'font-display text-3xl min-w-10 text-center shrink-0',
                  done ? 'text-cc-green' : current ? 'text-cc-purple' : 'text-cc-gray3'
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">{aula.titulo}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ta.compartilhada && <Badge variant="secondary">↻ {t.trilha.tambemNoNucleo}</Badge>}
                  {done && <Badge variant="success">✓ {t.trilha.concluida}</Badge>}
                  {!done && prog && <Badge variant="secondary">{t.trilha.emAndamento}</Badge>}
                </div>
              </div>

              <span
                className={cn('shrink-0 text-lg', done ? 'text-cc-green' : locked ? 'text-[#444]' : 'text-muted-foreground')}
              >
                {done ? '✓' : locked ? '🔒' : '›'}
              </span>
            </>
          )

          const classes = cn(
            'rounded-xl p-4 border flex items-center gap-4 transition-colors bg-card',
            done ? 'border-[#1a3a28]' : current ? 'border-cc-purple' : 'border-cc-gray2'
          )

          return (
            <li key={aula.id}>
              {locked ? (
                <div className={cn(classes, 'opacity-40 cursor-not-allowed')} aria-disabled>
                  {conteudo}
                </div>
              ) : (
                <Link href={href(`/aula/${aula.id}?trilha=${trilha.id}`)} className={cn(classes, 'hover:border-cc-purple')}>
                  {conteudo}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}
