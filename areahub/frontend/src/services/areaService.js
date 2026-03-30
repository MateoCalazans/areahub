import api from './api';

const areaService = {
  listar: async () => {
    const response = await api.get('/areas');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/areas/${id}`);
    return response.data;
  },

  criar: async (data) => {
    const response = await api.post('/areas', data);
    return response.data;
  },

  atualizar: async (id, data) => {
    const response = await api.put(`/areas/${id}`, data);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/areas/${id}`);
    return response.data;
  },
};

export default areaService;
