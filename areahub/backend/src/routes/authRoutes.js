/**
 * Rotas de Autenticação
 * Responsável pelos endpoints de login, register, refresh e logout
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /auth/login - Realizar login
router.post('/login', authController.login);

// POST /auth/register - Realizar cadastro
router.post('/register', authController.register);

// POST /auth/refresh - Renovar token JWT
router.post('/refresh', authMiddleware, authController.refreshToken);

// POST /auth/logout - Realizar logout
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
