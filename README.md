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
    supabaseClient.ts          -> client Supabase partagé
  hooks/
    useLocalItems.ts           -> chargement/sauvegarde dans le localStorage
  components/
    Sidebar.tsx                -> menu latéral (recherche, tiroirs, bouton d'envoi)
    ComposerForm.tsx           -> zone de saisie / collage
    ItemCard.tsx               -> carte d'un élément dans la grille principale
    SidebarItemRow.tsx         -> ligne d'un élément dans un tiroir
    ItemContent.tsx            -> rendu du contenu selon la catégorie (partagé)
    CategoryModal.tsx          -> modale "forcer une catégorie"
    ShareModal.tsx             -> NOUVEAU : sélection + envoi vers le téléphone
    Toast.tsx                  -> notification de copie
  page.tsx                     -> orchestre le tout
  s/[id]/page.tsx               -> NOUVEAU : page publique ouverte par le QR code
```

## Nouvelle fonctionnalité : "Envoyer sur mon téléphone"

Le localStorage ne se synchronise pas entre appareils : pour transférer une
sélection d'éléments vers son téléphone, l'app envoie une copie de ces
éléments dans une table Supabase, génère une URL publique
`/s/<id>` et affiche son QR code. Il suffit de le scanner pour retrouver le
contenu sur l'autre appareil.

### Mise en place (une seule fois)

1. Créez un projet sur [supabase.com](https://supabase.com) (gratuit).
2. Dans l'éditeur SQL du projet, exécutez le contenu de `supabase/schema.sql`
   (crée la table `shares` + les règles d'accès).
3. Copiez `.env.local.example` en `.env.local` et renseignez les deux
   variables avec les valeurs de **Project Settings > API** :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Ajoutez les mêmes variables dans les "Environment Variables" du projet
   Vercel si vous déployez là-bas.

### Fonctionnement

- Bouton "📤 Envoyer sur mon téléphone" dans la sidebar.
- On coche les éléments à transférer (tout est sélectionné par défaut).
- "Envoyer" insère une ligne dans `shares` et affiche un QR code + un lien
  copiable pointant vers `/s/<id>`.
- Le lien est public (comme un pastebin) : quiconque le connaît peut le
  consulter, mais l'id est un UUID aléatoire impossible à deviner.
- Les partages ne sont pas supprimés automatiquement ; voir le commentaire en
  bas de `supabase/schema.sql` pour purger les anciens partages si besoin.

## En savoir plus

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Déployer sur Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
