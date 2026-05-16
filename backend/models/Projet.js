const mongoose = require('mongoose');

const ProjetSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      trim: true,
      required: [true, 'Le libellé est obligatoire.'],
    },
    description: {
      type: String,
      default: '',
    },
    technologies: {
      type: [String],
      default: [],
    },
    lien: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Projet', ProjetSchema);
