'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const { t, href } = useI18n()
  return (
    <div className="relative isolate min-h-screen flex items-center justify-center p-6">
      <div aria-hidden className="bg-textura absolute inset-0 -z-10 opacity-20" />
      <div className="text-center max-w-sm">
        <p className="font-display text-8xl sm:text-9xl mb-4 text-cc-purple leading-none">404</p>
        <h1 className="font-display text-3xl mb-3 text-cc-green">{t.erros.naoEncontrada}</h1>
        <p className="mb-8 text-muted-foreground">{t.erros.naoEncontradaTexto}</p>
        <Button asChild size="lg" font="display" className="px-8">
          <Link href={href('/dashboard')}>{t.erros.voltarInicio}</Link>
        </Button>
      </div>
    </div>
  )
}
