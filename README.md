# Escola Classe Creator

Plataforma de formação gratuita para criadores de conteúdo.
Stack: **Next.js 15 + Supabase + Vercel**

---

## Pré-requisitos

- Node.js 18+
- Conta no Supabase (free tier)
- Conta no Vercel (free tier)
- Domínio classecreator.com com acesso ao DNS

---

## 1. Supabase — configurar o banco

1. Crie um projeto em app.supabase.com
2. Vá em SQL Editor e cole todo o conteúdo de supabase/schema.sql
3. Execute — isso cria tabelas, RLS, triggers e seed de conteúdo
4. Vá em Settings → API e copie:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - anon public key → NEXT_PUBLIC_SUPABASE_ANON_KEY

### Storage para PDFs
1. Storage → New bucket → nome: pdfs → marque Public
2. Faça upload dos PDFs de cada aula
3. Cole a URL pública na coluna pdf_url da tabela aulas

### YouTube (vídeos não-listados)
1. Suba cada aula como Não-listado
2. Copie só o ID do vídeo (ex: dQw4w9WgXcQ)
3. Cole na coluna youtube_id da tabela aulas

---

## 2. Desenvolvimento local

```bash
npm install
cp .env.local .env.local.bak   # já criado com placeholders
# edite .env.local com suas chaves reais
npm run dev
```

Acesse: http://localhost:3000

---

## 3. Deploy na Vercel

```bash
npm i -g vercel
vercel
```

Ou conecte o repositório GitHub no painel da Vercel.

Variáveis de ambiente na Vercel (Settings → Environment Variables):
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY

---

## 4. Subdomínio escola.classecreator.com

No DNS do seu provedor, adicione:
  Tipo:  CNAME
  Nome:  escola
  Valor: cname.vercel-dns.com

Na Vercel: Settings → Domains → adicione escola.classecreator.com

---

## 5. Gerenciar conteúdo

Tudo via painel Supabase → Table Editor.

Adicionar aula:      tabela aulas      → id, titulo, youtube_id, pdf_url, ordem
Adicionar à trilha:  tabela trilha_aulas → trilha_id, aula_id, ordem, compartilhada
Adicionar quiz:      tabela quiz_perguntas → aula_id, pergunta, opcoes (JSON), resposta_correta
Nova trilha:         tabela trilhas    → id, titulo, descricao, obrigatoria, ordem

---

## Estrutura do projeto

```
escola-classe-creator/
├── app/
│   ├── login/           login e cadastro
│   ├── dashboard/       dashboard do aluno
│   ├── trilha/[id]/     listagem de aulas
│   └── aula/[id]/       experiência completa
├── components/layout/   Navbar
├── lib/supabase/        client.ts + server.ts
├── types/               tipos TypeScript
├── supabase/            schema.sql completo
└── middleware.ts        proteção de rotas
```

---

## Custo mensal estimado

Supabase free:  R$ 0  (500MB, 50k usuários)
Vercel free:    R$ 0  (100GB bandwidth)
YouTube:        R$ 0  (vídeos não-listados)
Subdomínio:     R$ 0  (usa domínio existente)
TOTAL:          R$ 0/mês

Quando crescer — Supabase Pro: ~R$130 | Vercel Pro: ~R$120

---

## Próximos passos sugeridos

- Painel admin para gerenciar conteúdo sem acessar o Supabase
- E-mail de boas-vindas automático (Supabase + Resend)
- Certificado de conclusão por trilha em PDF
- Notificação quando instrutor responde comentário
- Analytics de progresso da turma
