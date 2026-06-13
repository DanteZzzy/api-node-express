const { validationResult } = require('express-validator');

const validar = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(422).json({ erros: erros.array() });
  }
  next();
};

module.exports = { validar };