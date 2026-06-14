terraform {
  backend "s3" {
    bucket       = "ibrahima-terraform-state-2026"
    key          = "dev/ec2/terraform.tfstate"
    region       = "eu-west-3"
    use_lockfile = true
    encrypt      = true
  }
}