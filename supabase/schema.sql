-- ============================================================
-- ESCOLA CLASSE CREATOR — Schema Supabase
-- Execute no SQL Editor do painel Supabase
-- ============================================================

-- EXTENSÕES
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABELAS DE CONTEÚDO (gerenciadas por você no painel)
-- ============================================================

create table public.trilhas (
  id          text primary key,               -- ex: 'nucleo', 'yt', 'tt'
  titulo      text not null,
  descricao   text,
  obrigatoria boolean default false,          -- true = núcleo
  ordem       int default 0,
  ativa       boolean default true,
  cor         text default '#7B2FFF',
  criado_em   timestamptz default now()
);

create table public.aulas (
  id          text primary key,               -- ex: 'a1', 'a2'
  titulo      text not null,
  descricao   text,
  youtube_id  text,                           -- ID do vídeo YouTube (não-listado)
  pdf_url     text,                           -- URL do PDF no Supabase Storage
  ordem       int default 0,
  ativa       boolean default true,
  criado_em   timestamptz default now()
);

create table public.trilha_aulas (
  id          uuid primary key default uuid_generate_v4(),
  trilha_id   text references public.trilhas(id) on delete cascade,
  aula_id     text references public.aulas(id) on delete cascade,
  ordem       int default 0,
  compartilhada boolean default false,        -- true = aparece em múltiplas trilhas
  unique(trilha_id, aula_id)
);

create table public.quiz_perguntas (
  id          uuid primary key default uuid_generate_v4(),
  aula_id     text references public.aulas(id) on delete cascade,
  pergunta    text not null,
  opcoes      jsonb not null,                 -- ["opcao1","opcao2","opcao3","opcao4"]
  resposta_correta int not null,              -- índice da opção correta (0-based)
  ordem       int default 0
);

-- ============================================================
-- TABELAS DE USUÁRIOS E PROGRESSO
-- ============================================================

create table public.perfis (
  id          uuid primary key references auth.users(id) on delete cascade,
  nome        text,
  avatar_url  text,
  criado_em   timestamptz default now()
);

create table public.progresso_aulas (
  id              uuid primary key default uuid_generate_v4(),
  usuario_id      uuid references public.perfis(id) on delete cascade,
  aula_id         text references public.aulas(id) on delete cascade,
  video_assistido boolean default false,
  pdf_baixado     boolean default false,
  quiz_aprovado   boolean default false,
  concluida       boolean default false,      -- true quando os 3 acima são true
  concluida_em    timestamptz,
  atualizado_em   timestamptz default now(),
  unique(usuario_id, aula_id)
);

-- ============================================================
-- COMENTÁRIOS
-- ============================================================

create table public.comentarios (
  id            uuid primary key default uuid_generate_v4(),
  aula_id       text references public.aulas(id) on delete cascade,
  usuario_id    uuid references public.perfis(id) on delete cascade,
  texto         text not null,
  pai_id        uuid references public.comentarios(id) on delete cascade,  -- respostas aninhadas
  likes         int default 0,
  criado_em     timestamptz default now()
);

create table public.comentario_likes (
  usuario_id    uuid references public.perfis(id) on delete cascade,
  comentario_id uuid references public.comentarios(id) on delete cascade,
  primary key(usuario_id, comentario_id)
);

-- ============================================================
-- SEED — Conteúdo inicial
-- ============================================================

insert into public.trilhas (id, titulo, descricao, obrigatoria, ordem, cor) values
  ('nucleo', 'Entenda o Jogo', 'A base crítica e estratégica que todo criador precisa antes de qualquer trilha.', true, 0, '#7B2FFF'),
  ('yt', 'Criador no YouTube', 'Do algoritmo aos formatos que retêm audiência.', false, 1, '#FF5C1A'),
  ('tt', 'Criador no TikTok', 'Lógica de distribuição e criação para o feed vertical.', false, 2, '#FF5C1A'),
  ('ds', 'Designer de Conteúdo', 'Fundamentos visuais aplicados à criação digital. Com Igor.', false, 3, '#FF5C1A'),
  ('ed', 'Editor de Vídeo', 'Em breve — trilha dedicada a editores.', false, 4, '#FF5C1A');

insert into public.aulas (id, titulo, ordem) values
  ('a1', 'A lógica das plataformas', 1),
  ('a2', 'O que é um algoritmo', 2),
  ('a3', 'Atenção como recurso escasso', 3),
  ('a4', 'Trabalho plataformizado', 4),
  ('a5', 'Interesse por trás das decisões de produto', 5),
  ('a6', 'Algoritmo do YouTube', 6),
  ('a7', 'Formatos que performam no YouTube', 7),
  ('a8', 'Algoritmo do TikTok', 8),
  ('a9', 'Criação para nicho vs. massa no TikTok', 9),
  ('a10', 'Fundamentos de design para criadores', 10),
  ('a11', 'Identidade visual e consistência', 11);

insert into public.trilha_aulas (trilha_id, aula_id, ordem, compartilhada) values
  ('nucleo','a1',1,false), ('nucleo','a2',2,false), ('nucleo','a3',3,false),
  ('nucleo','a4',4,false), ('nucleo','a5',5,false),
  ('yt','a2',1,true), ('yt','a6',2,false), ('yt','a7',3,false),
  ('tt','a2',1,true), ('tt','a8',2,false), ('tt','a9',3,false),
  ('ds','a2',1,true), ('ds','a10',2,false), ('ds','a11',3,false);

insert into public.quiz_perguntas (aula_id, pergunta, opcoes, resposta_correta) values
  ('a1','As plataformas digitais são projetadas principalmente para:','["Conectar pessoas de forma neutra","Maximizar o tempo de permanência e gerar dados monetizáveis","Dar visibilidade a criadores de qualidade","Distribuir conteúdo de forma democrática"]',1),
  ('a2','Um algoritmo de plataforma toma decisões com base em:','["Qualidade artística do conteúdo","Preferências declaradas pelo usuário","Comportamento e dados de engajamento coletados","Tempo de existência do perfil"]',2),
  ('a3','A economia da atenção pressupõe que:','["Atenção é infinita se o conteúdo for bom","A atenção humana é limitada e disputada por múltiplos atores","Plataformas distribuem atenção de forma equilibrada","Quem posta mais ganha mais atenção"]',1),
  ('a4','O trabalho plataformizado se caracteriza por:','["Estabilidade e benefícios trabalhistas garantidos","Autonomia total sem nenhuma dependência","Dependência das regras e interesses da plataforma hospedeira","Remuneração direta pela plataforma"]',2),
  ('a5','Quando uma plataforma lança uma nova feature, a pergunta estratégica é:','["Essa feature é esteticamente bonita?","Quantos criadores vão usar?","Isso gera receita para a plataforma?","A feature foi pedida pelos usuários?"]',2),
  ('a6','O YouTube prioriza conteúdo que:','["Tem alta qualidade de produção","Gera tempo de sessão longo na plataforma","Usa as palavras-chave certas no título","É publicado com alta frequência"]',1),
  ('a7','No YouTube, thumbnails e títulos servem para:','["Melhorar o SEO do Google","Converter impressões em cliques","Aumentar o tempo de vídeo","Agradar o algoritmo de shorts"]',1),
  ('a8','O TikTok se diferencia por distribuir conteúdo baseado em:','["Número de seguidores do criador","Histórico de engajamento do perfil","Comportamento de cada usuário individualmente","Frequência de publicação"]',2),
  ('a9','No TikTok, conteúdo de nicho tende a:','["Nunca viralizar","Alcançar audiência menor mas mais engajada","Ser penalizado pelo algoritmo","Funcionar apenas com muitos seguidores"]',1),
  ('a10','Hierarquia visual em um post serve para:','["Deixar o conteúdo mais bonito","Guiar o olhar do espectador para o elemento mais importante","Usar mais cores e fontes","Diferenciar do concorrente"]',1),
  ('a11','Consistência visual para um criador significa:','["Usar sempre as mesmas cores e fontes em todo conteúdo","Publicar no mesmo horário todos os dias","Ter um logotipo profissional","Usar templates prontos de outras marcas"]',0);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.trilhas enable row level security;
alter table public.aulas enable row level security;
alter table public.trilha_aulas enable row level security;
alter table public.quiz_perguntas enable row level security;
alter table public.perfis enable row level security;
alter table public.progresso_aulas enable row level security;
alter table public.comentarios enable row level security;
alter table public.comentario_likes enable row level security;

-- Conteúdo: leitura pública para usuários autenticados
create policy "Conteudo visivel para autenticados" on public.trilhas for select to authenticated using (true);
create policy "Conteudo visivel para autenticados" on public.aulas for select to authenticated using (true);
create policy "Conteudo visivel para autenticados" on public.trilha_aulas for select to authenticated using (true);
create policy "Conteudo visivel para autenticados" on public.quiz_perguntas for select to authenticated using (true);

-- Perfis
create policy "Perfil proprio" on public.perfis for select to authenticated using (id = auth.uid());
create policy "Criar perfil proprio" on public.perfis for insert to authenticated with check (id = auth.uid());
create policy "Atualizar perfil proprio" on public.perfis for update to authenticated using (id = auth.uid());

-- Progresso
create policy "Ver proprio progresso" on public.progresso_aulas for select to authenticated using (usuario_id = auth.uid());
create policy "Criar proprio progresso" on public.progresso_aulas for insert to authenticated with check (usuario_id = auth.uid());
create policy "Atualizar proprio progresso" on public.progresso_aulas for update to authenticated using (usuario_id = auth.uid());

-- Comentários
create policy "Ver comentarios" on public.comentarios for select to authenticated using (true);
create policy "Criar comentario" on public.comentarios for insert to authenticated with check (usuario_id = auth.uid());
create policy "Deletar proprio comentario" on public.comentarios for delete to authenticated using (usuario_id = auth.uid());

-- Likes
create policy "Ver likes" on public.comentario_likes for select to authenticated using (true);
create policy "Dar like" on public.comentario_likes for insert to authenticated with check (usuario_id = auth.uid());
create policy "Remover like" on public.comentario_likes for delete to authenticated using (usuario_id = auth.uid());

-- ============================================================
-- TRIGGER: cria perfil automaticamente ao cadastrar
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- FUNCTION: atualiza likes de comentário atomicamente
-- ============================================================

create or replace function toggle_like(p_comentario_id uuid, p_usuario_id uuid)
returns int language plpgsql security definer as $$
declare
  v_likes int;
begin
  if exists (select 1 from public.comentario_likes where comentario_id = p_comentario_id and usuario_id = p_usuario_id) then
    delete from public.comentario_likes where comentario_id = p_comentario_id and usuario_id = p_usuario_id;
    update public.comentarios set likes = likes - 1 where id = p_comentario_id returning likes into v_likes;
  else
    insert into public.comentario_likes (comentario_id, usuario_id) values (p_comentario_id, p_usuario_id);
    update public.comentarios set likes = likes + 1 where id = p_comentario_id returning likes into v_likes;
  end if;
  return v_likes;
end;
$$;
