/**
 * Rotas de Áreas Comuns
 * Responsável pelos endpoints de CRUD de áreas
 */

const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// GET /areas - Listar todas as áreas
router.get('/', authMiddleware, areaController.listar);

// GET /areas/:id - Buscar área por ID
router.get('/:id', authMiddleware, areaController.buscarPorId);

// POST /areas - Criar nova área (apenas admin/síndico)
router.post('/', authMiddleware, roleMiddleware(['admin', 'sindico']), areaController.criar);

// PATCH /areas/:id - Atualizar área (apenas admin/síndico)
router.patch('/:id', authMiddleware, roleMiddleware(['admin', 'sindico']), areaController.atualizar);

// DELETE /areas/:id - Deletar área (apenas admin/síndico)
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'sindico']), areaController.deletar);

module.exports = router;
