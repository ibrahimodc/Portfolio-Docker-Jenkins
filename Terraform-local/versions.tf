terraform {
  required_version = ">= 1.6.0"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  # Se connecte automatiquement a Docker Desktop (Windows/WSL2)
  # via le named pipe local. Aucune config supplementaire necessaire.
}
