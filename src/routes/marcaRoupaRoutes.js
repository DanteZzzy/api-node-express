const router = require('express').Router();
const { criarCrudController } = require('../controllers/nosqlController');
const { autenticar } = require('../middlewares/auth');
const { MarcaRoupa } = require('../models/nosqlModels');
const BaseRepository = require('../repositories/baseRepository');
const BaseService = require('../services/baseService');

const repository = new BaseRepository(MarcaRoupa);
const service = new BaseService(repository, {
  yearField: 'ano_fundacao',
  maxYearOffset: 0,
  entityName: 'marca de roupa',
});
const ctrl = criarCrudController(service);

/**
 * @swagger
 * tags:
 *   name: Marcas de Roupa
 *   description: CRUD de marcas de roupa (banco NoSQL - MongoDB)
 */

/**
 * @swagger
 * /marcas-roupa:
 *   get:
 *     summary: Lista todas as marcas de roupa
 *     tags: [Marcas de Roupa]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de marcas }
 *       401: { description: Não autenticado }
 */
router.get('/', autenticar, ctrl.listar);

/**
 * @swagger
 * /marcas-roupa/{id}:
 *   get:
 *     summary: Busca uma marca pelo ID
 *     tags: [Marcas de Roupa]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Marca encontrada }
 *       404: { description: Não encontrada }
 */
router.get('/:id', autenticar, ctrl.buscar);

/**
 * @swagger
 * /marcas-roupa:
 *   post:
 *     summary: Cria uma nova marca de roupa
 *     tags: [Marcas de Roupa]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, pais_origem]
 *             properties:
 *               nome:         { type: string, example: "Nike" }
 *               pais_origem:  { type: string, example: "EUA" }
 *               segmento:     { type: string, example: "Esportivo" }
 *               ano_fundacao: { type: integer, example: 1964 }
 *     responses:
 *       201: { description: Marca criada }
 *       400: { description: Dados inválidos }
 */
router.post('/', autenticar, ctrl.criar);

/**
 * @swagger
 * /marcas-roupa/{id}:
 *   put:
 *     summary: Atualiza uma marca de roupa
 *     tags: [Marcas de Roupa]
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
 *               nome:         { type: string }
 *               pais_origem:  { type: string }
 *               segmento:     { type: string }
 *               ano_fundacao: { type: integer }
 *     responses:
 *       200: { description: Marca atualizada }
 *       404: { description: Não encontrada }
 */
router.put('/:id', autenticar, ctrl.atualizar);

/**
 * @swagger
 * /marcas-roupa/{id}:
 *   delete:
 *     summary: Remove uma marca de roupa
 *     tags: [Marcas de Roupa]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Removida com sucesso }
 *       404: { description: Não encontrada }
 */
router.delete('/:id', autenticar, ctrl.deletar);

module.exports = router;