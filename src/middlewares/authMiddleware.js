const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Token mal formado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_temporal');

    if (!decoded.userId) {
      return res.status(401).json({ message: 'Token inválido: no contiene userId' });
    }

    const usuario = await Usuario.findByPk(decoded.userId);
    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.usuarioId = decoded.userId;
    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(403).json({ message: 'Acceso denegado: Usuario no encontrado' });
    }

    if (!req.usuario.isAdmin) {
      return res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de administrador' });
    }

    next();
  } catch (error) {
    console.error('Error en middleware isAdmin:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  authenticateToken,
  isAdmin
};
