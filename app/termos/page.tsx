import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso — Escola Classe Creator',
}

export default function TermosPage() {
  return (
    <div className="min-h-screen py-12 px-6" style={{ background: 'var(--cc-bg)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <a href="/dashboard" className="font-mono text-xs tracking-widest" style={{ color: 'var(--cc-muted)' }}>← VOLTAR</a>
          <h1 className="font-display text-4xl tracking-widest mt-4 mb-2" style={{ color: 'var(--cc-white)' }}>TERMOS DE USO</h1>
          <p className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>Última atualização: maio de 2026</p>
        </div>

        <div className="prose" style={{ color: 'var(--cc-muted)', lineHeight: 1.8 }}>
          {[
            {
              titulo: '1. Aceitação dos termos',
              texto: 'Ao acessar e utilizar a Escola Classe Creator, você concorda com estes Termos de Uso. Se não concordar com qualquer parte, não utilize a plataforma.'
            },
            {
              titulo: '2. Sobre a plataforma',
              texto: 'A Escola Classe Creator é uma plataforma de formação gratuita para criadores de conteúdo, desenvolvida e mantida por Filipe Severo no âmbito do projeto Classe Creator. O acesso é gratuito e não há cobrança de nenhum tipo para uso da plataforma.'
            },
            {
              titulo: '3. Cadastro e conta',
              texto: 'Para acessar o conteúdo, é necessário criar uma conta com e-mail e senha. Você é responsável pela segurança das suas credenciais. Não compartilhe sua senha com terceiros. Reservamo-nos o direito de encerrar contas que violem estes termos.'
            },
            {
              titulo: '4. Uso do conteúdo',
              texto: 'Todo o conteúdo disponível na plataforma — vídeos, PDFs, textos e materiais — é de uso pessoal e não comercial. É proibida a reprodução, distribuição ou comercialização do conteúdo sem autorização expressa.'
            },
            {
              titulo: '5. Comentários e interações',
              texto: 'Ao comentar nas aulas, você concorda em manter um ambiente respeitoso e construtivo. Comentários ofensivos, discriminatórios ou que violem direitos de terceiros poderão ser removidos e o usuário poderá ter sua conta suspensa.'
            },
            {
              titulo: '6. Certificados',
              texto: 'Os certificados emitidos pela Escola Classe Creator são documentos de conclusão de trilhas formativas. A emissão está sujeita à conclusão de todas as etapas da trilha e à análise pela equipe da Classe Creator. Atualmente, os certificados não possuem reconhecimento pelo MEC.'
            },
            {
              titulo: '7. Disponibilidade',
              texto: 'A plataforma é oferecida "como está". Não garantimos disponibilidade ininterrupta e não nos responsabilizamos por eventuais indisponibilidades técnicas.'
            },
            {
              titulo: '8. Alterações',
              texto: 'Podemos atualizar estes termos a qualquer momento. Alterações significativas serão comunicadas pelo mural de avisos da plataforma.'
            },
            {
              titulo: '9. Contato',
              texto: 'Dúvidas sobre estes termos: acesse classecreator.com e entre em contato pela página de contato.'
            },
          ].map(item => (
            <div key={item.titulo} className="mb-6">
              <h2 className="font-display text-lg tracking-wider mb-2" style={{ color: 'var(--cc-white)' }}>{item.titulo.toUpperCase()}</h2>
              <p className="text-sm leading-relaxed">{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
