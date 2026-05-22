'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const getClient = useCallback(() => {
    const { createClient } = require('@/lib/supabase/client')
    return createClient()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const supabase = getClient()

      if (modo === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
        if (error) setErro('E-mail ou senha incorretos.')
        else router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({
          email, password: senha,
          options: { data: { nome } }
        })
        if (error) setErro('Erro ao criar conta. Tente outro e-mail.')
        else router.push('/dashboard')
      }
    } catch {
      setErro('Configure as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cc-bg)' }}>
      <div
        className="w-full max-w-sm rounded-xl p-8 border"
        style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}
      >
        <div className="mb-6">
          <h1 className="font-display text-3xl tracking-widest" style={{ color: 'var(--cc-green)' }}>
            CLASSE<span style={{ color: 'var(--cc-white)' }}>CREATOR</span>
          </h1>
          <p className="font-mono text-xs tracking-widest mt-1" style={{ color: 'var(--cc-muted)' }}>
            ESCOLA — ACESSO GRATUITO
          </p>
        </div>

        <div className="flex rounded-lg overflow-hidden mb-6 border" style={{ borderColor: 'var(--cc-gray3)' }}>
          {(['login', 'cadastro'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setModo(m); setErro('') }}
              className="flex-1 py-2 text-xs font-mono tracking-widest transition-colors"
              style={{
                background: modo === m ? 'var(--cc-purple)' : 'transparent',
                color: modo === m ? '#fff' : 'var(--cc-muted)',
              }}
            >
              {m === 'login' ? 'ENTRAR' : 'CADASTRAR'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {modo === 'cadastro' && (
            <div>
              <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: 'var(--cc-muted)' }}>NOME</label>
              <input
                type="text" value={nome} onChange={e => setNome(e.target.value)}
                placeholder="Seu nome" required
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
                onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
                onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
              />
            </div>
          )}
          <div>
            <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: 'var(--cc-muted)' }}>E-MAIL</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com" required
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
              onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
              onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
            />
          </div>
          <div>
            <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: 'var(--cc-muted)' }}>SENHA</label>
            <input
              type="password" value={senha} onChange={e => setSenha(e.target.value)}
              placeholder="••••••••" required minLength={6}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
              onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
              onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
            />
          </div>

          {erro && <p className="font-mono text-xs text-center" style={{ color: 'var(--cc-orange)' }}>{erro}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-lg font-display text-xl tracking-widest transition-opacity disabled:opacity-50"
            style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}
          >
            {loading ? 'AGUARDE...' : modo === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--cc-muted)' }}>
          100% gratuito. Sem pegadinhas.
        </p>
      </div>
    </div>
  )
}
