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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="font-display text-8xl mb-2 text-cc-gray2">{t.erros.ops}</p>
        <h1 className="font-display text-2xl tracking-widest mb-3">{t.erros.algoErrado}</h1>
        <p className="text-sm mb-8 text-muted-foreground">{t.erros.algoErradoTexto}</p>
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
