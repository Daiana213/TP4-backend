const express = require('express');
const router = express.Router();
const entradaController = require('../controllers/entradaController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Rutas protegidas con los nombres correctos de funciones
router.get('/', authenticateToken, entradaController.getEntradas);
router.get('/:id', authenticateToken, entradaController.getEntradaPorId);
router.post('/', authenticateToken, entradaController.crearEntrada);
router.put('/:id', authenticateToken, entradaController.actualizarEntrada);
router.delete('/:id', authenticateToken, entradaController.eliminarEntrada);

module.exports = router;
