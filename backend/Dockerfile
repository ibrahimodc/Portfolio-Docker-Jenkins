# ============================================
# Portfolio Backend — Express.js + Node.js
# ============================================
FROM node:20-alpine

WORKDIR /app

# Installer les dépendances de production uniquement
COPY package*.json ./
RUN npm ci --only=production

# Copier le code source
COPY . .

# Port exposé par Express.js
EXPOSE 3000

# Démarrer le serveur
CMD ["node", "server.js"]