# Luuma Ucad

## 1. Présentation du projet

Luuma Ucad est une application mobile innovante destinée aux étudiants de l'Université Cheikh Anta Diop (UCAD). Dans un contexte où l'information est souvent dispersée et difficile d'accès, Luuma Ucad vise à centraliser les flux d'informations académiques, les ressources pédagogiques et les services essentiels à la vie étudiante.

L'application offre une interface unifiée pour rester informé, étudier efficacement et accéder aux services du campus, réduisant ainsi la dépendance aux canaux de communication informels.

## 2. Objectifs

Le projet s'articule autour de plusieurs objectifs clés :

- **Centralisation** : Regrouper toutes les annonces universitaires en un seul endroit fiable.
- **Accessibilité** : Faciliter l'accès aux resources pédagogiques (cours, TD, TP) avec un mode hors ligne.
- **Services** : Proposer une boutique campus intégrée pour les fournitures et services.
- **Fiabilité** : Offrir une alternative sécurisée et structurée aux groupes informels (WhatsApp, Facebook).

## 3. Fonctionnalités principales

### Informations

- **Annonces hiérarchisées** : Diffusion d'informations ciblées (Université, Faculté, Département).
- **Agenda académique** : Suivi des événements importants et échéances.
- **Notifications push** : Alertes pertinentes basées sur le profil de l'étudiant.

### Documents

- **Ressources pédagogiques** : Accès direct aux supports de cours, travaux dirigés et pratiques.
- **Organisation structurée** : Classement intuitif par Faculté, Département, Niveau et Unité d'Enseignement (UE).
- **Mode hors ligne** : Téléchargement des documents pour une consultation sans connexion internet.
- **Gestion de versions** : Accès garanti aux documents les plus récents.

### Boutique Campus

- **Fournitures et services** : Catalogue de produits utiles à la vie universitaire.
- **Paiement mobile** : Intégration de solutions de paiement sécurisées.
- **Click & Collect** : Commande en ligne et retrait sur le campus (en développement).

## 4. Architecture générale

L'architecture de Luuma Ucad repose sur une approche **Serverless** moderne pour garantir performance et scalabilité.

- **Mobile First** : L'application React Native communique directement avec le Backend-as-a-Service (BaaS).
- **Logique Métier** : Hébergée intégralement sur **Convex**, assurant des temps de réponse rapides et une cohérence des données.
- **Synchronisation Temps Réel** : Les données sont mises à jour instantanément sur les appareils des utilisateurs.
- **Hiérarchie des Données** : Modélisation stricte des relations Université > Faculté > Département pour le filtrage de contenu.

## 5. Stack technique

### Application Mobile

- **Framework** : Expo (React Native)
- **Langage** : TypeScript
- **State Management** : Redux Toolkit + RTK Query
- **Navigation** : React Navigation

### Backend & Infrastructure

- **BaaS** : Convex (Base de données temps réel, Fonctions Serverless, Auth)
- **Stockage** : Object Storage (compatible S3) pour les documents PDF
- **Notifications** : Expo Push Notifications

## 6. Organisation des données

La structure des données reflète l'organisation universitaire :

1. **Université** : Entité racine.
2. **Faculté** : Division académique principale (ex: FST, FLSH).
3. **Département** : Subdivision par filière (ex: Mathématiques, Histoire).
4. **Utilisateur** : Profil étudiant rattaché à un département spécifique.

Cette structure permet un filtrage contextuel automatique : un étudiant en Mathématiques verra prioritairement les annonces de son département et de sa faculté, tout en accédant aux informations générales de l'université.

## 7. Sécurité et gestion des accès

- **Authentification** : Gestion sécurisée des sessions utilisateurs via Convex Auth.
- **Contrôle d'accès (RBAC)** :
  - **Données publiques** : Informations générales accessibles à tous les utilisateurs authentifiés.
  - **Données restreintes** : Documents et annonces spécifiques limités aux étudiants des départements concernés.
- **Protection des données** : Validation stricte des entrées et isolation des données par contexte académique.

## 8. Installation et lancement (Développement)

Pré-requis : Node.js, npm/pnpm, et un compte Convex.

1. **Cloner le projet**

   ```bash
   git clone https://github.com/AmbaC0de/luuma-ucad.git
   cd luuma-ucad
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer le Backend (Convex)**
   Initialiser le projet Convex et lancer le serveur de développement :

   ```bash
   npx convex dev
   ```

4. **Lancer l'application mobile**
   Dans un nouveau terminal :
   ```bash
   npx expo start
   ```
   Utilisez l'application **Expo Go** ou un émulateur pour visualiser le projet.

## 9. Structure du projet

```
luuma-ucad/
├── assets/             # Ressources statiques (images, polices)
├── convex/             # Backend (Schémas BD, Fonctions API)
├── src/
│   ├── assets/         # Assets spécifiques au cdoe source
│   ├── components/     # Composants réutilisables
│   ├── features/       # Slices Redux et logique métier
│   ├── navigation/     # Configuration de la navigation
│   ├── screens/        # Écrans de l'application
│   ├── services/       # Services externes et API
│   ├── types.d.ts      # Définitions TypeScript globales
│   └── App.tsx         # Point d'entrée de l'application
├── app.json            # Configuration Expo
├── package.json        # Dépendances
└── tsconfig.json       # Configuration TypeScript
```

## 10. Évolutions futures

- Intégration complète du système de "Click & Collect".
- Module de chat communautaire modéré par département.
- Tableau de bord pour l'administration universitaire.
- Support multilingue (Français / Wolof).

## 11. Licence

Ce projet est sous licence propriétaire. Tous droits réservés à Luuma Ucad.
