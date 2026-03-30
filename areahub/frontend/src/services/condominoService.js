import api from './api';

const condominoService = {
  listar: async () => {
    const response = await api.get('/condominos');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/condominos/${id}`);
    return response.data;
  },

  criar: async (data) => {
    const response = await api.post('/condominos', data);
    return response.data;
  },

  atualizar: async (id, data) => {
    const response = await api.put(`/condominos/${id}`, data);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/condominos/${id}`);
    return response.data;
  },
};

export default condominoService;
