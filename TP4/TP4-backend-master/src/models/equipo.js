const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipo = sequelize.define('Equipo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  puntos: { type: DataTypes.INTEGER, defaultValue: 0 },
  podios: { type: DataTypes.INTEGER, defaultValue: 0 },
  carreras: { type: DataTypes.INTEGER, defaultValue: 0 },
  wins: { type: DataTypes.INTEGER, defaultValue: 0 },
  pais: { type: DataTypes.STRING, allowNull: false },
  team_chief: { type: DataTypes.STRING, allowNull: false },
  technical_chief: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Equipo;