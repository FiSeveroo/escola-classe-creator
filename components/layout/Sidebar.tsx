'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { HomeIcon, InfoIcon, LogOutIcon, RouteIcon, UserIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { stripLocale } from '@/i18n/config'
import { useI18n } from '@/i18n/I18nProvider'
import { cn, iniciais } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/brand/Logo'
import type { Perfil } from '@/types'

const navItems = [
  { key: 'inicio', href: '/dashboard', Icon: HomeIcon },
  { key: 'trilhas', href: '/trilhas', Icon: RouteIcon, matchPrefix: ['/trilha', '/aula'] },
  { key: 'perfil', href: '/perfil', Icon: UserIcon },
  { key: 'sobre', href: '/sobre', Icon: InfoIcon },
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
    if ('matchPrefix' in item) return item.matchPrefix.some(p => pathname.startsWith(p))
    return pathname === item.href
  }

  const nome = perfil?.nome || t.comum.usuario

  return (
    <>
      {/* DESKTOP / TABLET */}
      <aside className="hidden md:flex flex-col h-screen w-[72px] lg:w-60 shrink-0 sticky top-0 border-r border-cc-line bg-cc-bg">
        <Link href={href('/dashboard')} className="flex items-center gap-2 px-4 lg:px-5 h-20 border-b border-cc-line">
          <Logo className="h-9 lg:h-10" priority />
          <span className="hidden lg:inline label-caps text-muted-foreground mt-3">{t.comum.escola}</span>
        </Link>

        <nav className="flex-1 py-5 px-3 flex flex-col gap-1">
          {navItems.map(item => {
            const active = isActive(item)
            return (
              <Link
                key={item.key}
                href={href(item.href)}
                aria-current={active ? 'page' : undefined}
                title={t.nav[item.key]}
                className={cn(
                  'group relative flex items-center gap-3 h-11 px-3 rounded-lg text-sm font-semibold transition-colors',
                  'justify-center lg:justify-start',
                  active ? 'bg-cc-green/10 text-cc-green' : 'text-muted-foreground hover:text-foreground hover:bg-cc-surface'
                )}
              >
                {active && <span aria-hidden className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-cc-green" />}
                <item.Icon className="size-5 shrink-0" />
                <span className="hidden lg:block capitalize">{t.nav[item.key].toLowerCase()}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-cc-line flex flex-col gap-1">
          <LanguageSwitcher compact className="justify-center lg:justify-start" />
          <Link
            href={href('/perfil')}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-cc-surface transition-colors justify-center lg:justify-start"
          >
            <Avatar className="size-8">
              {perfil?.avatar_url && <AvatarImage src={perfil.avatar_url} alt={nome} />}
              <AvatarFallback>{iniciais(perfil?.nome)}</AvatarFallback>
            </Avatar>
            <span className="hidden lg:block text-sm font-medium truncate">{nome}</span>
          </Link>
          <button
            onClick={logout}
            title={t.nav.sair}
            className="flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-semibold text-muted-foreground transition-colors hover:text-cc-orange hover:bg-cc-orange/10 justify-center lg:justify-start"
          >
            <LogOutIcon className="size-5 shrink-0" />
            <span className="hidden lg:block capitalize">{t.nav.sair.toLowerCase()}</span>
          </button>
        </div>
      </aside>

      {/* MOBILE: barra superior com logo + barra inferior de navegação */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b border-cc-line bg-cc-bg/90 backdrop-blur">
        <Link href={href('/dashboard')}>
          <Logo className="h-8" priority />
        </Link>
        <LanguageSwitcher />
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 grid grid-cols-5 border-t border-cc-line bg-cc-bg/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        {navItems.map(item => {
          const active = isActive(item)
          return (
            <Link
              key={item.key}
              href={href(item.href)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 pt-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wide',
                active ? 'text-cc-green' : 'text-muted-foreground'
              )}
            >
              <item.Icon className="size-5" />
              {t.nav[item.key]}
            </Link>
          )
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 pt-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          <LogOutIcon className="size-5" />
          {t.nav.sair}
        </button>
      </nav>
    </>
  )
}
