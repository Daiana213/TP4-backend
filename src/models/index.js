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

// Relaciones de Piloto con otros modelos
Piloto.hasMany(Clasificacion, { foreignKey: 'PilotoId' });
Piloto.hasMany(Carrera, { as: 'ResultadosCarrera', foreignKey: 'PilotoId' });
Piloto.hasMany(Sprint, { foreignKey: 'PilotoId' });

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
