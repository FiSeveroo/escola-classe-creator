import { Metadata } from 'next'
import Sidebar from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SobreClient from './SobreClient'

export const metadata: Metadata = {
  title: 'Sobre — Escola Classe Creator',
}

export const dynamic = 'force-dynamic'

export default async function SobrePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase.from('perfis').select('*').eq('id', user.id).single()

  return (
    <div className="flex min-h-screen" style={{ background: 'transparent' }}>
      <Sidebar perfil={perfil} />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <SobreClient />
      </div>
    </div>
  )
}
