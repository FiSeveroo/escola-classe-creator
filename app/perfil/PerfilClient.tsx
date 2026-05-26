'use client'

import { useRouter } from 'next/navigation'

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

const TRILHA_INFO: Record<string, { icone: string; publico: string; duracao: string }> = {
  nucleo: { icone: '⬡', publico: 'Para todos os criadores', duracao: '5 aulas' },
  yt: { icone: '▶', publico: 'Criadores de vídeo', duracao: '3 aulas' },
  tt: { icone: '◉', publico: 'Criadores de conteúdo vertical', duracao: '3 aulas' },
  ds: { icone: '◈', publico: 'Designers e editores visuais', duracao: '3 aulas' },
  ed: { icone: '✂', publico: 'Editores de vídeo', duracao: 'Em breve' },
}

export default function TrilhasClient({ trilhas, nucleoCompleto }: Props) {
  const router = useRouter()

  const nucleo = trilhas.find(t => t.obrigatoria)
  const especificas = trilhas.filter(t => !t.obrigatoria)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      <div className="mb-6">
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-muted)' }}>FORMAÇÃO</p>
        <h1 className="font-display text-3xl tracking-widest" style={{ color: 'var(--cc-white)' }}>TRILHAS</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--cc-muted)' }}>
          Conclua o Núcleo obrigatório para desbloquear as trilhas específicas.
        </p>
      </div>

      {/* Núcleo */}
      {nucleo && (
        <div className="mb-8">
          <p className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--cc-purple)' }}>NÚCLEO OBRIGATÓRIO</p>
          <div
            className="rounded-xl border overflow-hidden cursor-pointer transition-all"
            style={{ background: 'var(--cc-gray)', borderColor: nucleo.concluida ? '#1a3a28' : 'var(--cc-purple)' }}
            onClick={() => router.push(`/trilha/${nucleo.id}`)}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cc-green)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = nucleo.concluida ? '#1a3a28' : 'var(--cc-purple)'}
          >
            <div className="h-1.5" style={{ background: nucleo.concluida ? 'var(--cc-green)' : 'var(--cc-purple)' }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{TRILHA_INFO[nucleo.id]?.icone || '⬡'}</span>
                    <h2 className="font-display text-2xl tracking-widest" style={{ color: 'var(--cc-white)' }}>
                      {nucleo.titulo.toUpperCase()}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--cc-muted)' }}>{nucleo.descricao}</p>
                </div>
                {nucleo.concluida && <span className="text-2xl" style={{ color: 'var(--cc-green)' }}>✓</span>}
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {[
                  { label: TRILHA_INFO[nucleo.id]?.publico || 'Para todos', icon: '◎' },
                  { label: TRILHA_INFO[nucleo.id]?.duracao || `${nucleo.total} aulas`, icon: '◷' },
                  { label: 'Gratuito', icon: '○' },
                ].map(tag => (
                  <span key={tag.label} className="font-mono text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--cc-gray2)', color: 'var(--cc-muted)' }}>
                    {tag.icon} {tag.label}
                  </span>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>{nucleo.done}/{nucleo.total} aulas concluídas</span>
                  <span className="font-mono text-xs" style={{ color: nucleo.concluida ? 'var(--cc-green)' : 'var(--cc-purple)' }}>
                    {Math.round((nucleo.done / Math.max(nucleo.total, 1)) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cc-gray2)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${Math.round((nucleo.done / Math.max(nucleo.total, 1)) * 100)}%`, background: nucleo.concluida ? 'var(--cc-green)' : 'var(--cc-purple)' }} />
                </div>
              </div>

              <button className="mt-4 font-display text-sm tracking-widest px-5 py-2 rounded-lg transition-colors"
                style={{ background: nucleo.concluida ? 'var(--cc-gray2)' : 'var(--cc-purple)', color: '#fff' }}>
                {nucleo.concluida ? 'REVISITAR' : nucleo.done > 0 ? 'CONTINUAR' : 'COMEÇAR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trilhas específicas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-xs tracking-widest" style={{ color: 'var(--cc-orange)' }}>TRILHAS ESPECÍFICAS</p>
          {!nucleoCompleto && (
            <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>conclua o núcleo para acessar</span>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {especificas.map(t => {
            const info = TRILHA_INFO[t.id]
            const pct = Math.round((t.done / Math.max(t.total, 1)) * 100)
            const emBreve = t.total === 0

            return (
              <div
                key={t.id}
                className="rounded-xl border overflow-hidden transition-all"
                style={{
                  background: 'var(--cc-gray)',
                  borderColor: t.concluida ? '#1a3a28' : t.desbloqueada && !emBreve ? 'var(--cc-gray2)' : 'var(--cc-gray2)',
                  opacity: (!t.desbloqueada || emBreve) ? 0.5 : 1,
                  cursor: t.desbloqueada && !emBreve ? 'pointer' : 'not-allowed',
                }}
                onClick={() => t.desbloqueada && !emBreve && router.push(`/trilha/${t.id}`)}
                onMouseEnter={e => { if (t.desbloqueada && !emBreve) e.currentTarget.style.borderColor = 'var(--cc-orange)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.concluida ? '#1a3a28' : 'var(--cc-gray2)' }}
              >
                {!emBreve && <div className="h-1" style={{ background: t.concluida ? 'var(--cc-green)' : 'var(--cc-orange)' }} />}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{info?.icone || '◎'}</span>
                        <h3 className="font-display text-xl tracking-wider" style={{ color: 'var(--cc-white)' }}>
                          {t.titulo.toUpperCase()}
                        </h3>
                        {emBreve && (
                          <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'var(--cc-gray2)', color: 'var(--cc-muted)' }}>
                            EM BREVE
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--cc-muted)' }}>{t.descricao}</p>
                      <div className="flex flex-wrap gap-2">
                        {info && [
                          { label: info.publico, icon: '◎' },
                          { label: info.duracao, icon: '◷' },
                        ].map(tag => (
                          <span key={tag.label} className="font-mono text-xs px-2 py-0.5 rounded"
                            style={{ background: 'var(--cc-gray2)', color: 'var(--cc-muted)' }}>
                            {tag.icon} {tag.label}
                          </span>
                        ))}
                        {!t.desbloqueada && (
                          <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: '#1a1a1a', color: '#555' }}>
                            🔒 Bloqueada
                          </span>
                        )}
                      </div>
                    </div>
                    {t.concluida && <span className="text-xl ml-3" style={{ color: 'var(--cc-green)' }}>✓</span>}
                  </div>

                  {t.desbloqueada && !emBreve && t.total > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>{t.done}/{t.total} aulas</span>
                        <span className="font-mono text-xs" style={{ color: t.concluida ? 'var(--cc-green)' : 'var(--cc-orange)' }}>{pct}%</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--cc-gray2)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: t.concluida ? 'var(--cc-green)' : 'var(--cc-orange)' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
