const express = require('express');
const router = express.Router();
const puntosController = require('../controllers/puntosController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Ruta protegida para puntos calculados del usuario logueado
router.get('/mios', authenticateToken, puntosController.calcularPuntosDelUsuario);

module.exports = router;
