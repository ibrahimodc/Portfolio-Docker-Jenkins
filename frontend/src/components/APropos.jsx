import React from "react";
import { Link } from "react-router-dom";

function APropos() {
  const competences = [
    {
      categorie: "Cloud & Infrastructure",
      icon: "☁️",
      items: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Docker"],
    },
    {
      categorie: "DevSecOps",
      icon: "🔐",
      items: [
        "CI/CD Pipelines",
        "GitLab CI",
        "GitHub Actions",
        "Jenkins",
        "SAST / DAST",
        "SonarQube",
      ],
    },
    {
      categorie: "Sécurité & Monitoring",
      icon: "🛡️",
      items: [
        "Vault (HashiCorp)",
        "Trivy",
        "Falco",
        "Prometheus",
        "Grafana",
        "ELK Stack",
      ],
    },
    {
      categorie: "Systèmes & Réseaux",
      icon: "🖥️",
      items: [
        "Linux (Ubuntu, RHEL)",
        "Ansible",
        "Nginx",
        "VPN / Firewalls",
        "DNS",
        "Load Balancing",
      ],
    },
  ];

  const experiences = [
    {
      poste: "Ingénieur DevSecOps",
      entreprise: "Cloud Ops Africa",
      periode: "2026 – Présent",
      description:
        "Mise en place de pipelines CI/CD sécurisés, déploiement sur AWS EKS, intégration d'outils SAST/DAST dans les workflows de développement.",
    },
    {
      poste: "Administrateur Systèmes & Cloud",
      entreprise: "Sonatel Digital",
      periode: "2026 – en cours",
      description:
        "Administration des infrastructures cloud hybrides, automatisation avec Ansible et Terraform, supervision des architectures haute disponibilité.",
    },
    {
      poste: "Technicien Systèmes & Réseaux",
      entreprise: "Orange Sénégal",
      periode: "2020 – 2024",
      description:
        "Gestion des serveurs Linux, maintenance réseau, déploiement de services web et bases de données.",
    },
  ];

  const certifications = [
    {
      nom: "AWS Certified Solutions Architect",
      organisme: "Amazon Web Services",
      annee: "2026",
    },
    {
      nom: "Certified Kubernetes Administrator (CKA)",
      organisme: "CNCF",
      annee: "future",
    },
    {
      nom: "HashiCorp Vault Associate",
      organisme: "HashiCorp",
      annee: "future",
    },
    { nom: "CompTIA Security+", organisme: "CompTIA", annee: "future" },
  ];

  return (
    <div className="apropos">
      {/* Hero Section */}
      <section className="apropos-hero">
        <div className="apropos-hero-content">
          <div className="apropos-avatar-wrapper">
            <div className="apropos-avatar-ring">
              <img
                src="/assets/team/ibrahim-diallo.jpg"
                alt="Ibrahima Diallo"
                className="apropos-avatar"
                onError={(e) => {
                  e.target.src = `https://placehold.co/200x200/0369a1/ffffff?text=ID`;
                }}
              />
            </div>
            <div className="apropos-status">
              <span className="status-dot" />
              Disponible
            </div>
          </div>
          <div className="apropos-hero-text">
            <div className="apropos-badge">
              ☁️ Cloud &amp; DevSecOps Engineer
            </div>
            <h1 className="apropos-nom">Ibrahima Diallo</h1>
            <p className="apropos-titre-poste">
              Ingénieur Cloud · DevSecOps · SysAdmin
            </p>
            <p className="apropos-bio">
              Passionné par l'automatisation, la sécurité des infrastructures et
              le cloud natif, je suis apprenant de la Sonatel Academie en AWS
              dans le but de pouvoir concevoir et déployer des architectures
              résilientes et sécurisées. Mon approche combine{" "}
              <strong>Infrastructure as Code</strong>, pipelines{" "}
              <strong>CI/CD</strong> robustes et intégration native de la
              sécurité dans chaque étape du cycle de vie logiciel.
            </p>
            <div className="apropos-hero-actions">
              <Link to="/projets" className="btn btn-principal">
                Voir mes projets
              </Link>
              <Link to="/contact" className="btn btn-secondaire">
                Me contacter
              </Link>
            </div>
            <div className="apropos-socials">
              <a
                href="https://github.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <span>⌨️</span> GitHub
              </a>
              <a
                href="https://www.linkedin.com/feed/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <span>💼</span> LinkedIn
              </a>
              <a href="https://maps.app.goo.gl/QRVo3GdPx6v4rBb7A">
                <span className="social-link">
                  <span>📍</span> Dakar, Sénégal
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Compétences */}
      <section className="apropos-section">
        <h2 className="apropos-section-titre">
          <span className="section-titre-accent">// </span>Compétences
          techniques visées
        </h2>
        <div className="competences-grid">
          {competences.map((cat, i) => (
            <div key={i} className="competence-card">
              <div className="competence-card-header">
                <span className="competence-icon">{cat.icon}</span>
                <h3>{cat.categorie}</h3>
              </div>
              <div className="competence-tags">
                {cat.items.map((item, j) => (
                  <span key={j} className="competence-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expériences */}
      <section className="apropos-section">
        <h2 className="apropos-section-titre">
          <span className="section-titre-accent">// </span>Expériences
          professionnelles visées
        </h2>
        <div className="timeline">
          {experiences.map((exp, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-poste">{exp.poste}</h3>
                    <p className="timeline-entreprise">{exp.entreprise}</p>
                  </div>
                  <span className="timeline-periode">{exp.periode}</span>
                </div>
                <p className="timeline-description">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="apropos-section">
        <h2 className="apropos-section-titre">
          <span className="section-titre-accent">// </span>Certifications visées
        </h2>
        <div className="certif-grid">
          {certifications.map((cert, i) => (
            <div key={i} className="certif-card">
              <div className="certif-icon">🏅</div>
              <div>
                <h4 className="certif-nom">{cert.nom}</h4>
                <p className="certif-organisme">
                  {cert.organisme} · {cert.annee}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default APropos;
