const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, perfilController.buscarPerfil);
router.put('/', authMiddleware, perfilController.atualizarPerfil);

module.exports = router;
