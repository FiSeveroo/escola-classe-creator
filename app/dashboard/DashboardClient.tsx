'use client'

import { useState } from 'react'
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

interface MuralItem {
  id: string
  titulo: string
  texto: string
  autor: string
  fixado: boolean
  criado_em: string
}

interface Props {
  trilhas: TrilhaRaw[]
  aulasConcluidas: string[]
  perfil: Perfil | null
  mural: MuralItem[]
  primeiroAcesso: boolean
  primeiraAulaId: string | null
}

export default function DashboardClient({ trilhas, aulasConcluidas, perfil, mural, primeiroAcesso, primeiraAulaId }: Props) {
  const router = useRouter()
  const concluidas = new Set(aulasConcluidas)
  const [showPopup, setShowPopup] = useState(primeiroAcesso)
  const [popupStep, setPopupStep] = useState(0)

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

  function formatarData(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  const popupCards = [
    {
      icone: '⬡',
      titulo: 'Bem-vindo à Escola',
      texto: 'A Escola Classe Creator é uma formação gratuita para criadores de conteúdo. Aqui você vai entender o jogo das plataformas de dentro pra fora.',
    },
    {
      icone: '◎',
      titulo: 'Núcleo Obrigatório',
      texto: 'Antes de qualquer trilha específica, você precisa concluir o Núcleo. São 5 aulas sobre algoritmos, atenção e lógica das plataformas — a base de tudo.',
    },
    {
      icone: '→',
      titulo: 'Trilhas Específicas',
      texto: 'Após o Núcleo, você desbloqueia trilhas por área: YouTube, TikTok, Design e mais. Cada trilha tem aulas, PDF e quiz obrigatório.',
    },
    {
      icone: '✓',
      titulo: 'Progressão por etapas',
      texto: 'Cada aula exige que você assista o vídeo, baixe o PDF e passe no quiz. Só assim a próxima aula é liberada. Sem atalhos.',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* POP-UP PRIMEIRO ACESSO */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-md rounded-2xl border overflow-hidden" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
            {/* Header */}
            <div className="p-5 border-b" style={{ borderColor: 'var(--cc-gray2)' }}>
              <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-green)' }}>COMO FUNCIONA</p>
              <h2 className="font-display text-2xl tracking-widest" style={{ color: 'var(--cc-white)' }}>
                ESCOLA CLASSE CREATOR
              </h2>
            </div>

            {/* Cards */}
            <div className="p-5">
              {/* Indicadores */}
              <div className="flex gap-1.5 mb-5">
                {popupCards.map((_, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all"
                    style={{ background: i <= popupStep ? 'var(--cc-green)' : 'var(--cc-gray2)' }} />
                ))}
              </div>

              {/* Card atual */}
              <div className="rounded-xl p-4 mb-5" style={{ background: 'var(--cc-bg)' }}>
                <div className="text-3xl mb-3">{popupCards[popupStep].icone}</div>
                <h3 className="font-display text-xl tracking-wider mb-2" style={{ color: 'var(--cc-white)' }}>
                  {popupCards[popupStep].titulo.toUpperCase()}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--cc-muted)' }}>
                  {popupCards[popupStep].texto}
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-2">
                {popupStep > 0 && (
                  <button onClick={() => setPopupStep(s => s - 1)}
                    className="flex-1 py-2.5 rounded-lg font-mono text-xs tracking-widest border transition-colors"
                    style={{ borderColor: 'var(--cc-gray3)', color: 'var(--cc-muted)' }}>
                    ANTERIOR
                  </button>
                )}
                {popupStep < popupCards.length - 1 ? (
                  <button onClick={() => setPopupStep(s => s + 1)}
                    className="flex-1 py-2.5 rounded-lg font-display text-lg tracking-widest"
                    style={{ background: 'var(--cc-purple)', color: '#fff' }}>
                    PRÓXIMO
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowPopup(false)
                      if (primeiraAulaId) router.push(`/aula/${primeiraAulaId}?trilha=nucleo`)
                    }}
                    className="flex-1 py-2.5 rounded-lg font-display text-lg tracking-widest"
                    style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}>
                    COMEÇAR AGORA
                  </button>
                )}
              </div>

              <button onClick={() => setShowPopup(false)}
                className="w-full mt-2 font-mono text-xs text-center py-1"
                style={{ color: 'var(--cc-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                pular introdução
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saudação */}
      <div className="mb-5">
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-muted)' }}>BEM-VINDO DE VOLTA</p>
        <h2 className="font-display text-3xl tracking-widest" style={{ color: 'var(--cc-white)' }}>{nome.toUpperCase()}</h2>
      </div>

      {/* Barra de progresso geral */}
      <div className="rounded-xl p-4 mb-5 border" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--cc-muted)' }}>PROGRESSÃO GERAL</span>
          <span className="font-display text-2xl" style={{ color: 'var(--cc-green)' }}>{pctGeral}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cc-gray2)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pctGeral}%`, background: 'var(--cc-green)' }} />
        </div>
        <p className="font-mono text-xs mt-2" style={{ color: 'var(--cc-muted)' }}>{concluidasGeral} de {totalGeral} aulas concluídas</p>
      </div>

      {/* Layout 2 colunas no desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Coluna esquerda — Núcleo + Trilhas */}
        <div className="lg:col-span-2">

      {/* Núcleo */}
      {nucleo && (
        <>
          <h3 className="font-display text-xl tracking-widest mb-3">
            <span style={{ color: 'var(--cc-green)' }}>NÚCLEO</span> OBRIGATÓRIO
          </h3>
          <div className="rounded-xl p-5 mb-5 border cursor-pointer relative overflow-hidden transition-colors"
            style={{ background: 'var(--cc-gray)', borderColor: nucleoCompleto ? '#1a3a28' : 'var(--cc-gray2)' }}
            onClick={() => router.push(`/trilha/${nucleo.id}`)}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cc-purple)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = nucleoCompleto ? '#1a3a28' : 'var(--cc-gray2)'}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }} />
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-mono text-xs tracking-widest mb-1" style={{ color: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }}>BASE PARA TODAS AS TRILHAS</p>
                <h4 className="font-display text-2xl tracking-wider" style={{ color: 'var(--cc-white)' }}>{nucleo.titulo.toUpperCase()}</h4>
              </div>
              <span className="text-2xl" style={{ color: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }}>{nucleoCompleto ? '✓' : '▶'}</span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--cc-muted)' }}>{nucleo.descricao}</p>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>{nucleoConcluidas}/{nucleoTotal} aulas</span>
              <span className="font-mono text-xs" style={{ color: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }}>{nucleoPct}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--cc-gray2)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${nucleoPct}%`, background: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }} />
            </div>
          </div>
        </>
      )}

        </div>{/* fim coluna esquerda */}

        {/* Coluna direita — Mural */}
        <div className="lg:col-span-1">
          {mural.length > 0 && (
            <div>
              <h3 className="font-display text-xl tracking-widest mb-3">
                MURAL <span style={{ color: 'var(--cc-orange)' }}>DE AVISOS</span>
              </h3>
              <div className="flex flex-col gap-2">
                {mural.map(item => (
                  <div key={item.id} className="rounded-xl p-4 border" style={{
                    background: 'var(--cc-gray)',
                    borderColor: item.fixado ? 'var(--cc-orange)' : 'var(--cc-gray2)',
                  }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {item.fixado && <span className="font-mono text-xs" style={{ color: 'var(--cc-orange)' }}>📌</span>}
                        <h4 className="font-display text-base tracking-wider" style={{ color: 'var(--cc-white)' }}>{item.titulo}</h4>
                      </div>
                      <span className="font-mono text-xs flex-shrink-0" style={{ color: 'var(--cc-muted)' }}>{formatarData(item.criado_em)}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--cc-muted)' }}>{item.texto}</p>
                    <p className="font-mono text-xs mt-2" style={{ color: 'var(--cc-purple)' }}>— {item.autor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>{/* fim coluna direita */}

      </div>{/* fim grid */}

      {/* Trilhas específicas */}
      <div id="trilhas-section">
        <div className="flex items-baseline gap-2 mb-3">
          <h3 className="font-display text-xl tracking-widest">TRILHAS <span style={{ color: 'var(--cc-green)' }}>ESPECÍFICAS</span></h3>
          {!nucleoCompleto && <span className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>conclua o núcleo para acessar</span>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {especificas.map((t, i) => {
            const total = t.trilha_aulas.length
            const done = t.trilha_aulas.filter(ta => concluidas.has(ta.aula_id)).length
            const desbloqueada = nucleoCompleto && total > 0
            const tConcluida = total > 0 && done === total
            return (
              <div key={t.id} className="rounded-xl p-4 border relative overflow-hidden transition-colors"
                style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)', opacity: desbloqueada ? 1 : 0.4, cursor: desbloqueada ? 'pointer' : 'not-allowed' }}
                onClick={() => desbloqueada && router.push(`/trilha/${t.id}`)}
                onMouseEnter={e => { if (desbloqueada) e.currentTarget.style.borderColor = 'var(--cc-orange)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cc-gray2)' }}>
                {desbloqueada && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'var(--cc-orange)' }} />}
                <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-muted)' }}>TRILHA {String(i + 1).padStart(2, '0')}</p>
                <h4 className="font-display text-base tracking-wider mb-2 leading-tight" style={{ color: 'var(--cc-white)' }}>{t.titulo.toUpperCase()}</h4>
                <p className="font-mono text-xs mb-3" style={{ color: 'var(--cc-muted)' }}>{total} aulas</p>
                <span className="font-mono text-xs px-2 py-1 rounded inline-flex items-center gap-1"
                  style={{ background: desbloqueada ? '#1f0d00' : '#1a1a1a', color: desbloqueada ? (tConcluida ? 'var(--cc-green)' : 'var(--cc-orange)') : '#555' }}>
                  {desbloqueada ? (tConcluida ? '✓ Concluída' : '▶ Disponível') : '🔒 Bloqueada'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
