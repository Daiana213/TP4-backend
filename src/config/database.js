const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite'),
  logging: false // puedes cambiar a true para ver las consultas SQL en la consola
});

module.exports = sequelize;