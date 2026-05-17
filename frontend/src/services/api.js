/**
 * src/services/api.js
 * Couche d'accès à l'API REST Express/MongoDB.
 * Supporte l'envoi de FormData (image locale) ou JSON (URL).
 */

const API_URL = "/api/projets";

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Erreur HTTP ${res.status}`);
  return json;
}

export async function getProjets() {
  const json = await request(API_URL);
  return json.data;
}

export async function getProjet(id) {
  const json = await request(`${API_URL}/${id}`);
  return json.data;
}

/**
 * Ajouter un projet.
 * @param {Object} projet  - données du projet
 * @param {File|null} file - fichier image local (optionnel)
 */
export async function addProjet(projet, file = null) {
  if (file) {
    const form = new FormData();
    form.append("image", file);
    form.append("libelle", projet.libelle);
    form.append("description", projet.description);
    form.append("technologies", projet.technologies.join(","));
    if (projet.lien) form.append("lien", projet.lien);
    const json = await request(API_URL, { method: "POST", body: form });
    return json.data;
  }
  const json = await request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projet),
  });
  return json.data;
}

/**
 * Modifier un projet.
 * @param {string} id
 * @param {Object} projet
 * @param {File|null} file - nouvelle image locale (optionnel)
 */
export async function updateProjet(id, projet, file = null) {
  if (file) {
    const form = new FormData();
    form.append("image", file);
    form.append("libelle", projet.libelle);
    form.append("description", projet.description);
    form.append("technologies", projet.technologies.join(","));
    if (projet.lien) form.append("lien", projet.lien);
    const json = await request(`${API_URL}/${id}`, {
      method: "PUT",
      body: form,
    });
    return json.data;
  }
  const json = await request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projet),
  });
  return json.data;
}

export async function deleteProjet(id) {
  await request(`${API_URL}/${id}`, { method: "DELETE" });
  return true;
}
