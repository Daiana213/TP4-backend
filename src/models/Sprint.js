const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Sprint extends Model {}

Sprint.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  standings: DataTypes.JSON,
  entradaId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Sprint'
});

module.exports = Sprint;
