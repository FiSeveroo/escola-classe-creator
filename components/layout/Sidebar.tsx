'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Perfil } from '@/types'

interface SidebarProps {
  perfil: Perfil | null
}

const navItems = [
  { label: 'INÍCIO', href: '/dashboard', icon: '⌂' },
  { label: 'TRILHAS', href: '/dashboard#trilhas', icon: '◎', matchHref: '/trilha' },
  { label: 'PERFIL', href: '/perfil', icon: '○' },
]

export default function Sidebar({ perfil }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = perfil?.nome
    ? perfil.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'CC'

  function isActive(item: typeof navItems[0]) {
    if (item.matchHref) return pathname.startsWith(item.matchHref)
    if (item.href === '/dashboard') return pathname === '/dashboard'
    return pathname === item.href
  }

  function handleNav(item: typeof navItems[0]) {
    if (item.href === '/dashboard#trilhas') {
      router.push('/dashboard')
      setTimeout(() => {
        document.getElementById('trilhas-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      router.push(item.href)
    }
  }

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className="hidden md:flex flex-col justify-between h-screen w-16 lg:w-52 flex-shrink-0 sticky top-0 border-r"
        style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}
      >
        <div>
          <div
            className="px-3 lg:px-5 py-5 border-b cursor-pointer"
            style={{ borderColor: 'var(--cc-gray2)' }}
            onClick={() => router.push('/dashboard')}
          >
            <span className="font-display text-lg tracking-widest hidden lg:block" style={{ color: 'var(--cc-green)' }}>
              CLASSE<span style={{ color: 'var(--cc-white)' }}>CREATOR</span>
            </span>
            <span className="font-display text-xl tracking-widest lg:hidden" style={{ color: 'var(--cc-green)' }}>C</span>
            <p className="font-mono text-xs tracking-widest hidden lg:block mt-0.5" style={{ color: 'var(--cc-muted)' }}>ESCOLA</p>
          </div>

          <nav className="py-4 flex flex-col gap-1 px-2">
            {navItems.map(item => {
              const active = isActive(item)
              return (
                <button
                  key={item.label}
                  onClick={() => handleNav(item)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors w-full"
                  style={{
                    background: active ? 'var(--cc-gray2)' : 'transparent',
                    color: active ? 'var(--cc-green)' : 'var(--cc-muted)',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--cc-white)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--cc-muted)' }}
                >
                  <span className="text-lg w-5 text-center flex-shrink-0">{item.icon}</span>
                  <span className="font-mono text-xs tracking-widest hidden lg:block">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-2 border-t" style={{ borderColor: 'var(--cc-gray2)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-display text-xs"
              style={{ background: 'var(--cc-purple)', color: '#fff' }}
            >
              {initials}
            </div>
            <span className="font-mono text-xs hidden lg:block truncate" style={{ color: 'var(--cc-muted)' }}>
              {perfil?.nome || 'Usuário'}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors"
            style={{ color: 'var(--cc-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--cc-orange)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--cc-muted)' }}
          >
            <span className="text-lg w-5 text-center flex-shrink-0">→</span>
            <span className="font-mono text-xs tracking-widest hidden lg:block">SAIR</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM BAR */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t"
        style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {navItems.map(item => {
          const active = isActive(item)
          return (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className="flex flex-col items-center gap-1 py-3 px-4 flex-1"
              style={{ color: active ? 'var(--cc-green)' : 'var(--cc-muted)' }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-mono tracking-widest" style={{ fontSize: '9px' }}>{item.label}</span>
            </button>
          )
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 py-3 px-4 flex-1"
          style={{ color: 'var(--cc-muted)' }}
        >
          <span className="text-xl">→</span>
          <span className="font-mono tracking-widest" style={{ fontSize: '9px' }}>SAIR</span>
        </button>
      </nav>
    </>
  )
}
