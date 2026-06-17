import api from './api';

export const authService = {
  async login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha });
    return data;
  },

  async registro(nome, email, senha, role) {
    const { data } = await api.post('/auth/registro', { nome, email, senha, role });
    return data;
  },
};