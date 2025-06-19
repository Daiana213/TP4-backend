require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const f1Routes = require('./routes/f1Routes');
const entradaRoutes = require('./routes/entrada.routes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all origins during development
app.use(cors());

// Rutas públicas
app.use('/', userRoutes); // login, registro, etc.
app.use('/', f1Routes);   // rutas públicas de F1

// Rutas protegidas
app.use('/api/entradas', authMiddleware, entradaRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Manejo de 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Conexión a la base de datos y arranque del servidor
sequelize.sync().then(() => {
  console.log('✅ Base de datos sincronizada correctamente con el modelo EntradaGPUsuario');
  app.listen(3001, () => console.log('🚀 Servidor corriendo en puerto 3001'));
}).catch(error => {
  console.error('❌ Error al sincronizar la base de datos:', error);
});

// -- ELIMINAR esta línea porque no tiene sentido aquí --
// const decoded = jwt.verify(token, process.env.JWT_SECRET);
