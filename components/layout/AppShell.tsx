import Sidebar from './Sidebar'
import type { Perfil } from '@/types'

/** Layout das páginas logadas: sidebar à esquerda, conteúdo e (opcional) coluna à direita. */
export function AppShell({
  perfil,
  children,
  aside,
}: {
  perfil: Perfil | null
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar perfil={perfil} />
      <div className="flex-1 flex min-w-0">
        <div className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0">{children}</div>
        {aside}
      </div>
    </div>
  )
}

/** Contêiner padrão do conteúdo das páginas. */
export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">{children}</div>
}

/** Cabeçalho padrão: rótulo mono pequeno + título display. */
export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-xs tracking-widest mb-1 text-muted-foreground">{eyebrow}</p>
      <h1 className="font-display text-3xl tracking-widest text-foreground">{title}</h1>
      {children}
    </div>
  )
}
