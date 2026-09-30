import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getI18n } from '@/i18n/server'
import { localePath } from '@/i18n/config'
import { createClient } from '@/lib/supabase/server'
import LoginForm from './LoginForm'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { t } = await getI18n(params)
  return { title: `${t.login.entrar} — Escola Classe Creator` }
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { lang, t } = await getI18n(params)
  const { error } = await searchParams

  // Quem já está logado vai direto pro dashboard.
  let logado = false
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    logado = !!user
  } catch {
    // Supabase não configurado: mostra o formulário mesmo assim.
  }
  if (logado) redirect(localePath(lang, '/dashboard'))

  return <LoginForm erroInicial={error === 'oauth' ? t.login.erroOauth : ''} />
}
