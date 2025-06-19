// src/models/entradaGPUsuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EntradaGPUsuario = sequelize.define('EntradaGPUsuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resumengeneral: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notaspersonales: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fechacreacion: {
    type: DataTypes.DATEONLY, // O DataTypes.DATE si incluye hora
    allowNull: true,
  },
  Titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tieneSprint: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  UsuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  GranPremioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'EntradaGPUsuarios', // Respeta mayúsculas/minúsculas según la tabla
  timestamps: true, // Sequelize gestionará createdAt y updatedAt automáticamente
  freezeTableName: true, // Para que no pluralice ni cambie el nombre de la tabla
});

module.exports = EntradaGPUsuario;
