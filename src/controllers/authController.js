const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const registro = async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(409).json({ erro: 'E-mail já cadastrado.' });

    const hash = await bcrypt.hash(senha, 12);
    const usuario = await Usuario.create({ nome, email, senha: hash, role });

    return res.status(201).json({
      mensagem: 'Usuário criado.',
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
    });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    const valido  = usuario ? await bcrypt.compare(senha, usuario.senha) : false;

    if (!usuario || !valido) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
    });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

module.exports = { registro, login };