/**
 * Serviço de Áreas
 * Responsável por requisições relacionadas a áreas comuns
 */

import api from './api';

const areaService = {
  // Listar todas as áreas
  listar: async () => {
    const response = await api.get('/areas');
    return response.data;
  },

  // Buscar área por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/areas/${id}`);
    return response.data;
  },

  // Criar nova área
  criar: async (nome, descricao, condominio_id, capacidade) => {
    const response = await api.post('/areas', { nome, descricao, condominio_id, capacidade });
    return response.data;
  },

  // Atualizar área
  atualizar: async (id, updates) => {
    const response = await api.patch(`/areas/${id}`, updates);
    return response.data;
  },

  // Deletar área
  deletar: async (id) => {
    const response = await api.delete(`/areas/${id}`);
    return response.data;
  },
};

export default areaService;
