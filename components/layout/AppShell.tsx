import Sidebar from './Sidebar'
import { SectionTitle } from '@/components/brand/Brand'
import type { Perfil } from '@/types'

/** Layout das páginas logadas: menu à esquerda, conteúdo e (opcional) coluna à direita. */
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
    <div className="md:flex min-h-screen">
      <Sidebar perfil={perfil} />
      <div className="flex-1 flex min-w-0">
        <main className="flex-1 min-w-0 pb-24 md:pb-0">{children}</main>
        {aside}
      </div>
    </div>
  )
}

/** Contêiner padrão do conteúdo das páginas. */
export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 ${className ?? ''}`}>{children}</div>
}

/** Cabeçalho de página: rótulo + título verde (Gunterz). */
export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-8">
      <SectionTitle as="h1" eyebrow={eyebrow} className="mb-0">
        {title}
      </SectionTitle>
      {children}
    </header>
  )
}
