const router = require('express').Router();
const { criarCrudController } = require('../controllers/nosqlController');
const { autenticar } = require('../middlewares/auth');
const { Moto } = require('../models/nosqlModels');
const BaseRepository = require('../repositories/baseRepository');
const BaseService = require('../services/baseService');

const repository = new BaseRepository(Moto);
const service = new BaseService(repository, {
  yearField: 'ano',
  maxYearOffset: 1,
  entityName: 'moto',
});
const ctrl = criarCrudController(service);

/**
 * @swagger
 * tags:
 *   name: Motos
 *   description: CRUD de motos (banco NoSQL - MongoDB)
 */

/**
 * @swagger
 * /motos:
 *   get:
 *     summary: Lista todas as motos
 *     tags: [Motos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de motos }
 *       401: { description: Não autenticado }
 */
router.get('/', autenticar, ctrl.listar);

/**
 * @swagger
 * /motos/{id}:
 *   get:
 *     summary: Busca uma moto pelo ID
 *     tags: [Motos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Moto encontrada }
 *       404: { description: Não encontrada }
 */
router.get('/:id', autenticar, ctrl.buscar);

/**
 * @swagger
 * /motos:
 *   post:
 *     summary: Cria uma nova moto
 *     tags: [Motos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [marca, modelo, ano, cilindradas]
 *             properties:
 *               marca:       { type: string, example: "Honda" }
 *               modelo:      { type: string, example: "CB 500" }
 *               ano:         { type: integer, example: 2022 }
 *               cilindradas: { type: integer, example: 500 }
 *               cor:         { type: string, example: "Vermelha" }
 *     responses:
 *       201: { description: Moto criada }
 *       400: { description: Dados inválidos }
 */
router.post('/', autenticar, ctrl.criar);

/**
 * @swagger
 * /motos/{id}:
 *   put:
 *     summary: Atualiza uma moto
 *     tags: [Motos]
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
 *               marca:       { type: string }
 *               modelo:      { type: string }
 *               ano:         { type: integer }
 *               cilindradas: { type: integer }
 *               cor:         { type: string }
 *     responses:
 *       200: { description: Moto atualizada }
 *       404: { description: Não encontrada }
 */
router.put('/:id', autenticar, ctrl.atualizar);

/**
 * @swagger
 * /motos/{id}:
 *   delete:
 *     summary: Remove uma moto
 *     tags: [Motos]
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