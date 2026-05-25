'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Modo = 'login' | 'cadastro' | 'esqueci'

export default function LoginPage() {
  const router = useRouter()
  const [modo, setModo] = useState<Modo>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)

  const getClient = useCallback(() => {
    const { createClient } = require('@/lib/supabase/client')
    return createClient()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setLoading(true)

    try {
      const supabase = getClient()

      if (modo === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
        if (error) setErro('E-mail ou senha incorretos.')
        else router.push('/dashboard')

      } else if (modo === 'cadastro') {
        const { error } = await supabase.auth.signUp({
          email, password: senha,
          options: { data: { nome } }
        })
        if (error) setErro('Erro ao criar conta. Tente outro e-mail.')
        else setSucesso('Cadastro realizado! Verifique sua caixa de entrada e confirme o e-mail antes de fazer login.')

      } else if (modo === 'esqueci') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/redefinir-senha`,
        })
        if (error) setErro('Erro ao enviar e-mail. Verifique o endereço.')
        else setSucesso('E-mail de redefinição enviado! Verifique sua caixa de entrada.')
      }
    } catch {
      setErro('Erro de configuração. Tente novamente.')
    }

    setLoading(false)
  }

  const titulo = modo === 'login' ? 'ENTRAR' : modo === 'cadastro' ? 'CADASTRAR' : 'REDEFINIR SENHA'
  const btnLabel = loading ? 'AGUARDE...' : modo === 'login' ? 'ENTRAR' : modo === 'cadastro' ? 'CRIAR CONTA' : 'ENVIAR E-MAIL'

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cc-bg)' }}>
      <div className="w-full max-w-sm rounded-xl p-8 border" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>

        <div className="mb-6">
          <h1 className="font-display text-3xl tracking-widest" style={{ color: 'var(--cc-green)' }}>
            CLASSE<span style={{ color: 'var(--cc-white)' }}>CREATOR</span>
          </h1>
          <p className="font-mono text-xs tracking-widest mt-1" style={{ color: 'var(--cc-muted)' }}>ESCOLA — ACESSO GRATUITO</p>
        </div>

        {/* Toggle login/cadastro */}
        {modo !== 'esqueci' && (
          <div className="flex rounded-lg overflow-hidden mb-6 border" style={{ borderColor: 'var(--cc-gray3)' }}>
            {(['login', 'cadastro'] as const).map(m => (
              <button key={m} onClick={() => { setModo(m); setErro(''); setSucesso('') }}
                className="flex-1 py-2 text-xs font-mono tracking-widest transition-colors"
                style={{ background: modo === m ? 'var(--cc-purple)' : 'transparent', color: modo === m ? '#fff' : 'var(--cc-muted)' }}>
                {m === 'login' ? 'ENTRAR' : 'CADASTRAR'}
              </button>
            ))}
          </div>
        )}

        {modo === 'esqueci' && (
          <div className="mb-5">
            <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-orange)' }}>REDEFINIR SENHA</p>
            <p className="text-xs" style={{ color: 'var(--cc-muted)' }}>Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {modo === 'cadastro' && (
            <div>
              <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: 'var(--cc-muted)' }}>NOME</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                placeholder="Seu nome completo" required
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
                onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
                onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
              />
            </div>
          )}

          <div>
            <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: 'var(--cc-muted)' }}>E-MAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com" required
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
              onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
              onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
            />
          </div>

          {modo !== 'esqueci' && (
            <div>
              <label className="font-mono text-xs tracking-widest block mb-1.5" style={{ color: 'var(--cc-muted)' }}>SENHA</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                placeholder="••••••••" required minLength={6}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ background: 'var(--cc-bg)', border: '1px solid var(--cc-gray3)', color: 'var(--cc-white)' }}
                onFocus={e => e.target.style.borderColor = 'var(--cc-green)'}
                onBlur={e => e.target.style.borderColor = 'var(--cc-gray3)'}
              />
            </div>
          )}

          {erro && <p className="font-mono text-xs text-center" style={{ color: 'var(--cc-orange)' }}>{erro}</p>}
          {sucesso && (
            <div className="rounded-lg p-3 text-xs text-center font-mono" style={{ background: '#0d2b1a', color: 'var(--cc-green)', border: '1px solid #1a3a28' }}>
              {sucesso}
            </div>
          )}

          {!sucesso && (
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-display text-xl tracking-widest transition-opacity disabled:opacity-50"
              style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}>
              {btnLabel}
            </button>
          )}
        </form>

        <div className="mt-4 flex flex-col gap-2 text-center">
          {modo === 'login' && (
            <button onClick={() => { setModo('esqueci'); setErro(''); setSucesso('') }}
              className="font-mono text-xs" style={{ color: 'var(--cc-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Esqueci minha senha
            </button>
          )}
          {modo === 'esqueci' && (
            <button onClick={() => { setModo('login'); setErro(''); setSucesso('') }}
              className="font-mono text-xs" style={{ color: 'var(--cc-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              ← Voltar ao login
            </button>
          )}
          {modo !== 'esqueci' && (
            <>
              <p className="text-xs" style={{ color: 'var(--cc-muted)' }}>100% gratuito. Sem pegadinhas.</p>
              {modo === 'cadastro' && (
                <p className="text-center mt-1" style={{ fontSize: '10px', color: 'var(--cc-muted)' }}>
                  Ao criar conta você concorda com os{' '}
                  <a href="/termos" style={{ color: 'var(--cc-purple)' }}>Termos de Uso</a>
                  {' '}e a{' '}
                  <a href="/privacidade" style={{ color: 'var(--cc-purple)' }}>Política de Privacidade</a>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
