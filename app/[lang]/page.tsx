import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { localePath } from '@/i18n/config'
import { getI18n } from '@/i18n/server'

export const dynamic = 'force-dynamic'

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await getI18n(params)

  let logado = false
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    logado = !!user
  } catch {}

  redirect(localePath(lang, logado ? '/dashboard' : '/login'))
}
