# Mercato Nova - Projet Piscine ECE

## Lien du Repository Github

 [https://github.com/ECE-Groupe-1/projet-piscine](https://github.com/ECE-Groupe-1/projet-piscine)

**Mercato Nova** est une plateforme d'e-commerce spécialisée dans l'import de véhicules et pièces JDM (Japanese Domestic Market). Ce projet propose une architecture complète avec un front-end en **React** et un back-end en **PHP / MySQL**, intégrant des fonctionnalités d'achat direct, d'enchères et de négociation en temps réel.

---

## 1. Installation du Serveur (Backend)

Pour faire fonctionner la partie serveur et la base de données, vous avez besoin de **MAMP** (ou XAMPP / WAMP).

1. Assurez-vous d'avoir installé MAMP.
2. Déplacez **l'intégralité de ce dossier** (`Projet_Piscine`) dans le dossier racine de votre serveur web :
   - Sous Windows (MAMP) : `C:\MAMP\htdocs\Projet_Piscine`
   - Sous Mac (MAMP) : `/Applications/MAMP/htdocs/Projet_Piscine`
3. Ouvrez MAMP et **démarrez les serveurs Apache et MySQL**.

---

## 2. Configuration de la Base de Données

Le projet est livré avec un script SQL complet pour générer l'architecture et les données de test.

1. Allez sur **phpMyAdmin** depuis votre navigateur (généralement `http://localhost/phpMyAdmin` ou `http://localhost:8888/phpMyAdmin`).
2. Allez dans l'onglet **Importer**.
3. Importez le fichier situé dans `Projet_Piscine/database/init.sql` et exécutez-le.
   *Note : Ce script crée automatiquement la base de données `mercato_nova`, les tables, et ajoute un jeu complet d'utilisateurs et de produits de test.*

---

## 3. Lancement de l'Application (Frontend)

L'interface utilisateur a été développée avec React et Vite. Assurez-vous d'avoir **Node.js** installé sur votre machine.

1. Ouvrez un terminal et naviguez dans le dossier `frontend` du projet :
   ```bash
   cd frontend
   ```
2. Installez les dépendances du projet :
   ```bash
   npm install
   ```
3. Démarrez le serveur de développement React :
   ```bash
   npm run dev
   ```
4. Ouvrez le lien affiché dans le terminal (généralement **http://localhost:5173**) dans votre navigateur web.

---

## 4. Démarche de Test & Fonctionnalités

Pour explorer l'ensemble des fonctionnalités du site, utilisez l'icône de profil (en haut à droite de l'écran) pour basculer entre les différents types de comptes pré-configurés :

### Comptes de test
*Le mot de passe pour tous les comptes est le même (bien que simulé pour l'interface de test) : `password123`*

- **Client / Acheteur** : `takumi.fujiwara@akina.jp`
- **Vendeur** : `celestin@mercatonova.com`
- **Administrateur / Directeur** : `gabin@mercatonova.com`

### Scénarios à tester pour la correction :

#### A. Le cycle de Négociation (Test Client + Vendeur)
1. Connectez-vous en tant que **Vendeur (Célestin)**. Allez dans l'espace vendeur et créez une annonce pour un véhicule en sélectionnant l'option de vente "Négociation".
2. Déconnectez-vous et connectez-vous en tant que **Client (Takumi)**.
3. Trouvez l'annonce dans le catalogue, cliquez sur "Démarrer une négociation" et proposez un prix.
4. Déconnectez-vous et reconnectez-vous en tant que **Vendeur (Célestin)**.
5. Allez dans l'onglet **"Offres reçues"** du tableau de bord vendeur pour consulter l'offre et l'accepter, la refuser ou faire une contre-offre.

#### B. Les Notifications en temps réel
- Lors du scénario de négociation ci-dessus, observez **l'icône de la cloche** en haut à droite. Elle s'animera (avec une pastille rouge) dès qu'une action est effectuée.
- Cliquez dessus pour lire la notification. Cette action marque la notification comme lue dans la base de données en temps réel !

#### C. Gestion d'Administration
1. Connectez-vous en tant qu'**Administrateur (Gabin)**.
2. Parcourez l'Espace Directeur : observez le journal d'audit interactif, les statistiques de ventes calculées sur la base de données, et l'historique des transactions.
3. Depuis le catalogue, l'administrateur peut directement supprimer des annonces (l'action impacte instantanément la base de données).

---
