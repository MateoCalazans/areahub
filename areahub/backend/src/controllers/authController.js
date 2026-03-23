/**
 * Controller de Autenticação
 * Responsável por login, registro e gerenciamento de tokens JWT
 */

const authService = require('../services/authService');

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO: Implementar lógica de login
    res.status(200).json({ message: 'ok', token: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registro de novo usuário
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // TODO: Implementar lógica de registro
    res.status(201).json({ message: 'ok', user: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh do token
exports.refreshToken = async (req, res) => {
  try {
    // TODO: Implementar lógica de refresh de token
    res.status(200).json({ message: 'ok', token: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout do usuário
exports.logout = async (req, res) => {
  try {
    // TODO: Implementar lógica de logout
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
