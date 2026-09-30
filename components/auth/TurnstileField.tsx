'use client'

import { forwardRef } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import type { Locale } from '@/i18n/config'

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

/**
 * Widget do Cloudflare Turnstile. O token vai para o Supabase Auth como
 * `captchaToken`, e o próprio Supabase valida no servidor (Auth → Attack Protection).
 * Sem NEXT_PUBLIC_TURNSTILE_SITE_KEY não renderiza nada (modo dev).
 */
export const TurnstileField = forwardRef<
  TurnstileInstance,
  { lang: Locale; onToken: (token: string | null) => void }
>(function TurnstileField({ lang, onToken }, ref) {
  if (!TURNSTILE_SITE_KEY) return null

  return (
    <Turnstile
      ref={ref}
      siteKey={TURNSTILE_SITE_KEY}
      options={{ theme: 'dark', size: 'flexible', language: lang }}
      onSuccess={token => onToken(token)}
      onExpire={() => onToken(null)}
      onError={() => onToken(null)}
    />
  )
})
