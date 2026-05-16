import React, { useState, useRef } from 'react';
import { getImageUrl } from '../services/imageUrl';

function EditerProjet({ projet, onValider, onAnnuler }) {
  const imageInitiale = projet.image || '';
  const modeInitial   = imageInitiale.startsWith('http') ? 'url' : (imageInitiale.startsWith('/uploads/') ? 'fichier' : 'url');
  const apercuInitial = getImageUrl(imageInitiale) || '';

  const [champs, setChamps]       = useState({
    libelle:      projet.libelle || '',
    imageUrl:     modeInitial === 'url' ? imageInitiale : '',
    description:  projet.description || '',
    technologies: projet.technologies?.join(', ') || '',
    lien:         projet.lien || '',
  });
  const [modeImage, setModeImage] = useState(modeInitial);
  const [fichier, setFichier]     = useState(null);
  const [apercu, setApercu]       = useState(apercuInitial);
  const [erreurs, setErreurs]     = useState({});
  const [envoi, setEnvoi]         = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const inputFichier              = useRef(null);

  const valider = () => {
    const e = {};
    if (!champs.libelle.trim()) e.libelle = 'Le libellé est obligatoire';
    if (champs.libelle.trim().length > 80) e.libelle = 'Maximum 80 caractères';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChamps((prev) => ({ ...prev, [name]: value }));
    if (erreurs[name]) setErreurs((prev) => ({ ...prev, [name]: undefined }));
    if (name === 'imageUrl') setApercu(value);
  };

  const handleFichier = (file) => {
    if (!file) return;
    setFichier(file);
    setApercu(URL.createObjectURL(file));
  };

  const handleInputFichier = (e) => handleFichier(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFichier(e.dataTransfer.files[0]);
  };

  const changerMode = (mode) => {
    setModeImage(mode);
    setFichier(null);
    setApercu(mode === 'url' ? champs.imageUrl : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = valider();
    if (Object.keys(validation).length > 0) { setErreurs(validation); return; }

    setEnvoi(true);
    try {
      await onValider(
        {
          libelle:      champs.libelle.trim(),
          image:        modeImage === 'url' ? champs.imageUrl.trim() : (projet.image || ''),
          description:  champs.description.trim(),
          technologies: champs.technologies
            ? champs.technologies.split(',').map((t) => t.trim()).filter(Boolean)
            : [],
          lien: champs.lien.trim(),
        },
        modeImage === 'fichier' ? fichier : null
      );
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="editer-projet">
      <div className="editer-entete">
        <h1>Modifier le projet</h1>
      </div>

      <form className="editer-form" onSubmit={handleSubmit} noValidate>
        {/* Libellé */}
        <div className="champ-groupe">
          <label htmlFor="libelle">Libellé <span className="champ-requis">*</span></label>
          <input
            id="libelle" name="libelle" type="text"
            value={champs.libelle} onChange={handleChange}
            className={erreurs.libelle ? 'champ-input champ-erreur' : 'champ-input'}
            maxLength={80} autoFocus
          />
          {erreurs.libelle && <span className="erreur-msg">{erreurs.libelle}</span>}
        </div>

        {/* Image — onglets */}
        <div className="champ-groupe">
          <label className="champ-label">Image du projet</label>
          <div className="image-onglets">
            <button type="button" className={`image-onglet${modeImage === 'url' ? ' actif' : ''}`} onClick={() => changerMode('url')}>
              🔗 URL
            </button>
            <button type="button" className={`image-onglet${modeImage === 'fichier' ? ' actif' : ''}`} onClick={() => changerMode('fichier')}>
              📁 Fichier local
            </button>
          </div>

          {modeImage === 'url' ? (
            <input
              name="imageUrl" type="url"
              className="champ-input"
              placeholder="https://exemple.com/image.png"
              value={champs.imageUrl} onChange={handleChange}
            />
          ) : (
            <div
              className={`upload-zone${dragOver ? ' drag-over' : ''}`}
              onClick={() => inputFichier.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                ref={inputFichier} type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                style={{ display: 'none' }}
                onChange={handleInputFichier}
              />
              {fichier ? (
                <span className="upload-zone-nom">✅ {fichier.name}</span>
              ) : (
                <>
                  <span className="upload-zone-icon">☁️</span>
                  <span className="upload-zone-texte">
                    Glissez une image ici ou <strong>cliquez pour parcourir</strong>
                  </span>
                  <span className="upload-zone-aide">JPG, PNG, GIF, WebP, SVG — 5 Mo max</span>
                </>
              )}
            </div>
          )}

          {apercu && (
            <div className="image-apercu">
              <img src={apercu} alt="Aperçu" onError={() => setApercu('')} />
              <button type="button" className="apercu-suppr" onClick={() => { setApercu(''); setFichier(null); setChamps(p => ({ ...p, imageUrl: '' })); }}>✕</button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="champ-groupe">
          <label htmlFor="description">Description</label>
          <textarea
            id="description" name="description"
            value={champs.description} onChange={handleChange}
            className="champ-input champ-textarea" rows={4}
          />
        </div>

        {/* Technologies */}
        <div className="champ-groupe">
          <label htmlFor="technologies">Technologies <span className="champ-hint">(séparées par des virgules)</span></label>
          <input
            id="technologies" name="technologies" type="text"
            value={champs.technologies} onChange={handleChange}
            className="champ-input"
          />
        </div>

        {/* Lien */}
        <div className="champ-groupe">
          <label htmlFor="lien">Lien du projet</label>
          <input
            id="lien" name="lien" type="url"
            value={champs.lien} onChange={handleChange}
            className="champ-input"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-annuler" onClick={onAnnuler}>Annuler</button>
          <button type="submit" className="btn btn-valider" disabled={envoi}>
            {envoi ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditerProjet;
