const express = require('express');
const router = express.Router();
const condominoController = require('../controllers/condominoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// GET /api/condominos - Listar todos (SINDICO/ADMINISTRADOR)
router.get('/', authMiddleware, roleMiddleware(['SINDICO', 'ADMINISTRADOR']), condominoController.listar);

// GET /api/condominos/:id - Buscar por ID (autenticado)
router.get('/:id', authMiddleware, condominoController.buscarPorId);

// POST /api/condominos - Criar condomino (SINDICO/ADMINISTRADOR)
router.post('/', authMiddleware, roleMiddleware(['SINDICO', 'ADMINISTRADOR']), condominoController.criar);

// PUT /api/condominos/:id - Atualizar condomino (SINDICO/ADMINISTRADOR)
router.put('/:id', authMiddleware, roleMiddleware(['SINDICO', 'ADMINISTRADOR']), condominoController.atualizar);

// DELETE /api/condominos/:id - Deletar condomino (SINDICO/ADMINISTRADOR)
router.delete('/:id', authMiddleware, roleMiddleware(['SINDICO', 'ADMINISTRADOR']), condominoController.deletar);

module.exports = router;
