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
  Puntos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  Pais: DataTypes.STRING,
  Campeonatos: DataTypes.INTEGER,
  Podios: DataTypes.INTEGER,
  TotalCarreras: DataTypes.INTEGER,  // Cambiado de 'Carreras' a 'TotalCarreras'
  Wins: DataTypes.INTEGER,
  EquipoId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Equipos',
      key: 'id'
    }
  }
  
}, {
  sequelize,
  modelName: 'Piloto'
});


module.exports = Piloto;