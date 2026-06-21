# 📊 Monitoring — Prometheus + Grafana

Stack de monitoring **independante** pour surveiller les conteneurs Docker du portfolio
(frontend, backend, mongo) et la machine EC2 elle-meme.

---

## 📁 Structure

```text
Monitoring/
├── docker-compose.monitoring.yml   # Prometheus + Grafana + cAdvisor + node-exporter
├── prometheus/
│   └── prometheus.yml              # Cibles a scraper
└── grafana/
    ├── provisioning/
    │   ├── datasources/datasource.yml   # Connexion auto a Prometheus
    │   └── dashboards/dashboard.yml     # Chargement auto des dashboards
    └── dashboards/
        └── docker-containers.json       # Dashboard pret a l'emploi
```

---

## 🚀 Deploiement sur l'EC2

### 1. Copier le dossier sur le serveur (si pas deja fait via git)

```bash
# Sur le serveur EC2, depuis la racine du projet
cd ~/Portfolio-Docker-Jenkins
git pull origin CodeVersion2
cd Monitoring
```

### 2. Verifier le nom du reseau Docker du portfolio

```bash
docker network ls
```

Cherche un reseau du type `portfolio-docker-jenkins_default` (genere automatiquement
a partir du nom du dossier). Si le nom differe, modifie la ligne `name:` dans
`docker-compose.monitoring.yml` (section `networks: portfolio_default`).

### 3. Lancer la stack monitoring

```bash
docker compose -f docker-compose.monitoring.yml up -d
```

### 4. Verifier que tout tourne

```bash
docker compose -f docker-compose.monitoring.yml ps
```hcl

Tu dois voir 4 conteneurs `Up` :
- `monitoring-prometheus`
- `monitoring-grafana`
- `monitoring-cadvisor`
- `monitoring-node-exporter`

---

## ⚠️ Ouvrir les ports dans le Security Group (Terraform)

Ajoute ces 2 regles `ingress` dans `Terraform/main.tf` (ressource `aws_security_group.portfolio_sg`) :

```hcl
ingress {
  from_port   = 9090
  to_port     = 9090
  protocol    = "tcp"
  cidr_blocks = ["TON_IP/32"]   # Prometheus - acces restreint recommande
}

ingress {
  from_port   = 3030
  to_port     = 3030
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]   # Grafana - ouvert ou restreint selon besoin
}
```text

Puis :
```powershell
terraform apply -var-file="environments\dev.tfvars"
```text

---

## 🌐 Acces aux interfaces

| Service     | URL                              | Identifiants            |
|-------------|-----------------------------------|--------------------------|
| Prometheus  | `http://<IP_EC2>:9090`           | Aucun                    |
| Grafana     | `http://<IP_EC2>:3030`           | `admin` / `admin`        |

⚠️ A la premiere connexion Grafana, il te sera demande de changer le mot de passe.

---

## 📊 Dashboard pre-configure

Le dashboard **"Portfolio - Conteneurs Docker"** est charge automatiquement et affiche :
- CPU par conteneur (frontend/backend/mongo)
- RAM par conteneur
- Trafic reseau entrant/sortant par conteneur
- Nombre de conteneurs actifs
- CPU / RAM / disque disponibles sur l'EC2

Accessible dans Grafana via : **Dashboards → Portfolio → Portfolio - Conteneurs Docker**

---

## 🛑 Arreter la stack monitoring

```bash
docker compose -f docker-compose.monitoring.yml down
```text

Pour supprimer aussi les donnees stockees (historique des metriques) :
```
docker compose -f docker-compose.monitoring.yml down -v
```

---

## 🔧 Depannage

### Le dashboard n'affiche aucune donnee
```text
# Verifier que cAdvisor voit bien les conteneurs
curl http://localhost:8081/metrics | grep portfolio

# Verifier les cibles dans Prometheus
# Aller sur http://<IP_EC2>:9090/targets
# Tous les jobs doivent etre "UP"
```text

### Erreur "network not found" au demarrage
```text
# Verifier le nom exact du reseau principal
docker network ls

# Mettre a jour le nom dans docker-compose.monitoring.yml si different
```