output "frontend_url" {
  description = "URL d'acces au portfolio (frontend)"
  value       = "http://localhost:${var.frontend_port}"
}

output "backend_url" {
  description = "URL de l'API backend"
  value       = "http://localhost:${var.backend_port}/api/projets"
}

output "mongo_connection" {
  description = "Adresse de connexion MongoDB depuis l'hote"
  value       = "mongodb://localhost:${var.mongo_port}/portfolio_db"
}

output "network_name" {
  description = "Nom du reseau Docker cree"
  value       = docker_network.portfolio_network.name
}

output "container_names" {
  description = "Noms des conteneurs crees"
  value = [
    docker_container.mongo.name,
    docker_container.backend.name,
    docker_container.frontend.name,
  ]
}
