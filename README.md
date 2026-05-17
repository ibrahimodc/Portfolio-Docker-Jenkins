# 🗂️ Portfolio Fullstack — React + Express + MongoDB

Application SPA de gestion de portfolio avec backend REST complet.

---

## ⚡ Démarrage rapide

### 1. Ouvrir dans VS Code

```
Fichier → Ouvrir le dossier → sélectionner portfolio-fullstack/
```

VS Code proposera d'installer les extensions recommandées — accepter.

---

### 2. Démarrer le Backend (API Express + MongoDB)

```bash
cd backend
npm install
npm run dev        # nodemon — rechargement automatique
```

> Configurer `backend/.env` avant si besoin (voir section MongoDB ci-dessous).

L'API sera disponible sur : **http://localhost:3001/api/projets**

---

### 3. Démarrer le Frontend (React)

Dans un **second terminal** :

```bash
cd frontend
npm install
npm start
```

L'application s'ouvre sur : **http://localhost:3000**

---

## 🗄️ Configuration MongoDB

Modifier `backend/.env` :

```env
PORT=3001

# MongoDB local
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_db

# MongoDB Atlas (cloud gratuit)
# MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/portfolio_db

NODE_ENV=development
```

---

## 🗂️ Structure du projet

```
portfolio-fullstack/
│
├── backend/                      ← API REST Express + MongoDB
│   ├── config/
│   │   └── connectdb.js          ← Connexion MongoDB (Mongoose)
│   ├── models/
│   │   └── Projet.js             ← Schéma de données Mongoose
│   ├── controllers/
│   │   └── projetController.js   ← Logique CRUD complète
│   ├── routes/
│   │   └── projetRoutes.js       ← Déclaration des routes REST
│   ├── server.js                 ← Point d'entrée Express
│   ├── .env                      ← Variables d'environnement
│   ├── .env.example              ← Modèle .env
│   └── package.json
│
├── frontend/                     ← Application React
│   ├── public/
│   │   └── assets/               ← Logo + photos équipe
│   ├── src/
│   │   ├── components/
│   │   │   ├── Accueil.jsx       ← Page d'accueil
│   │   │   ├── AjouterProjet.jsx ← Formulaire d'ajout
│   │   │   ├── Contact.jsx       ← Page contact
│   │   │   ├── DetaillerProjet.jsx ← Vue détail
│   │   │   ├── Dossier.jsx       ← Liste des projets (état global)
│   │   │   ├── EditerProjet.jsx  ← Formulaire d'édition
│   │   │   ├── Projet.jsx        ← Carte d'un projet
│   │   │   └── Team.jsx          ← Page équipe
│   │   ├── services/
│   │   │   └── api.js            ← Appels HTTP vers l'API Express
│   │   ├── styles/
│   │   │   ├── App.css           ← Design system complet
│   │   │   └── Team.css
│   │   ├── utils/
│   │   │   └── imageUtils.js     ← Compression d'images
│   │   ├── App.jsx               ← Composant racine + routing
│   │   └── index.js              ← Point d'entrée React
│   └── package.json
│
├── .vscode/
│   ├── settings.json             ← Paramètres éditeur
│   ├── launch.json               ← Débogage F5
│   └── extensions.json           ← Extensions recommandées
│
├── api.http                      ← Tests REST Client
└── README.md
```

---

## 🔗 Endpoints de l'API

| Méthode  | URL                | Action                     |
| -------- | ------------------ | -------------------------- |
| `GET`    | `/api/projets`     | Récupérer tous les projets |
| `GET`    | `/api/projets/:id` | Récupérer un projet par ID |
| `POST`   | `/api/projets`     | Ajouter un projet          |
| `PUT`    | `/api/projets/:id` | Modifier un projet         |
| `DELETE` | `/api/projets/:id` | Supprimer un projet        |

---

## 🧪 Tester l'API

Ouvrir **`api.http`** à la racine et cliquer **Send Request** sur chaque bloc.  
Nécessite l'extension **REST Client** (proposée automatiquement par VS Code).

---

## 🐛 Débogage avec F5

- Aller dans **Exécuter → Démarrer le débogage** (`F5`)
- Choisir **▶ Backend — Nodemon** pour lancer l'API avec rechargement auto
- Poser des points d'arrêt dans `controllers/projetController.js`

---

## 📦 Dépendances Backend

| Package    | Rôle                              |
| ---------- | --------------------------------- |
| `express`  | Framework HTTP                    |
| `mongoose` | ODM MongoDB                       |
| `dotenv`   | Chargement des variables `.env`   |
| `cors`     | Requêtes cross-origin (port 3000) |
| `nodemon`  | Rechargement auto (dev)           |
