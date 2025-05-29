const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Original API routes
router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.post('/validate-user', UserController.validateUser);

// Frontend expected routes
router.post('/usuarios/registro', UserController.registerUser);
router.post('/usuarios/login', UserController.loginUser);

module.exports = router;
