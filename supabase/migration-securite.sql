-- À exécuter dans l'éditeur SQL de votre projet Supabase si la table
-- "shares" existe déjà (installation faite avant l'ajout de l'expiration
-- et de la route serveur /api/share). Sans effet destructif sur les
-- partages déjà stockés.

-- 1. Ajoute la colonne d'expiration (les lignes existantes reçoivent une
--    expiration à 7 jours à partir de maintenant)
alter table shares
  add column if not exists expires_at timestamptz not null default (now() + interval '7 days');

-- 2. Retire l'ancienne policy qui autorisait n'importe qui à insérer
--    directement avec la clé anonyme
drop policy if exists "Anyone can insert a share" on shares;

-- 3. Remplace l'ancienne policy de lecture par une version qui exclut les
--    partages expirés
drop policy if exists "Anyone can read a share by id" on shares;

create policy "Anyone can read a non-expired share by id"
on shares for select
to anon
using (expires_at > now());
