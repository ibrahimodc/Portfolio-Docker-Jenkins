const Projet = require('../models/Projet');

exports.getAllProjets = async (_req, res) => {
  try {
    const projets = await Projet.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projets.length, data: projets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des projets.' });
  }
};

exports.getProjetById = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);
    if (!projet) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé.' });
    }
    res.json({ success: true, data: projet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération du projet.' });
  }
};

exports.createProjet = async (req, res) => {
  try {
    const { libelle, description, technologies, lien, imageUrl } = req.body;
    if (!libelle) {
      return res.status(400).json({ success: false, message: 'Le libellé est obligatoire.' });
    }

    const projet = await Projet.create({
      libelle,
      description: description || '',
      technologies: Array.isArray(technologies)
        ? technologies
        : technologies
          ? technologies.split(',').map((t) => t.trim())
          : [],
      lien: lien || '',
      imageUrl: imageUrl || '',
    });

    res.status(201).json({ success: true, data: projet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la création du projet.' });
  }
};

exports.updateProjet = async (req, res) => {
  try {
    const { libelle, description, technologies, lien, imageUrl } = req.body;
    const update = {
      ...(libelle !== undefined && { libelle }),
      ...(description !== undefined && { description }),
      ...(technologies !== undefined && {
        technologies: Array.isArray(technologies)
          ? technologies
          : technologies.split(',').map((t) => t.trim()),
      }),
      ...(lien !== undefined && { lien }),
      ...(imageUrl !== undefined && { imageUrl }),
    };

    const projet = await Projet.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!projet) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé.' });
    }

    res.json({ success: true, data: projet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la mise à jour du projet.' });
  }
};

exports.deleteProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);
    if (!projet) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé.' });
    }
    res.json({ success: true, message: 'Projet supprimé.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la suppression du projet.' });
  }
};

exports.apiHealth = (_req, res) => {
  res.json({ success: true, message: '🚀 Portfolio API opérationnelle.', version: '2.0.0' });
};
