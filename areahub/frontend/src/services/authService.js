import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, senha: password });
    return response.data;
  },

  primeiroAcesso: async (senha) => {
    const response = await api.post('/auth/primeiro-acesso', { senha });
    return response.data;
  },

  redefinirSenha: async (senhaAtual, novaSenha) => {
    const response = await api.post('/auth/redefinir-senha', { senhaAtual, novaSenha });
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('areahub_token');
    localStorage.removeItem('areahub_user');
  },
};

export default authService;
