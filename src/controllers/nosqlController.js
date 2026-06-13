/**
 * Gera um controller CRUD que delega toda a lógica para a camada de Service.
 * O controller só conhece HTTP: recebe requisição, chama o service, devolve resposta.
 */
const criarCrudController = (service) => ({

  listar: async (req, res) => {
    try {
      const lista = await service.getAllRecords();
      return res.json(lista);
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  buscar: async (req, res) => {
    try {
      const item = await service.getRecordById(req.params.id);
      return res.json(item);
    } catch (err) {
      return res.status(err.statusCode || 500).json({ erro: err.message });
    }
  },

  criar: async (req, res) => {
    try {
      const item = await service.createRecord(req.body);
      return res.status(201).json(item);
    } catch (err) {
      return res.status(err.statusCode || 400).json({ erro: err.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const item = await service.updateRecord(req.params.id, req.body);
      return res.json(item);
    } catch (err) {
      return res.status(err.statusCode || 400).json({ erro: err.message });
    }
  },

  deletar: async (req, res) => {
    try {
      await service.deleteRecord(req.params.id);
      return res.status(204).send();
    } catch (err) {
      return res.status(err.statusCode || 500).json({ erro: err.message });
    }
  },
});

module.exports = { criarCrudController };