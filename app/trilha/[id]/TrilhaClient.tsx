'use client'

import { useRouter } from 'next/navigation'
import { ProgressoAula } from '@/types'

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
  const router = useRouter()
  const concluidas = new Set(aulasConcluidas)

  const aulas = [...trilha.trilha_aulas].sort((a, b) => a.ordem - b.ordem)

  return (
    <main className="flex-1 p-5 max-w-2xl mx-auto w-full">
      {/* Header da trilha */}
      <div className="mb-6">
        <p
          className="font-mono text-xs tracking-widest mb-1"
          style={{ color: trilha.obrigatoria ? 'var(--cc-purple)' : 'var(--cc-orange)' }}
        >
          {trilha.obrigatoria ? 'NÚCLEO OBRIGATÓRIO' : 'TRILHA ESPECÍFICA'}
        </p>
        <h1 className="font-display text-4xl tracking-widest" style={{ color: 'var(--cc-white)' }}>
          {trilha.titulo.toUpperCase()}
        </h1>
        {trilha.descricao && (
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--cc-muted)' }}>
            {trilha.descricao}
          </p>
        )}
      </div>

      {/* Lista de aulas */}
      <div className="flex flex-col gap-3">
        {aulas.map((ta, i) => {
          const aula = ta.aulas
          const prog = progressoMap[aula.id]
          const done = concluidas.has(aula.id)
          const prevDone = i === 0 || concluidas.has(aulas[i - 1].aula_id)
          const locked = !prevDone && !done
          const current = prevDone && !done

          return (
            <div
              key={aula.id}
              className="rounded-xl p-4 border flex items-center gap-4 transition-colors"
              style={{
                background: 'var(--cc-gray)',
                borderColor: done ? '#1a3a28' : current ? 'var(--cc-purple)' : 'var(--cc-gray2)',
                opacity: locked ? 0.4 : 1,
                cursor: locked ? 'not-allowed' : 'pointer',
              }}
              onClick={() => !locked && router.push(`/aula/${aula.id}?trilha=${trilha.id}`)}
              onMouseEnter={e => { if (!locked) e.currentTarget.style.borderColor = 'var(--cc-purple)' }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = done ? '#1a3a28' : current ? 'var(--cc-purple)' : 'var(--cc-gray2)'
              }}
            >
              {/* Número */}
              <span
                className="font-display text-3xl w-8 text-center flex-shrink-0"
                style={{ color: done ? 'var(--cc-green)' : current ? 'var(--cc-purple)' : 'var(--cc-gray3)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--cc-white)' }}>
                  {aula.titulo}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ta.compartilhada && (
                    <span
                      className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{ background: '#1f1a2e', color: 'var(--cc-purple)' }}
                    >
                      ↻ também no núcleo
                    </span>
                  )}
                  {done && (
                    <span
                      className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{ background: '#0d2b1a', color: 'var(--cc-green)' }}
                    >
                      ✓ concluída
                    </span>
                  )}
                  {!done && prog && (
                    <span
                      className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{ background: '#1f1a2e', color: 'var(--cc-purple)' }}
                    >
                      em andamento
                    </span>
                  )}
                </div>
              </div>

              {/* Ícone */}
              <span className="flex-shrink-0 text-lg" style={{ color: done ? 'var(--cc-green)' : locked ? '#444' : 'var(--cc-muted)' }}>
                {done ? '✓' : locked ? '🔒' : '›'}
              </span>
            </div>
          )
        })}
      </div>
    </main>
  )
}
