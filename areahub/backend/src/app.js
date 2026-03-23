/**
 * Express App Principal
 * Responsável pela configuração da aplicação Express com middlewares e rotas
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const areaRoutes = require('./routes/areaRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

// Registrar rotas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/reservas', reservaRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware de erro global (simples)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

module.exports = app;
