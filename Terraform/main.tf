resource "aws_instance" "mon_serveur" {
  ami           = var.ami
  instance_type = var.instance_type

  tags = {
    Name        = "serveur-${var.env}"
    Environment = var.env
  }
}