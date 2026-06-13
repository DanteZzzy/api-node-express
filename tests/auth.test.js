require('./setup');
const request = require('supertest');
const app     = require('../src/app');
const Usuario = require('../src/models/Usuario');

let tokenAdmin, tokenUser, adminId, userId;

describe('Auth — /auth', () => {
  beforeAll(async () => { await Usuario.destroy({ where: {} }); });

  test('POST /auth/registro — cria admin', async () => {
    const res = await request(app).post('/auth/registro').send({ nome: 'Admin', email: 'admin@test.com', senha: 'Senha@123', role: 'admin' });
    expect(res.status).toBe(201);
    adminId = res.body.usuario.id;
  });

  test('POST /auth/registro — cria usuário comum', async () => {
    const res = await request(app).post('/auth/registro').send({ nome: 'User', email: 'user@test.com', senha: 'Senha@123' });
    expect(res.status).toBe(201);
    userId = res.body.usuario.id;
  });

  test('POST /auth/registro — e-mail duplicado retorna 409', async () => {
    const res = await request(app).post('/auth/registro').send({ nome: 'Dup', email: 'admin@test.com', senha: 'Senha@123' });
    expect(res.status).toBe(409);
  });

  test('POST /auth/registro — dados inválidos retorna 422', async () => {
    const res = await request(app).post('/auth/registro').send({ nome: '', email: 'invalido', senha: '123' });
    expect(res.status).toBe(422);
  });

  test('POST /auth/login — login admin retorna token', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'admin@test.com', senha: 'Senha@123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    tokenAdmin = res.body.token;
  });

  test('POST /auth/login — login user retorna token', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'user@test.com', senha: 'Senha@123' });
    expect(res.status).toBe(200);
    tokenUser = res.body.token;
  });

  test('POST /auth/login — credenciais erradas retorna 401', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'admin@test.com', senha: 'errada' });
    expect(res.status).toBe(401);
  });
});

describe('Usuários — /usuarios', () => {
  test('GET /usuarios — admin lista todos', async () => {
    const res = await request(app).get('/usuarios').set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /usuarios — user comum é bloqueado (403)', async () => {
    const res = await request(app).get('/usuarios').set('Authorization', `Bearer ${tokenUser}`);
    expect(res.status).toBe(403);
  });

  test('GET /usuarios/:id — busca por ID', async () => {
    const res = await request(app).get(`/usuarios/${userId}`).set('Authorization', `Bearer ${tokenUser}`);
    expect(res.status).toBe(200);
  });

  test('GET /usuarios/:id — ID inexistente retorna 404', async () => {
    const res = await request(app).get('/usuarios/9999').set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(404);
  });

  test('PUT /usuarios/:id — atualiza nome', async () => {
    const res = await request(app).put(`/usuarios/${userId}`).set('Authorization', `Bearer ${tokenUser}`).send({ nome: 'User Atualizado' });
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('User Atualizado');
  });

  test('DELETE /usuarios/:id — deleta usuário', async () => {
    const res = await request(app).delete(`/usuarios/${userId}`).set('Authorization', `Bearer ${tokenUser}`);
    expect(res.status).toBe(204);
  });

  test('GET /usuarios — sem token retorna 401', async () => {
    const res = await request(app).get('/usuarios');
    expect(res.status).toBe(401);
  });
});