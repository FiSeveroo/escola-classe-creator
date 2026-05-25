'use client'

import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cc-bg)' }}>
      <div className="text-center max-w-sm">
        <p className="font-display text-8xl mb-2" style={{ color: 'var(--cc-gray2)' }}>404</p>
        <h1 className="font-display text-2xl tracking-widest mb-3" style={{ color: 'var(--cc-white)' }}>
          PÁGINA NÃO ENCONTRADA
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--cc-muted)' }}>
          Esta página não existe ou foi movida.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="font-display text-lg tracking-widest px-8 py-3 rounded-xl"
          style={{ background: 'var(--cc-green)', color: 'var(--cc-bg)' }}
        >
          VOLTAR AO INÍCIO
        </button>
      </div>
    </div>
  )
}
