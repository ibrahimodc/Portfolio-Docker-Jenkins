import React, { useState, useRef } from 'react';

const CHAMPS_VIDES = {
  libelle: '',
  imageUrl: '',
  description: '',
  technologies: '',
  lien: '',
};

function AjouterProjet({ onAjouter }) {
  const [ouvert, setOuvert]       = useState(false);
  const [champs, setChamps]       = useState(CHAMPS_VIDES);
  const [modeImage, setModeImage] = useState('url');   // 'url' | 'fichier'
  const [fichier, setFichier]     = useState(null);
  const [apercu, setApercu]       = useState('');
  const [erreurs, setErreurs]     = useState({});
  const [envoi, setEnvoi]         = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const inputFichier              = useRef(null);

  const valider = () => {
    const e = {};
    if (!champs.libelle.trim())       e.libelle     = 'Le libellé est obligatoire';
    if (champs.libelle.trim().length > 80) e.libelle = 'Maximum 80 caractères';
    if (modeImage === 'url' && !champs.imageUrl.trim()) e.image = "L'URL de l'image est obligatoire";
    if (modeImage === 'fichier' && !fichier)            e.image = 'Veuillez sélectionner une image';
    if (!champs.description.trim())   e.description  = 'La description est obligatoire';
    if (!champs.technologies.trim())  e.technologies = 'Au moins une technologie est requise';
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
    if (erreurs.image) setErreurs((prev) => ({ ...prev, image: undefined }));
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
    setErreurs((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = valider();
    if (Object.keys(validation).length > 0) { setErreurs(validation); return; }

    setEnvoi(true);
    try {
      await onAjouter(
        {
          libelle:      champs.libelle.trim(),
          image:        modeImage === 'url' ? champs.imageUrl.trim() : '',
          description:  champs.description.trim(),
          technologies: champs.technologies.split(',').map((t) => t.trim()).filter(Boolean),
          lien:         champs.lien.trim() || null,
        },
        modeImage === 'fichier' ? fichier : null
      );
      setChamps(CHAMPS_VIDES);
      setFichier(null);
      setApercu('');
      setModeImage('url');
      setOuvert(false);
    } finally {
      setEnvoi(false);
    }
  };

  const handleAnnuler = () => {
    setChamps(CHAMPS_VIDES);
    setFichier(null);
    setApercu('');
    setModeImage('url');
    setErreurs({});
    setOuvert(false);
  };

  return (
    <div className="ajouter-wrapper">
      {!ouvert ? (
        <button className="btn btn-ajouter-toggle" onClick={() => setOuvert(true)}>
          <span className="btn-plus">+</span> Nouveau projet
        </button>
      ) : (
        <div className="ajouter-form-card">
          <div className="ajouter-form-header">
            <h2 className="ajouter-titre">Ajouter un projet</h2>
            <button className="btn-fermer" onClick={handleAnnuler} title="Fermer">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="ajouter-form" noValidate>
            {/* Libellé */}
            <div className="champ-groupe">
              <label className="champ-label" htmlFor="libelle">
                Libellé <span className="champ-requis">*</span>
              </label>
              <input
                id="libelle" name="libelle" type="text"
                className={`champ-input${erreurs.libelle ? ' champ-erreur' : ''}`}
                placeholder="Nom du projet"
                value={champs.libelle} onChange={handleChange} maxLength={80} autoFocus
              />
              {erreurs.libelle && <span className="erreur-msg">{erreurs.libelle}</span>}
            </div>

            {/* Image — onglets URL / Fichier */}
            <div className="champ-groupe">
              <label className="champ-label">
                Image du projet <span className="champ-requis">*</span>
              </label>
              <div className="image-onglets">
                <button
                  type="button"
                  className={`image-onglet${modeImage === 'url' ? ' actif' : ''}`}
                  onClick={() => changerMode('url')}
                >
                  🔗 URL
                </button>
                <button
                  type="button"
                  className={`image-onglet${modeImage === 'fichier' ? ' actif' : ''}`}
                  onClick={() => changerMode('fichier')}
                >
                  📁 Fichier local
                </button>
              </div>

              {modeImage === 'url' ? (
                <input
                  name="imageUrl" type="url"
                  className={`champ-input${erreurs.image ? ' champ-erreur' : ''}`}
                  placeholder="https://exemple.com/image.png"
                  value={champs.imageUrl} onChange={handleChange}
                />
              ) : (
                <div
                  className={`upload-zone${dragOver ? ' drag-over' : ''}${erreurs.image ? ' champ-erreur' : ''}`}
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

              {erreurs.image && <span className="erreur-msg">{erreurs.image}</span>}

              {/* Prévisualisation */}
              {apercu && (
                <div className="image-apercu">
                  <img src={apercu} alt="Aperçu" onError={() => setApercu('')} />
                  <button type="button" className="apercu-suppr" onClick={() => { setApercu(''); setFichier(null); setChamps(p => ({ ...p, imageUrl: '' })); }}>✕</button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="champ-groupe">
              <label className="champ-label" htmlFor="description">
                Description <span className="champ-requis">*</span>
              </label>
              <textarea
                id="description" name="description" rows={3}
                className={`champ-input champ-textarea${erreurs.description ? ' champ-erreur' : ''}`}
                placeholder="Description du projet…"
                value={champs.description} onChange={handleChange}
              />
              {erreurs.description && <span className="erreur-msg">{erreurs.description}</span>}
            </div>

            {/* Technologies */}
            <div className="champ-groupe">
              <label className="champ-label" htmlFor="technologies">
                Technologies <span className="champ-requis">*</span>
              </label>
              <input
                id="technologies" name="technologies" type="text"
                className={`champ-input${erreurs.technologies ? ' champ-erreur' : ''}`}
                placeholder="React, Node.js, MongoDB…"
                value={champs.technologies} onChange={handleChange}
              />
              {erreurs.technologies && <span className="erreur-msg">{erreurs.technologies}</span>}
              <span className="champ-aide">Séparer les technologies par une virgule</span>
            </div>

            {/* Lien */}
            <div className="champ-groupe">
              <label className="champ-label" htmlFor="lien">Lien du projet</label>
              <input
                id="lien" name="lien" type="url"
                className="champ-input"
                placeholder="https://github.com/…"
                value={champs.lien} onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-annuler" onClick={handleAnnuler}>Annuler</button>
              <button type="submit" className="btn btn-valider" disabled={envoi}>
                {envoi ? 'Ajout…' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AjouterProjet;
