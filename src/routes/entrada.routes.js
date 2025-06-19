const express = require('express');
const router = express.Router();
const entradaController = require('../controllers/entradaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas protegidas con los nombres correctos de funciones
router.get('/', authMiddleware, entradaController.getEntradas);
router.get('/:id', authMiddleware, entradaController.getEntradaPorId);
router.post('/', authMiddleware, entradaController.crearEntrada);
router.put('/:id', authMiddleware, entradaController.actualizarEntrada);
router.delete('/:id', authMiddleware, entradaController.eliminarEntrada);

module.exports = router;
