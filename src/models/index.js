const Usuario = require('./Usuario');
const EntradaGPUsuario = require('./EntradaGPUsuario');
const GranPremio = require('./GranPremio');
const Piloto = require('./Piloto');
const Equipo = require('./Equipo');
const Clasificacion = require('./Clasificacion');
const Carrera = require('./Carrera');
const Sprint = require('./Sprint');

// Relaciones
Usuario.hasMany(EntradaGPUsuario);
EntradaGPUsuario.belongsTo(Usuario);

GranPremio.hasMany(EntradaGPUsuario);
EntradaGPUsuario.belongsTo(GranPremio);

Piloto.hasMany(Clasificacion);
Piloto.hasMany(Carrera);
Piloto.hasMany(Sprint);

Equipo.hasMany(Piloto);
Piloto.belongsTo(Equipo);

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