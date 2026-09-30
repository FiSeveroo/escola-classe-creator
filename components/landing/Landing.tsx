import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRightIcon,
  AwardIcon,
  CheckIcon,
  ChevronDownIcon,
  CompassIcon,
  FileTextIcon,
  ListChecksIcon,
  LockIcon,
  PlayIcon,
  RouteIcon,
} from 'lucide-react'
import { localePath, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { Button } from '@/components/ui/button'
import { BrandBlock, Eyebrow, SectionTitle } from '@/components/brand/Brand'
import { Logo } from '@/components/brand/Logo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { TrilhaIcon } from '@/components/trilha/TrilhaCard'

interface Props {
  lang: Locale
  t: Dictionary
  logado: boolean
}

/** Landing pública da escola (a "home" divulgada). Tudo que não é interativo roda no servidor. */
export function Landing({ lang, t, logado }: Props) {
  const L = t.landing
  const href = (p: string) => localePath(lang, p)
  // Visitante vai direto para a aba de cadastro; quem já tem sessão vai para as aulas.
  const ctaHref = logado ? href('/dashboard') : href('/login?modo=cadastro')
  const ctaTexto = logado ? L.irParaAulas.toUpperCase() : L.hero.cta

  const CtaPrincipal = ({ className }: { className?: string }) => (
    <Button asChild variant="cta" size="lg" font="display" className={className}>
      <Link href={ctaHref}>
        {ctaTexto} <ArrowRightIcon />
      </Link>
    </Button>
  )

  const passosIcones = [CompassIcon, RouteIcon, AwardIcon]
  const etapasIcones = [PlayIcon, FileTextIcon, ListChecksIcon]

  return (
    <div className="min-h-screen">
      {/* CABEÇALHO */}
      <header className="sticky top-0 z-40 border-b border-cc-line/70 bg-cc-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href={href('/')} className="flex items-center gap-2">
            <Logo className="h-9" priority />
            <span className="hidden sm:inline label-caps mt-3 text-muted-foreground">{t.comum.escola}</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-muted-foreground">
            <a href="#como-funciona" className="hover:text-foreground">{L.nav.comoFunciona}</a>
            <a href="#trilhas" className="hover:text-foreground">{L.nav.trilhas}</a>
            <a href="#quem-faz" className="hover:text-foreground">{L.nav.quem}</a>
            <a href="#duvidas" className="hover:text-foreground">{L.nav.faq}</a>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            {!logado && (
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href={href('/login')}>{L.entrar}</Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link href={ctaHref}>{logado ? L.irParaAulas : L.comecar}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
          <BrandBlock className="px-5 py-10 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
              <div>
                <Eyebrow className="text-white/75">{L.hero.eyebrow}</Eyebrow>
                <h1 className="mt-4 font-display text-[1.875rem] leading-[0.95] break-words sm:text-5xl lg:text-6xl">{L.hero.titulo}</h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{L.hero.texto}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <CtaPrincipal />
                  <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    <a href="#trilhas">{L.hero.ctaSecundario}</a>
                  </Button>
                </div>
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
                  {L.hero.provas.map(p => (
                    <li key={p} className="flex items-center gap-2">
                      <CheckIcon className="size-4 text-cc-green" strokeWidth={3} /> {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prévia do produto: a primeira trilha e as etapas de uma aula */}
              <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
                <div className="rounded-2xl bg-cc-bg/90 p-5 shadow-2xl ring-1 ring-white/10 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-cc-purple text-white">
                      <CompassIcon className="size-5" />
                    </span>
                    <div>
                      <p className="label-caps text-muted-foreground">{L.hero.previaRotulo}</p>
                      <p className="font-display text-lg leading-tight text-cc-green">{L.trilhas.nucleoTitulo}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{L.hero.previaMeta}</p>
                  <ol className="mt-5 flex flex-col gap-2">
                    {L.trilhas.nucleoAulas.slice(0, 3).map((aula, i) => (
                      <li key={aula} className="flex items-center gap-3 rounded-xl border border-cc-line bg-cc-surface px-3 py-2.5">
                        <span
                          className={
                            i === 0
                              ? 'grid size-7 place-items-center rounded-full bg-cc-green text-primary-foreground'
                              : i === 1
                                ? 'grid size-7 place-items-center rounded-full bg-cc-purple text-xs font-bold text-white'
                                : 'grid size-7 place-items-center rounded-full bg-cc-surface-2 text-muted-foreground'
                          }
                        >
                          {i === 0 ? <CheckIcon className="size-4" strokeWidth={3} /> : i === 1 ? '2' : <LockIcon className="size-3" />}
                        </span>
                        <span className={i === 2 ? 'text-sm text-muted-foreground' : 'text-sm font-semibold'}>{aula}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {L.como.etapas.map((e, i) => {
                      const Icon = etapasIcones[i]
                      return (
                        <div key={e.titulo} className="rounded-lg bg-cc-surface-2 px-2 py-2.5 text-center">
                          <Icon className="mx-auto size-4 text-cc-green" />
                          <p className="mt-1 text-[11px] font-semibold leading-tight">{e.titulo}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </BrandBlock>
        </section>

        {/* MANIFESTO */}
        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="font-display text-[2.75rem] leading-none text-cc-green sm:text-7xl">{L.manifesto.frase}</p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{L.manifesto.texto}</p>
          <p className="mt-6 label-caps text-cc-purple-text">{t.sobre.slogan}</p>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="scroll-mt-20 mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle eyebrow={L.como.eyebrow} className="mb-8">
            {L.como.titulo}
          </SectionTitle>
          <ol className="grid gap-4 md:grid-cols-3">
            {L.como.passos.map((p, i) => {
              const Icon = passosIcones[i]
              return (
                <li key={p.titulo} className="relative rounded-2xl border border-cc-line bg-cc-surface p-6">
                  <span className="absolute right-6 top-5 font-display text-5xl leading-none text-cc-surface-2">{i + 1}</span>
                  <span className="grid size-12 place-items-center rounded-xl bg-cc-purple text-white">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl">{p.titulo}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{p.texto}</p>
                </li>
              )
            })}
          </ol>

          <div className="mt-6 grid gap-6 rounded-2xl border border-cc-line bg-cc-surface p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <h3 className="font-display text-2xl text-cc-purple-text">{L.como.aulaTitulo}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{L.como.aulaTexto}</p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-3">
              {L.como.etapas.map((e, i) => {
                const Icon = etapasIcones[i]
                return (
                  <li key={e.titulo} className="rounded-xl bg-cc-bg p-4 ring-1 ring-cc-line">
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-full bg-cc-green/12 text-cc-green">
                        <Icon className="size-4" />
                      </span>
                      <span className="label-caps text-muted-foreground">{i + 1}</span>
                    </div>
                    <p className="mt-3 font-semibold">{e.titulo}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{e.texto}</p>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        {/* TRILHAS */}
        <section id="trilhas" className="scroll-mt-20 mx-auto mt-24 max-w-6xl px-4 sm:px-6">
          <SectionTitle eyebrow={L.trilhas.eyebrow} className="mb-8">
            {L.trilhas.titulo}
          </SectionTitle>

          <BrandBlock className="p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <Eyebrow className="text-white/75">
                  {L.trilhas.nucleoRotulo} · {t.comum.nucleoObrigatorio}
                </Eyebrow>
                <div className="mt-3 flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
                    <CompassIcon className="size-6" />
                  </span>
                  <h3 className="font-display text-3xl leading-none sm:text-4xl">{L.trilhas.nucleoTitulo}</h3>
                </div>
                <p className="mt-4 leading-relaxed text-white/85">{L.trilhas.nucleoTexto}</p>
              </div>
              <ol className="flex flex-col gap-2">
                {L.trilhas.nucleoAulas.map((aula, i) => (
                  <li key={aula} className="flex items-center gap-3 rounded-xl bg-black/30 px-4 py-3 ring-1 ring-white/10">
                    <span className="font-display text-lg text-cc-green">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-semibold">{aula}</span>
                  </li>
                ))}
              </ol>
            </div>
          </BrandBlock>

          <p className="mt-10 mb-4 label-caps text-muted-foreground">{L.trilhas.depois}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {L.trilhas.lista.map(tr => (
              <article key={tr.id} className="flex flex-col rounded-2xl border border-cc-line bg-cc-surface p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className={tr.emBreve ? 'grid size-11 place-items-center rounded-xl bg-cc-surface-2 text-muted-foreground' : 'grid size-11 place-items-center rounded-xl bg-cc-purple text-white'}>
                    <TrilhaIcon id={tr.id} className="size-5" />
                  </span>
                  {tr.emBreve && <span className="rounded-md bg-cc-surface-2 px-2 py-0.5 text-xs text-muted-foreground">{t.comum.emBreve}</span>}
                </div>
                <h3 className="mt-4 font-display text-lg leading-tight">{tr.titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tr.texto}</p>
                {t.trilhas.info[tr.id] && (
                  <p className="mt-auto pt-4 text-xs text-muted-foreground">
                    {t.trilhas.info[tr.id].publico} · {t.trilhas.info[tr.id].duracao}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* PARA QUEM */}
        <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
          <SectionTitle eyebrow={L.paraQuem.eyebrow} className="mb-6">
            {L.paraQuem.titulo}
          </SectionTitle>
          <ul className="flex flex-wrap gap-3">
            {L.paraQuem.itens.map(item => (
              <li key={item} className="flex items-center gap-2 rounded-full border border-cc-line bg-cc-surface px-4 py-2.5 font-semibold">
                <CheckIcon className="size-4 text-cc-green" strokeWidth={3} /> {item}
              </li>
            ))}
          </ul>
        </section>

        {/* QUEM FAZ */}
        <section id="quem-faz" className="scroll-mt-20 mx-auto mt-24 max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 rounded-2xl border border-cc-line bg-cc-surface p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center">
            <Image
              src="/brand/filipe.webp"
              alt="Filipe Severo"
              width={320}
              height={320}
              className="size-40 rounded-2xl object-cover ring-4 ring-cc-purple sm:size-48"
            />
            <div>
              <SectionTitle eyebrow={L.quem.eyebrow} className="mb-4">
                {L.quem.titulo}
              </SectionTitle>
              <p className="text-lg leading-relaxed text-foreground/90">{L.quem.texto}</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">{L.quem.movimento}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Logo className="h-12" />
                <a
                  href="https://classecreator.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-muted-foreground hover:text-cc-green"
                >
                  classecreator.com ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* DÚVIDAS */}
        <section id="duvidas" className="scroll-mt-20 mx-auto mt-24 max-w-3xl px-4 sm:px-6">
          <SectionTitle eyebrow={L.faq.eyebrow} className="mb-6">
            {L.faq.titulo}
          </SectionTitle>
          <div className="flex flex-col gap-3">
            {L.faq.itens.map(item => (
              <details key={item.p} className="group rounded-2xl border border-cc-line bg-cc-surface open:border-cc-purple/60">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
                  {item.p}
                  <ChevronDownIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="-mt-1 px-5 pb-5 leading-relaxed text-muted-foreground">{item.r}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CHAMADA FINAL */}
        <section className="mx-auto mt-24 max-w-6xl px-4 pb-20 sm:px-6">
          <BrandBlock className="px-6 py-14 text-center sm:px-10 sm:py-20">
            <h2 className="font-display text-4xl leading-none sm:text-6xl">{L.final.titulo}</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">{L.final.texto}</p>
            <Button asChild variant="cta" size="lg" font="display" className="mt-8">
              <Link href={ctaHref}>
                {logado ? L.irParaAulas.toUpperCase() : L.final.cta} <ArrowRightIcon />
              </Link>
            </Button>
            <p className="mt-6 label-caps text-white/60">{t.login.gratuito}</p>
          </BrandBlock>
        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="border-t border-cc-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <Logo className="h-9" />
            <span className="text-sm text-muted-foreground">{t.sobre.slogan}</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href={href('/termos')} className="hover:text-foreground">{t.meta.termos}</Link>
            <Link href={href('/privacidade')} className="hover:text-foreground">{t.meta.privacidade}</Link>
            <a href="https://www.instagram.com/classecreator/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Instagram</a>
            <a href="https://www.youtube.com/@ClasseCreator" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">YouTube</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
