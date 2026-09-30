'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/brand/Logo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { TurnstileField, TURNSTILE_SITE_KEY } from '@/components/auth/TurnstileField'

type Modo = 'login' | 'cadastro' | 'esqueci'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export default function LoginForm({ erroInicial }: { erroInicial: string }) {
  const router = useRouter()
  const { lang, t, href } = useI18n()
  const turnstileRef = useRef<TurnstileInstance>(null)

  const [modo, setModo] = useState<Modo>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState(erroInicial)
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  function trocarModo(m: Modo) {
    setModo(m)
    setErro('')
    setSucesso('')
  }

  async function handleGoogle() {
    try {
      const next = encodeURIComponent(href('/dashboard'))
      await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
      })
    } catch {
      setErro(t.login.erroGoogle)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setErro(t.login.erroCaptcha)
      return
    }

    setLoading(true)
    const captcha = captchaToken ?? undefined

    try {
      const supabase = createClient()

      if (modo === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
          options: { captchaToken: captcha },
        })
        if (error) setErro(error.message?.toLowerCase().includes('captcha') ? t.login.erroCaptchaFalhou : t.login.erroCredenciais)
        else {
          router.push(href('/dashboard'))
          router.refresh()
        }
      } else if (modo === 'cadastro') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { data: { nome }, captchaToken: captcha },
        })

        if (error) {
          if (error.message?.toLowerCase().includes('captcha')) setErro(t.login.erroCaptchaFalhou)
          else if (error.message?.toLowerCase().includes('already') || error.status === 422) setErro(t.login.erroJaCadastrado)
          else setErro(t.login.erroCadastro)
        } else if (!data?.user || data.user.identities?.length === 0) {
          // Supabase devolve user sem identities quando o e-mail já existe (anti-enumeração).
          setErro(t.login.erroJaCadastrado)
        } else if (data.session) {
          router.push(href('/dashboard'))
          router.refresh()
        } else {
          setSucesso(t.login.sucessoCadastro)
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}${href('/redefinir-senha')}`,
          captchaToken: captcha,
        })
        if (error) setErro(error.message?.toLowerCase().includes('captcha') ? t.login.erroCaptchaFalhou : t.login.erroEnvioEmail)
        else setSucesso(t.login.sucessoReset)
      }
    } catch {
      setErro(t.login.erroConfig)
    }

    // Token do Turnstile é de uso único: gera outro para a próxima tentativa.
    setCaptchaToken(null)
    turnstileRef.current?.reset()
    setLoading(false)
  }

  const btnLabel = loading
    ? t.comum.aguarde
    : modo === 'login'
      ? t.login.entrar
      : modo === 'cadastro'
        ? t.login.criarConta
        : t.login.enviarEmail

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
      <LanguageSwitcher className="absolute top-4 right-4" />
      <Card className="w-full max-w-sm">
        <CardContent className="p-8">
          <Logo className="mb-6 text-[26px]" subtitle={t.login.subtitulo} />

          {modo !== 'esqueci' ? (
            <div className="flex rounded-lg overflow-hidden mb-6 border border-cc-gray3" role="tablist">
              {(['login', 'cadastro'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={modo === m}
                  onClick={() => trocarModo(m)}
                  className={cn(
                    'flex-1 py-2 text-xs font-mono tracking-widest transition-colors',
                    modo === m ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {m === 'login' ? t.login.entrar : t.login.cadastrar}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-5">
              <p className="font-mono text-xs tracking-widest mb-1 text-cc-orange">{t.login.redefinirSenha}</p>
              <p className="text-xs text-muted-foreground">{t.login.redefinirInstrucao}</p>
            </div>
          )}

          {modo !== 'esqueci' && (
            <>
              <Button
                type="button"
                onClick={handleGoogle}
                className="w-full mb-4 bg-white text-[#333] border border-[#ddd] hover:bg-[#f5f5f5]"
              >
                <GoogleIcon />
                {t.login.google}
              </Button>
              <div className="flex items-center gap-3 mb-4">
                <Separator className="flex-1" />
                <span className="font-mono text-xs text-muted-foreground">{t.login.ou}</span>
                <Separator className="flex-1" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {modo === 'cadastro' && (
              <div className="grid gap-1.5">
                <Label htmlFor="nome">{t.login.nome}</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder={t.login.nomePlaceholder}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="email">{t.login.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.login.emailPlaceholder}
                autoComplete="email"
                required
              />
            </div>

            {modo !== 'esqueci' && (
              <div className="grid gap-1.5">
                <Label htmlFor="senha">{t.login.senha}</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                />
              </div>
            )}

            {!sucesso && <TurnstileField ref={turnstileRef} lang={lang} onToken={setCaptchaToken} />}

            {erro && (
              <p role="alert" className="font-mono text-xs text-center text-cc-orange">
                {erro}
              </p>
            )}
            {sucesso && (
              <div role="status" className="rounded-lg p-3 text-xs text-center font-mono bg-[#0d2b1a] text-cc-green border border-[#1a3a28]">
                {sucesso}
              </div>
            )}

            {!sucesso && (
              <Button type="submit" size="lg" font="display" disabled={loading} className="w-full text-xl">
                {btnLabel}
              </Button>
            )}
          </form>

          <div className="mt-4 flex flex-col gap-2 text-center">
            {modo === 'login' && (
              <button type="button" onClick={() => trocarModo('esqueci')} className="font-mono text-xs text-muted-foreground hover:text-foreground">
                {t.login.esqueci}
              </button>
            )}
            {modo === 'esqueci' && (
              <button type="button" onClick={() => trocarModo('login')} className="font-mono text-xs text-muted-foreground hover:text-foreground">
                {t.login.voltarLogin}
              </button>
            )}
            {modo !== 'esqueci' && <p className="text-xs text-muted-foreground">{t.login.gratuito}</p>}
            {modo === 'cadastro' && (
              <p className="text-[10px] mt-1 text-muted-foreground">
                {t.login.aceiteAntes}{' '}
                <Link href={href('/termos')} className="text-cc-purple hover:underline">
                  {t.login.aceiteTermos}
                </Link>{' '}
                {t.login.aceiteE}{' '}
                <Link href={href('/privacidade')} className="text-cc-purple hover:underline">
                  {t.login.aceitePrivacidade}
                </Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
