import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { localePath, type Locale } from '@/i18n/config'

/** Para páginas protegidas: devolve o client + usuário, ou manda pro login no idioma atual. */
export async function requireUser(lang: Locale) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(localePath(lang, '/login'))
  return { supabase, user }
}
