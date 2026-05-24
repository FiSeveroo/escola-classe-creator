'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TrilhaProgresso {
  id: string
  titulo: string
  obrigatoria: boolean
  total: number
  done: number
  concluida: boolean
}

interface Props {
  perfil: { id: string; nome: string | null; avatar_url: string | null } | null
  email: string
  trilhas: TrilhaProgresso[]
  totalConcluidas: number
}

export default function PerfilClient({ perfil, email, trilhas, totalConcluidas }: Props) {
  const supabase = createClient()
  const [nome, setNome] = useState(perfil?.nome || '')
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)

  const initials = nome
    ? nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : email[0].toUpperCase()

  const trilhasConcluidas = trilhas.filter(t => t.concluida && !t.obrigatoria)
  const nucleo = trilhas.find(t => t.obrigatoria)

  async function salvarPerfil() {
    if (!nome.trim()) return
    setSalvando(true)
    await supabase.from('perfis').update({ nome: nome.trim() }).eq('id', perfil?.id || '')
    setSalvando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="mb-6">
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-muted)' }}>MINHA CONTA</p>
        <h1 className="font-display text-3xl tracking-widest" style={{ color: 'var(--cc-white)' }}>PERFIL</h1>
      </div>

      {/* Avatar + info */}
      <div className="rounded-xl p-5 border mb-4" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl flex-shrink-0"
            style={{ background: 'var(--cc-purple)', color: '#fff' }}
          >
            {initials}
          </div>
          <div>
            <p className="font-display text-xl tracking-widest" style={{ color: 'var(--cc-white)' }}>
              {nome || 'Sem nome'}
            </p>
            <p className="font-mono text-xs mt-1" style={{ color: 'var(--cc-muted)' }}>{email}</p>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: 'var(--cc-muted)' }}>NOME</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome completo"
              className="flex-1 rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
              onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
              onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
            />
            <button
              onClick={salvarPerfil}
              disabled={salvando || !nome.trim()}
              className="font-display text-sm tracking-widest px-4 rounded-lg transition-opacity disabled:opacity-40"
              style={{ background: salvo ? 'var(--cc-green)' : 'var(--cc-purple)', color: '#fff' }}
            >
              {salvando ? '...' : salvo ? '✓' : 'SALVAR'}
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'AULAS CONCLUÍDAS', value: totalConcluidas },
          { label: 'TRILHAS COMPLETAS', value: trilhasConcluidas.length },
          { label: 'CERTIFICADOS', value: trilhasConcluidas.length },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-4 border text-center" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
            <p className="font-display text-3xl mb-1" style={{ color: 'var(--cc-green)' }}>{stat.value}</p>
            <p className="font-mono leading-tight" style={{ color: 'var(--cc-muted)', fontSize: '9px', letterSpacing: '1px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progresso por trilha */}
      <div className="rounded-xl p-5 border mb-4" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <h2 className="font-display text-lg tracking-widest mb-4" style={{ color: 'var(--cc-white)' }}>
          PROGRESSO <span style={{ color: 'var(--cc-green)' }}>NAS TRILHAS</span>
        </h2>
        <div className="flex flex-col gap-3">
          {trilhas.map(t => {
            const pct = t.total > 0 ? Math.round((t.done / t.total) * 100) : 0
            return (
              <div key={t.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm" style={{ color: t.concluida ? 'var(--cc-green)' : 'var(--cc-white)' }}>
                    {t.concluida ? '✓ ' : ''}{t.titulo}
                    {t.obrigatoria && <span className="font-mono text-xs ml-2" style={{ color: 'var(--cc-purple)', fontSize: '9px' }}>NÚCLEO</span>}
                  </span>
                  <span className="font-mono text-xs" style={{ color: t.concluida ? 'var(--cc-green)' : 'var(--cc-muted)' }}>
                    {t.done}/{t.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cc-gray2)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: t.concluida ? 'var(--cc-green)' : t.obrigatoria ? 'var(--cc-purple)' : 'var(--cc-orange)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Certificados */}
      <div className="rounded-xl p-5 border" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <h2 className="font-display text-lg tracking-widest mb-1" style={{ color: 'var(--cc-white)' }}>
          CERTIFICADOS
        </h2>
        <p className="text-xs mb-4" style={{ color: 'var(--cc-muted)' }}>
          Disponível ao concluir uma trilha específica. Emissão em até 15 dias após solicitação.
        </p>

        {trilhasConcluidas.length === 0 ? (
          <div className="text-center py-6 rounded-lg" style={{ background: 'var(--cc-bg)' }}>
            <p className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>
              Conclua uma trilha específica para solicitar seu certificado
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trilhasConcluidas.map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-lg border"
                style={{ background: 'var(--cc-bg)', borderColor: '#1a3a28' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--cc-white)' }}>{t.titulo}</p>
                  <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--cc-green)' }}>✓ Trilha concluída</p>
                </div>
                <button
                  className="font-display text-sm tracking-widest px-4 py-2 rounded-lg"
                  style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}
                  onClick={() => alert('Em breve! A solicitação de certificados será implementada na próxima versão.')}
                >
                  SOLICITAR
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
