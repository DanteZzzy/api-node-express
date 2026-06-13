require('dotenv').config();
const app = require('./app');
const { connectMongo, connectSQL } = require('./config/database');

const PORT = process.env.PORT || 3000;

const iniciar = async () => {
  await connectSQL();
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação em  http://localhost:${PORT}/docs`);
  });
};

iniciar();