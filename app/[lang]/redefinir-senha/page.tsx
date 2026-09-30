'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/I18nProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/brand/Logo'

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardContent className="p-8">
          <Logo className="text-[26px] mb-6" subtitle={t.redefinir.titulo} />

          {sucesso ? (
            <div role="status" className="rounded-lg p-4 text-center bg-[#0d2b1a] border border-[#1a3a28]">
              <p className="font-display text-xl tracking-widest mb-2 text-cc-green">{t.redefinir.sucessoTitulo}</p>
              <p className="text-sm text-muted-foreground">{t.redefinir.sucessoTexto}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">{t.redefinir.instrucao}</p>

              <div className="grid gap-1.5">
                <Label htmlFor="senha">{t.redefinir.novaSenha}</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="confirmar">{t.redefinir.confirmar}</Label>
                <Input
                  id="confirmar"
                  type="password"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>

              {erro && (
                <p role="alert" className="font-mono text-xs text-center text-cc-orange">
                  {erro}
                </p>
              )}

              <Button type="submit" size="lg" font="display" disabled={loading} className="w-full text-xl">
                {loading ? t.comum.aguarde : t.redefinir.salvar}
              </Button>

              <Link href={href('/login')} className="font-mono text-xs text-center text-muted-foreground hover:text-foreground">
                {t.login.voltarLogin}
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
