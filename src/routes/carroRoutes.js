const router = require('express').Router();
const { criarCrudController } = require('../controllers/nosqlController');
const { Carro } = require('../models/nosqlModels');
const { autenticar, autorizar } = require('../middlewares/auth');
const BaseRepository = require('../repositories/baseRepository');
const BaseService = require('../services/baseService');

const repository = new BaseRepository(Carro);
const service = new BaseService(repository, {
  yearField: 'ano',
  maxYearOffset: 1,
  entityName: 'carro',
});
const ctrl = criarCrudController(service);

/**
 * @swagger
 * tags:
 *   name: Carros
 *   description: CRUD de carros (banco NoSQL - MongoDB)
 */

/**
 * @swagger
 * /carros:
 *   get:
 *     summary: Lista todos os carros
 *     tags: [Carros]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de carros
 *       401:
 *         description: Não autenticado
 */
router.get('/', autenticar, ctrl.listar);

/**
 * @swagger
 * /carros/{id}:
 *   get:
 *     summary: Busca um carro pelo ID
 *     tags: [Carros]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID do MongoDB
 *     responses:
 *       200:
 *         description: Carro encontrado
 *       404:
 *         description: Não encontrado
 */
router.get('/:id', autenticar, ctrl.buscar);

/**
 * @swagger
 * /carros:
 *   post:
 *     summary: Cria um novo carro (apenas admin)
 *     tags: [Carros]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [marca, modelo, ano, cor]
 *             properties:
 *               marca:  { type: string, example: "Toyota" }
 *               modelo: { type: string, example: "Corolla" }
 *               ano:    { type: integer, example: 2023 }
 *               cor:    { type: string, example: "Prata" }
 *               preco:  { type: number, example: 120000 }
 *     responses:
 *       201:
 *         description: Carro criado
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado (apenas admin)
 */
router.post('/', autenticar, autorizar('admin'), ctrl.criar);

/**
 * @swagger
 * /carros/{id}:
 *   put:
 *     summary: Atualiza um carro (apenas admin)
 *     tags: [Carros]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:  { type: string }
 *               modelo: { type: string }
 *               ano:    { type: integer }
 *               cor:    { type: string }
 *               preco:  { type: number }
 *     responses:
 *       200:
 *         description: Carro atualizado
 *       403:
 *         description: Acesso negado (apenas admin)
 *       404:
 *         description: Não encontrado
 */
router.put('/:id', autenticar, autorizar('admin'), ctrl.atualizar);

/**
 * @swagger
 * /carros/{id}:
 *   delete:
 *     summary: Remove um carro (apenas admin)
 *     tags: [Carros]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Removido com sucesso
 *       403:
 *         description: Acesso negado (apenas admin)
 *       404:
 *         description: Não encontrado
 */
router.delete('/:id', autenticar, autorizar('admin'), ctrl.deletar);

module.exports = router;