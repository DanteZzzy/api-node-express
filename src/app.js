require('dotenv').config();
const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const swaggerUi  = require('swagger-ui-express');

const swaggerSpec      = require('./config/swagger');
const authRoutes       = require('./routes/authRoutes');
const usuarioRoutes    = require('./routes/usuarioRoutes');
const carroRoutes      = require('./routes/carroRoutes');
const motoRoutes       = require('./routes/motoRoutes');
const marcaRoupaRoutes = require('./routes/marcaRoupaRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { erro: 'Muitas requisições. Tente novamente em 15 minutos.' },
}));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth',         authRoutes);
app.use('/usuarios',     usuarioRoutes);
app.use('/carros',       carroRoutes);
app.use('/motos',        motoRoutes);
app.use('/marcas-roupa', marcaRoupaRoutes);

app.get('/', (req, res) => res.json({ mensagem: 'API funcionando!', docs: '/docs' }));

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

module.exports = app;