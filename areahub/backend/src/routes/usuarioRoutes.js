const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// GET /api/usuarios - Listar todos (ADMINISTRADOR)
router.get('/', authMiddleware, roleMiddleware(['ADMINISTRADOR']), usuarioController.listar);

// GET /api/usuarios/:id - Buscar por ID (ADMINISTRADOR)
router.get('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR']), usuarioController.buscarPorId);

// POST /api/usuarios - Criar usuario (ADMINISTRADOR)
router.post('/', authMiddleware, roleMiddleware(['ADMINISTRADOR']), usuarioController.criar);

// PUT /api/usuarios/:id - Atualizar usuario (ADMINISTRADOR)
router.put('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR']), usuarioController.atualizar);

// PATCH /api/usuarios/:id/status - Ativar/desativar usuario (ADMINISTRADOR)
router.patch('/:id/status', authMiddleware, roleMiddleware(['ADMINISTRADOR']), usuarioController.alterarStatus);

// DELETE /api/usuarios/:id - Deletar usuario (ADMINISTRADOR)
router.delete('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR']), usuarioController.deletar);

module.exports = router;
