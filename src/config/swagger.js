const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Node.js — Carros, Motos, Marcas & Usuários',
      version: '1.0.0',
      description:
        'API RESTful com autenticação JWT, MongoDB (NoSQL) e SQLite (SQL), ' +
        'proteção OWASP Top 10, testes de integração e Docker.',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);