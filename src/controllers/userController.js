const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios (excluyendo contraseñas)
const getAllUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      attributes: { exclude: ['contrasena'] }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// Crear un nuevo usuario con validación
const createUser = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Validar longitud de la contraseña
    if (contrasena.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está en uso' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const newUser = await Usuario.create({
      nombre,
      email,
      contrasena: hashedPassword
    });

    res.status(201).json({ message: 'Usuario creado exitosamente', usuario: newUser });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

// Registrar usuario
const registerUser = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const newUser = await Usuario.create({
      nombre,
      email,
      contrasena: hashedPassword
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: newUser });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Validar usuario por email y contraseña
const validateUser = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const user = await Usuario.findOne({
      where: { email },
      attributes: ['id', 'nombre', 'email', 'contrasena'] 
    });

    if (!user || !user.contrasena) {
      return res.status(404).json({ message: 'Usuario no encontrado o sin contraseña válida' });
    }

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Usuario validado exitosamente', usuario: user });
  } catch (error) {
    console.error('Error al validar usuario:', error);
    res.status(500).json({ message: 'Error al validar usuario', error: error.message });
  }
};

// Inicio de sesión con JWT
const loginUser = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);

    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario en la base de datos asegurando que la contraseña está incluida
    const user = await Usuario.findOne({
      where: { email },
      attributes: ['id', 'nombre', 'email', 'contrasena', 'isAdmin']
    });

    if (!user) {
      console.error('Usuario no encontrado:', email);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const datos = user.dataValues;

    if (!datos.contrasena) {
      return res.status(400).json({ error: 'Error en credenciales' });
    }

    // Comparación segura de contraseñas con bcrypt
    const isPasswordValid = await bcrypt.compare(contrasena, datos.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email o contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: datos.id, email: datos.email },
      process.env.JWT_SECRET || 'clave_secreta_temporal',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      usuario: {
        id: datos.id,
        nombre: datos.nombre,
        email: datos.email,
        isAdmin: datos.isAdmin
      },
      token
    });

  } catch (error) {
    console.error('Error inesperado en login:', error);
    res.status(500).json({ error: 'Error interno en el servidor', details: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  registerUser,
  validateUser,
  loginUser
};
