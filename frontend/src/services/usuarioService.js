import api from './api';

export const usuarioService = {
  async listar() {
    const { data } = await api.get('/usuarios');
    return data;
  },

  async buscar(id) {
    const { data } = await api.get(`/usuarios/${id}`);
    return data;
  },

  async atualizar(id, payload) {
    const { data } = await api.put(`/usuarios/${id}`, payload);
    return data;
  },

  async deletar(id) {
    await api.delete(`/usuarios/${id}`);
  },
};