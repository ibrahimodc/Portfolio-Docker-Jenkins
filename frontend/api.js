/**
 * api.js — Client API Portfolio
 * Communique avec le backend Express (projects.json)
 */

const API_BASE = 'http://localhost:5000/api';

// ── Helper fetch ──────────────────────────────────────────────────────────────
async function request(url, options = {}) {
  const res  = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Erreur HTTP ${res.status}`);
  return json;
}

// ── API Projets ───────────────────────────────────────────────────────────────

/** Récupérer tous les projets */
async function getProjets() {
  const json = await request(`${API_BASE}/projets`);
  return json.data;
}

/** Récupérer un projet par ID */
async function getProjet(id) {
  const json = await request(`${API_BASE}/projets/${id}`);
  return json.data;
}

/** Créer un nouveau projet
 * @param {{ libelle, description, technologies, lien, imageUrl }} data
 * @param {File|null} file - image locale optionnelle
 */
async function addProjet(data, file = null) {
  if (file) {
    const form = new FormData();
    form.append('image', file);
    form.append('libelle', data.libelle);
    form.append('description', data.description || '');
    form.append('technologies', (data.technologies || []).join(','));
    if (data.lien) form.append('lien', data.lien);
    const res = await fetch(`${API_BASE}/projets`, { method: 'POST', body: form });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `Erreur HTTP ${res.status}`);
    return json.data;
  }
  const json = await request(`${API_BASE}/projets`, {
    method : 'POST',
    body   : JSON.stringify(data),
  });
  return json.data;
}

/** Modifier un projet existant
 * @param {string} id
 * @param {{ libelle?, description?, technologies?, lien?, imageUrl? }} data
 */
async function updateProjet(id, data) {
  const json = await request(`${API_BASE}/projets/${id}`, {
    method : 'PUT',
    body   : JSON.stringify(data),
  });
  return json.data;
}

/** Supprimer un projet */
async function deleteProjet(id) {
  return request(`${API_BASE}/projets/${id}`, { method: 'DELETE' });
}
