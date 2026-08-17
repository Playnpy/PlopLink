-- À exécuter une fois dans l'éditeur SQL de votre projet Supabase
-- (Supabase Dashboard > SQL Editor > New query)
--
-- ⚠️ Si la table "shares" existe déjà chez vous (installation précédente),
-- utilisez plutôt supabase/migration-securite.sql pour mettre à jour votre
-- base sans perdre les données existantes.

create table if not exists shares (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days')
);

-- Active la sécurité au niveau des lignes
alter table shares enable row level security;

-- Aucune policy d'insertion pour "anon" : la création d'un partage passe
-- désormais uniquement par la route serveur app/api/share/route.ts, qui
-- utilise la clé service_role (laquelle contourne RLS et n'est jamais
-- exposée au navigateur). Ça évite que n'importe qui utilisant la clé
-- anonyme publique (ex. trouvée dans le code du site ou de l'extension)
-- puisse écrire directement dans la table.

-- Lecture publique, mais uniquement pour les partages non expirés
create policy "Anyone can read a non-expired share by id"
on shares for select
to anon
using (expires_at > now());

-- Recommandé : purger automatiquement les partages expirés avec pg_cron
-- (Database > Extensions > pg_cron dans le dashboard Supabase), par exemple :
--
-- select cron.schedule('purge-expired-shares', '0 3 * * *', $$
--   delete from shares where expires_at < now();
-- $$);
