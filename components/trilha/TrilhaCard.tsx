'use client'

import Link from 'next/link'
import {
  CheckIcon,
  CompassIcon,
  LockIcon,
  PaletteIcon,
  PlayIcon,
  ScissorsIcon,
  SmartphoneIcon,
  type LucideIcon,
} from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { fmt } from '@/i18n/format'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const ICONES: Record<string, LucideIcon> = {
  nucleo: CompassIcon,
  yt: PlayIcon,
  tt: SmartphoneIcon,
  ds: PaletteIcon,
  ed: ScissorsIcon,
}

export function TrilhaIcon({ id, className }: { id: string; className?: string }) {
  const Icon = ICONES[id] ?? CompassIcon
  return <Icon className={className} />
}

export interface TrilhaCardData {
  id: string
  titulo: string
  descricao: string | null
  total: number
  done: number
  desbloqueada: boolean
}

/** Card de trilha específica: disponível, concluída, bloqueada ou em breve. */
export function TrilhaCard({ trilha, detalhado = false }: { trilha: TrilhaCardData; detalhado?: boolean }) {
  const { t, href } = useI18n()
  const emBreve = trilha.total === 0
  const concluida = !emBreve && trilha.done === trilha.total
  const acessivel = trilha.desbloqueada && !emBreve
  const pct = trilha.total ? Math.round((trilha.done / trilha.total) * 100) : 0
  const info = t.trilhas.info[trilha.id]

  const conteudo = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-xl',
            concluida ? 'bg-cc-green text-primary-foreground' : acessivel ? 'bg-cc-purple text-white' : 'bg-cc-surface-2 text-muted-foreground'
          )}
        >
          <TrilhaIcon id={trilha.id} className="size-5" />
        </span>
        {concluida ? (
          <Badge variant="success">
            <CheckIcon /> {t.dashboard.concluida}
          </Badge>
        ) : emBreve ? (
          <Badge>{t.comum.emBreve}</Badge>
        ) : !trilha.desbloqueada ? (
          <Badge>
            <LockIcon /> {t.comum.bloqueada}
          </Badge>
        ) : null}
      </div>

      <h3 className="mt-4 font-display text-lg leading-tight">{trilha.titulo}</h3>
      {detalhado && trilha.descricao && <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{trilha.descricao}</p>}
      {detalhado && info && (
        <p className="mt-3 text-xs text-muted-foreground">
          {info.publico} · {info.duracao}
        </p>
      )}

      <div className="mt-auto pt-5">
        {acessivel ? (
          <>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{fmt(t.comum.aulasFracao, { done: trilha.done, total: trilha.total })}</span>
              <span className={cn('font-semibold', concluida ? 'text-cc-green' : 'text-foreground')}>{pct}%</span>
            </div>
            <Progress value={pct} />
          </>
        ) : !emBreve ? (
          <p className="text-xs text-muted-foreground">
            {t.dashboard.concluaO} <span className="text-cc-purple-text font-semibold">{t.dashboard.nucleoObrigatorio}</span>
          </p>
        ) : null}
      </div>
    </>
  )

  const base = 'group relative flex flex-col rounded-2xl border border-cc-line bg-cc-surface p-5 transition-all'

  return acessivel ? (
    <Link href={href(`/trilha/${trilha.id}`)} className={cn(base, 'hover:border-cc-green/60 hover:-translate-y-0.5')}>
      {conteudo}
    </Link>
  ) : (
    <div className={cn(base, 'opacity-60')} aria-disabled>
      {conteudo}
    </div>
  )
}
