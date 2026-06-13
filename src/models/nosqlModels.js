const mongoose = require('mongoose');

const carroSchema = new mongoose.Schema(
  {
    marca:  { type: String, required: true, trim: true },
    modelo: { type: String, required: true, trim: true },
    ano:    { type: Number, required: true },
    cor:    { type: String, required: true, trim: true },
    preco:  { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const motoSchema = new mongoose.Schema(
  {
    marca:       { type: String, required: true, trim: true },
    modelo:      { type: String, required: true, trim: true },
    ano:         { type: Number, required: true },
    cilindradas: { type: Number, required: true },
    cor:         { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

const marcaRoupaSchema = new mongoose.Schema(
  {
    nome:         { type: String, required: true, trim: true },
    pais_origem:  { type: String, required: true, trim: true },
    segmento:     { type: String, trim: true },
    ano_fundacao: { type: Number },
  },
  { timestamps: true, versionKey: false }
);

const Carro      = mongoose.model('Carro', carroSchema);
const Moto       = mongoose.model('Moto', motoSchema);
const MarcaRoupa = mongoose.model('MarcaRoupa', marcaRoupaSchema);

module.exports = { Carro, Moto, MarcaRoupa };