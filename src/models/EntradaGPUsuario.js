const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class EntradaGPUsuario extends Model {}

EntradaGPUsuario.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  resumengeneral: DataTypes.STRING,
  notaspersonales: DataTypes.STRING,
  fechacreacion: DataTypes.DATE,
  Titulo: DataTypes.STRING,
  formatoId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'EntradaGPUsuario'
});

module.exports = EntradaGPUsuario;