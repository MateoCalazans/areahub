const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// GET /api/reservas - Listar reservas (autenticado)
router.get('/', authMiddleware, reservaController.listar);

// GET /api/reservas/:id - Buscar por ID (autenticado)
router.get('/:id', authMiddleware, reservaController.buscarPorId);

// POST /api/reservas - Criar reserva (CONDOMINO)
router.post('/', authMiddleware, roleMiddleware(['CONDOMINO']), reservaController.criar);

// PUT /api/reservas/:id - Atualizar reserva (autenticado)
router.put('/:id', authMiddleware, reservaController.atualizar);

// DELETE /api/reservas/:id - Cancelar reserva (autenticado)
router.delete('/:id', authMiddleware, reservaController.cancelar);

// PATCH /api/reservas/:id/aprovar - Aprovar reserva (SINDICO/ADMINISTRADOR)
router.patch('/:id/aprovar', authMiddleware, roleMiddleware(['SINDICO', 'ADMINISTRADOR']), reservaController.aprovar);

// PATCH /api/reservas/:id/rejeitar - Rejeitar reserva (SINDICO/ADMINISTRADOR)
router.patch('/:id/rejeitar', authMiddleware, roleMiddleware(['SINDICO', 'ADMINISTRADOR']), reservaController.rejeitar);

module.exports = router;
