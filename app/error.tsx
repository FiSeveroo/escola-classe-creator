'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cc-bg)' }}>
      <div className="text-center max-w-sm">
        <p className="font-display text-8xl mb-2" style={{ color: 'var(--cc-gray2)' }}>ops</p>
        <h1 className="font-display text-2xl tracking-widest mb-3" style={{ color: 'var(--cc-white)' }}>
          ALGO DEU ERRADO
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--cc-muted)' }}>
          Ocorreu um erro inesperado. Tente novamente ou volte ao início.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="font-display text-lg tracking-widest px-6 py-3 rounded-xl border"
            style={{ borderColor: 'var(--cc-gray3)', color: 'var(--cc-muted)' }}
          >
            TENTAR NOVAMENTE
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="font-display text-lg tracking-widest px-6 py-3 rounded-xl"
            style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}
          >
            INÍCIO
          </button>
        </div>
      </div>
    </div>
  )
}
