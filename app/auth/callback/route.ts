import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next') ?? '/dashboard'
  // Só aceita caminhos internos: evita open redirect via ?next=//site-externo.com
  const next = /^\/(?![/\\])/.test(nextParam) ? nextParam : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // O middleware adiciona o prefixo de idioma.
  return NextResponse.redirect(`${origin}/login?error=oauth`)
}
