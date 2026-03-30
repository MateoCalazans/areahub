import api from './api';

const usuarioService = {
  listar: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  criar: async (data) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },

  atualizar: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  alterarStatus: async (id, status) => {
    const response = await api.patch(`/usuarios/${id}/status`, { status });
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};

export default usuarioService;
