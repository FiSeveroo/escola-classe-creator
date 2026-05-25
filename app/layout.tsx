import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Escola Classe Creator — Formação gratuita para criadores',
  description: 'Entenda o jogo das plataformas digitais. Formação gratuita para criadores de conteúdo, editores, designers e gestores de comunidade.',
  keywords: ['criadores de conteúdo', 'algoritmo', 'plataformas digitais', 'formação gratuita', 'classe creator', 'influência digital'],
  authors: [{ name: 'Filipe Severo', url: 'https://classecreator.com' }],
  creator: 'Classe Creator',
  publisher: 'Classe Creator',
  metadataBase: new URL('https://escola.classecreator.com'),
  openGraph: {
    title: 'Escola Classe Creator — Formação gratuita para criadores',
    description: 'Entenda o jogo das plataformas digitais. Formação gratuita para criadores de conteúdo.',
    url: 'https://escola.classecreator.com',
    siteName: 'Escola Classe Creator',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Escola Classe Creator',
    description: 'Formação gratuita para criadores de conteúdo. A revolução não cabe no feed.',
    creator: '@classecreator',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
