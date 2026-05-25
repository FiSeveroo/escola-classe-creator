'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessaoOk, setSessaoOk] = useState(false)

  const getClient = useCallback(() => {
    const { createClient } = require('@/lib/supabase/client')
    return createClient()
  }, [])

  useEffect(() => {
    // O Supabase processa o código da URL automaticamente via onAuthStateChange
    const supabase = getClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessaoOk(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [getClient])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const supabase = getClient()
    const { error } = await supabase.auth.updateUser({ password: senha })

    if (error) {
      setErro('Erro ao redefinir senha. O link pode ter expirado.')
    } else {
      setSucesso(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cc-bg)' }}>
      <div className="w-full max-w-sm rounded-xl p-8 border" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>

        <div className="mb-6">
          <h1 className="font-display text-3xl tracking-widest" style={{ color: 'var(--cc-green)' }}>
            CLASSE<span style={{ color: 'var(--cc-white)' }}>CREATOR</span>
          </h1>
          <p className="font-mono text-xs tracking-widest mt-1" style={{ color: 'var(--cc-muted)' }}>REDEFINIR SENHA</p>
        </div>

        {sucesso ? (
          <div className="rounded-lg p-4 text-center" style={{ background: '#0d2b1a', border: '1px solid #1a3a28' }}>
            <p className="font-display text-xl tracking-widest mb-2" style={{ color: 'var(--cc-green)' }}>SENHA ALTERADA!</p>
            <p className="text-sm" style={{ color: 'var(--cc-muted)' }}>Redirecionando para o dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: 'var(--cc-muted)' }}>
              Digite sua nova senha abaixo.
            </p>

            <div>
              <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: 'var(--cc-muted)' }}>
                NOVA SENHA
              </label>
              <input
                type="password" value={senha} onChange={e => setSenha(e.target.value)}
                placeholder="••••••••" required minLength={6}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
                onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
                onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
              />
            </div>

            <div>
              <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: 'var(--cc-muted)' }}>
                CONFIRMAR SENHA
              </label>
              <input
                type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)}
                placeholder="••••••••" required minLength={6}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
                onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
                onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
              />
            </div>

            {erro && (
              <p className="font-mono text-xs text-center" style={{ color: 'var(--cc-orange)' }}>{erro}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-display text-xl tracking-widest transition-opacity disabled:opacity-50"
              style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}
            >
              {loading ? 'AGUARDE...' : 'SALVAR NOVA SENHA'}
            </button>

            <button
              type="button" onClick={() => router.push('/login')}
              className="font-mono text-xs text-center"
              style={{ color: 'var(--cc-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Voltar ao login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
