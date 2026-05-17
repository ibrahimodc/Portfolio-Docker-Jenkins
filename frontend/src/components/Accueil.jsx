import React from 'react';
import { Link } from 'react-router-dom';

function Accueil() {
  const tools = [
    "AWS", "Kubernetes", "Docker", "Terraform",
    "Ansible", "GitLab CI", "Vault", "Prometheus",
    "Grafana", "Trivy", "SonarQube", "Linux"
  ];

  return (
    <div className="accueil">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text-side">
            <div className="hero-label">☁️ Cloud &amp; DevSecOps Engineer</div>
            <h1 className="hero-titre">
              Infrastructure sécurisée,<br />
              <span className="hero-titre-accent">déployée dans le Cloud</span>
            </h1>
            <p className="hero-sous-titre">
              Bienvenue sur mon portfolio. Je suis <strong>Ibrahima Diallo</strong>, apprenant à Orange Digital Center (ODC SENEGAL) en vue d'être un ingénieur spécialisé
              en Cloud Computing et DevSecOps. Je conçois des infrastructures automatisées, résilientes
              et sécurisées — du code à la production.
            </p>
            <div className="hero-actions">
              <Link to="/projets" className="btn btn-principal">Voir mes projets</Link>
              <Link to="/apropos" className="btn btn-secondaire">En savoir plus</Link>
            </div>
            <div className="hero-tools">
              {tools.map((tool, i) => (
                <span key={i} className="hero-tool-badge">{tool}</span>
              ))}
            </div>
          </div>
          <div className="hero-image-side">
            <div className="hero-avatar-container">
              <div className="hero-avatar-glow" />
              <img
                src="/assets/team/ibrahim-diallo.jpg"
                alt="Ibrahima Diallo — Cloud & DevSecOps Engineer"
                className="hero-avatar-img"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x500/0369a1/ffffff?text=Ibrahima+Diallo';
                }}
              />
              <div className="hero-avatar-badge hero-avatar-badge--top">
                <span>🔐</span> Security First
              </div>
              <div className="hero-avatar-badge hero-avatar-badge--bottom">
                <span>⚡</span> CI/CD Expert
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What I do */}
      <section className="presentation">
        <h2 className="section-titre-center">Ce que je compte faire</h2>
        <p className="section-sous-titre-center">
          Mon expertise couvre l'ensemble du cycle de vie de l'infrastructure cloud moderne,
          avec un accent fort sur la sécurité intégrée dès la conception.
        </p>
        <div className="competences">
          <div className="competence">
            <div className="competence-icon-wrapper">☁️</div>
            <h3>Cloud Architecture</h3>
            <p>Conception et déploiement d'infrastructures multi-cloud sur AWS, Azure et GCP avec Terraform et Kubernetes.</p>
          </div>
          <div className="competence">
            <div className="competence-icon-wrapper">🔄</div>
            <h3>CI/CD &amp; Automatisation</h3>
            <p>Pipelines DevOps end-to-end avec GitLab CI, GitHub Actions, Jenkins. Infrastructure as Code avec Ansible.</p>
          </div>
          <div className="competence">
            <div className="competence-icon-wrapper">🛡️</div>
            <h3>DevSecOps</h3>
            <p>Intégration native de la sécurité — SAST, DAST, scanning de conteneurs, gestion des secrets avec Vault.</p>
          </div>
          <div className="competence">
            <div className="competence-icon-wrapper">📊</div>
            <h3>Monitoring &amp; Observabilité</h3>
            <p>Stack Prometheus/Grafana, ELK, alerting proactif et dashboards de performance en temps réel.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Accueil;
