'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t, href } = useI18n()
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative isolate min-h-screen flex items-center justify-center p-6">
      <div aria-hidden className="bg-textura absolute inset-0 -z-10 opacity-20" />
      <div className="text-center max-w-sm">
        <p className="font-display text-8xl sm:text-9xl mb-4 text-cc-purple leading-none">{t.erros.ops}</p>
        <h1 className="font-display text-3xl mb-3 text-cc-green">{t.erros.algoErrado}</h1>
        <p className="mb-8 text-muted-foreground">{t.erros.algoErradoTexto}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" size="lg" font="display" onClick={reset}>
            {t.erros.tentarNovamente}
          </Button>
          <Button asChild size="lg" font="display">
            <Link href={href('/dashboard')}>{t.erros.inicio}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
