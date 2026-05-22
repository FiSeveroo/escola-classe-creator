'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Perfil } from '@/types'

interface NavbarProps {
  perfil: Perfil | null
  backHref?: string
  backLabel?: string
}

export default function Navbar({ perfil, backHref, backLabel }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = perfil?.nome
    ? perfil.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'CC'

  return (
    <nav
      className="flex items-center justify-between px-5 h-14 flex-shrink-0 border-b"
      style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}
    >
      <div className="flex items-center gap-4">
        {backHref && (
          <button
            onClick={() => router.push(backHref)}
            className="font-mono text-xs tracking-widest flex items-center gap-1.5 transition-colors"
            style={{ color: 'var(--cc-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cc-green)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--cc-muted)')}
          >
            ← {backLabel || 'VOLTAR'}
          </button>
        )}
        <button onClick={() => router.push('/dashboard')}>
          <span className="font-display text-lg tracking-widest" style={{ color: 'var(--cc-green)' }}>
            CLASSE<span style={{ color: 'var(--cc-white)' }}>CREATOR</span>
          </span>
          <span className="font-mono text-xs tracking-widest ml-2" style={{ color: 'var(--cc-muted)' }}>
            ESCOLA
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm"
          style={{ background: 'var(--cc-purple)', color: '#fff' }}
        >
          {initials}
        </div>
        <button
          onClick={logout}
          className="font-mono text-xs px-2 py-1 rounded border transition-colors"
          style={{ borderColor: 'var(--cc-gray3)', color: 'var(--cc-muted)' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--cc-orange)'
            e.currentTarget.style.color = 'var(--cc-orange)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--cc-gray3)'
            e.currentTarget.style.color = 'var(--cc-muted)'
          }}
        >
          SAIR
        </button>
      </div>
    </nav>
  )
}
