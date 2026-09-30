'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { GlobeIcon } from 'lucide-react'
import { locales, localeNames, localePath, stripLocale, LOCALE_COOKIE, type Locale } from '@/i18n/config'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LanguageSwitcher({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { lang, t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  function trocar(novo: string) {
    if (novo === lang) return
    document.cookie = `${LOCALE_COOKIE}=${novo}; path=/; max-age=31536000; samesite=lax`
    // window.location.search em vez de useSearchParams: evita exigir <Suspense> em páginas estáticas.
    const destino = localePath(novo as Locale, stripLocale(pathname)) + window.location.search
    startTransition(() => router.replace(destino))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.comum.idioma}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-xs tracking-widest text-muted-foreground transition-colors hover:text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
          pending && 'opacity-50',
          className
        )}
      >
        <GlobeIcon className="size-4 shrink-0" />
        <span className={cn(compact && 'hidden lg:inline')}>{lang.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={lang} onValueChange={trocar}>
          {locales.map(l => (
            <DropdownMenuRadioItem key={l} value={l}>
              {localeNames[l]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
