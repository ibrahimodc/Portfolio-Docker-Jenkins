import React from 'react';
import { getImageUrl } from '../services/imageUrl';

function DetaillerProjet({ projet, onAnnuler, onEditer, onSupprimer }) {
  return (
    <div className="detail-projet">
      <button className="btn btn-retour" onClick={onAnnuler}>
        ← Retour aux projets
      </button>

      <div className="detail-entete">
        <h1 className="detail-titre">{projet.libelle}</h1>
        <div className="detail-badges">
          {projet.technologies?.map((tech) => (
            <span key={tech} className="tech-badge">{tech}</span>
          ))}
        </div>
      </div>

      {projet.image && (
        <div className="detail-image-wrapper">
          <img src={getImageUrl(projet.image)} alt={projet.libelle} className="detail-image" />
        </div>
      )}

      <div className="detail-corps">
        {projet.description ? (
          <p className="detail-description">{projet.description}</p>
        ) : (
          <p className="detail-description detail-description-vide">Pas de description fournie.</p>
        )}

        <div className="detail-meta">
          {projet.dateCreation && (
            <span className="detail-date">Créé le {new Date(projet.dateCreation).toLocaleDateString('fr-FR')}</span>
          )}
          {projet.lien && (
            <a href={projet.lien} target="_blank" rel="noreferrer" className="btn btn-lien">
              Voir le projet
            </a>
          )}
        </div>
      </div>

      <div className="detail-actions">
        <button className="btn btn-editer" onClick={() => onEditer(projet)}>
          Modifier
        </button>
        <button className="btn btn-supprimer" onClick={() => onSupprimer(projet._id)}>
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default DetaillerProjet;
