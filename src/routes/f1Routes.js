const express = require('express');
const router = express.Router();
const F1Controller = require('../controllers/f1Controller');

// Rutas para pilotos
router.get('/pilotos', F1Controller.getAllPilotos);
router.get('/pilotos/:id', F1Controller.getPilotoById);

// Rutas para equipos
router.get('/equipos', F1Controller.getAllEquipos);
router.get('/equipos/:id', F1Controller.getEquipoById);

// Rutas para el calendario
router.get('/calendario', F1Controller.getAllGrandesPremios);
router.get('/calendario/:id', F1Controller.getGranPremioById);

// Rutas para administrador
router.post('/admin/pilotos', F1Controller.createPiloto);
router.put('/admin/pilotos/:id', F1Controller.updatePiloto);
router.delete('/admin/pilotos/:id', F1Controller.deletePiloto);
router.post('/admin/equipos', F1Controller.createEquipo);
router.put('/admin/equipos/:id', F1Controller.updateEquipo);
router.delete('/admin/equipos/:id', F1Controller.deleteEquipo);
router.post('/admin/calendario', F1Controller.createGranPremio);
router.put('/admin/calendario/:id', F1Controller.updateGranPremio);
router.delete('/admin/calendario/:id', F1Controller.deleteGranPremio);

module.exports = router;