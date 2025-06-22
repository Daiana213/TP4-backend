const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_temporal');
    // Asegurarse de que el token incluya el ID del usuario
    req.usuarioId = decoded.userId;
    
    // Obtener información del usuario para verificar si es admin
    const usuario = await Usuario.findByPk(decoded.userId);
    if (usuario) {
      req.usuario = usuario;
    }
    
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
