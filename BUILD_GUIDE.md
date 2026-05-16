# 🚀 Guide de Compilation - Portfolio Full Stack

## ✅ Prérequis
- Node.js 16+ et npm
- MongoDB configuré et en cours d'exécution
- Variables d'environnement `.env` dans le dossier `backend/`

## 📋 Configuration Initiale

### 1. Backend (.env)
Créez un fichier `backend/.env` :
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio
```

### 2. Installez les dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 🏃 Mode Développement

### Option 1 : Deux terminaux (recommandé)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Serveur disponible sur http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Accessible sur http://localhost:5173 (Vite)
```

### Option 2 : Un seul terminal
Utilisez un gestionnaire comme `concurrently` (optionnel).

---

## 🏗️ Mode Production (Compilation Complète)

### Étape 1 : Compiler le frontend
```bash
cd frontend
npm run build
```
Cela crée un dossier `frontend/dist/` avec les fichiers optimisés.

### Étape 2 : Démarrer le backend en production
```bash
cd backend
npm run start
```
Le backend sert alors :
- ✅ L'API REST sur `/api/projets`
- ✅ Les fichiers statiques du frontend depuis `/`

**Accès:** `http://localhost:3001`

---

## 🔗 Configuration Actualisée

| Composant | URL | Port |
|-----------|-----|------|
| Backend API | `http://localhost:3001/api/projets` | 3001 |
| Frontend (Dev) | `http://localhost:5173` | 5173 |
| Frontend (Prod) | `http://localhost:3001` | 3001 |

---

## ✨ Résumé des Modifications

✅ **api.js** - Aligné sur le port 3001  
✅ **server.js** - Sert les fichiers statiques du frontend en production  
✅ **package.json** - Scripts simplifiés pour build et démarrage  

Vous êtes prêt à compiler et exécuter votre application ! 🎉
