/**
 * Serviço de Reservas
 * Responsável por requisições relacionadas a reservas
 */

import api from './api';

const reservaService = {
  // Listar todas as reservas
  listar: async () => {
    const response = await api.get('/reservas');
    return response.data;
  },

  // Buscar reserva por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  // Criar nova reserva
  criar: async (usuario_id, area_id, data_inicio, data_fim) => {
    const response = await api.post('/reservas', { usuario_id, area_id, data_inicio, data_fim });
    return response.data;
  },

  // Atualizar reserva
  atualizar: async (id, updates) => {
    const response = await api.patch(`/reservas/${id}`, updates);
    return response.data;
  },

  // Cancelar reserva
  cancelar: async (id) => {
    const response = await api.post(`/reservas/${id}/cancelar`);
    return response.data;
  },

  // Aprovar reserva
  aprovar: async (id) => {
    const response = await api.post(`/reservas/${id}/aprovar`);
    return response.data;
  },

  // Rejeitar reserva
  rejeitar: async (id, motivo) => {
    const response = await api.post(`/reservas/${id}/rejeitar`, { motivo });
    return response.data;
  },

  // Deletar reserva
  deletar: async (id) => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
  },
};

export default reservaService;
