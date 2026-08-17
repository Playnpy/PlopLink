Projet [Next.js](https://nextjs.org) bootstrapé avec `create-next-app`.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
  types.ts                     -> types + constantes (catégories, icônes, couleurs)
  lib/
    categoryDetection.ts       -> devine la catégorie d'un texte collé
    supabaseClient.ts          -> client Supabase public (clé anonyme, lecture des partages)
    supabaseAdmin.ts           -> client Supabase serveur (clé service_role, jamais exposée au navigateur)
  hooks/
    useLocalItems.ts           -> chargement/sauvegarde dans le localStorage
  components/
    Sidebar.tsx                -> menu latéral (recherche, tiroirs, bouton d'envoi)
    ComposerForm.tsx           -> zone de saisie / collage
    ItemCard.tsx               -> carte d'un élément dans la grille principale
    SidebarItemRow.tsx         -> ligne d'un élément dans un tiroir
    ItemContent.tsx            -> rendu du contenu selon la catégorie (partagé)
    CategoryModal.tsx          -> modale "forcer une catégorie"
    ShareModal.tsx             -> sélection + envoi vers le téléphone (appelle /api/share)
    Toast.tsx                  -> notification de copie
  api/share/route.ts           -> route serveur : validation, rate limiting, création du partage
  page.tsx                     -> orchestre le tout
  s/[id]/page.tsx               -> page publique ouverte par le QR code
```

## Fonctionnalité : "Envoyer sur mon téléphone"

Le localStorage ne se synchronise pas entre appareils : pour transférer une
sélection d'éléments vers son téléphone, l'app crée un partage temporaire
dans Supabase, génère une URL publique `/s/<id>` et affiche son QR code. Il
suffit de le scanner pour retrouver le contenu sur l'autre appareil.

**Important :** la création d'un partage ne passe plus par un insert direct
depuis le navigateur — elle passe par la route serveur `app/api/share/route.ts`,
qui valide le contenu, limite le débit par IP, fixe une expiration (7 jours
par défaut) et utilise la clé `service_role` (secrète, jamais exposée au
client). Voir la section Sécurité ci-dessous pour le pourquoi.

### Mise en place (une seule fois)

1. Créez un projet sur [supabase.com](https://supabase.com) (gratuit).
2. Dans l'éditeur SQL du projet, exécutez le contenu de `supabase/schema.sql`
   (nouvelle installation) — ou `supabase/migration-securite.sql` si la table
   `shares` existe déjà chez vous depuis une version précédente.
3. Copiez `.env.local.example` en `.env.local` et renseignez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` — **secrète**, à ne jamais préfixer par
     `NEXT_PUBLIC_` (voir Project Settings > API > Project API keys)
4. Ajoutez les mêmes variables dans les "Environment Variables" du projet
   Vercel si vous déployez là-bas.

### Fonctionnement

- Bouton "📤 Envoyer sur mon téléphone" dans la sidebar.
- On coche les éléments à transférer (tout est sélectionné par défaut).
- "Envoyer" appelle `/api/share`, qui insère une ligne dans `shares` (avec
  une expiration à 7 jours) et renvoie un id, utilisé pour générer le QR
  code + un lien copiable pointant vers `/s/<id>`.
- Le lien est public (comme un pastebin) : quiconque le connaît peut le
  consulter tant qu'il n'a pas expiré, mais l'id est un UUID aléatoire
  impossible à deviner.

## Sécurité — points à connaître avant d'ouvrir le site à d'autres utilisateurs

- **Écriture verrouillée côté serveur** : la table `shares` n'a plus de
  policy d'insertion pour la clé anonyme. Seule la route `/api/share`
  (clé `service_role`, jamais exposée) peut créer un partage. Ça évite que
  n'importe qui récupérant la clé anonyme publique (visible dans le code du
  site) puisse spammer la table directement via l'API REST de Supabase.
- **Expiration automatique** : chaque partage expire après 7 jours
  (`expires_at`), et la policy de lecture exclut les lignes expirées. Pensez
  à activer `pg_cron` (voir le commentaire dans `supabase/schema.sql`) pour
  purger réellement les lignes expirées de la base, sinon elles restent
  stockées (juste illisibles).
- **Limites de taille et rate limiting** : `/api/share` plafonne à 20
  éléments par partage, ~500 Ko par élément, 4 Mo au total, et 5 requêtes par
  minute par adresse IP. Le rate limiting est en mémoire (simple première
  barrière) : sur Vercel, chaque instance serverless a sa propre mémoire, donc
  cette limite n'est pas garantie de façon stricte à grande échelle — si le
  trafic augmente, remplacez `requestLog` par un store partagé (ex. Upstash
  Redis) dans `app/api/share/route.ts`.
- **La bibliothèque principale reste 100% locale** : elle n'est toujours pas
  synchronisée entre appareils (localStorage uniquement). Seuls les éléments
  explicitement envoyés via "Envoyer sur mon téléphone" transitent par le
  serveur.

## En savoir plus

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Déployer sur Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
