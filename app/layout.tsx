import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Escola — Classe Creator',
  description: 'Formação gratuita para criadores de conteúdo. Entenda o jogo das plataformas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
