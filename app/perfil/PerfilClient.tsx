'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface TrilhaProgresso {
  id: string
  titulo: string
  obrigatoria: boolean
  total: number
  done: number
  concluida: boolean
}

interface Solicitacao {
  id: string
  trilha_id: string
  status: string
  urgente: boolean
  criado_em: string
}

interface Props {
  perfil: { id: string; nome: string | null; avatar_url: string | null } | null
  email: string
  trilhas: TrilhaProgresso[]
  totalConcluidas: number
  solicitacoes: Solicitacao[]
}

export default function PerfilClient({ perfil, email, trilhas, totalConcluidas, solicitacoes }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [nome, setNome] = useState(perfil?.nome || '')
  const [avatarUrl, setAvatarUrl] = useState(perfil?.avatar_url || '')
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [uploadando, setUploadando] = useState(false)
  const [showCertModal, setShowCertModal] = useState<string | null>(null)
  const [urgente, setUrgente] = useState(false)
  const [motivoUrgencia, setMotivoUrgencia] = useState('')
  const [nomeCompleto, setNomeCompleto] = useState(perfil?.nome || '')
  const [emailCert, setEmailCert] = useState('')
  const [enviandoCert, setEnviandoCert] = useState(false)

  const initials = nome
    ? nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : email[0].toUpperCase()

  const trilhasConcluidas = trilhas.filter(t => t.concluida && !t.obrigatoria)
  const trilhasSolicitadas = new Set(solicitacoes.map(s => s.trilha_id))

  async function salvarPerfil() {
    if (!nome.trim()) return
    setSalvando(true)
    await supabase.from('perfis').update({ nome: nome.trim(), avatar_url: avatarUrl }).eq('id', perfil?.id || '')
    setSalvando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !perfil?.id) return
    setUploadando(true)

    const ext = file.name.split('.').pop()
    const path = `${perfil.id}/avatar.${ext}`

    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = data.publicUrl + '?t=' + Date.now()
      setAvatarUrl(url)
      await supabase.from('perfis').update({ avatar_url: url }).eq('id', perfil.id)
    }
    setUploadando(false)
  }

  async function solicitarCertificado(trilhaId: string) {
    if (!nomeCompleto.trim() || !emailCert.trim()) return
    setEnviandoCert(true)
    const { error } = await supabase.from('certificado_solicitacoes').insert({
      usuario_id: perfil?.id,
      trilha_id: trilhaId,
      urgente,
      motivo_urgencia: urgente ? motivoUrgencia : null,
      nome_completo: nomeCompleto.trim(),
      email_certificado: emailCert.trim(),
    })
    if (!error) {
      setShowCertModal(null)
      setUrgente(false)
      setMotivoUrgencia('')
      router.refresh()
    }
    setEnviandoCert(false)
  }

  function statusCert(status: string) {
    const map: Record<string, { label: string; color: string }> = {
      pendente: { label: 'Aguardando análise', color: '#aaa' },
      em_analise: { label: 'Em análise', color: 'var(--cc-orange)' },
      aprovado: { label: 'Aprovado ✓', color: 'var(--cc-green)' },
      rejeitado: { label: 'Rejeitado', color: 'var(--cc-orange)' },
    }
    return map[status] || { label: status, color: '#aaa' }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">

      {/* Modal de solicitação de certificado */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
            <h3 className="font-display text-xl tracking-widest mb-1" style={{ color: 'var(--cc-white)' }}>SOLICITAR CERTIFICADO</h3>
            <p className="text-xs mb-4" style={{ color: '#aaa' }}>Prazo de emissão: até 15 dias úteis.</p>

            {/* Nome completo */}
            <div className="mb-3">
              <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: '#aaa' }}>NOME COMPLETO</label>
              <input type="text" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)}
                placeholder="Como deve aparecer no certificado"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
                onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
                onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
              />
            </div>

            {/* E-mail para receber */}
            <div className="mb-4">
              <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: '#aaa' }}>E-MAIL PARA RECEBER</label>
              <input type="email" value={emailCert} onChange={e => setEmailCert(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
                onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
                onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
              />
            </div>

            <div className="rounded-lg p-3 mb-4" style={{ background: 'transparent' }}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={urgente} onChange={e => setUrgente(e.target.checked)} className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--cc-white)' }}>Preciso com urgência</p>
                  <p className="text-sm" style={{ color: '#aaa' }}>Para processo seletivo ou outra necessidade</p>
                </div>
              </label>
            </div>

            {urgente && (
              <div className="mb-4">
                <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: '#aaa' }}>MOTIVO</label>
                <textarea value={motivoUrgencia} onChange={e => setMotivoUrgencia(e.target.value)}
                  placeholder="Ex: processo seletivo em 10/06..."
                  rows={2} className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
                />
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setShowCertModal(null)}
                className="flex-1 py-2.5 rounded-lg font-mono text-xs border"
                style={{ borderColor: 'var(--cc-gray3)', color: '#aaa' }}>
                CANCELAR
              </button>
              <button onClick={() => solicitarCertificado(showCertModal)}
                disabled={enviandoCert || !nomeCompleto.trim() || !emailCert.trim() || (urgente && !motivoUrgencia.trim())}
                className="flex-1 py-2.5 rounded-lg font-display text-lg tracking-widest disabled:opacity-40"
                style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}>
                {enviandoCert ? '...' : 'SOLICITAR'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: '#aaa' }}>MINHA CONTA</p>
        <h1 className="font-display text-3xl tracking-widest" style={{ color: 'var(--cc-white)' }}>PERFIL</h1>
      </div>

      {/* Avatar + info */}
      <div className="rounded-xl p-5 border mb-4" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            {avatarUrl
              ? <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
              : <div className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl"
                  style={{ background: 'var(--cc-purple)', color: '#fff' }}>{initials}</div>
            }
            <button onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs border-2"
              style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)', borderColor: 'var(--cc-gray)' }}>
              {uploadando ? '...' : '+'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
          </div>
          <div>
            <p className="font-display text-xl tracking-widest" style={{ color: 'var(--cc-white)' }}>{nome || 'Sem nome'}</p>
            <p className="font-mono text-xs mt-1" style={{ color: '#aaa' }}>{email}</p>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: '#aaa' }}>NOME</label>
          <div className="flex gap-2">
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome completo"
              className="flex-1 rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
              onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
              onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
            />
            <button onClick={salvarPerfil} disabled={salvando || !nome.trim()}
              className="font-display text-sm tracking-widest px-4 rounded-lg transition-opacity disabled:opacity-40"
              style={{ background: salvo ? 'var(--cc-green)' : 'var(--cc-purple)', color: '#fff' }}>
              {salvando ? '...' : salvo ? '✓' : 'SALVAR'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'AULAS CONCLUÍDAS', value: totalConcluidas },
          { label: 'TRILHAS COMPLETAS', value: trilhasConcluidas.length },
          { label: 'CERTIFICADOS', value: solicitacoes.filter(s => s.status === 'aprovado').length },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-4 border text-center" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
            <p className="font-display text-3xl mb-1" style={{ color: 'var(--cc-green)' }}>{stat.value}</p>
            <p className="font-mono leading-tight" style={{ color: '#aaa', fontSize: '9px', letterSpacing: '1px' }}>{stat.label}</p>
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
                  <span className="text-base" style={{ color: t.concluida ? 'var(--cc-green)' : 'var(--cc-white)' }}>
                    {t.concluida ? '✓ ' : ''}{t.titulo}
                    {t.obrigatoria && <span className="font-mono text-xs ml-2" style={{ color: 'var(--cc-purple)', fontSize: '9px' }}>NÚCLEO</span>}
                  </span>
                  <span className="font-mono text-xs" style={{ color: t.concluida ? 'var(--cc-green)' : 'var(--cc-muted)' }}>{t.done}/{t.total}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cc-gray2)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: t.concluida ? 'var(--cc-green)' : t.obrigatoria ? 'var(--cc-purple)' : 'var(--cc-orange)' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Certificados */}
      <div className="rounded-xl p-5 border" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <h2 className="font-display text-lg tracking-widest mb-1" style={{ color: 'var(--cc-white)' }}>CERTIFICADOS</h2>
        <p className="text-xs mb-4" style={{ color: '#aaa' }}>
          Disponível ao concluir uma trilha específica. Emissão em até 15 dias após solicitação.
        </p>

        {trilhasConcluidas.length === 0 ? (
          <div className="text-center py-6 rounded-lg" style={{ background: 'transparent' }}>
            <p className="font-mono text-xs" style={{ color: '#aaa' }}>Conclua uma trilha específica para solicitar seu certificado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trilhasConcluidas.map(t => {
              const solicitacao = solicitacoes.find(s => s.trilha_id === t.id)
              const jasolicitou = trilhasSolicitadas.has(t.id)
              const cert = solicitacao ? statusCert(solicitacao.status) : null

              return (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ background: 'var(--cc-bg)', borderColor: '#1a3a28' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--cc-white)' }}>{t.titulo}</p>
                    {cert
                      ? <p className="font-mono text-xs mt-0.5" style={{ color: cert.color }}>{cert.label}</p>
                      : <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--cc-green)' }}>✓ Trilha concluída</p>
                    }
                  </div>
                  {!jasolicitou ? (
                    <button onClick={() => setShowCertModal(t.id)}
                      className="font-display text-sm tracking-widest px-4 py-2 rounded-lg"
                      style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}>
                      SOLICITAR
                    </button>
                  ) : (
                    <span className="font-mono text-xs px-3 py-1.5 rounded border"
                      style={{ borderColor: 'var(--cc-gray3)', color: '#aaa' }}>
                      SOLICITADO
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
