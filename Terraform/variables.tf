variable "region" {
  description = "Région AWS"
  type        = string
  default     = "eu-west-3"
}

variable "instance_type" {
  description = "Type d'instance EC2"
  type        = string
  default     = "t3.micro"
}

variable "ami" {
  description = "AMI de l'instance EC2"
  type        = string
}

variable "env" {
  description = "Environnement"
  type        = string
  default     = "dev"
}