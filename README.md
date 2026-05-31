# Mercato Nova

Mercato Nova est une maquette de plateforme de vente JDM developpee pour le projet piscine ECE ING2.
Le site permet de consulter un catalogue de voitures et pieces, puis de gerer plusieurs modes de transaction :
achat direct, enchere et negociation.

## Repartition du projet

- Gabin : interface web du menu principal, catalogue, enchere, parcours marketplace.
- Nicolas : interface web admin/directeur, user management, acces par roles.
- Paul : interface web vendeur, gestion des ventes.
- Celestin : base de donnees et implementation backend.

## Stack technique

- Frontend : React, Vite, Tailwind CSS, JavaScript.
- Backend : PHP pur, structure REST API.
- Base de donnees : MySQL, script d'initialisation dans `database/init.sql`.
- UI : theme sombre neon, composants avec `lucide-react`.

## Structure actuelle

```txt
Projet_Piscine/
├── backend/
│   ├── config/database.php
│   ├── api/
│   ├── controllers/
│   ├── models/
│   ├── uploads/
│   └── index.php
├── database/
│   └── init.sql
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── data/mockData.js
    │   ├── views/Home.jsx
    │   ├── views/Login.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## Nouveautes ajoutees

### Acces invite

Quand l'utilisateur arrive sur le site, il n'est pas connecte.
Il peut consulter librement le catalogue, les voitures, les pieces et les informations visibles.

Les actions suivantes demandent une connexion :

- acheter une piece ou une voiture ;
- placer une enchere ;
- negocier un prix ;
- proposer une annonce au catalogue.

### Connexion et roles

La connexion passe par le bouton profil en haut a droite.
La maquette utilise des faux comptes stockes dans `frontend/src/data/mockData.js`.

Quatre niveaux d'acces sont geres :

- invite : consultation seule ;
- utilisateur connecte : navigation, achat, enchere, negociation, proposition d'annonce ;
- administrateur : moderation des annonces, gestion des comptes, suppression/modification/ajout de ventes ;
- directeur : acces global, y compris informations des administrateurs, suppression des comptes et annonces.

### Interface administrateur

L'administrateur garde l'interface normale du catalogue, mais dispose d'outils supplementaires :

- croix de suppression sur les annonces du catalogue ;
- bouton `Modifier` sous chaque annonce ;
- prix verrouille lors de la modification ;
- bouton d'ajout de vente depuis la console admin ;
- bloc d'acces rapide a la console admin dans le panneau lateral.

La console admin contient :

- statistiques de plateforme ;
- file des annonces en attente ;
- validation ou refus d'une annonce ;
- verification des informations vendeur et criteres de carte d'identite ;
- gestion des comptes utilisateurs ;
- bannissement d'un utilisateur ;
- suppression d'un compte.

### Interface directeur

Le directeur a un espace dedie avec des droits plus larges :

- acces aux comptes utilisateurs et administrateurs ;
- acces aux donnees personnelles visibles dans la maquette ;
- affichage d'information bancaire simulee, reservee au directeur ;
- suppression des comptes ;
- suppression et modification des annonces ;
- validation des annonces en attente.

### Moderation des annonces

Quand un utilisateur connecte propose une annonce, elle n'est pas publiee directement.
Elle arrive dans la file de moderation admin/directeur.

Un administrateur ou directeur peut ensuite :

- accepter l'annonce, ce qui l'ajoute au catalogue ;
- refuser l'annonce, ce qui la retire de la file ;
- ne rien faire et la laisser en attente.

### Gestion utilisateurs

La gestion utilisateurs est simulee cote frontend pour la maquette.
Les actions de ban et suppression sont persistantes localement via `localStorage`.

- Un utilisateur banni ne peut plus se connecter.
- Un utilisateur supprime est retire de la liste et sa connexion est refusee.
- L'administrateur ne peut pas se bannir ou se supprimer lui-meme.
- Le directeur est protege contre la suppression depuis la maquette.

## Identifiants de test

```txt
Compte normal : driver@mercatonova.com / nova1234
Vendeur test  : seller@mercatonova.com / nova1234
Admin         : admin@mercatonova.com / admin123
Directeur     : directeur@mercatonova.com / boss123
Compte banni  : banned@mercatonova.com / banned123
```

## Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

Le site est ensuite disponible sur l'URL indiquee par Vite, generalement :

```txt
http://127.0.0.1:5173
```

## Construire le frontend

```bash
cd frontend
npm run build
```

Le build a ete verifie avec succes apres l'ajout des pages admin/directeur.

## Base de donnees

Le fichier `database/init.sql` contient le schema MySQL initial.
Il a ete enrichi pour preparer l'integration backend des nouvelles fonctionnalites :

- role `director` ;
- informations personnelles utilisateur ;
- statut de compte : `active`, `banned`, `deleted` ;
- statut de verification de carte d'identite ;
- statut d'approbation des annonces : `pending`, `approved`, `rejected` ;
- lien vers l'administrateur ou directeur ayant approuve une annonce.

## Notes d'integration

Pour l'instant, la gestion des roles, comptes, annonces en attente et bannissements fonctionne en maquette frontend.
La prochaine etape sera de connecter ces actions aux endpoints PHP/MySQL :

- authentification ;
- liste des utilisateurs ;
- ban/suppression utilisateur ;
- creation d'annonce en attente ;
- validation/refus d'annonce ;
- modification/suppression d'annonce.
