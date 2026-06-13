require('dotenv').config();
const mongoose = require('mongoose');
const { sequelize } = require('../src/config/database');

process.env.SQL_STORAGE = ':memory:';
process.env.MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/api_test';
process.env.JWT_SECRET = 'segredo_para_testes';
process.env.JWT_EXPIRES_IN = '1h';

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await sequelize.close();
});