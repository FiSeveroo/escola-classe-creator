'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/I18nProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const { t, href } = useI18n()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Instanciar o client processa o código de recuperação da URL (detectSessionInUrl).
    const {
      data: { subscription },
    } = createClient().auth.onAuthStateChange(() => {})
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (senha.length < 6) return setErro(t.redefinir.erroTamanho)
    if (senha !== confirmar) return setErro(t.redefinir.erroDiferentes)

    setLoading(true)
    const { error } = await createClient().auth.updateUser({ password: senha })

    if (error) {
      setErro(t.redefinir.erroExpirado)
    } else {
      setSucesso(true)
      setTimeout(() => router.push(href('/dashboard')), 2500)
    }
    setLoading(false)
  }

  return (
    <AuthLayout>
      <header className="mb-8">
        <h1 className="font-display text-3xl text-cc-green">{t.redefinir.titulo}</h1>
        <p className="mt-2 text-muted-foreground">{t.redefinir.instrucao}</p>
      </header>

      {sucesso ? (
        <div role="status" className="rounded-xl border border-cc-green/40 bg-cc-green/10 p-5">
          <p className="font-display text-xl text-cc-green">{t.redefinir.sucessoTitulo}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.redefinir.sucessoTexto}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="senha">{t.redefinir.novaSenha}</Label>
            <Input id="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" autoComplete="new-password" required minLength={6} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmar">{t.redefinir.confirmar}</Label>
            <Input id="confirmar" type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)} placeholder="••••••••" autoComplete="new-password" required minLength={6} />
          </div>

          {erro && (
            <p role="alert" className="rounded-lg border border-cc-orange/40 bg-cc-orange/10 px-3 py-2.5 text-sm text-cc-orange">
              {erro}
            </p>
          )}

          <Button type="submit" size="lg" font="display" disabled={loading} className="w-full mt-1">
            {loading ? t.comum.aguarde : t.redefinir.salvar}
          </Button>

          <Link href={href('/login')} className="text-sm text-center text-muted-foreground hover:text-foreground">
            {t.login.voltarLogin}
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}
