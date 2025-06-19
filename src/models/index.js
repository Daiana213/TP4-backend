const Usuario = require('./Usuario');
const EntradaGPUsuario = require('./EntradaGPUsuario');
const GranPremio = require('./GranPremio');
const Piloto = require('./Piloto');
const Equipo = require('./Equipo');
const Clasificacion = require('./Clasificacion');
const Carrera = require('./Carrera');
const Sprint = require('./Sprint');

// Definir relaciones entre modelos

// Relaciones para EntradaGPUsuario
Usuario.hasMany(EntradaGPUsuario, { foreignKey: 'UsuarioId' });
EntradaGPUsuario.belongsTo(Usuario, { foreignKey: 'UsuarioId' });

GranPremio.hasMany(EntradaGPUsuario, { foreignKey: 'GranPremioId' });
EntradaGPUsuario.belongsTo(GranPremio, { foreignKey: 'GranPremioId' });

// Relaciones para Carrera, Clasificacion y Sprint con EntradaGPUsuario
EntradaGPUsuario.hasOne(Carrera, { foreignKey: 'entradaId' });
Carrera.belongsTo(EntradaGPUsuario, { foreignKey: 'entradaId' });

EntradaGPUsuario.hasOne(Clasificacion, { foreignKey: 'entradaId' });
Clasificacion.belongsTo(EntradaGPUsuario, { foreignKey: 'entradaId' });

EntradaGPUsuario.hasOne(Sprint, { foreignKey: 'entradaId' });
Sprint.belongsTo(EntradaGPUsuario, { foreignKey: 'entradaId' });

// Relación principal Piloto-Equipo
Equipo.hasMany(Piloto, { foreignKey: 'EquipoId' });
Piloto.belongsTo(Equipo, { foreignKey: 'EquipoId' });

// Exportar todos los modelos
module.exports = {
  Usuario,
  EntradaGPUsuario,
  GranPremio,
  Piloto,
  Equipo,
  Clasificacion,
  Carrera,
  Sprint
};
