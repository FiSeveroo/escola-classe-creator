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
    { icone: '⬡', titulo: 'Bem-vindo à Escola', texto: 'A Escola Classe Creator é uma formação gratuita para criadores de conteúdo. Aqui você vai entender o jogo das plataformas de dentro pra fora.' },
    { icone: '◎', titulo: 'Núcleo Obrigatório', texto: 'Antes de qualquer trilha específica, você precisa concluir o Núcleo. São 5 aulas sobre algoritmos, atenção e lógica das plataformas — a base de tudo.' },
    { icone: '→', titulo: 'Trilhas Específicas', texto: 'Após o Núcleo, você desbloqueia trilhas por área: YouTube, TikTok, Design e mais. Cada trilha tem aulas, PDF e quiz obrigatório.' },
    { icone: '✓', titulo: 'Progressão por etapas', texto: 'Cada aula exige que você assista o vídeo, baixe o PDF e passe no quiz. Só assim a próxima aula é liberada. Sem atalhos.' },
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">

      {/* POP-UP PRIMEIRO ACESSO */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
          <div className="w-full max-w-md rounded-2xl border overflow-hidden" style={{ background: '#111', borderColor: '#222' }}>
            <div className="p-5 border-b" style={{ borderColor: '#1a1a1a' }}>
              <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-green)' }}>COMO FUNCIONA</p>
              <h2 className="font-display text-2xl tracking-widest" style={{ color: 'var(--cc-white)' }}>ESCOLA CLASSE CREATOR</h2>
            </div>
            <div className="p-5">
              <div className="flex gap-1.5 mb-5">
                {popupCards.map((_, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all"
                    style={{ background: i <= popupStep ? 'var(--cc-green)' : '#222' }} />
                ))}
              </div>
              <div className="rounded-xl p-4 mb-5" style={{ background: '#0a0a0a' }}>
                <div className="text-3xl mb-3">{popupCards[popupStep].icone}</div>
                <h3 className="font-display text-xl tracking-wider mb-2" style={{ color: 'var(--cc-white)' }}>
                  {popupCards[popupStep].titulo.toUpperCase()}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#aaa' }}>{popupCards[popupStep].texto}</p>
              </div>
              <div className="flex gap-2">
                {popupStep > 0 && (
                  <button onClick={() => setPopupStep(s => s - 1)}
                    className="flex-1 py-2.5 rounded-lg font-mono text-xs tracking-widest border"
                    style={{ borderColor: '#333', color: '#aaa' }}>ANTERIOR</button>
                )}
                {popupStep < popupCards.length - 1 ? (
                  <button onClick={() => setPopupStep(s => s + 1)}
                    className="flex-1 py-2.5 rounded-lg font-display text-lg tracking-widest"
                    style={{ background: 'var(--cc-purple)', color: '#fff' }}>PRÓXIMO</button>
                ) : (
                  <button onClick={() => { setShowPopup(false); if (primeiraAulaId) router.push(`/aula/${primeiraAulaId}?trilha=nucleo`) }}
                    className="flex-1 py-2.5 rounded-lg font-display text-lg tracking-widest"
                    style={{ background: 'var(--cc-green)', color: '#0a0a0a' }}>COMEÇAR AGORA</button>
                )}
              </div>
              <button onClick={() => setShowPopup(false)}
                className="w-full mt-2 font-mono text-xs text-center py-1"
                style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>
                pular introdução
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <div className="rounded-2xl p-6 mb-5 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: '#1a1a1a' }}>
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: '#aaa' }}>BEM-VINDO DE VOLTA</p>
        <h1 className="font-display tracking-widest mb-1" style={{ fontSize: '64px', color: 'var(--cc-green)', lineHeight: 1 }}>
          {nome.toUpperCase()}
        </h1>
        <p className="font-mono text-xs tracking-widest" style={{ color: '#333' }}>A REVOLUÇÃO NÃO CABE NO FEED</p>
      </div>

      {/* PROGRESSO GERAL */}
      <div className="rounded-xl p-5 border mb-5 flex items-center gap-5" style={{ background: 'rgba(255,255,255,0.02)', borderColor: '#1a1a1a' }}>
        <div className="flex-1">
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: '#aaa' }}>PROGRESSÃO GERAL</p>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: '#1a1a1a' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pctGeral}%`, background: 'var(--cc-green)' }} />
          </div>
          <p className="font-mono text-xs" style={{ color: '#aaa' }}>{concluidasGeral} de {totalGeral} aulas concluídas</p>
        </div>
        <p className="font-display" style={{ fontSize: '64px', color: 'var(--cc-green)', lineHeight: 1 }}>{pctGeral}%</p>
      </div>

      {/* GRID: NÚCLEO + MURAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

        {/* Núcleo */}
        <div className="lg:col-span-2">
          <p className="font-mono tracking-widest mb-3" style={{ color: 'var(--cc-purple)', fontSize: 'clamp(10px, 2vw, 14px)' }}>NÚCLEO OBRIGATÓRIO</p>
          <div className="rounded-xl border overflow-hidden cursor-pointer transition-all"
            style={{ background: 'rgba(123,47,255,0.06)', borderColor: nucleoCompleto ? '#1a3a28' : '#3a2f6e' }}
            onClick={() => router.push(`/trilha/${nucleo?.id}`)}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cc-purple)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = nucleoCompleto ? '#1a3a28' : '#3a2f6e'}>
            <div className="h-1" style={{ background: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }} />
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-mono text-xs tracking-widest mb-1" style={{ color: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }}>
                    BASE PARA TODAS AS TRILHAS
                  </p>
                  <h2 className="font-display tracking-widest" style={{ fontSize: '44px', color: 'var(--cc-white)' }}>
                    {nucleo?.titulo.toUpperCase()}
                  </h2>
                </div>
                <span style={{ fontSize: '44px', color: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }}>
                  {nucleoCompleto ? '✓' : '▶'}
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: '#999' }}>{nucleo?.descricao}</p>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-xs" style={{ color: '#aaa' }}>{nucleoConcluidas}/{nucleoTotal} aulas</span>
                <span className="font-mono text-xs" style={{ color: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }}>{nucleoPct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${nucleoPct}%`, background: nucleoCompleto ? 'var(--cc-green)' : 'var(--cc-purple)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Mural */}
        <div className="lg:col-span-1">
          <p className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--cc-orange)' }}>MURAL DE AVISOS</p>
          <div className="flex flex-col gap-2">
            {mural.length === 0 ? (
              <div className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: '#1a1a1a' }}>
                <p className="font-mono text-xs" style={{ color: '#333' }}>Nenhum aviso no momento.</p>
              </div>
            ) : mural.map(item => (
              <div key={item.id} className="rounded-xl border overflow-hidden" style={{
                background: item.fixado ? 'rgba(255,92,26,0.05)' : 'rgba(255,255,255,0.02)',
                borderColor: item.fixado ? '#2a1800' : '#1a1a1a',
              }}>
                {item.fixado && <div className="h-0.5" style={{ background: 'var(--cc-orange)' }} />}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-display text-base tracking-wider" style={{ color: 'var(--cc-white)' }}>
                      {item.fixado && <span style={{ color: 'var(--cc-orange)' }}>📌 </span>}{item.titulo}
                    </h4>
                    <span className="font-mono text-xs flex-shrink-0" style={{ color: '#aaa' }}>{formatarData(item.criado_em)}</span>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: '#999' }}>{item.texto}</p>
                  <p className="font-mono" style={{ fontSize: '9px', color: 'var(--cc-orange)' }}>— {item.autor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRILHAS ESPECÍFICAS */}
      <div id="trilhas-section">
        <div className="flex items-baseline justify-between mb-4">
          <p className="font-mono tracking-widest" style={{ color: '#aaa', fontSize: 'clamp(10px, 2vw, 14px)' }}>TRILHAS ESPECÍFICAS</p>
          {!nucleoCompleto && <span className="font-mono text-sm" style={{ color: '#999' }}>conclua o núcleo para acessar</span>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {especificas.map((t, i) => {
            const total = t.trilha_aulas.length
            const done = t.trilha_aulas.filter(ta => concluidas.has(ta.aula_id)).length
            const desbloqueada = nucleoCompleto && total > 0
            const emBreve = total === 0
            const tConcluida = total > 0 && done === total
            const pct = total > 0 ? Math.round((done / total) * 100) : 0

            const corBg = tConcluida ? 'rgba(0,232,122,0.06)' : desbloqueada ? 'rgba(255,92,26,0.06)' : 'rgba(255,255,255,0.01)'
            const corBorder = tConcluida ? '#1a3a28' : desbloqueada ? '#2a1800' : '#151515'
            const corAccent = tConcluida ? 'var(--cc-green)' : 'var(--cc-orange)'

            return (
              <div key={t.id}
                className="rounded-xl border overflow-hidden transition-all"
                style={{ background: corBg, borderColor: corBorder, opacity: desbloqueada || emBreve ? 1 : 0.5, cursor: desbloqueada ? 'pointer' : 'default' }}
                onClick={() => desbloqueada && router.push(`/trilha/${t.id}`)}
                onMouseEnter={e => { if (desbloqueada) e.currentTarget.style.borderColor = corAccent }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = corBorder }}>
                {desbloqueada && <div className="h-0.5" style={{ background: corAccent }} />}
                <div className="p-4">
                  <p className="font-mono mb-1" style={{ fontSize: '9px', letterSpacing: '2px', color: desbloqueada ? corAccent : '#333' }}>
                    TRILHA {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display tracking-wider mb-1 leading-tight" style={{ fontSize: 'clamp(16px, 4vw, 26px)', color: desbloqueada ? 'var(--cc-white)' : '#333' }}>
                    {t.titulo.toUpperCase()}
                  </h3>

                  {desbloqueada && !emBreve && (
                    <>
                      <div className="h-1 rounded-full overflow-hidden mb-1.5" style={{ background: '#1a1a1a' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: corAccent }} />
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono" style={{ fontSize: '9px', color: '#aaa' }}>{done}/{total} aulas</span>
                        <span className="font-mono" style={{ fontSize: '9px', color: corAccent }}>
                          {tConcluida ? '✓ Concluída' : '▶ Disponível'}
                        </span>
                      </div>
                    </>
                  )}

                  {emBreve && (
                    <span className="font-mono" style={{ fontSize: '9px', color: '#333' }}>Em breve</span>
                  )}

                  {!desbloqueada && !emBreve && (
                    <div className="rounded-lg p-2 mt-2" style={{ background: 'rgba(123,47,255,0.08)', border: '1px solid #2a1f4a' }}>
                      <p className="font-mono mb-0.5" style={{ fontSize: '8px', letterSpacing: '1px', color: 'var(--cc-purple)' }}>PARA DESBLOQUEAR</p>
                      <p className="text-sm" style={{ color: '#aaa', lineHeight: 1.4 }}>
                        Conclua o <span style={{ color: 'var(--cc-purple)' }}>Núcleo Obrigatório</span>
                      </p>
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
