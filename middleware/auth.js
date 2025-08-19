const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware para proteger rotas
const protect = async (req, res, next) => {
  let token;

  // Verificar se existe token no header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrair token do header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuário pelo ID do token
      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido, usuário não encontrado'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Conta desativada'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acesso negado, token necessário'
    });
  }
};

// Middleware para autorizar apenas roles específicos
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} não autorizado para esta ação`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
