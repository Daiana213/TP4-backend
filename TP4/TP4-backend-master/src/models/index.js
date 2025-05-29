const User = require('./user');
const GranPremio = require('./granPremio');
const EntradaGP = require('./EntradaGP');
const Clasificacion = require('./clasificacion');
const Carrera = require('./carrera');
const Sprint = require('./sprint');
const Piloto = require('./piloto');
const Equipo = require('./equipo');

// Relaciones
User.hasMany(EntradaGP);
EntradaGP.belongsTo(User);
3
GranPremio.hasMany(EntradaGP);
EntradaGP.belongsTo(GranPremio);

EntradaGP.hasOne(Clasificacion);
Clasificacion.belongsTo(EntradaGP);

EntradaGP.hasOne(Carrera);
Carrera.belongsTo(EntradaGP);

EntradaGP.hasOne(Sprint);
Sprint.belongsTo(EntradaGP);

Piloto.hasMany(Carrera);
Carrera.belongsTo(Piloto);

Piloto.hasMany(Sprint);
Sprint.belongsTo(Piloto);

Piloto.hasMany(Clasificacion);
Clasificacion.belongsTo(Piloto);

Equipo.hasMany(Piloto);
Piloto.belongsTo(Equipo);

module.exports = {
  User,
  GranPremio,
  EntradaGP,
  Clasificacion,
  Carrera,
  Sprint,
  Piloto,
  Equipo
};