const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Clasificacion extends Model {}

Clasificacion.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  standings: DataTypes.JSON,
  entradaId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Clasificacion'
});

module.exports = Clasificacion;