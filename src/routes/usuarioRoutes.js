const router = require('express').Router();
const { listar, buscar, atualizar, deletar } = require('../controllers/usuarioController');
const { autenticar, autorizar } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: CRUD de usuários (banco SQL - SQLite)
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários (somente admin)
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de usuários }
 *       401: { description: Não autenticado }
 *       403: { description: Sem permissão }
 */
router.get('/', autenticar, autorizar('admin'), listar);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário por ID
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuário encontrado }
 *       404: { description: Não encontrado }
 */
router.get('/:id', autenticar, buscar);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:  { type: string }
 *               email: { type: string }
 *               senha: { type: string }
 *     responses:
 *       200: { description: Usuário atualizado }
 */
router.put('/:id', autenticar, atualizar);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Removido com sucesso }
 */
router.delete('/:id', autenticar, deletar);

module.exports = router;