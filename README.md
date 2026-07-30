# PhoneTimeline — app Next.js + Supabase

Projet en rendu **SSR** (Server Components + Server Actions, pas de génération
statique). Contient pour l'instant l'**interface d'administration** complète
(marques + téléphones) ; la page publique (`app/page.tsx`) est un placeholder
à reconstruire ensuite à partir du prototype HTML/CSS.

## 1. Installer les dépendances

```bash
npm install
```

## 2. Créer le projet Supabase

1. Va sur https://supabase.com, crée un nouveau projet.
2. Dans **SQL Editor**, colle et exécute le contenu de
   `supabase/migrations/0001_init.sql` — ça crée les tables `brands`,
   `phones`, `phone_images` et les politiques de sécurité (RLS).
3. Dans **Authentication -> Users**, crée manuellement un utilisateur
   (ton email + un mot de passe) — c'est le compte que tu utiliseras pour te
   connecter à `/admin`. Le programme ne permet pas l'inscription publique :
   seul un compte créé à la main dans Supabase peut se connecter à l'admin.
4. Dans **Project Settings -> API**, copie l'URL du projet et la clé `anon`.

## 3. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplis `.env.local` avec l'URL et la clé copiées à l'étape précédente.

## 4. Lancer le projet

```bash
npm run dev
```

- Site public : http://localhost:3000
- Admin : http://localhost:3000/admin (redirige vers `/admin/login` si non
  connecté)

## Ce que fait l'admin actuellement

- **Marques** (`/admin/marques`) : liste, création, modification, suppression.
- **Téléphones** (`/admin/telephones`) : liste filtrable par marque, création
  et modification avec tous les champs de caractéristiques (écran, processeur,
  RAM, batterie, photo...), suppression.
- Protection par **Supabase Auth** : toute route sous `/admin` (sauf
  `/admin/login`) redirige vers la connexion si tu n'es pas authentifié. La
  vérification se fait dans `middleware.ts`.

## Prochaines étapes possibles

- Reconstruire la page publique et les pages `/marques/[brand]` et
  `/smartphones/[slug]` à partir du prototype HTML/CSS déjà fait, en lisant
  les données depuis Supabase au lieu du HTML en dur.
- Ajouter l'upload d'images (Supabase Storage) au formulaire téléphone —
  actuellement `phone_images` existe en base mais n'a pas encore
  d'interface.
- Ajouter un champ de recherche/tri à la liste `/admin/telephones` si le
  nombre de modèles devient grand.
