'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer, PageHeader } from '@/components/layout/AppShell'

const PIX_EMAIL = 'filipe.leal.severo@gmail.com'

function LinkExterno({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors bg-cc-gray2 text-muted-foreground hover:text-foreground"
    >
      {icon} {label}
    </a>
  )
}

function Secao({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Card className={cn('p-6 mb-4', className)}>{children}</Card>
}

export default function SobreClient() {
  const { t, href } = useI18n()
  const [pixCopiado, setPixCopiado] = useState(false)

  function copiarPix() {
    navigator.clipboard.writeText(PIX_EMAIL)
    setPixCopiado(true)
    setTimeout(() => setPixCopiado(false), 2000)
  }

  return (
    <PageContainer>
      <PageHeader eyebrow={t.sobre.oProjeto} title={t.sobre.titulo} />

      {/* Missão */}
      <Secao className="border-cc-green">
        <p className="font-display text-xl tracking-widest mb-3 text-cc-green">{t.sobre.missaoTitulo}</p>
        <p className="text-base leading-relaxed mb-3 text-muted-foreground">{t.sobre.missao1}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{t.sobre.missao2}</p>
      </Secao>

      {/* Filipe */}
      <Secao>
        <p className="font-mono text-xs tracking-widest mb-4 text-cc-purple">{t.sobre.quem}</p>
        <div className="flex items-start gap-4 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/filipe-severo.png"
            alt="Filipe Severo"
            className="size-20 rounded-full object-cover shrink-0 border-2 border-cc-purple"
          />
          <div>
            <h2 className="font-display text-xl tracking-widest mb-1">FILIPE SEVERO</h2>
            <p className="font-mono text-xs tracking-widest text-cc-purple">{t.sobre.filipeCargo}</p>
          </div>
        </div>
        <p className="text-base leading-relaxed mb-5 text-muted-foreground">{t.sobre.filipeBio}</p>
        <div className="flex flex-wrap gap-2">
          <LinkExterno href="https://www.youtube.com/@FilipeSevero" icon="▶" label="YouTube" />
          <LinkExterno href="https://www.instagram.com/severo_filipe/" icon="◉" label="Instagram" />
        </div>
      </Secao>

      {/* Classe Creator */}
      <Secao>
        <p className="font-mono text-xs tracking-widest mb-4 text-cc-orange">{t.sobre.movimento}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/classe-creator-logo.png" alt="Classe Creator" className="h-12 object-contain mb-4" />
        <p className="text-base leading-relaxed mb-3 text-muted-foreground">{t.sobre.movimentoTexto}</p>
        <p className="text-base leading-relaxed mb-5 text-muted-foreground">{t.sobre.slogan}</p>
        <div className="flex flex-wrap gap-2">
          <LinkExterno href="https://classecreator.com" icon="⬡" label={t.sobre.site} />
          <LinkExterno href="https://www.instagram.com/classecreator/" icon="◉" label="Instagram" />
          <LinkExterno href="https://www.youtube.com/@ClasseCreator" icon="▶" label="YouTube" />
        </div>
      </Secao>

      {/* Raio-X */}
      <Secao>
        <p className="font-mono text-xs tracking-widest mb-4 text-cc-orange">{t.sobre.observatorio}</p>
        <h3 className="font-display text-xl tracking-widest mb-2">RAIO-X CLASSE CREATOR</h3>
        <p className="text-base leading-relaxed mb-3 text-muted-foreground">{t.sobre.raioxTexto1}</p>
        <p className="text-base leading-relaxed mb-5 text-muted-foreground">
          {t.sobre.raioxTexto2}
          <span className="text-foreground italic"> {t.sobre.raioxLema}</span>
        </p>
        <Button asChild variant="destructive" font="display" size="sm" className="text-sm px-4 text-white">
          <a href="http://raiox.classecreator.com" target="_blank" rel="noopener noreferrer">
            {t.sobre.raioxCta}
          </a>
        </Button>
      </Secao>

      {/* Doação */}
      <Card className="p-6">
        <p className="font-mono text-xs tracking-widest mb-4 text-cc-green">{t.sobre.apoie}</p>
        <h3 className="font-display text-xl tracking-widest mb-3">{t.sobre.ajudeTitulo}</h3>
        <p className="text-base leading-relaxed mb-5 text-muted-foreground">{t.sobre.ajudeTexto}</p>

        <div className="rounded-xl p-5 text-center mb-4">
          <p className="font-mono text-xs tracking-widest mb-4 text-muted-foreground">{t.sobre.pixTitulo}</p>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-xl bg-white inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/pix-qrcode.png" alt="QR Code PIX" width={160} height={160} />
            </div>
          </div>
          <button
            onClick={copiarPix}
            className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-lg border border-cc-gray3 bg-card transition-colors hover:border-cc-green"
          >
            <span className="font-mono text-sm flex-1 text-center break-all">{PIX_EMAIL}</span>
            <span className={cn('font-mono text-xs shrink-0', pixCopiado ? 'text-cc-green' : 'text-muted-foreground')}>
              {pixCopiado ? '✓' : '⎘'}
            </span>
          </button>
          <p className="font-mono text-xs mt-2 text-muted-foreground">{t.sobre.pixCopiar}</p>
        </div>

        <p className="text-xs text-center text-muted-foreground">{t.sobre.obrigado}</p>
      </Card>

      <div className="flex gap-4 justify-center mt-6">
        <Link href={href('/termos')} className="font-mono text-xs text-muted-foreground hover:text-foreground">
          {t.meta.termos}
        </Link>
        <Link href={href('/privacidade')} className="font-mono text-xs text-muted-foreground hover:text-foreground">
          {t.meta.privacidade}
        </Link>
      </div>
    </PageContainer>
  )
}
