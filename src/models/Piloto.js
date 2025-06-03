const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Piloto extends Model {}

Piloto.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: DataTypes.STRING,
  Numero: DataTypes.INTEGER,
  Puntos: DataTypes.INTEGER,
  Pais: DataTypes.STRING,
  Campeonatos: DataTypes.INTEGER,
  Podios: DataTypes.INTEGER,
  TotalCarreras: DataTypes.INTEGER,  // Cambiado de 'Carreras' a 'TotalCarreras'
  Wins: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Piloto'
});

module.exports = Piloto;