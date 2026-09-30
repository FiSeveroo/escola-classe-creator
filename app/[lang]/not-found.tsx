'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const { t, href } = useI18n()
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="font-display text-8xl mb-2 text-cc-gray2">404</p>
        <h1 className="font-display text-2xl tracking-widest mb-3">{t.erros.naoEncontrada}</h1>
        <p className="text-sm mb-8 text-muted-foreground">{t.erros.naoEncontradaTexto}</p>
        <Button asChild size="lg" font="display" className="px-8">
          <Link href={href('/dashboard')}>{t.erros.voltarInicio}</Link>
        </Button>
      </div>
    </div>
  )
}
