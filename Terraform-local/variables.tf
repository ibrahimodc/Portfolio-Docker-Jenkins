variable "env" {
  description = "Nom de l'environnement"
  type        = string
  default     = "dev"
}

variable "network_name" {
  description = "Nom du reseau Docker cree pour le portfolio"
  type        = string
  default     = "portfolio-terraform-network"
}

variable "frontend_image" {
  description = "Image Docker Hub du frontend"
  type        = string
  default     = "ibraahiimm/portfolio-frontend:latest"
}

variable "backend_image" {
  description = "Image Docker Hub du backend"
  type        = string
  default     = "ibraahiimm/portfolio-backend:latest"
}

variable "mongo_image" {
  description = "Image officielle MongoDB"
  type        = string
  default     = "mongo:7"
}

variable "frontend_port" {
  description = "Port expose pour le frontend (host)"
  type        = number
  default     = 3000
}

variable "backend_port" {
  description = "Port expose pour le backend (host)"
  type        = number
  default     = 3001
}

variable "mongo_port" {
  description = "Port expose pour MongoDB (host)"
  type        = number
  default     = 27017
}
