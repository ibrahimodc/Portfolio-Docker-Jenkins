output "instance_id" {
  description = "ID de l'instance EC2"
  value       = aws_instance.mon_serveur.id
}

output "public_ip" {
  description = "IP publique de l'instance"
  value       = aws_instance.mon_serveur.public_ip
}