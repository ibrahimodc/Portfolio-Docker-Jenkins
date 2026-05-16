import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjets, addProjet, deleteProjet, updateProjet } from '../services/api';
import Projet from './Projet';
import AjouterProjet from './AjouterProjet';
import DetaillerProjet from './DetaillerProjet';
import EditerProjet from './EditerProjet';

function Dossier() {
  const [projets, setProjets] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [notification, setNotification] = useState(null);
  const [vue, setVue] = useState('liste');
  const [projetSelectionne, setProjetSelectionne] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Chargement initial
  useEffect(() => { chargerProjets(); }, []);

  // Synchronisation URL ↔ vue
  useEffect(() => {
    if (!id) {
      if (vue !== 'editer') { setProjetSelectionne(null); setVue('liste'); }
      return;
    }
    if (projets.length === 0) return;
    // MongoDB utilise _id
    const projet = projets.find((p) => String(p._id) === String(id));
    if (projet) { setProjetSelectionne(projet); setVue('detail'); }
    else { setProjetSelectionne(null); setVue('liste'); }
  }, [id, projets]);

  const chargerProjets = async () => {
    try {
      setChargement(true);
      setErreur(null);
      const data = await getProjets();
      setProjets(data);
    } catch (err) {
      setErreur('Impossible de charger les projets. Vérifiez que le serveur Express est lancé (npm run dev dans /backend).');
    } finally {
      setChargement(false);
    }
  };

  const afficherNotification = (message, type = 'succes') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const afficherDetail = (projet) => navigate(`/projets/${projet._id}`);
  const afficherEdition = (projet) => { setProjetSelectionne(projet); setVue('editer'); };
  const retourListe = () => navigate('/projets');

  // ── Ajouter ──────────────────────────────────────────────────────────────────
  const handleAjouter = async (nouveauProjet, fichier = null) => {
    try {
      const projetCree = await addProjet(
        { ...nouveauProjet, dateCreation: new Date().toISOString().split('T')[0] },
        fichier
      );
      setProjets((prev) => [...prev, projetCree]);
      afficherNotification(`✓ Projet "${projetCree.libelle}" ajouté avec succès`);
    } catch (err) {
      afficherNotification(`✗ ${err.message}`, 'erreur');
    }
  };

  // ── Supprimer ─────────────────────────────────────────────────────────────────
  const handleSupprimer = async (idProjet) => {
    const projet = projets.find((p) => p._id === idProjet);
    if (!window.confirm(`Supprimer le projet "${projet?.libelle}" ?`)) return;
    try {
      await deleteProjet(idProjet);
      setProjets((prev) => prev.filter((p) => p._id !== idProjet));
      afficherNotification(`✓ Projet supprimé`);
      if (vue === 'detail') retourListe();
    } catch (err) {
      afficherNotification(`✗ ${err.message}`, 'erreur');
    }
  };

  // ── Éditer ────────────────────────────────────────────────────────────────────
  const handleEditer = async (donneesModifiees, fichier = null) => {
    try {
      const projetMaj = await updateProjet(projetSelectionne._id, donneesModifiees, fichier);
      setProjets((prev) =>
        prev.map((p) => (p._id === projetMaj._id ? projetMaj : p))
      );
      setProjetSelectionne(projetMaj);
      setVue('detail');
      afficherNotification(`✓ Projet "${projetMaj.libelle}" modifié`);
    } catch (err) {
      afficherNotification(`✗ ${err.message}`, 'erreur');
    }
  };

  // ── Filtrage ──────────────────────────────────────────────────────────────────
  const projetsFiltres = projets.filter((p) =>
    p.libelle?.toLowerCase().includes(recherche.toLowerCase()) ||
    p.description?.toLowerCase().includes(recherche.toLowerCase()) ||
    p.technologies?.some((t) => t.toLowerCase().includes(recherche.toLowerCase()))
  );

  // ── Rendu ─────────────────────────────────────────────────────────────────────

  if (vue === 'detail' && projetSelectionne) {
    return (
      <div className="dossier-container">
        {notification && (
          <div className={`notification notification-${notification.type}`}>
            {notification.message}
          </div>
        )}
        <DetaillerProjet
          projet={projetSelectionne}
          onAnnuler={retourListe}
          onEditer={afficherEdition}
          onSupprimer={handleSupprimer}
        />
      </div>
    );
  }

  if (vue === 'editer' && projetSelectionne) {
    return (
      <div className="dossier-container">
        <EditerProjet
          projet={projetSelectionne}
          onValider={handleEditer}
          onAnnuler={() => setVue('detail')}
        />
      </div>
    );
  }

  return (
    <div className="dossier-container">
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* En-tête */}
      <div className="dossier-entete">
        <h1 className="dossier-titre">Mes projets</h1>
        <p className="dossier-sous-titre">
          {projets.length} projet{projets.length !== 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Barre de recherche + bouton ajout */}
      <div className="dossier-toolbar">
        <div className="recherche-wrapper">
          <span className="recherche-icon">🔍</span>
          <input
            type="text"
            className="recherche-input"
            placeholder="Rechercher un projet…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          {recherche && (
            <button className="recherche-reset" onClick={() => setRecherche('')}>✕</button>
          )}
        </div>
        <AjouterProjet onAjouter={handleAjouter} />
      </div>

      {/* États : chargement / erreur / vide / liste */}
      {chargement && (
        <div className="etat-chargement">
          <div className="spinner" />
          <p>Chargement des projets…</p>
        </div>
      )}

      {!chargement && erreur && (
        <div className="etat-erreur">
          <p>{erreur}</p>
          <button className="btn btn-principal" onClick={chargerProjets}>Réessayer</button>
        </div>
      )}

      {!chargement && !erreur && projetsFiltres.length === 0 && (
        <div className="etat-vide">
          {recherche
            ? <p>Aucun projet ne correspond à « {recherche} ».</p>
            : <p>Aucun projet pour l'instant. Ajoutez votre premier projet !</p>}
        </div>
      )}

      {!chargement && !erreur && projetsFiltres.length > 0 && (
        <div className="projets-grille">
          {projetsFiltres.map((projet) => (
            <Projet
              key={projet._id}
              projet={projet}
              onSupprimer={handleSupprimer}
              onAfficherDetail={afficherDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dossier;
