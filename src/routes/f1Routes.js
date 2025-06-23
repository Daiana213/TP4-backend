const express = require('express');
const router = express.Router();
const F1Controller = require('../controllers/f1Controller');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas para pilotos
router.get('/pilotos', F1Controller.getAllPilotos);
router.get('/pilotos/:id', F1Controller.getPilotoById);

// Rutas para equipos
router.get('/equipos', F1Controller.getAllEquipos);
router.get('/equipos/:id', F1Controller.getEquipoById);

// Rutas para el calendario
router.get('/calendario', F1Controller.getAllGrandesPremios);
router.get('/calendario/:id', F1Controller.getGranPremioById);

// Rutas para administrador (requieren autenticación y rol admin)
router.post('/admin/pilotos', authenticateToken, isAdmin, F1Controller.createPiloto);
router.put('/admin/pilotos/:id', authenticateToken, isAdmin, F1Controller.updatePiloto);
router.delete('/admin/pilotos/:id', authenticateToken, isAdmin, F1Controller.deletePiloto);
router.post('/admin/equipos', authenticateToken, isAdmin, F1Controller.createEquipo);
router.put('/admin/equipos/:id', authenticateToken, isAdmin, F1Controller.updateEquipo);
router.delete('/admin/equipos/:id', authenticateToken, isAdmin, F1Controller.deleteEquipo);
router.post('/admin/calendario', authenticateToken, isAdmin, F1Controller.createGranPremio);
router.put('/admin/calendario/:id', authenticateToken, isAdmin, F1Controller.updateGranPremio);
router.delete('/admin/calendario/:id', authenticateToken, isAdmin, F1Controller.deleteGranPremio);

module.exports = router;