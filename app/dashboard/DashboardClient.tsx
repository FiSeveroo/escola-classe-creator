'use client'

import { useRouter } from 'next/navigation'
import { Perfil } from '@/types'

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

interface Props {
  trilhas: TrilhaRaw[]
  aulasConcluidas: string[]
  perfil: Perfil | null
}

export default function DashboardClient({ trilhas, aulasConcluidas, perfil }: Props) {
  const router = useRouter()
  const concluidas = new Set(aulasConcluidas)

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

  const nome = perfil?.nome?.split(' ')[0] || 'Criador'

  return (
    <main className="flex-1 p-5 max-w-2xl mx-auto w-full">

      {/* Saudação */}
      <div className="mb-5">
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-muted)' }}>
          BEM-VINDO DE VOLTA
        </p>
        <h2 className="font-display text-3xl tracking-widest" style={{ color: 'var(--cc-white)' }}>
          {nome.toUpperCase()}
        </h2>
      </div>

      {/* Barra de progresso geral */}
      <div
        className="rounded-xl p-4 mb-5 border"
        style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--cc-muted)' }}>
            PROGRESSÃO GERAL
          </span>
          <span className="font-display text-2xl" style={{ color: 'var(--cc-green)' }}>
            {pctGeral}%
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cc-gray2)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pctGeral}%`, background: 'var(--cc-green)' }}
          />
        </div>
        <p className="font-mono text-xs mt-2" style={{ color: 'var(--cc-muted)' }}>
          {concluidasGeral} de {totalGeral} aulas concluídas
        </p>
      </div>

      {/* Núcleo */}
      {nucleo && (
        <>
          <h3 className="font-display text-xl tracking-widest mb-3">
            <span style={{ color: 'var(--cc-green)' }}>NÚCLEO</span> OBRIGATÓRIO
          </h3>
          <div
            className="rounded-xl p-5 mb-5 border cursor-pointer relative overflow-hidden transition-colors"
            style={{
              background: 'var(--cc-gray)',
              borderColor: nucleoCompleto ? '#1a3a28' : 'var(--cc-gray2)',
            }}
            onClick={() => router.push(`/trilha/${nucleo.id}`)}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--cc-purple)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = nucleoCompleto ? '#1a3a28' : 'var(--cc-gray2)')}
          >
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }}
            />
            <div className="flex justify-between items-start mb-3">
              <div>
                <p
                  className="font-mono text-xs tracking-widest mb-1"
                  style={{ color: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }}
                >
                  BASE PARA TODAS AS TRILHAS
                </p>
                <h4 className="font-display text-2xl tracking-wider" style={{ color: 'var(--cc-white)' }}>
                  {nucleo.titulo.toUpperCase()}
                </h4>
              </div>
              <span
                className="text-2xl"
                style={{ color: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }}
              >
                {nucleoCompleto ? '✓' : '▶'}
              </span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--cc-muted)' }}>
              {nucleo.descricao}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {nucleo.trilha_aulas
                .sort((a, b) => a.ordem - b.ordem)
                .map(ta => (
                  <span
                    key={ta.aula_id}
                    className="font-mono text-xs px-2 py-1 rounded"
                    style={{
                      background: concluidas.has(ta.aula_id) ? '#0d2b1a' : 'var(--cc-gray2)',
                      color: concluidas.has(ta.aula_id) ? 'var(--cc-green)' : 'var(--cc-muted)',
                    }}
                  >
                    {concluidas.has(ta.aula_id) ? '✓ ' : ''}aula {ta.ordem}
                  </span>
                ))}
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
                {nucleoConcluidas}/{nucleoTotal} aulas
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }}
              >
                {nucleoPct}%
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--cc-gray2)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${nucleoPct}%`,
                  background: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)',
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Trilhas específicas */}
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="font-display text-xl tracking-widest">
          TRILHAS <span style={{ color: 'var(--cc-green)' }}>ESPECÍFICAS</span>
        </h3>
        {!nucleoCompleto && (
          <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
            conclua o núcleo para acessar
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {especificas.map((t, i) => {
          const total = t.trilha_aulas.length
          const done = t.trilha_aulas.filter(ta => concluidas.has(ta.aula_id)).length
          const desbloqueada = nucleoCompleto && total > 0
          const tConcluida = total > 0 && done === total

          return (
            <div
              key={t.id}
              className="rounded-xl p-4 border relative overflow-hidden transition-colors"
              style={{
                background: 'var(--cc-gray)',
                borderColor: 'var(--cc-gray2)',
                opacity: desbloqueada ? 1 : 0.4,
                cursor: desbloqueada ? 'pointer' : 'not-allowed',
              }}
              onClick={() => desbloqueada && router.push(`/trilha/${t.id}`)}
              onMouseEnter={e => {
                if (desbloqueada) e.currentTarget.style.borderColor = 'var(--cc-orange)'
              }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cc-gray2)' }}
            >
              {desbloqueada && (
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'var(--cc-orange)' }} />
              )}
              <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-muted)' }}>
                TRILHA {String(i + 1).padStart(2, '0')}
              </p>
              <h4 className="font-display text-base tracking-wider mb-2 leading-tight" style={{ color: 'var(--cc-white)' }}>
                {t.titulo.toUpperCase()}
              </h4>
              <p className="font-mono text-xs mb-3" style={{ color: 'var(--cc-muted)' }}>
                {total} aulas
              </p>
              <span
                className="font-mono text-xs px-2 py-1 rounded inline-flex items-center gap-1"
                style={{
                  background: desbloqueada ? '#1f0d00' : '#1a1a1a',
                  color: desbloqueada ? (tConcluida ? 'var(--cc-green)' : 'var(--cc-orange)') : '#555',
                }}
              >
                {desbloqueada ? (tConcluida ? '✓ Concluída' : '▶ Disponível') : '🔒 Bloqueada'}
              </span>
            </div>
          )
        })}
      </div>
    </main>
  )
}
