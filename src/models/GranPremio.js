const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class GranPremio extends Model {}

GranPremio.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  fecha: DataTypes.DATE,
  circuito: DataTypes.STRING,
  pais: DataTypes.STRING,
  numero_vueltas: DataTypes.INTEGER,
  horarios: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'GranPremio'
});

module.exports = GranPremio;