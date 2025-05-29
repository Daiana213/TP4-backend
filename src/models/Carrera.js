const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Carrera extends Model {}

Carrera.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  standings: DataTypes.JSON,
  entradaId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Carrera'
});

module.exports = Carrera;