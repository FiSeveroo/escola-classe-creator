'use client'

import { useState } from 'react'

export default function SobreClient() {
  const [pixCopiado, setPixCopiado] = useState(false)

  const pixEmail = 'filipe.leal.severo@gmail.com'

  function copiarPix() {
    navigator.clipboard.writeText(pixEmail)
    setPixCopiado(true)
    setTimeout(() => setPixCopiado(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--cc-muted)' }}>O PROJETO</p>
        <h1 className="font-display text-3xl tracking-widest" style={{ color: 'var(--cc-white)' }}>SOBRE</h1>
      </div>

      {/* Missão */}
      <div className="rounded-xl p-6 border mb-4" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-green)' }}>
        <p className="font-display text-xl tracking-widest mb-3" style={{ color: 'var(--cc-green)' }}>
          CONHECIMENTO SEM PEDÁGIO
        </p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--cc-muted)' }}>
          A Escola Classe Creator existe porque acreditamos que entender o jogo das plataformas digitais
          não pode ser privilégio de quem pode pagar. Criadores, editores, designers e gestores de comunidade
          merecem acesso à mesma profundidade de análise que pesquisadores e grandes agências têm.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--cc-muted)' }}>
          Tudo aqui é gratuito — os vídeos, os materiais, os quizzes, os certificados.
          Sempre foi, sempre será.
        </p>
      </div>

      {/* Filipe */}
      <div className="rounded-xl p-6 border mb-4" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--cc-purple)' }}>QUEM ESTÁ POR TRÁS</p>
        <div className="flex items-start gap-4 mb-4">
          <img
            src="/filipe-severo.png"
            alt="Filipe Severo"
            className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            style={{ border: '2px solid var(--cc-purple)' }}
          />
          <div>
            <h2 className="font-display text-xl tracking-widest mb-1" style={{ color: 'var(--cc-white)' }}>
              FILIPE SEVERO
            </h2>
            <p className="font-mono text-xs tracking-widest" style={{ color: 'var(--cc-purple)' }}>
              Pesquisador · Estrategista de Conteúdo · Criador
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--cc-muted)' }}>
          Sou Filipe Severo — pesquisador, estrategista de conteúdo e criador há mais de 10 anos.
          Estudei plataformas digitais no mestrado e aprendi uma coisa que ninguém te conta: o jogo é mais
          complexo do que parece, e quem não entende as regras trabalha para quem entende. Criei a Escola
          Classe Creator porque acredito que esse conhecimento não pode ter pedágio.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'YouTube', url: 'https://www.youtube.com/@FilipeSevero', icon: '▶' },
            { label: 'Instagram', url: 'https://www.instagram.com/severo_filipe/', icon: '◉' },
          ].map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              style={{ background: 'var(--cc-gray2)', color: 'var(--cc-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--cc-white)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--cc-muted)' }}
            >
              {link.icon} {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Classe Creator */}
      <div className="rounded-xl p-6 border mb-4" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--cc-orange)' }}>O MOVIMENTO</p>
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/classe-creator-logo.png"
            alt="Classe Creator"
            className="h-12 object-contain"
          />
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--cc-muted)' }}>
          A Classe Creator é um movimento que reúne criadores, editores, roteiristas, designers e gestores
          de comunidade que querem trabalhar com liberdade e entender o sistema por dentro. Não é só um curso —
          é um espaço de pesquisa, análise crítica e articulação coletiva.
        </p>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--cc-muted)' }}>
          A revolução não cabe no feed.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: 'Site', url: 'https://classecreator.com', icon: '⬡' },
            { label: 'Instagram', url: 'https://www.instagram.com/classecreator/', icon: '◉' },
            { label: 'YouTube', url: 'https://www.youtube.com/@ClasseCreator', icon: '▶' },
          ].map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              style={{ background: 'var(--cc-gray2)', color: 'var(--cc-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--cc-white)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--cc-muted)' }}
            >
              {link.icon} {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Raio-X */}
      <div className="rounded-xl p-6 border mb-4" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--cc-orange)' }}>OBSERVATÓRIO</p>
        <h3 className="font-display text-xl tracking-widest mb-2" style={{ color: 'var(--cc-white)' }}>
          RAIO-X CLASSE CREATOR
        </h3>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--cc-muted)' }}>
          Ferramenta de auditoria algorítmica e pesquisa acadêmica do trabalho plataformizado no YouTube.
          Classifica artefatos segundo uma tipologia dupla — quem produz × que gênero de trabalho é produzido —
          ancorada em pesquisa acadêmica e operacionalizada por inteligência artificial.
        </p>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--cc-muted)' }}>
          Mais do que um utilitário de análise, o Raio-X é uma proposta metodológica: tratar o YouTube
          não como vitrine de "criadores independentes", mas como regime de produção plataformizada.
          <span style={{ color: 'var(--cc-white)', fontStyle: 'italic' }}> "Criar é trabalho."</span>
        </p>
        <a
          href="http://raiox.classecreator.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-sm tracking-widest px-4 py-2 rounded-lg inline-block transition-colors"
          style={{ background: 'var(--cc-orange)', color: '#fff' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          ACESSAR O RAIO-X →
        </a>
      </div>

      {/* Doação */}
      <div className="rounded-xl p-6 border" style={{ background: 'var(--cc-gray)', borderColor: 'var(--cc-gray2)' }}>
        <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--cc-green)' }}>APOIE O PROJETO</p>
        <h3 className="font-display text-xl tracking-widest mb-3" style={{ color: 'var(--cc-white)' }}>
          SE PUDER, AJUDE
        </h3>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--cc-muted)' }}>
          Manter a plataforma tem custo — servidores, domínio, tempo de desenvolvimento.
          Se este conteúdo te ajudou e você quiser contribuir, qualquer valor é bem-vindo.
          Mas nunca faça nada além das suas possibilidades. O conteúdo continuará gratuito independente disso.
        </p>

        {/* QR Code + PIX */}
        <div className="rounded-xl p-5 text-center mb-4" style={{ background: 'var(--cc-bg)' }}>
          <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--cc-muted)' }}>
            PIX — ESCANEIE OU COPIE A CHAVE
          </p>

          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-xl" style={{ background: '#fff', display: 'inline-block' }}>
              <img src="/pix-qrcode.png" alt="QR Code PIX" width={160} height={160} />
            </div>
          </div>

          {/* Chave PIX copiável */}
          <div
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors mx-auto"
            style={{ borderColor: 'var(--cc-gray3)', background: 'var(--cc-gray)', maxWidth: '100%' }}
            onClick={copiarPix}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cc-green)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--cc-gray3)'}
          >
            <span className="font-mono text-sm" style={{ color: 'var(--cc-white)', wordBreak: 'break-all', flex: 1, textAlign: 'center' }}>{pixEmail}</span>
            <span className="font-mono text-xs flex-shrink-0" style={{ color: pixCopiado ? 'var(--cc-green)' : 'var(--cc-muted)' }}>
              {pixCopiado ? '✓' : '⎘'}
            </span>
          </div>
          <p className="font-mono text-xs mt-2" style={{ color: 'var(--cc-muted)' }}>
            Clique para copiar a chave PIX
          </p>
        </div>

        <p className="text-xs text-center" style={{ color: 'var(--cc-muted)' }}>
          Obrigado por fazer parte dessa corrente.
        </p>
      </div>

      {/* Links legais */}
      <div className="flex gap-4 justify-center mt-6">
        {[
          { label: 'Termos de Uso', url: '/termos' },
          { label: 'Política de Privacidade', url: '/privacidade' },
        ].map(link => (
          <a
            key={link.label}
            href={link.url}
            className="font-mono text-xs"
            style={{ color: 'var(--cc-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--cc-white)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--cc-muted)'}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
