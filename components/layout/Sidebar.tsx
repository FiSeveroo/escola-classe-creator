'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { stripLocale } from '@/i18n/config'
import { useI18n } from '@/i18n/I18nProvider'
import { cn, iniciais } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/brand/Logo'
import type { Perfil } from '@/types'

const navItems = [
  { key: 'inicio', href: '/dashboard', icon: '⌂' },
  { key: 'trilhas', href: '/trilhas', icon: '◎', matchPrefix: '/trilha' },
  { key: 'perfil', href: '/perfil', icon: '○' },
  { key: 'sobre', href: '/sobre', icon: '◇' },
] as const

export default function Sidebar({ perfil }: { perfil: Perfil | null }) {
  const router = useRouter()
  const { t, href } = useI18n()
  const pathname = stripLocale(usePathname())

  async function logout() {
    await createClient().auth.signOut()
    router.push(href('/login'))
    router.refresh()
  }

  function isActive(item: (typeof navItems)[number]) {
    if ('matchPrefix' in item) return pathname.startsWith(item.matchPrefix)
    return pathname === item.href
  }

  const nome = perfil?.nome || t.comum.usuario

  return (
    <>
      {/* DESKTOP */}
      <aside className="hidden md:flex flex-col justify-between h-screen w-16 lg:w-52 shrink-0 sticky top-0 border-r border-cc-gray bg-cc-bg/85 backdrop-blur-sm">
        <div>
          <Link href={href('/dashboard')} className="block px-3 lg:px-5 py-5 border-b">
            <Logo className="hidden lg:block text-lg" subtitle={t.comum.escola} />
            <span className="font-display text-xl tracking-widest text-cc-green lg:hidden">C</span>
          </Link>

          <nav className="py-4 flex flex-col gap-1 px-2">
            {navItems.map(item => {
              const active = isActive(item)
              return (
                <Link
                  key={item.key}
                  href={href(item.href)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    active ? 'bg-cc-gray2 text-cc-green' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="text-lg w-5 text-center shrink-0">{item.icon}</span>
                  <span className="font-mono text-xs tracking-widest hidden lg:block">{t.nav[item.key]}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-2 border-t">
          <LanguageSwitcher compact className="w-full justify-center lg:justify-start" />
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <Avatar className="size-7">
              {perfil?.avatar_url && <AvatarImage src={perfil.avatar_url} alt={nome} />}
              <AvatarFallback>{iniciais(perfil?.nome)}</AvatarFallback>
            </Avatar>
            <span className="font-mono text-xs hidden lg:block truncate text-muted-foreground">{nome}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors text-muted-foreground hover:text-cc-orange"
          >
            <span className="text-lg w-5 text-center shrink-0">→</span>
            <span className="font-mono text-xs tracking-widest hidden lg:block">{t.nav.sair}</span>
          </button>
        </div>
      </aside>

      {/* MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-card pb-[env(safe-area-inset-bottom)]">
        {navItems.map(item => {
          const active = isActive(item)
          return (
            <Link
              key={item.key}
              href={href(item.href)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-2 flex-1',
                active ? 'text-cc-green' : 'text-muted-foreground'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-mono tracking-widest text-[9px]">{t.nav[item.key]}</span>
            </Link>
          )
        })}
        <button onClick={logout} className="flex flex-col items-center gap-1 py-3 px-2 flex-1 text-muted-foreground">
          <span className="text-xl">→</span>
          <span className="font-mono tracking-widest text-[9px]">{t.nav.sair}</span>
        </button>
      </nav>
    </>
  )
}
