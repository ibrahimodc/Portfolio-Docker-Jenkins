const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');

router.get('/projets', projetController.getAllProjets);
router.get('/projets/:id', projetController.getProjetById);
router.post('/projets', projetController.createProjet);
router.put('/projets/:id', projetController.updateProjet);
router.delete('/projets/:id', projetController.deleteProjet);
router.get('/', projetController.apiHealth);

module.exports = router;
