-- À exécuter une fois dans l'éditeur SQL de votre projet Supabase
-- (Supabase Dashboard > SQL Editor > New query)

create table if not exists shares (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null,
  created_at timestamptz not null default now()
);

-- Active la sécurité au niveau des lignes
alter table shares enable row level security;

-- Tout le monde (clé anonyme) peut créer un partage
create policy "Anyone can insert a share"
on shares for insert
to anon
with check (true);

-- Tout le monde peut lire un partage s'il connaît son id (lien type "pastebin")
create policy "Anyone can read a share by id"
on shares for select
to anon
using (true);

-- Optionnel : pour éviter d'accumuler les partages indéfiniment, vous pouvez
-- planifier une suppression des lignes de plus de 30 jours, par exemple via
-- une Edge Function / cron Supabase :
--
-- delete from shares where created_at < now() - interval '30 days';
