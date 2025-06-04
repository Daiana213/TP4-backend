const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const f1Routes = require('./routes/f1Routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all origins during development
app.use(cors());

// Routes - remove the '/api' prefix to match frontend expectations
app.use('/', userRoutes);
app.use('/', f1Routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// 404 handling
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection and server startup
sequelize.sync().then(() => {
  console.log('Database connected');
  app.listen(3001, () => console.log('Server running on port 3000'));
}).catch(error => console.error('Database error:', error));
