import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url === 'your-project-url') {
    throw new Error('Supabase não configurado. Edite .env.local com suas chaves.')
  }

  return createBrowserClient(url, key)
}
