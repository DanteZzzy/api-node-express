const bcrypt  = require('bcryptjs');
const Usuario = require('../models/Usuario');

const CAMPOS = ['id', 'nome', 'email', 'role', 'createdAt'];

const listar = async (req, res) => {
  try {
    const lista = await Usuario.findAll({ attributes: CAMPOS });
    return res.json(lista);
  } catch (err) { return res.status(500).json({ erro: err.message }); }
};

const buscar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: CAMPOS });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    return res.json(usuario);
  } catch (err) { return res.status(500).json({ erro: err.message }); }
};

const atualizar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    if (req.usuario.id !== usuario.id && req.usuario.role !== 'admin') {
      return res.status(403).json({ erro: 'Sem permissão.' });
    }

    const { nome, email, senha, role } = req.body;
    const dados = {};
    if (nome)  dados.nome  = nome;
    if (email) dados.email = email;
    if (senha) dados.senha = await bcrypt.hash(senha, 12);
    if (role && req.usuario.role === 'admin') dados.role = role;

    await usuario.update(dados);
    const atualizado = await Usuario.findByPk(usuario.id, { attributes: CAMPOS });
    return res.json(atualizado);
  } catch (err) { return res.status(500).json({ erro: err.message }); }
};

const deletar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    if (req.usuario.id !== usuario.id && req.usuario.role !== 'admin') {
      return res.status(403).json({ erro: 'Sem permissão.' });
    }

    await usuario.destroy();
    return res.status(204).send();
  } catch (err) { return res.status(500).json({ erro: err.message }); }
};

module.exports = { listar, buscar, atualizar, deletar };