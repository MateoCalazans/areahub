/**
 * Serviço de Autenticação
 * Responsável por realizar requisições relacionadas a autenticação
 */

import api from './api';

const authService = {
  // Realizar login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Realizar registro
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Renovar token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Realizar logout
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  // Obter token do localStorage
  getToken: () => localStorage.getItem('token'),

  // Verificar se está autenticado
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authService;
