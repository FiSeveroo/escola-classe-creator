'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRightIcon, CheckIcon, CopyIcon, GlobeIcon, HeartIcon, AtSignIcon as InstagramIcon, PlayIcon as YoutubeIcon } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BrandBlock, Eyebrow, SectionTitle } from '@/components/brand/Brand'
import { Logo } from '@/components/brand/Logo'
import { PageContainer, PageHeader } from '@/components/layout/AppShell'

const PIX_EMAIL = 'filipe.leal.severo@gmail.com'

function LinkExterno({ href, Icon, label }: { href: string; Icon: typeof GlobeIcon; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-cc-line px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-cc-green/60 hover:text-foreground"
    >
      <Icon className="size-4" /> {label}
    </a>
  )
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
      <BrandBlock className="p-6 sm:p-10">
        <h2 className="font-display text-3xl sm:text-4xl leading-none">{t.sobre.missaoTitulo}</h2>
        <p className="mt-5 max-w-3xl text-lg text-white/85 leading-relaxed">{t.sobre.missao1}</p>
        <p className="mt-3 max-w-3xl text-white/75 leading-relaxed">{t.sobre.missao2}</p>
      </BrandBlock>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Filipe */}
        <Card className="p-6 sm:p-8">
          <SectionTitle eyebrow={t.sobre.quem} tone="secondary">
            Filipe Severo
          </SectionTitle>
          <div className="flex items-start gap-4">
            <Image
              src="/brand/filipe.webp"
              alt="Filipe Severo"
              width={96}
              height={96}
              className="size-20 shrink-0 rounded-2xl object-cover ring-2 ring-cc-purple"
            />
            <p className="text-sm font-semibold text-cc-purple-text">{t.sobre.filipeCargo}</p>
          </div>
          <p className="mt-5 text-muted-foreground leading-relaxed">{t.sobre.filipeBio}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <LinkExterno href="https://www.youtube.com/@FilipeSevero" Icon={YoutubeIcon} label="YouTube" />
            <LinkExterno href="https://www.instagram.com/severo_filipe/" Icon={InstagramIcon} label="Instagram" />
          </div>
        </Card>

        {/* Classe Creator */}
        <Card className="p-6 sm:p-8">
          <SectionTitle eyebrow={t.sobre.movimento} tone="secondary">
            Classe Creator
          </SectionTitle>
          <Logo className="h-16 self-start" />
          <p className="mt-5 text-muted-foreground leading-relaxed">{t.sobre.movimentoTexto}</p>
          <p className="mt-3 font-display text-lg text-cc-green">{t.sobre.slogan}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <LinkExterno href="https://classecreator.com" Icon={GlobeIcon} label={t.sobre.site} />
            <LinkExterno href="https://www.instagram.com/classecreator/" Icon={InstagramIcon} label="Instagram" />
            <LinkExterno href="https://www.youtube.com/@ClasseCreator" Icon={YoutubeIcon} label="YouTube" />
          </div>
        </Card>
      </div>

      {/* Raio-X */}
      <Card className="mt-6 p-6 sm:p-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>{t.sobre.observatorio}</Eyebrow>
          <h3 className="mt-1.5 font-display text-2xl text-cc-green">Raio-X Classe Creator</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">{t.sobre.raioxTexto1}</p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {t.sobre.raioxTexto2} <span className="italic text-foreground">{t.sobre.raioxLema}</span>
          </p>
        </div>
        <Button asChild variant="cta" size="lg" font="display" className="shrink-0">
          <a href="https://raiox.classecreator.com" target="_blank" rel="noopener noreferrer">
            {t.sobre.raioxCta.replace(' →', '')} <ArrowUpRightIcon />
          </a>
        </Button>
      </Card>

      {/* Apoio */}
      <section className="mt-10">
        <SectionTitle eyebrow={t.sobre.apoie}>{t.sobre.ajudeTitulo}</SectionTitle>
        <Card className="p-6 sm:p-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-muted-foreground leading-relaxed">{t.sobre.ajudeTexto}</p>
            <p className="mt-6 label-caps text-muted-foreground">{t.sobre.pixTitulo}</p>
            <button
              onClick={copiarPix}
              className={cn(
                'mt-2 flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                pixCopiado ? 'border-cc-green bg-cc-green/10' : 'border-cc-line bg-cc-bg hover:border-cc-green/60'
              )}
            >
              <span className="break-all font-semibold">{PIX_EMAIL}</span>
              {pixCopiado ? <CheckIcon className="size-4 shrink-0 text-cc-green" /> : <CopyIcon className="size-4 shrink-0 text-muted-foreground" />}
            </button>
            <p className="mt-2 text-xs text-muted-foreground">{t.sobre.pixCopiar}</p>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <HeartIcon className="size-4 text-cc-orange" /> {t.sobre.obrigado}
            </p>
          </div>
          <div className="justify-self-center rounded-2xl bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pix-qrcode.png" alt="QR Code PIX" width={180} height={180} />
          </div>
        </Card>
      </section>

      <nav className="mt-10 flex justify-center gap-6 text-sm">
        <Link href={href('/termos')} className="text-muted-foreground hover:text-foreground">
          {t.meta.termos}
        </Link>
        <Link href={href('/privacidade')} className="text-muted-foreground hover:text-foreground">
          {t.meta.privacidade}
        </Link>
      </nav>
    </PageContainer>
  )
}
