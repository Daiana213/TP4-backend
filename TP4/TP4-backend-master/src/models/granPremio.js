const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GranPremio = sequelize.define('GranPremio', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  fecha: { type: DataTypes.DATE, allowNull: false },
  circuito: { type: DataTypes.STRING, allowNull: false },
  pais: { type: DataTypes.STRING, allowNull: false },
  numero_vueltas: { type: DataTypes.INTEGER, allowNull: false },
  horarios: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = GranPremio;