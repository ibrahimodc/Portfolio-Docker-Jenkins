/**
 * Redimensionne et compresse une image via Canvas.
 * @param {File} file - Fichier image sélectionné
 * @param {number} maxWidth - Largeur maximale (défaut 800px)
 * @param {number} maxHeight - Hauteur maximale (défaut 600px)
 * @param {number} quality - Qualité JPEG 0-1 (défaut 0.72)
 * @returns {Promise<string>} base64 compressée
 */
export function compresserImage(file, maxWidth = 800, maxHeight = 600, quality = 0.72) {
  return new Promise((resolve, reject) => {
    // Crée un lecteur de fichier pour lire l'image
    const reader = new FileReader();
    reader.onerror = reject;
    
    // Traite le fichier une fois qu'il est chargé
    reader.onload = (ev) => {
      // Crée une nouvelle image pour obtenir ses dimensions
      const img = new Image();
      img.onerror = reject;
      
      // Redimensionne l'image une fois qu'elle est chargée
      img.onload = () => {
        // Récupère les dimensions originales
        let { width, height } = img;

        // Calcule les nouvelles dimensions si l'image dépasse les limites
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Crée un canvas et dessine l'image redimensionnée
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        // Convertit le canvas en base64 JPEG compressé
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target.result;
    };
    // Lit le fichier en format base64
    reader.readAsDataURL(file);
  });
}
/** Cette fonction peut être utilisée pour compresser une image avant de l'envoyer à un serveur 
ou de l'afficher dans une application web, réduisant ainsi la taille du fichier tout en maintenant une qualité acceptable. */