import api from './api';

// Função que gera um CRUD completo para qualquer recurso
const createCrudService = (resource) => ({
  async listar() {
    const { data } = await api.get(`/${resource}`);
    return data;
  },

  async buscar(id) {
    const { data } = await api.get(`/${resource}/${id}`);
    return data;
  },

  async criar(payload) {
    const { data } = await api.post(`/${resource}`, payload);
    return data;
  },

  async atualizar(id, payload) {
    const { data } = await api.put(`/${resource}/${id}`, payload);
    return data;
  },

  async deletar(id) {
    await api.delete(`/${resource}/${id}`);
  },
});

export const carroService = createCrudService('carros');
export const motoService = createCrudService('motos');
export const marcaRoupaService = createCrudService('marcas-roupa');