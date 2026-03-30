const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// GET /api/areas - Listar todas (autenticado)
router.get('/', authMiddleware, areaController.listar);

// GET /api/areas/:id - Buscar por ID (autenticado)
router.get('/:id', authMiddleware, areaController.buscarPorId);

// GET /api/areas/:id/disponibilidade - Verificar disponibilidade (autenticado)
router.get('/:id/disponibilidade', authMiddleware, areaController.verificarDisponibilidade);

// POST /api/areas - Criar area (SINDICO/ADMINISTRADOR)
router.post('/', authMiddleware, roleMiddleware(['SINDICO', 'ADMINISTRADOR']), areaController.criar);

// PUT /api/areas/:id - Atualizar area (SINDICO/ADMINISTRADOR)
router.put('/:id', authMiddleware, roleMiddleware(['SINDICO', 'ADMINISTRADOR']), areaController.atualizar);

// DELETE /api/areas/:id - Deletar area (SINDICO/ADMINISTRADOR)
router.delete('/:id', authMiddleware, roleMiddleware(['SINDICO', 'ADMINISTRADOR']), areaController.deletar);

module.exports = router;
