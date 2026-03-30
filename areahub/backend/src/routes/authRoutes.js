const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/auth/login - Login (publico)
router.post('/login', authController.login);

// POST /api/auth/primeiro-acesso - Forcar troca de senha no primeiro acesso
router.post('/primeiro-acesso', authMiddleware, authController.primeiroAcesso);

// POST /api/auth/redefinir-senha - Trocar senha de usuario autenticado
router.post('/redefinir-senha', authMiddleware, authController.redefinirSenha);

// POST /api/auth/logout - Logout (autenticado)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
