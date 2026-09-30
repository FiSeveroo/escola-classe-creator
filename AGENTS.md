# Escola Classe Creator — notas para agentes

Stack: **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui + Supabase**.
Não há docs embutidas em `node_modules/next/dist/docs` nesta versão; siga as convenções do Next 15
(`params`/`searchParams`/`cookies()` são assíncronos, arquivo de middleware é `middleware.ts`).

- Rotas ficam em `app/[lang]/...` (pt, en, es). Links internos sempre com prefixo de idioma:
  `href('/dashboard')` do `useI18n()` no cliente, `localePath(lang, '/dashboard')` no servidor.
- Todo texto de interface vem dos dicionários em `i18n/dictionaries/`. `pt.ts` é a referência;
  `en.ts` e `es.ts` são tipados com `Dictionary` e o `tsc` acusa chave faltando.
- Componentes shadcn/ui ficam em `components/ui/` (tokens da marca em `app/globals.css`).
  A CLI do shadcn pode ser usada normalmente: `npx shadcn@latest add <componente>`.
- Mutações passam por Server Actions (`actions.ts` ao lado da rota) com o client do servidor.
- Antes de commitar: `npx tsc --noEmit && npm run lint && npm run build`.
