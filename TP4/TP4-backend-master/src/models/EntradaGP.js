const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EntradaGP = sequelize.define('EntradaGP', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuarioId: { type: DataTypes.INTEGER, allowNull: false },
  granpremioId: { type: DataTypes.INTEGER, allowNull: false },
  resumengeneral: { type: DataTypes.STRING },
  notaspersonales: { type: DataTypes.STRING },
  fechacreacion: { type: DataTypes.DATE, allowNull: false },
  titulo: { type: DataTypes.STRING, allowNull: false },
  formatoId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = EntradaGP;