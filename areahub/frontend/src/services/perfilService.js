import api from './api';

const perfilService = {
  buscar: async () => {
    const response = await api.get('/perfil');
    return response.data;
  },

  atualizar: async (data) => {
    const response = await api.put('/perfil', data);
    return response.data;
  },
};

export default perfilService;
