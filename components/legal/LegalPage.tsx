import Link from 'next/link'
import { localePath, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'

interface Props {
  lang: Locale
  t: Dictionary
  titulo: string
  secoes: { titulo: string; texto: string }[]
}

/** Layout comum de Termos de Uso e Política de Privacidade (páginas públicas). */
export function LegalPage({ lang, t, titulo, secoes }: Props) {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href={localePath(lang, '/dashboard')} className="font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground">
            ← {t.comum.voltar}
          </Link>
          <h1 className="font-display text-4xl tracking-widest mt-4 mb-2">{titulo}</h1>
          <p className="font-mono text-xs text-muted-foreground">{t.legal.ultimaAtualizacao}</p>
          {t.legal.avisoTraducao && <p className="font-mono text-xs mt-2 text-cc-orange">{t.legal.avisoTraducao}</p>}
        </div>

        <div className="text-muted-foreground leading-[1.8]">
          {secoes.map(item => (
            <section key={item.titulo} className="mb-6">
              <h2 className="font-display text-lg tracking-wider mb-2 text-foreground">{item.titulo.toUpperCase()}</h2>
              <p className="text-sm leading-relaxed">{item.texto}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
