const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const areaRoutes = require('./routes/areaRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const condominoRoutes = require('./routes/condominoRoutes');
const perfilRoutes = require('./routes/perfilRoutes');

const app = express();

// Middlewares globais
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/condominos', condominoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', mensagem: 'Servidor AreaHub funcionando' });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno do servidor',
  });
});

module.exports = app;
