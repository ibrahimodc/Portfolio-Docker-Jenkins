# Liens Docker Hub — Portfolio Ibrahima Diallo

## Images publiées sur Docker Hub

| Service    | Image                              | Lien                                                                 |
|------------|------------------------------------|----------------------------------------------------------------------|
| Frontend   | `ibraahiimm/portfolio-frontend`    | https://hub.docker.com/r/ibraahiimm/portfolio-frontend               |
| Backend    | `ibraahiimm/portfolio-backend`     | https://hub.docker.com/r/ibraahiimm/portfolio-backend                |
| MongoDB    | `mongo:7` (image officielle)       | https://hub.docker.com/_/mongo                                       |

## Lancer le projet depuis Docker Hub

```bash
docker compose up -d
```

> Aucune installation de Node.js ou React requise.
> Docker télécharge automatiquement les 3 images et lance l'application.

## Application disponible sur

- Frontend : http://localhost:3000
- Backend API : http://localhost:3001/api/projets
- MongoDB : localhost:27017
