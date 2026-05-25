import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Escola Classe Creator',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen py-12 px-6" style={{ background: 'var(--cc-bg)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <a href="/dashboard" className="font-mono text-xs tracking-widest" style={{ color: 'var(--cc-muted)' }}>← VOLTAR</a>
          <h1 className="font-display text-4xl tracking-widest mt-4 mb-2" style={{ color: 'var(--cc-white)' }}>POLÍTICA DE PRIVACIDADE</h1>
          <p className="font-mono text-xs" style={{ color: 'var(--cc-muted)' }}>Última atualização: maio de 2026</p>
        </div>

        <div style={{ color: 'var(--cc-muted)', lineHeight: 1.8 }}>
          {[
            {
              titulo: '1. Quem somos',
              texto: 'A Escola Classe Creator é uma plataforma de formação gratuita mantida por Filipe Severo, no âmbito do projeto Classe Creator. Esta política descreve como coletamos, usamos e protegemos seus dados, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).'
            },
            {
              titulo: '2. Dados que coletamos',
              texto: 'Coletamos os seguintes dados ao criar sua conta e utilizar a plataforma: nome, endereço de e-mail, foto de perfil (opcional), progresso nas aulas e trilhas, comentários postados nas aulas e dados de solicitação de certificado (nome completo e e-mail para envio).'
            },
            {
              titulo: '3. Como usamos seus dados',
              texto: 'Seus dados são usados exclusivamente para: permitir acesso à plataforma, salvar seu progresso de aprendizado, personalizar a experiência (nome e foto), emitir certificados de conclusão quando solicitado e comunicar atualizações importantes da plataforma.'
            },
            {
              titulo: '4. Compartilhamento de dados',
              texto: 'Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais. Seus dados são armazenados no Supabase (infraestrutura de banco de dados) com servidores na região da América do Sul. O Supabase segue as melhores práticas de segurança e está em conformidade com regulamentações internacionais de proteção de dados.'
            },
            {
              titulo: '5. Seus direitos (LGPD)',
              texto: 'Você tem direito a: acessar seus dados, corrigir dados incorretos, solicitar a exclusão da sua conta e dados, portabilidade dos seus dados e revogar consentimento a qualquer momento. Para exercer qualquer desses direitos, entre em contato pelo site classecreator.com.'
            },
            {
              titulo: '6. Cookies e rastreamento',
              texto: 'Utilizamos cookies estritamente necessários para manter sua sessão autenticada. Não utilizamos cookies de rastreamento, publicidade ou análise de comportamento de terceiros.'
            },
            {
              titulo: '7. Retenção de dados',
              texto: 'Seus dados são mantidos enquanto sua conta estiver ativa. Ao solicitar a exclusão da conta, seus dados pessoais serão removidos em até 30 dias, exceto onde a retenção for exigida por lei.'
            },
            {
              titulo: '8. Segurança',
              texto: 'Adotamos medidas técnicas para proteger seus dados, incluindo autenticação segura, controle de acesso por Row Level Security (RLS) e armazenamento criptografado de senhas.'
            },
            {
              titulo: '9. Contato',
              texto: 'Para questões sobre privacidade e proteção de dados: acesse classecreator.com e entre em contato pela página de contato.'
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
