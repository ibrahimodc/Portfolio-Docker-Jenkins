/**
 * imageUrl.js
 * Retourne l'URL correcte pour afficher une image de projet.
 *
 * - Si l'image commence par "http" → URL externe, on la retourne telle quelle
 * - Si l'image commence par "/uploads/" → fichier uploadé localement,
 *   en développement le proxy Vite redirige vers le backend (localhost:3001),
 *   en production Express sert directement /uploads depuis le même serveur.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export function getImageUrl(imagePath) {
  if (!imagePath) return null;

  // URL externe (http:// ou https://)
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Chemin local uploadé — en dev le proxy Vite gère la redirection
  // En prod, VITE_BACKEND_URL peut être défini si frontend et backend sont séparés
  if (imagePath.startsWith("/uploads/")) {
    return `${BACKEND_URL}${imagePath}`;
  }

  return imagePath;
}
