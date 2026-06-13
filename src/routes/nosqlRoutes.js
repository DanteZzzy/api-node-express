const router       = require('express').Router;
const { criarCrudController } = require('../controllers/nosqlController');
const { autenticar } = require('../middlewares/auth');

/**
 * Gera um router Express com as 5 operações CRUD para um model Mongoose.
 * O parâmetro `tag` é usado nas anotações Swagger.
 */
const criarRotasNoSQL = (Model, tag) => {
  const r = router();
  const ctrl = criarCrudController(Model);

  /**
   * @swagger
   * tags:
   *   name: {tag}
   */

  // Leitura — aberta para usuários autenticados
  r.get('/',    autenticar, ctrl.listar);
  r.get('/:id', autenticar, ctrl.buscar);

  // Escrita — exige autenticação
  r.post('/',    autenticar, ctrl.criar);
  r.put('/:id',  autenticar, ctrl.atualizar);
  r.delete('/:id', autenticar, ctrl.deletar);

  return r;
};

module.exports = { criarRotasNoSQL };