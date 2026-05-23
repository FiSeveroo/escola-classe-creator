'use client'

import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const concluidas = new Set(aulasConcluidas)

  const totalConcluidas = aulas.filter(a => concluidas.has(a.id)).length
  const pct = Math.round((totalConcluidas / aulas.length) * 100)

  return (
    <aside
      className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 h-screen sticky top-0 border-l overflow-y-auto"
      style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}
    >
      {/* Header */}
      <div className="p-4 border-b sticky top-0 z-10" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-orange)' }}>TRILHA</p>
        <h3 className="font-display text-lg tracking-wider leading-tight mb-3" style={{ color: 'var(--cc-white)' }}>
          {trilhaTitulo.toUpperCase()}
        </h3>
        {/* Progresso */}
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
            {totalConcluidas}/{aulas.length} aulas
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--cc-green)' }}>{pct}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--cc-gray2)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: 'var(--cc-green)' }}
          />
        </div>
      </div>

      {/* Lista de aulas */}
      <div className="flex flex-col py-2">
        {aulas.map((aula, i) => {
          const done = concluidas.has(aula.id)
          const isAtual = aula.id === aulaAtualId
          const prevDone = i === 0 || concluidas.has(aulas[i - 1].id)
          const locked = !prevDone && !done

          return (
            <button
              key={aula.id}
              onClick={() => !locked && router.push(`/aula/${aula.id}?trilha=${trilhaId}`)}
              className="flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2"
              style={{
                borderLeftColor: isAtual ? 'var(--cc-green)' : 'transparent',
                background: isAtual ? 'rgba(0,232,122,0.05)' : 'transparent',
                opacity: locked ? 0.35 : 1,
                cursor: locked ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!locked && !isAtual) e.currentTarget.style.background = 'var(--cc-gray2)' }}
              onMouseLeave={e => { if (!isAtual) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Status circle */}
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs border-2 transition-colors"
                style={{
                  borderColor: done ? 'var(--cc-green)' : isAtual ? 'var(--cc-purple)' : 'var(--cc-gray3)',
                  background: done ? 'var(--cc-green)' : 'transparent',
                  color: done ? 'var(--cc-bg)' : 'transparent',
                }}
              >
                {done ? '✓' : ''}
              </div>

              {/* Título */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs leading-snug truncate"
                  style={{
                    color: isAtual ? 'var(--cc-white)' : done ? 'var(--cc-muted)' : 'var(--cc-white)',
                    fontWeight: isAtual ? 500 : 400,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}. {aula.titulo}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
