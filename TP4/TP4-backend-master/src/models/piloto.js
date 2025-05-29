const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Piloto = sequelize.define('Piloto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  numero: { type: DataTypes.INTEGER, allowNull: false },
  puntos: { type: DataTypes.INTEGER, defaultValue: 0 },
  pais: { type: DataTypes.STRING, allowNull: false },
  campeonatos: { type: DataTypes.INTEGER, defaultValue: 0 },
  podios: { type: DataTypes.INTEGER, defaultValue: 0 },
  carreras: { type: DataTypes.INTEGER, defaultValue: 0 },
  wins: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Piloto;