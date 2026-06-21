# 🐳 Terraform-Local — POC : Portfolio pilote par Terraform (Docker, sans AWS)

Ce dossier est un **proof-of-concept** independant : il pilote ton portfolio
(frontend + backend + MongoDB) **en local**, via Docker, en utilisant Terraform
au lieu de `docker compose`.

⚠️ **Il ne remplace pas** ton `docker-compose.yml` actuel — les deux peuvent
exister cote a cote (mais pas tourner EN MEME TEMPS si les ports se chevauchent).

---

## 📁 Structure

```
Terraform-Local/
├── versions.tf              # Provider Docker (kreuzwerker/docker)
├── variables.tf             # Variables (images, ports...)
├── main.tf                  # Reseau + volumes + 3 conteneurs
├── outputs.tf                # URLs d'acces apres deploiement
└── environments/
    └── dev.tfvars            # Valeurs pour l'environnement dev
```

---

## ⚙️ Comment ca marche

| Concept Terraform          | Equivalent docker-compose.yml |
|-----------------------------|-------------------------------|
| `docker_network`            | section `networks:`           |
| `docker_volume`              | section `volumes:`            |
| `docker_image`               | `image:` (pull automatique)   |
| `docker_container`           | `services:`                   |

Les images utilisees sont **directement celles de Docker Hub** (pas de build) :
- `ibraahiimm/portfolio-frontend:latest`
- `ibraahiimm/portfolio-backend:latest`
- `mongo:7`

---

## 🚀 Utilisation

### 1. Initialiser (telecharge le provider Docker)

```powershell
cd Terraform-Local
terraform init
```

### 2. Verifier le plan

```powershell
terraform plan -var-file="environments\dev.tfvars"
```

### 3. Deployer

```powershell
terraform apply -var-file="environments\dev.tfvars"
```

Terraform va :
1. Creer le reseau Docker `portfolio-terraform-network`
2. Creer 2 volumes (`tf_mongo_data`, `tf_uploads_data`)
3. Telecharger les 3 images depuis Docker Hub
4. Lancer les 3 conteneurs (`tf-portfolio-mongo`, `tf-portfolio-backend`, `tf-portfolio-frontend`)

### 4. Acceder a l'application

```powershell
terraform output
```

```
frontend_url = "http://localhost:3000"
backend_url  = "http://localhost:3001/api/projets"
```

---

## 🛑 Detruire (nettoyer)

```powershell
terraform destroy -var-file="environments\dev.tfvars"
```

Cela arrete et supprime les 3 conteneurs, le reseau et les volumes crees par Terraform
(sans toucher a ceux de ton `docker-compose.yml` principal, qui ont des noms differents).

---

## ⚠️ Conflits de ports possibles

Ce POC utilise les memes ports par defaut que ton `docker-compose.yml` principal :
- `3000` (frontend)
- `3001` (backend)
- `27017` (mongo)

➡️ **Arrete d'abord ton portfolio principal** avant de lancer ce POC :
```powershell
# Depuis la racine du projet (Portfolio-Docker-Jenkins)
docker compose down
```

Puis lance le POC Terraform. Ou inversement, change les ports dans
`environments/dev.tfvars` pour les faire tourner simultanement, par exemple :
```hcl
frontend_port = 3100
backend_port  = 3101
mongo_port    = 27018
```
(Attention : si tu changes `frontend_port`, le `FRONTEND_URL` interne au backend
dans `main.tf` doit aussi etre coherent.)

---

## 🔧 Prerequis

- **Terraform** installe (`terraform version`)
- **Docker Desktop** installe et demarre, avec le moteur **WSL2** active
- Aucune cle AWS necessaire — ce POC n'utilise aucun service AWS

---

## 💡 Pourquoi ce POC est utile

- Demontrer la portabilite de Terraform au-dela du cloud (ici : provider Docker)
- Comparer la meme infrastructure decrite en HCL vs YAML (docker-compose)
- Preparer une eventuelle migration vers un autre provider (AWS ECS, K8s...)
  en gardant la meme logique de description d'infrastructure-as-code
