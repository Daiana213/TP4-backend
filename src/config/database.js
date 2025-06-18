const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

module.exports = sequelize;
