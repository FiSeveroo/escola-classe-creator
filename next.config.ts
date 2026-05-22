import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // força todas as rotas a serem dinâmicas (necessário com Supabase SSR)
    // pages com cookies nunca podem ser estáticas
  },
}

export default nextConfig
