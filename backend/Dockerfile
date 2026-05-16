# ── Backend API — Node.js / Express ──────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Dépendances de production uniquement
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Dossier uploads persistant (monté via volume Docker)
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "server.js"]
