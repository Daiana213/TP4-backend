const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Equipo extends Model {}

Equipo.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: DataTypes.STRING,
  Puntos: DataTypes.INTEGER,
  Podios: DataTypes.INTEGER,
  Carreras: DataTypes.INTEGER,
  Wins: DataTypes.INTEGER,
  Pais: DataTypes.STRING,
  Team_chief: DataTypes.STRING,
  Technical_chief: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Equipo'
});

module.exports = Equipo;