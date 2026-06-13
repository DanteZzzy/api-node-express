const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const connectMongo = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('[MongoDB] Conectado');
};

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.SQL_STORAGE || './database.sqlite',
  logging: false,
});

const connectSQL = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('[SQLite] Conectado e sincronizado');
};

module.exports = { connectMongo, connectSQL, sequelize };