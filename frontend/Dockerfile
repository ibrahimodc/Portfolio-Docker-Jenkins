# Stage 1 : Build React/Vite
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Injecter api.js inline dans index.html via Node.js
RUN node -e "
const fs = require('fs');
const api = fs.readFileSync('/app/api.js', 'utf8');
let html = fs.readFileSync('/app/dist/index.html', 'utf8');
html = html.replace('<script src=\"api.js\"></script>', '<script>' + api + '</script>');
fs.writeFileSync('/app/dist/index.html', html);
console.log('api.js injecté avec succès');
"

# Stage 2 : Servir avec Nginx
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]