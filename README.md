# Escola Classe Creator

Plataforma de formação gratuita para criadores de conteúdo.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase · Cloudflare Turnstile · Vercel
**Idiomas:** Português (padrão), English, Español

---

## Pré-requisitos

- Node.js 18.18+ (recomendado 20+)
- Conta no Supabase (free tier)
- Conta no Vercel (free tier)
- Conta na Cloudflare (Turnstile é gratuito)
- Domínio classecreator.com com acesso ao DNS

---

## 1. Supabase — configurar o banco

1. Crie um projeto em app.supabase.com
2. Vá em SQL Editor e cole todo o conteúdo de `supabase/schema.sql`
3. Execute — isso cria tabelas, RLS, triggers e seed de conteúdo
4. Vá em Settings → API e copie:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### URLs de redirecionamento (obrigatório com os idiomas)
Authentication → URL Configuration → **Redirect URLs**, adicione:

```
https://escola.classecreator.com/**
http://localhost:3000/**
```

Os links de recuperação de senha agora apontam para `/{idioma}/redefinir-senha`
e o login com Google volta por `/auth/callback?next=/{idioma}/dashboard`.

### Storage para PDFs
1. Storage → New bucket → nome: `pdfs` → marque Public
2. Faça upload dos PDFs de cada aula
3. Cole a URL pública na coluna `pdf_url` da tabela `aulas`

### YouTube (vídeos não-listados)
1. Suba cada aula como Não-listado
2. Copie só o ID do vídeo (ex: `dQw4w9WgXcQ`)
3. Cole na coluna `youtube_id` da tabela `aulas`

---

## 2. Cloudflare Turnstile (anti-bot)

O widget aparece em **login, cadastro e recuperação de senha**. A validação do token é feita
pelo próprio Supabase Auth, então bots não conseguem criar conta chamando a API direto.

1. Cloudflare → Turnstile → adicione um site (ou reutilize o widget do Raio-X) e inclua os
   domínios `escola.classecreator.com` e `localhost`.
2. Copie a **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
3. Supabase → Authentication → **Attack Protection** → Enable Captcha protection →
   provedor **Turnstile** → cole a **Secret Key**.

> Ordem importa: publique o front com a site key **antes** de ligar o captcha no Supabase.
> Com o captcha ligado e sem o widget, login e cadastro por e-mail falham.
> Sem `NEXT_PUBLIC_TURNSTILE_SITE_KEY` o widget não é renderizado (útil em dev).

---

## 3. Desenvolvimento local

```bash
npm install
cp .env.example .env.local   # preencha com suas chaves
npm run dev
```

Acesse: http://localhost:3000 (redireciona para `/pt`, `/en` ou `/es` conforme o navegador).

Checagens antes de subir:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

---

## 4. Deploy na Vercel

Conecte o repositório GitHub no painel da Vercel (ou `npx vercel`).

Variáveis de ambiente (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_TURNSTILE_SITE_KEY
```

### Subdomínio escola.classecreator.com

No DNS do seu provedor:

```
Tipo:  CNAME
Nome:  escola
Valor: cname.vercel-dns.com
```

Na Vercel: Settings → Domains → adicione `escola.classecreator.com`.

---

## 5. Idiomas (i18n)

- Todas as rotas vivem em `app/[lang]/` → `/pt/dashboard`, `/en/dashboard`, `/es/dashboard`.
- O `middleware.ts` redireciona URLs sem idioma (inclusive links antigos, ex. `/dashboard`)
  usando, nesta ordem: cookie `NEXT_LOCALE` (escolha do usuário) → `Accept-Language` → `pt`.
- O seletor de idioma fica no rodapé do menu lateral, na tela de login e no Perfil (mobile).
- Textos da interface: `i18n/dictionaries/pt.ts` (referência), `en.ts`, `es.ts`.
  Para adicionar um texto, crie a chave no `pt.ts` — o TypeScript aponta onde falta traduzir.
- **Conteúdo do banco** (títulos de trilhas/aulas, quiz, mural) continua em português.
  Traduzir esse conteúdo exige colunas por idioma no Supabase — fica como próximo passo.
- Termos e Privacidade em EN/ES exibem aviso de que a versão em português prevalece.

---

## 6. Gerenciar conteúdo

Tudo via painel Supabase → Table Editor.

| Ação | Tabela | Colunas |
|---|---|---|
| Adicionar aula | `aulas` | id, titulo, youtube_id, pdf_url, ordem |
| Adicionar à trilha | `trilha_aulas` | trilha_id, aula_id, ordem, compartilhada |
| Adicionar quiz | `quiz_perguntas` | aula_id, pergunta, opcoes (JSON), resposta_correta |
| Nova trilha | `trilhas` | id, titulo, descricao, obrigatoria, ordem |

---

## Estrutura do projeto

```
escola-classe-creator/
├── app/
│   ├── [lang]/                layout raiz por idioma (html lang, metadata, I18nProvider)
│   │   ├── login/             login, cadastro, esqueci a senha (+ Turnstile)
│   │   ├── dashboard/         dashboard do aluno + onboarding
│   │   ├── trilhas/           lista de trilhas
│   │   ├── trilha/[id]/       aulas da trilha
│   │   ├── aula/[id]/         vídeo → PDF → quiz, comentários (actions.ts = Server Actions)
│   │   ├── perfil/            perfil e certificados (actions.ts = Server Actions)
│   │   ├── sobre/ termos/ privacidade/ redefinir-senha/
│   │   └── [...rest]/         404 localizado
│   ├── auth/callback/         troca do código OAuth (fora do [lang])
│   └── globals.css            Tailwind v4 + tokens shadcn com a paleta Classe Creator
├── components/
│   ├── ui/                    componentes shadcn/ui
│   ├── layout/                AppShell, Sidebar, TrilhaSidebar
│   ├── auth/                  TurnstileField
│   └── LanguageSwitcher.tsx
├── i18n/                      config, dicionários, provider e helpers
├── lib/supabase/              client.ts, server.ts, middleware.ts
├── lib/auth.ts                requireUser() para páginas protegidas
├── middleware.ts              idioma + refresh da sessão Supabase
├── types/                     tipos TypeScript
└── supabase/schema.sql        schema base
```

---

## Custo mensal estimado

| Serviço | Custo |
|---|---|
| Supabase free | R$ 0 (500MB, 50k usuários) |
| Vercel free | R$ 0 (100GB bandwidth) |
| Cloudflare Turnstile | R$ 0 |
| YouTube | R$ 0 (vídeos não-listados) |
| Subdomínio | R$ 0 (usa domínio existente) |
| **Total** | **R$ 0/mês** |

Quando crescer — Supabase Pro: ~R$130 | Vercel Pro: ~R$120

---

## Próximos passos sugeridos

- Traduzir conteúdo do banco (colunas `titulo_en`, `titulo_es`... ou tabela de traduções)
- Painel admin para gerenciar conteúdo sem acessar o Supabase
- E-mail de boas-vindas automático (Supabase + Resend)
- Certificado de conclusão por trilha em PDF
- Notificação quando instrutor responde comentário
- Analytics de progresso da turma
