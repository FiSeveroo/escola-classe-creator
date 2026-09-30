'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/I18nProvider'
import { cn, iniciais } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PageContainer, PageHeader } from '@/components/layout/AppShell'
import { BrandBlock, SectionTitle } from '@/components/brand/Brand'
import { Badge } from '@/components/ui/badge'
import { AwardIcon, CameraIcon, CheckIcon } from 'lucide-react'
import { atualizarPerfil, solicitarCertificado } from './actions'

interface TrilhaProgresso {
  id: string
  titulo: string
  obrigatoria: boolean
  total: number
  done: number
  concluida: boolean
}

interface Solicitacao {
  id: string
  trilha_id: string
  status: string
  urgente: boolean
  criado_em: string
}

interface Props {
  perfil: { id: string; nome: string | null; avatar_url: string | null } | null
  email: string
  trilhas: TrilhaProgresso[]
  totalConcluidas: number
  solicitacoes: Solicitacao[]
}

const COR_STATUS: Record<string, string> = {
  pendente: 'text-muted-foreground',
  em_analise: 'text-cc-purple-text',
  aprovado: 'text-cc-green',
  rejeitado: 'text-cc-orange',
}

export default function PerfilClient({ perfil, email, trilhas, totalConcluidas, solicitacoes }: Props) {
  const router = useRouter()
  const { t } = useI18n()
  const fileRef = useRef<HTMLInputElement>(null)

  const [nome, setNome] = useState(perfil?.nome || '')
  const [avatarUrl, setAvatarUrl] = useState(perfil?.avatar_url || '')
  const [salvando, startSalvar] = useTransition()
  const [salvo, setSalvo] = useState(false)
  const [uploadando, setUploadando] = useState(false)
  const [erroUpload, setErroUpload] = useState('')

  const [certTrilhaId, setCertTrilhaId] = useState<string | null>(null)
  const [urgente, setUrgente] = useState(false)
  const [motivoUrgencia, setMotivoUrgencia] = useState('')
  const [nomeCompleto, setNomeCompleto] = useState(perfil?.nome || '')
  const [emailCert, setEmailCert] = useState('')
  const [enviandoCert, startEnviarCert] = useTransition()
  const [erroCert, setErroCert] = useState('')

  const trilhasConcluidas = trilhas.filter(tr => tr.concluida && !tr.obrigatoria)
  const solicitacaoPorTrilha = new Map(solicitacoes.map(s => [s.trilha_id, s]))

  function salvarNome() {
    if (!nome.trim()) return
    startSalvar(async () => {
      if (await atualizarPerfil({ nome })) {
        setSalvo(true)
        setTimeout(() => setSalvo(false), 2000)
      }
    })
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !perfil?.id) return
    setUploadando(true)
    setErroUpload('')

    // Upload direto do navegador pro Storage (evita trafegar o arquivo pela Vercel).
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${perfil.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })

    if (error) {
      setErroUpload(t.perfil.erroUpload)
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = `${data.publicUrl}?t=${Date.now()}`
      setAvatarUrl(url)
      if (!(await atualizarPerfil({ avatar_url: url }))) setErroUpload(t.perfil.erroUpload)
    }
    setUploadando(false)
    e.target.value = ''
  }

  function fecharModal() {
    setCertTrilhaId(null)
    setUrgente(false)
    setMotivoUrgencia('')
    setErroCert('')
  }

  function enviarCertificado() {
    if (!certTrilhaId) return
    setErroCert('')
    startEnviarCert(async () => {
      const ok = await solicitarCertificado({
        trilhaId: certTrilhaId,
        nomeCompleto,
        email: emailCert,
        urgente,
        motivoUrgencia,
      })
      if (ok) {
        fecharModal()
        router.refresh()
      } else {
        setErroCert(t.perfil.modal.erro)
      }
    })
  }

  const podeEnviarCert = !enviandoCert && nomeCompleto.trim() && emailCert.trim() && (!urgente || motivoUrgencia.trim())

  const stats = [
    { label: t.perfil.aulasConcluidas, value: totalConcluidas },
    { label: t.perfil.trilhasCompletas, value: trilhasConcluidas.length },
    { label: t.perfil.certificados, value: solicitacoes.filter(s => s.status === 'aprovado').length },
  ]

  return (
    <PageContainer>
      {/* Solicitação de certificado */}
      <Dialog open={!!certTrilhaId} onOpenChange={aberto => !aberto && fecharModal()}>
        <DialogContent closeLabel={t.comum.fechar}>
          <DialogHeader>
            <DialogTitle className="text-cc-green">{t.perfil.modal.titulo}</DialogTitle>
            <DialogDescription>{t.perfil.modal.prazo}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="cert-nome">{t.perfil.modal.nomeCompleto}</Label>
            <Input id="cert-nome" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} placeholder={t.perfil.modal.nomeCompletoPlaceholder} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cert-email">{t.perfil.modal.emailReceber}</Label>
            <Input id="cert-email" type="email" value={emailCert} onChange={e => setEmailCert(e.target.value)} placeholder={t.login.emailPlaceholder} />
          </div>

          <label htmlFor="cert-urgente" className="flex cursor-pointer items-start gap-3 rounded-xl border border-cc-line p-3">
            <Checkbox id="cert-urgente" checked={urgente} onCheckedChange={v => setUrgente(v === true)} className="mt-0.5" />
            <span>
              <span className="block text-sm font-semibold">{t.perfil.modal.urgente}</span>
              <span className="block text-sm text-muted-foreground">{t.perfil.modal.urgenteDescricao}</span>
            </span>
          </label>

          {urgente && (
            <div className="grid gap-2">
              <Label htmlFor="cert-motivo">{t.perfil.modal.motivo}</Label>
              <Textarea id="cert-motivo" value={motivoUrgencia} onChange={e => setMotivoUrgencia(e.target.value)} placeholder={t.perfil.modal.motivoPlaceholder} rows={2} className="resize-none" />
            </div>
          )}

          {erroCert && (
            <p role="alert" className="rounded-lg border border-cc-orange/40 bg-cc-orange/10 px-3 py-2.5 text-sm text-cc-orange">
              {erroCert}
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" className="flex-1" onClick={fecharModal}>
              {t.comum.cancelar}
            </Button>
            <Button variant="cta" font="display" className="flex-1" onClick={enviarCertificado} disabled={!podeEnviarCert}>
              {enviandoCert ? '...' : t.perfil.solicitar}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PageHeader eyebrow={t.perfil.minhaConta} title={t.perfil.titulo} />

      {/* Identidade + números */}
      <BrandBlock className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <Avatar className="size-20 ring-4 ring-white/20">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={nome} />}
                <AvatarFallback className="bg-black/30 text-2xl">{iniciais(nome, email[0]?.toUpperCase())}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileRef.current?.click()}
                aria-label={t.perfil.trocarFoto}
                title={t.perfil.trocarFoto}
                className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-cc-purple bg-cc-green text-primary-foreground transition-transform hover:scale-105"
              >
                {uploadando ? <span className="text-xs">…</span> : <CameraIcon className="size-4" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-2xl sm:text-3xl leading-none truncate">{nome || t.perfil.semNome}</p>
              <p className="mt-1.5 truncate text-white/75">{email}</p>
              {erroUpload && <p className="mt-1 text-sm text-cc-orange">{erroUpload}</p>}
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-2 md:w-[420px]">
            {stats.map(stat => (
              <div key={stat.label} className="rounded-xl bg-black/25 p-3 text-center ring-1 ring-white/10">
                <dd className="font-display text-3xl text-cc-green">{stat.value}</dd>
                <dt className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-wider text-white/70">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </BrandBlock>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Nome */}
        <Card className="p-6 lg:col-span-2 h-fit">
          <SectionTitle as="h2" className="mb-5">{t.perfil.nome}</SectionTitle>
          <Label htmlFor="perfil-nome" className="sr-only">{t.perfil.nome}</Label>
          <div className="flex gap-2">
            <Input id="perfil-nome" value={nome} onChange={e => setNome(e.target.value)} placeholder={t.perfil.nomePlaceholder} autoComplete="name" className="flex-1" />
            <Button onClick={salvarNome} disabled={salvando || !nome.trim()} className="h-11 min-w-24">
              {salvando ? '...' : salvo ? <CheckIcon /> : t.comum.salvar}
            </Button>
          </div>
        </Card>

        {/* Progresso por trilha */}
        <Card className="p-6 lg:col-span-3">
          <SectionTitle as="h2" className="mb-5">
            {t.perfil.progresso} {t.perfil.nasTrilhas}
          </SectionTitle>
          <ul className="flex flex-col gap-4">
            {trilhas.map(tr => {
              const pct = tr.total > 0 ? Math.round((tr.done / tr.total) * 100) : 0
              return (
                <li key={tr.id}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      {tr.concluida && <CheckIcon className="size-4 text-cc-green" />}
                      {tr.titulo}
                      {tr.obrigatoria && <Badge variant="secondary">{t.perfil.nucleo}</Badge>}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tr.done}/{tr.total}
                    </span>
                  </div>
                  <Progress value={pct} />
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      {/* Certificados */}
      <section className="mt-10">
        <SectionTitle>{t.perfil.certificados}</SectionTitle>
        <p className="-mt-2 mb-5 text-sm text-muted-foreground">{t.perfil.certInfo}</p>

        {trilhasConcluidas.length === 0 ? (
          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-cc-line p-6">
            <AwardIcon className="size-8 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t.perfil.certVazio}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {trilhasConcluidas.map(tr => {
              const solicitacao = solicitacaoPorTrilha.get(tr.id)
              return (
                <div key={tr.id} className="flex items-center justify-between gap-4 rounded-2xl border border-cc-green/40 bg-cc-surface p-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cc-green/12 text-cc-green">
                      <AwardIcon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{tr.titulo}</p>
                      {solicitacao ? (
                        <p className={cn('text-sm', COR_STATUS[solicitacao.status] || 'text-muted-foreground')}>
                          {t.perfil.status[solicitacao.status] || solicitacao.status}
                        </p>
                      ) : (
                        <p className="text-sm text-cc-green">{t.perfil.trilhaConcluida}</p>
                      )}
                    </div>
                  </div>
                  {solicitacao ? (
                    <Badge variant="outline">{t.perfil.solicitado}</Badge>
                  ) : (
                    <Button variant="cta" size="sm" font="display" onClick={() => setCertTrilhaId(tr.id)}>
                      {t.perfil.solicitar}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </PageContainer>
  )
}
