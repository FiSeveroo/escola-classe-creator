'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/I18nProvider'
import { cn, iniciais } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
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
  em_analise: 'text-cc-orange',
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
            <DialogTitle>{t.perfil.modal.titulo}</DialogTitle>
            <DialogDescription>{t.perfil.modal.prazo}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-1.5">
            <Label htmlFor="cert-nome">{t.perfil.modal.nomeCompleto}</Label>
            <Input
              id="cert-nome"
              value={nomeCompleto}
              onChange={e => setNomeCompleto(e.target.value)}
              placeholder={t.perfil.modal.nomeCompletoPlaceholder}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="cert-email">{t.perfil.modal.emailReceber}</Label>
            <Input
              id="cert-email"
              type="email"
              value={emailCert}
              onChange={e => setEmailCert(e.target.value)}
              placeholder={t.login.emailPlaceholder}
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox id="cert-urgente" checked={urgente} onCheckedChange={v => setUrgente(v === true)} className="mt-0.5" />
            <label htmlFor="cert-urgente" className="cursor-pointer">
              <p className="text-sm font-medium">{t.perfil.modal.urgente}</p>
              <p className="text-sm text-muted-foreground">{t.perfil.modal.urgenteDescricao}</p>
            </label>
          </div>

          {urgente && (
            <div className="grid gap-1.5">
              <Label htmlFor="cert-motivo">{t.perfil.modal.motivo}</Label>
              <Textarea
                id="cert-motivo"
                value={motivoUrgencia}
                onChange={e => setMotivoUrgencia(e.target.value)}
                placeholder={t.perfil.modal.motivoPlaceholder}
                rows={2}
                className="resize-none"
              />
            </div>
          )}

          {erroCert && (
            <p role="alert" className="font-mono text-xs text-cc-orange">
              {erroCert}
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" font="mono" className="flex-1" onClick={fecharModal}>
              {t.comum.cancelar}
            </Button>
            <Button font="display" className="flex-1" onClick={enviarCertificado} disabled={!podeEnviarCert}>
              {enviandoCert ? '...' : t.perfil.solicitar}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-start justify-between gap-4">
        <PageHeader eyebrow={t.perfil.minhaConta} title={t.perfil.titulo} />
        {/* No mobile o sidebar vira barra inferior, então o seletor de idioma fica aqui também. */}
        <LanguageSwitcher className="md:hidden" />
      </div>

      {/* Avatar + nome */}
      <Card className="mb-4">
        <CardContent>
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <Avatar className="size-16">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={nome} />}
                <AvatarFallback className="text-2xl">{iniciais(nome, email[0]?.toUpperCase())}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileRef.current?.click()}
                aria-label={t.perfil.trocarFoto}
                className="absolute -bottom-1 -right-1 size-6 rounded-full flex items-center justify-center text-xs border-2 bg-cc-green text-cc-bg border-card"
              >
                {uploadando ? '…' : '+'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl tracking-widest truncate">{nome || t.perfil.semNome}</p>
              <p className="font-mono text-xs mt-1 text-muted-foreground truncate">{email}</p>
              {erroUpload && <p className="font-mono text-xs mt-1 text-cc-orange">{erroUpload}</p>}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="perfil-nome">{t.perfil.nome}</Label>
            <div className="flex gap-2">
              <Input
                id="perfil-nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder={t.perfil.nomePlaceholder}
                autoComplete="name"
                className="flex-1"
              />
              <Button
                variant={salvo ? 'default' : 'secondary'}
                font="display"
                className="text-sm px-4"
                onClick={salvarNome}
                disabled={salvando || !nome.trim()}
              >
                {salvando ? '...' : salvo ? '✓' : t.comum.salvar}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {stats.map(stat => (
          <Card key={stat.label} className="p-4 text-center">
            <p className="font-display text-3xl mb-1 text-cc-green">{stat.value}</p>
            <p className="font-mono leading-tight text-muted-foreground text-[9px] tracking-[1px]">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Progresso por trilha */}
      <Card className="mb-4">
        <CardContent>
          <h2 className="font-display text-lg tracking-widest mb-4">
            {t.perfil.progresso} <span className="text-cc-green">{t.perfil.nasTrilhas}</span>
          </h2>
          <div className="flex flex-col gap-3">
            {trilhas.map(tr => {
              const pct = tr.total > 0 ? Math.round((tr.done / tr.total) * 100) : 0
              return (
                <div key={tr.id}>
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <span className={cn('text-base', tr.concluida && 'text-cc-green')}>
                      {tr.concluida ? '✓ ' : ''}
                      {tr.titulo}
                      {tr.obrigatoria && <span className="font-mono ml-2 text-cc-purple text-[9px]">{t.perfil.nucleo}</span>}
                    </span>
                    <span className={cn('font-mono text-xs', tr.concluida ? 'text-cc-green' : 'text-muted-foreground')}>
                      {tr.done}/{tr.total}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className="bg-cc-gray2"
                    indicatorClassName={tr.concluida ? 'bg-cc-green' : tr.obrigatoria ? 'bg-cc-purple' : 'bg-cc-orange'}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Certificados */}
      <Card>
        <CardContent>
          <h2 className="font-display text-lg tracking-widest mb-1">{t.perfil.certificados}</h2>
          <p className="text-xs mb-4 text-muted-foreground">{t.perfil.certInfo}</p>

          {trilhasConcluidas.length === 0 ? (
            <p className="font-mono text-xs text-center py-6 text-muted-foreground">{t.perfil.certVazio}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {trilhasConcluidas.map(tr => {
                const solicitacao = solicitacaoPorTrilha.get(tr.id)
                return (
                  <div key={tr.id} className="flex items-center justify-between gap-3 p-4 rounded-lg border border-[#1a3a28] bg-background">
                    <div>
                      <p className="text-sm font-medium">{tr.titulo}</p>
                      {solicitacao ? (
                        <p className={cn('font-mono text-xs mt-0.5', COR_STATUS[solicitacao.status] || 'text-muted-foreground')}>
                          {t.perfil.status[solicitacao.status] || solicitacao.status}
                        </p>
                      ) : (
                        <p className="font-mono text-xs mt-0.5 text-cc-green">✓ {t.perfil.trilhaConcluida}</p>
                      )}
                    </div>
                    {solicitacao ? (
                      <span className="font-mono text-xs px-3 py-1.5 rounded border border-cc-gray3 text-muted-foreground">
                        {t.perfil.solicitado}
                      </span>
                    ) : (
                      <Button font="display" size="sm" className="text-sm px-4" onClick={() => setCertTrilhaId(tr.id)}>
                        {t.perfil.solicitar}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
