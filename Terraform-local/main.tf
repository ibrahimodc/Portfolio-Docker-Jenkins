# ═══════════════════════════════════════════════════════════════════════════════
#  main.tf — POC : Portfolio pilote par Terraform (provider Docker, 100% local)
#
#  Equivalent du docker-compose.yml principal, mais en HCL.
#  Utilise UNIQUEMENT les images deja publiees sur Docker Hub (pas de build).
#
#  Ce dossier est INDEPENDANT du docker-compose.yml du portfolio :
#    - Reseau Docker dedie : "portfolio-terraform-network"
#    - Noms de conteneurs differents : "tf-portfolio-*"
#    - Volumes differents : "tf_mongo_data", "tf_uploads_data"
#  => Les deux peuvent exister cote a cote sans conflit (sauf si tu utilises
#     les memes ports en meme temps : 3000, 3001, 27017 -> arrete l'un avant l'autre).
# ═══════════════════════════════════════════════════════════════════════════════

# ── Reseau Docker dedie (equivalent du reseau "default" de docker-compose) ────
resource "docker_network" "portfolio_network" {
  name = var.network_name
}

# ── Volumes persistants (equivalent des "volumes:" de docker-compose) ─────────
resource "docker_volume" "mongo_data" {
  name = "tf_mongo_data"
}

resource "docker_volume" "uploads_data" {
  name = "tf_uploads_data"
}

# ── Images Docker Hub (telechargees automatiquement si absentes) ──────────────
resource "docker_image" "mongo" {
  name = var.mongo_image
}

resource "docker_image" "backend" {
  name = var.backend_image
}

resource "docker_image" "frontend" {
  name = var.frontend_image
}

# ═══════════════════════════════════════════════════════════════════════════════
#  1. MongoDB
# ═══════════════════════════════════════════════════════════════════════════════
resource "docker_container" "mongo" {
  name  = "tf-portfolio-mongo"
  image = docker_image.mongo.image_id

  networks_advanced {
    name    = docker_network.portfolio_network.name
    aliases = ["mongo"]   # permet au backend de joindre Mongo via "mongo:27017"
  }

  ports {
    internal = 27017
    external = var.mongo_port
  }

  volumes {
    volume_name    = docker_volume.mongo_data.name
    container_path = "/data/db"
  }

  env = [
    "MONGO_INITDB_DATABASE=portfolio_db"
  ]

  healthcheck {
    test     = ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
    interval = "10s"
    timeout  = "5s"
    retries  = 5
  }

  restart = "unless-stopped"
}

# ═══════════════════════════════════════════════════════════════════════════════
#  2. Backend (Express.js)
# ═══════════════════════════════════════════════════════════════════════════════
resource "docker_container" "backend" {
  name  = "tf-portfolio-backend"
  image = docker_image.backend.image_id

  networks_advanced {
    name    = docker_network.portfolio_network.name
    aliases = ["backend-service"]   # nom attendu par nginx (frontend)
  }

  ports {
    internal = 3001
    external = var.backend_port
  }

  volumes {
    volume_name    = docker_volume.uploads_data.name
    container_path = "/app/uploads"
  }

  env = [
    "NODE_ENV=production",
    "PORT=3001",
    "MONGO_URI=mongodb://mongo:27017/portfolio_db",
    "FRONTEND_URL=http://localhost:${var.frontend_port}"
  ]

  restart = "unless-stopped"

  depends_on = [docker_container.mongo]
}

# ═══════════════════════════════════════════════════════════════════════════════
#  3. Frontend (React + Vite -> Nginx)
# ═══════════════════════════════════════════════════════════════════════════════
resource "docker_container" "frontend" {
  name  = "tf-portfolio-frontend"
  image = docker_image.frontend.image_id

  networks_advanced {
    name = docker_network.portfolio_network.name
  }

  ports {
    internal = 80
    external = var.frontend_port
  }

  restart = "unless-stopped"

  depends_on = [docker_container.backend]
}
