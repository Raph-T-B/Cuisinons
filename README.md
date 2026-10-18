# 🍳 Cuisinons - Application Web de Recettes de Cuisine

Projet d'application web réalisé avec **Angular** dans le cadre du TP noté. 
L'application permet la consultation, la recherche, la création et l'évaluation communautaire de recettes culinaires via une API REST (MockAPI).

Par Matteo et Raphaël

---

## 📋 Table des Matières

1. [Fonctionnalités et Respect des Consignes](#-fonctionnalités-et-respect-des-consignes)
2. [Adaptations et Améliorations Apportées](#-adaptations-et-améliorations-apportées)
3. [Architecture et Arborescence](#-architecture-et-arborescence)
4. [Modèle de Données & Règles Métier](#-modèle-de-données--règles-métier)
5. [Installation et Démarrage](#-installation-et-démarrage)

---

## 🎯 Fonctionnalités et Respect des Consignes

### 1. Authentification & Sécurité
- **Accès restreint** : L'ensemble de l'application est inaccessible sans identification préalable.
- **Règles strictes de connexion** :
  - Login et mot de passe **rigoureusement identiques**.
  - Longueur minimale de **5 caractères**.
  - Présence obligatoire d'au moins **1 chiffre**.
  - Présence obligatoire d'au moins **1 caractère spécial** parmi : `.` `/` `*` `-` `+`.
- **Persistance** : Gestion de la session utilisateur stockée en `localStorage`.
- **Déconnexion globale** : Accessible depuis n'importe quelle page via le menu de navigation persistant.
- **Redirection automatique** : Redirection vers l'accueil après connexion et protection de la page de login pour les utilisateurs déjà connectés.

### 2. Pages et Navigation
Chaque vue dispose de sa propre URL et actualise dynamiquement la balise `<title>` de l'onglet du navigateur :
- **Accueil (`/`)** : Affiche les **5 dernières recettes** créées (triées par date décroissante). Pour chaque recette sont affichés :
  - Le nom de la recette.
  - Les **15 premiers caractères** de la description (formatés via un pipe personnalisé).
  - La note moyenne calculée.
- **Toutes les recettes (`/recettes`)** :
  - Liste paginée des recettes.
  - Recherche textuelle par nom de recette en temps réel / requête API.
  - Affichage du nom, des 15 premiers caractères de la description et de la note moyenne.
- **Création de recette (`/recettes/new`)** :
  - Formulaire complet avec contrôles de validité en temps réel.
  - Validation bloquante : 1 nom obligatoire, 1 description de minimum 30 caractères, au moins 2 ingrédients avec des quantités valides ($> 0$).
- **Détail d'une recette (`/recette/:id`)** :
  - Affichage complet du nom, de la description, des ingrédients avec leurs quantités associées et de tous les avis laissés par les utilisateurs.
  - Formulaire pour soumettre un nouvel avis (note de 1 à 5 + commentaire) associé au nom d'utilisateur connecté.
- **Page 404 (`/**`)** : Gestion des routes inexistantes (redirection vers `/login` si non connecté, ou vers la page `/404` si connecté).

---

## 💡 Adaptations et Améliorations Apportées

Par rapport aux exigences initiales du sujet, plusieurs optimisations techniques et ergonomiques (UX/UI) ont été conçues et intégrées :

1. **Pipe personnalisé `TruncatePipe` (`truncate-pipe.ts`)** :
   - Mise en place d'un pipe réutilisable paramétrable (`description | truncate:15`) pour tronquer proprement les descriptions à 15 caractères avec points de suspension.

2. **Séparation claire de l'ajout d'ingrédients (bdd ingrédient ou dans la recette)** :
   - Clarification visuelle entre l'ajout d'un ingrédient **à la recette en cours** (`+ Ajouter un autre ingrédient`) et la création d'un **ingrédient inédit dans le catalogue global MockAPI** (*« Ingrédient non disponible ? Soyez le premier à l'ajouter ! »*).

3. **Sélecteur d'ingrédients avec autocomplétion dynamique** :
   - Remplacement du menu déroulant brut par un champ de recherche filtrable en instantané.
   - **Exclusion dynamique** : Dès qu'un ingrédient est sélectionné sur une ligne de la recette, il disparaît automatiquement des options proposées sur les autres lignes afin d'interdire les doublons.
   - **Tri insensible à la casse et aux accents** (`localeCompare`) : Les majuscules et minuscules sont regroupées alphabétiquement (`c` à côté de `C`), palliant les limites du tri ASCII natif de MockAPI.

4. **Guards** :
   - `authGuard` : Bloque l'accès aux pages protégées et renvoie vers `/login`.
   - `guestGuard` : Empêche un utilisateur déjà connecté d'accéder à la page de connexion et le redirige vers l'accueil.

5. **Impossible d'ajouter un ingrédient existant** :
   - Check dans l'api si un ingrédient du même nom est déjà existant (non sensible à la casse)

6. ** Quelques tests unitaires sur certains composants**
   - Tests présents nottaments sur les composants 'Recipe-details', 'recipe-list' et 'recipe-create'
   
---

## 📂 Architecture et Arborescence

```text
src/
├── app/
│   ├── components/
│   │   ├── home/                  # Page d'accueil (5 dernières recettes)
│   │   ├── login/                 # Page de connexion (règles strictes de mot de passe)
│   │   ├── menu/                  # Navbar globale (liens de navigation + déconnexion)
│   │   ├── not-found/             # Page d'erreur 404
│   │   ├── recipe-create/         # Formulaire de création de recette & ajout d'ingrédient
│   │   ├── recipe-detail/         # Vue détaillée d'une recette & ajout d'avis
│   │   └── recipe-list/           # Liste complète des recettes avec pagination et recherche
│   ├── guards/
│   │   ├── auth.guard.ts          # Protection des routes privées
│   │   └── auth.guest.ts          # Protection de la route de connexion
│   ├── models/
│   │   ├── ingredient-recette.ts  # Association idIngredient + quantité
│   │   ├── ingredients.ts         # Modèle Ingredient
│   │   ├── note.ts                # Modèle Review/Note
│   │   └── recettes.ts            # Modèle Recette
│   ├── pipes/
│   │   └── truncate-pipe.ts       # Pipe de troncature à 15 caractères
│   ├── services/
│   │   ├── authentification-service.ts  # Logique auth, regex, session localStorage
│   │   ├── IngredientsService.ts        # Appels API ingrédients MockAPI
│   │   └── RecettesService.ts           # Appels API recettes, tris, pagination, notes
│   ├── app.config.ts              # Configuration de l'application & provideHttpClient
│   ├── app.routes.ts              # Définition des routes, guards et titles
│   ├── app.html / app.ts          # Composant racine
│   └── styles.css                 # Configuration globale et directives Tailwind
```

---

## 📐 Modèle de Données & Règles Métier

### Recette
Une recette n'est validée et envoyée à l'API que si l'ensemble des critères suivants est vérifié :
- `name` : Chaîne non vide.
- `description` : Chaîne comportant **au moins 30 caractères**.
- `composition` : Tableau contenant **au minimum 2 ingrédients** ayant chacun une quantité $> 0$.

### Authentification
- Login et mot de passe identiques.
- Longueur $\ge 5$ caractères.
- Regex chiffre : `/\d/`.
- Regex caractère spécial : `/[.\/*\-+]/.test(...)`.

---

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** (version 18+ recommandée)
- **Angular CLI**

### Étapes
1. Cloner ou décompresser le projet.
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur de développement :
   ```bash
   ng serve
   ```
4. Ouvrir votre navigateur sur [http://localhost:4200](http://localhost:4200).
