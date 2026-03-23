/**
 * Rotas de Usuários
 * Responsável pelos endpoints de CRUD de usuários
 */

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// GET /usuarios - Listar todos os usuários
router.get('/', authMiddleware, roleMiddleware(['admin', 'sindico']), usuarioController.listar);

// GET /usuarios/:id - Buscar usuário por ID
router.get('/:id', authMiddleware, usuarioController.buscarPorId);

// POST /usuarios - Criar novo usuário
router.post('/', authMiddleware, roleMiddleware(['admin']), usuarioController.criar);

// PATCH /usuarios/:id - Atualizar usuário
router.patch('/:id', authMiddleware, usuarioController.atualizar);

// DELETE /usuarios/:id - Deletar usuário
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), usuarioController.deletar);

module.exports = router;
