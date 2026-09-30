'use client'

import { CheckIcon } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { BrandBlock } from '@/components/brand/Brand'
import { Logo } from '@/components/brand/Logo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

/**
 * Telas de autenticação: painel da marca (roxo + textura) à esquerda no desktop,
 * formulário à direita. No mobile o painel vira um cabeçalho compacto.
 */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t, href } = useI18n()

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      {/* Painel da marca — desktop */}
      <div className="hidden lg:block p-4">
        <BrandBlock className="h-full flex flex-col justify-between p-12 xl:p-16">
          <Link href={href('/')} className="self-start">
            <Logo className="h-16 w-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]" priority />
          </Link>
          <div className="max-w-lg">
            <h2 className="font-display text-5xl xl:text-6xl leading-[0.95] text-white">{t.login.heroTitulo}</h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">{t.login.heroTexto}</p>
            <ul className="mt-8 flex flex-col gap-3">
              {t.login.heroItens.map(item => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <span className="grid size-6 place-items-center rounded-full bg-cc-green text-primary-foreground">
                    <CheckIcon className="size-4" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="label-caps text-white/60">{t.login.gratuito}</p>
        </BrandBlock>
      </div>

      {/* Formulário */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-4 lg:justify-end">
          <Link href={href('/')} className="lg:hidden">
            <Logo className="h-9" priority />
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="flex-1 flex items-center justify-center px-5 pb-12">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
      </div>
    </div>
  )
}
