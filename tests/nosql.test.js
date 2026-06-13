require('./setup');
const request = require('supertest');
const app     = require('../src/app');
const Usuario = require('../src/models/Usuario');
const bcrypt  = require('bcryptjs');
const { Carro, Moto, MarcaRoupa } = require('../src/models/nosqlModels');

let token;

beforeAll(async () => {
  await Usuario.destroy({ where: {} });
  const hash = await bcrypt.hash('Senha@123', 12);
  await Usuario.create({ nome: 'Tester', email: 'tester@test.com', senha: hash, role: 'admin' });
  const res = await request(app).post('/auth/login').send({ email: 'tester@test.com', senha: 'Senha@123' });
  token = res.body.token;
});

const testarCrud = (rota, body, bodyAtualizado) => {
  let id;

  test(`POST ${rota} — cria recurso`, async () => {
    const res = await request(app).post(rota).set('Authorization', `Bearer ${token}`).send(body);
    expect(res.status).toBe(201);
    id = res.body._id;
  });

  test(`GET ${rota} — lista recursos`, async () => {
    const res = await request(app).get(rota).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test(`GET ${rota}/:id — busca por ID`, async () => {
    const res = await request(app).get(`${rota}/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test(`PUT ${rota}/:id — atualiza recurso`, async () => {
    const res = await request(app).put(`${rota}/${id}`).set('Authorization', `Bearer ${token}`).send(bodyAtualizado);
    expect(res.status).toBe(200);
  });

  test(`DELETE ${rota}/:id — deleta recurso`, async () => {
    const res = await request(app).delete(`${rota}/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  test(`GET ${rota} — sem token retorna 401`, async () => {
    const res = await request(app).get(rota);
    expect(res.status).toBe(401);
  });
};

describe('Carros — /carros', () => {
  beforeAll(() => Carro.deleteMany({}));
  testarCrud('/carros', { marca: 'Toyota', modelo: 'Corolla', ano: 2022, cor: 'Prata', preco: 110000 }, { cor: 'Preto' });
});

describe('Motos — /motos', () => {
  beforeAll(() => Moto.deleteMany({}));
  testarCrud('/motos', { marca: 'Honda', modelo: 'CB 500', ano: 2021, cilindradas: 500, cor: 'Vermelha' }, { cor: 'Azul' });
});

describe('Marcas de Roupa — /marcas-roupa', () => {
  beforeAll(() => MarcaRoupa.deleteMany({}));
  testarCrud('/marcas-roupa', { nome: 'Nike', pais_origem: 'EUA', segmento: 'Esportivo', ano_fundacao: 1964 }, { segmento: 'Casual' });
});