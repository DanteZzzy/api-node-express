const router = require('express').Router();
const { body } = require('express-validator');
const { registro, login } = require('../controllers/authController');
const { validar } = require('../middlewares/validar');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registro e login de usuários
 */

/**
 * @swagger
 * /auth/registro:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:  { type: string, example: "Gabriel" }
 *               email: { type: string, example: "gabriel@email.com" }
 *               senha: { type: string, example: "Senha@123" }
 *               role:  { type: string, enum: [user, admin], example: "user" }
 *     responses:
 *       201: { description: Usuário criado }
 *       409: { description: E-mail já cadastrado }
 *       422: { description: Dados inválidos }
 */
router.post(
  '/registro',
  [
    body('nome').trim().notEmpty().withMessage('Nome obrigatório.'),
    body('email').isEmail().withMessage('E-mail inválido.'),
    body('senha').isLength({ min: 6 }).withMessage('Senha mínima: 6 caracteres.'),
  ],
  validar,
  registro
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica o usuário e retorna um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email: { type: string, example: "gabriel@email.com" }
 *               senha: { type: string, example: "Senha@123" }
 *     responses:
 *       200: { description: Token JWT retornado }
 *       401: { description: Credenciais inválidas }
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('E-mail inválido.'),
    body('senha').notEmpty().withMessage('Senha obrigatória.'),
  ],
  validar,
  login
);

module.exports = router;