const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Carrera = sequelize.define('Carrera', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  standings: { type: DataTypes.JSON, allowNull: false },
  entradaId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Carrera;