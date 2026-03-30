import api from './api';

const reservaService = {
  listar: async (params) => {
    const response = await api.get('/reservas', { params });
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  criar: async (data) => {
    const response = await api.post('/reservas', data);
    return response.data;
  },

  atualizar: async (id, data) => {
    const response = await api.put(`/reservas/${id}`, data);
    return response.data;
  },

  cancelar: async (id) => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
  },

  aprovar: async (id) => {
    const response = await api.patch(`/reservas/${id}/aprovar`);
    return response.data;
  },

  rejeitar: async (id, motivo) => {
    const response = await api.patch(`/reservas/${id}/rejeitar`, { motivo });
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
  },
};

export default reservaService;
