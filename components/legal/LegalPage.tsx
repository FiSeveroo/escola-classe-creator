import Link from 'next/link'
import { localePath, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { Logo } from '@/components/brand/Logo'

interface Props {
  lang: Locale
  t: Dictionary
  titulo: string
  secoes: { titulo: string; texto: string }[]
}

/** Layout comum de Termos de Uso e Política de Privacidade (páginas públicas). */
export function LegalPage({ lang, t, titulo, secoes }: Props) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-cc-line">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href={localePath(lang, '/dashboard')}>
            <Logo className="h-9" />
          </Link>
          <Link href={localePath(lang, '/dashboard')} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            ← {t.comum.voltar}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-4xl sm:text-5xl leading-none text-cc-green">{titulo}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t.legal.ultimaAtualizacao}</p>
        {t.legal.avisoTraducao && (
          <p className="mt-4 rounded-lg border border-cc-orange/40 bg-cc-orange/10 px-4 py-3 text-sm text-cc-orange">{t.legal.avisoTraducao}</p>
        )}

        <div className="mt-10 flex flex-col gap-8">
          {secoes.map(item => (
            <section key={item.titulo}>
              <h2 className="font-display text-lg text-cc-purple-text">{item.titulo}</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">{item.texto}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
