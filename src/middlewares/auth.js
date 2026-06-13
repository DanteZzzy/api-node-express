const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  const token = header.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

const autorizar = (...roles) => (req, res, next) => {
  if (!roles.includes(req.usuario?.role)) {
    return res.status(403).json({ erro: 'Acesso negado.' });
  }
  next();
};

module.exports = { autenticar, autorizar };