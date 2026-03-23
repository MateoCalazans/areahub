/**
 * Rotas de Reservas
 * Responsável pelos endpoints de CRUD e gerenciamento de reservas
 */

const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// GET /reservas - Listar todas as reservas
router.get('/', authMiddleware, reservaController.listar);

// GET /reservas/:id - Buscar reserva por ID
router.get('/:id', authMiddleware, reservaController.buscarPorId);

// POST /reservas - Criar nova reserva
router.post('/', authMiddleware, reservaController.criar);

// PATCH /reservas/:id - Atualizar reserva
router.patch('/:id', authMiddleware, reservaController.atualizar);

// POST /reservas/:id/cancelar - Cancelar reserva
router.post('/:id/cancelar', authMiddleware, reservaController.cancelar);

// POST /reservas/:id/aprovar - Aprovar reserva (apenas admin/síndico)
router.post('/:id/aprovar', authMiddleware, roleMiddleware(['admin', 'sindico']), reservaController.aprovar);

// POST /reservas/:id/rejeitar - Rejeitar reserva (apenas admin/síndico)
router.post('/:id/rejeitar', authMiddleware, roleMiddleware(['admin', 'sindico']), reservaController.rejeitar);

// DELETE /reservas/:id - Deletar reserva
router.delete('/:id', authMiddleware, reservaController.deletar);

module.exports = router;
